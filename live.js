/* live.js — подключение оверлеев к сервисам донатов и событий.
   StreamElements (WebSocket Astro) и DonationAlerts (OAuth + Centrifugo).
   Заполняет шину OV: события (follow/sub/donate/raid/cheer) и показатели для цели. */
(function (g) {
'use strict';
var OV = g.OV;
var conns = [], status = {}, cbStatus = null;

function st(name, s, msg) { status[name] = { s: s, msg: msg || '' }; if (cbStatus) try { cbStatus(name, status[name]); } catch (e) {} }
function num(x) { x = parseFloat(x); return isNaN(x) ? 0 : x; }

/* ---------------- StreamElements ---------------- */
var SE_KIND = { follow: 'follow', subscriber: 'sub', tip: 'donate', donation: 'donate', cheer: 'cheer', raid: 'raid', host: 'raid' };

function seEvent(a) {
  if (!a) return;
  var d = a.data || a, kind = SE_KIND[a.type || d.type];
  if (!kind) return;
  var amount = d.amount;
  if (kind === 'raid') amount = d.amount || d.viewers || d.count;
  if (kind === 'sub') amount = d.amount || d.months || 1;
  OV.emitEvent({
    kind: kind,
    who: d.displayName || d.username || d.name || '',
    amount: amount == null ? '' : amount,
    currency: d.currency || 'RUB',
    msg: d.message || ''
  });
}

function seSession(d) {
  if (!d) return;
  var s = d.session || d.data || d;
  if (!s || typeof s !== 'object') return;
  Object.keys(s).forEach(function (k) {
    if (!/^(follower|subscriber|tip|cheer)-/.test(k)) return;
    var v = s[k];
    if (v && typeof v === 'object') v = v.count != null ? v.count : (v.amount != null ? v.amount : null);
    if (v != null && !isNaN(+v)) OV.setMetric('se:' + k, +v);
  });
}

function startSE(c) {
  if (!c || !c.id || !c.token) return;
  var ws, dead = false, tries = 0, hb, timer;
  function open() {
    if (dead) return;
    st('se', 'wait', 'Подключаюсь…');
    try { ws = new WebSocket('wss://astro.streamelements.com'); } catch (e) { st('se', 'err', 'WebSocket недоступен'); return; }
    ws.onmessage = function (m) {
      var j; try { j = JSON.parse(m.data); } catch (e) { return; }
      if (j.type === 'welcome') {
        tries = 0;
        ['channel.activities', 'channel.session.update'].forEach(function (topic, i) {
          setTimeout(function () {
            if (!ws || ws.readyState !== 1) return;
            ws.send(JSON.stringify({ type: 'subscribe', nonce: 'ov' + i + Date.now(), data: { topic: topic, room: c.id, token: c.token, token_type: c.type === 'jwt' ? 'jwt' : 'apikey' } }));
          }, i * 400);
        });
      } else if (j.type === 'response') {
        if (j.error) st('se', 'err', 'Отказ: ' + (j.error + (j.data && j.data.message ? ' ' + j.data.message : '')));
        else st('se', 'ok', 'Подключено');
      } else if (j.type === 'message') {
        if (j.topic === 'channel.activities') seEvent(j.data);
        else if (j.topic === 'channel.session.update') seSession(j.data);
      }
    };
    ws.onclose = function () {
      if (dead) return;
      st('se', 'wait', 'Связь потеряна, переподключаюсь…');
      timer = setTimeout(open, Math.min(30000, 1500 * Math.pow(2, tries++)));
    };
    ws.onerror = function () { try { ws.close(); } catch (e) {} };
  }
  open();
  // Начальные значения цели (если сервис отдаёт их по REST)
  try {
    fetch('https://api.streamelements.com/kappa/v2/sessions/' + encodeURIComponent(c.id), {
      headers: { Authorization: (c.type === 'jwt' ? 'Bearer ' : 'apikey ') + c.token }
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.data) seSession(j.data); }).catch(function () {});
  } catch (e) {}
  return function () { dead = true; clearTimeout(timer); clearInterval(hb); try { ws.close(); } catch (e) {} };
}

/* ---------------- DonationAlerts ---------------- */
function startDA(c) {
  if (!c || !c.token) return;
  var dead = false, ws, sum = 0, since = c.since ? new Date(c.since).getTime() : 0;
  var H = { Authorization: 'Bearer ' + c.token };
  function api(path, opt) {
    return fetch('https://www.donationalerts.com/api/v1/' + path, Object.assign({ headers: H }, opt || {})).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }
  function donation(d) {
    var rub = num(d.amount_in_user_currency != null ? d.amount_in_user_currency : d.amount);
    if (!since || !d.created_at || new Date(d.created_at.replace(' ', 'T') + (/[zZ+]/.test(d.created_at) ? '' : 'Z')).getTime() >= since) sum += rub;
    OV.setMetric('da:sum', sum);
  }
  st('da', 'wait', 'Подключаюсь…');
  api('user/oauth').then(function (u) {
    var me = u.data;
    if (dead) return;
    ws = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');
    ws.onopen = function () { ws.send(JSON.stringify({ params: { token: me.socket_connection_token }, id: 1 })); };
    ws.onmessage = function (m) {
      var j; try { j = JSON.parse(m.data); } catch (e) { return; }
      if (j.id === 1 && j.result && j.result.client) {
        var ch = '$alerts:donation_' + me.id;
        api('centrifuge/subscribe', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, H), body: JSON.stringify({ channels: [ch], client: j.result.client }) })
          .then(function (r) {
            var t = r.channels && r.channels[0] && r.channels[0].token;
            ws.send(JSON.stringify({ method: 1, params: { channel: ch, token: t }, id: 2 }));
          }).catch(function (e) { st('da', 'err', 'Подписка: ' + e.message); });
      } else if (j.id === 2) {
        st('da', 'ok', 'Подключено');
      } else if (j.result && j.result.data && j.result.data.data) {
        var d = j.result.data.data;
        OV.emitEvent({ kind: 'donate', who: d.username || 'Аноним', amount: d.amount, currency: d.currency || 'RUB', msg: d.message || '' });
        if (!d.created_at) d.created_at = ''; donation(d);
      }
    };
    ws.onclose = function () { if (!dead) st('da', 'err', 'Связь потеряна. Обнови страницу.'); };
  }).catch(function (e) { st('da', 'err', 'Токен не подошёл или сервис недоступен (' + e.message + ')'); });
  // Сумма донатов с даты — для цели
  (function page(n) {
    if (dead || n > 30) return;
    api('alerts/donations?page=' + n).then(function (r) {
      (r.data || []).forEach(donation);
      OV.setMetric('da:sum', sum);
      if (r.links && r.links.next) page(n + 1);
    }).catch(function () {});
  })(1);
  return function () { dead = true; try { ws.close(); } catch (e) {} };
}

/* ---------------- публичный интерфейс ---------------- */
var LIVE = {
  // live = {se:{id,token,type}, da:{token,since}}
  start: function (live, onStatus) {
    LIVE.stop();
    cbStatus = onStatus || null;
    live = live || {};
    var a = startSE(live.se), b = startDA(live.da);
    if (a) conns.push(a);
    if (b) conns.push(b);
    return !!(a || b);
  },
  stop: function () { conns.forEach(function (f) { try { f(); } catch (e) {} }); conns = []; status = {}; },
  status: function () { return status; },
  // Пробное событие, чтобы увидеть, как выглядит окно
  test: function (kind) {
    var S = {
      follow: { who: 'Тестовый зритель' },
      sub: { who: 'Тестовый зритель', amount: 3, msg: 'Спасибо за стрим!' },
      donate: { who: 'Тестовый зритель', amount: 250, currency: 'RUB', msg: 'Держи на кофе' },
      raid: { who: 'Тестовый канал', amount: 42 },
      cheer: { who: 'Тестовый зритель', amount: 100, msg: 'Огонь!' }
    };
    OV.emitEvent(Object.assign({ kind: kind }, S[kind] || S.follow));
  }
};
g.LIVE = LIVE;
})(window);
