(function (g) {
'use strict';

var PLATFORMS = {
  twitch: { name: 'Twitch', color: '#9146ff' },
  youtube: { name: 'YouTube', color: '#ff0033' },
  vk: { name: 'VK Видео', color: '#0077ff' }
};

var FONTS = [
  ['Segoe UI, Arial, sans-serif', 'Segoe UI'],
  ['Arial, sans-serif', 'Arial'],
  ['Trebuchet MS, sans-serif', 'Trebuchet'],
  ['Impact, Haettenschweiler, sans-serif', 'Impact'],
  ['Georgia, serif', 'Georgia'],
  ['Courier New, monospace', 'Courier']
];

// Игры: название + обычный значок-эмодзи (официальные логотипы не используются)
var GAMES = [
  ['Minecraft', '⛏️'], ['Fortnite', '🏝️'], ['Counter-Strike 2', '🔫'], ['Dota 2', '🛡️'],
  ['Valorant', '🎯'], ['GTA V', '🚗'], ['Roblox', '🧱'], ['League of Legends', '⚔️'],
  ['Apex Legends', '🪂'], ['Call of Duty: Warzone', '🎖️'], ['World of Tanks', '🪖'], ['Rust', '🏚️'],
  ['Escape from Tarkov', '🎒'], ['PUBG', '🍗'], ['Rainbow Six Siege', '🛰️'], ['Overwatch 2', '🦸'],
  ['Genshin Impact', '🌸'], ['Elden Ring', '🗡️'], ['The Witcher 3', '🐺'], ['Cyberpunk 2077', '🤖'],
  ['Terraria', '🌳'], ['Stardew Valley', '🌾'], ['Among Us', '🚀'], ['Brawl Stars', '⭐'],
  ['Standoff 2', '💥'], ['Dark Souls', '🔥'], ['Hollow Knight', '🐞'],
  ['Общение', '💬'], ['Музыка', '🎵'], ['Творчество', '🎨']
];
var GAME_ICONS = {};
GAMES.forEach(function (x) { GAME_ICONS[x[0]] = x[1]; });
var GAME_OPTS = [['', 'Не выбрана']]
  .concat(GAMES.map(function (x) { return [x[0], x[1] + ' ' + x[0]]; }))
  .concat([['__custom', '✏️ Другая игра…']]);

var POS4 = [['tl', 'Слева вверху'], ['tr', 'Справа вверху'], ['bl', 'Слева внизу'], ['br', 'Справа внизу']];

function isCustom(c) { return c.game === '__custom'; }

var COMMON = [
  { type: 'h', label: 'Игра' },
  { k: 'game', label: 'Выбери игру', type: 'select', options: GAME_OPTS },
  { k: 'gameCustom', label: 'Название игры', type: 'text', showIf: isCustom },
  { k: 'gameIcon', label: 'Значок (эмодзи)', type: 'text', showIf: isCustom },
  { k: 'logo', label: 'Свой логотип игры: ссылка на картинку или файл рядом с сайтом (logo.png)', type: 'text' },
  { k: 'showGame', label: 'Показывать игру в оверлее', type: 'check' },
  { type: 'h', label: 'Платформа' },
  { k: 'platform', label: 'Платформа', type: 'select', options: [['twitch', 'Twitch'], ['youtube', 'YouTube'], ['vk', 'VK Видео']] },
  { k: 'showPlatform', label: 'Показывать метку платформы', type: 'check' },
  { type: 'h', label: 'Цвета и текст' },
  { k: 'accent', label: 'Цвет акцента', type: 'color' },
  { k: 'textColor', label: 'Цвет текста', type: 'color' },
  { k: 'font', label: 'Шрифт', type: 'select', options: FONTS },
  { k: 'fs', label: 'Размер текста, %', type: 'range', min: 70, max: 160, step: 5 },
  { k: 'shadow', label: 'Тень у текста', type: 'check' },
  { k: 'caps', label: 'ВСЕ БУКВЫ ЗАГЛАВНЫЕ', type: 'check' },
  { k: 'gfont', label: 'Свой шрифт Google Fonts (название, например Rubik или Pacifico)', type: 'text' },
  { k: 'accent2', label: 'Второй цвет (для градиента и пикселя)', type: 'color' },
  { k: 'theme', label: 'Стиль панелей', type: 'select', options: [['glass', 'Стекло'], ['solid', 'Сплошной цвет'], ['neon', 'Неон'], ['outline', 'Контур'], ['gradient', 'Градиент'], ['pixel', 'Пиксель']] },
  { type: 'h', label: 'Положение и вид' },
  { k: 'dx', label: 'Сдвиг по горизонтали', type: 'range', min: -960, max: 960, step: 2 },
  { k: 'dy', label: 'Сдвиг по вертикали', type: 'range', min: -540, max: 540, step: 2 },
  { k: 'opacity', label: 'Прозрачность оверлея, %', type: 'range', min: 20, max: 100, step: 5 },
  { k: 'scale', label: 'Размер слоя, %', type: 'range', min: 40, max: 250, step: 5 },
  { k: 'rot', label: 'Поворот, градусы', type: 'range', min: -45, max: 45, step: 1 },
  { k: 'anim', label: 'Анимация', type: 'select', options: [['none', 'Без анимации'], ['fade', 'Плавное появление'], ['up', 'Выезд снизу'], ['down', 'Выезд сверху'], ['left', 'Выезд слева'], ['right', 'Выезд справа'], ['zoom', 'Увеличение'], ['bounce', 'Отскок'], ['float', 'Парение (постоянно)'], ['pulse', 'Мерцание (постоянно)']] },
  { k: 'animDelay', label: 'Задержка анимации, сек', type: 'range', min: 0, max: 10, step: 0.5 },
  { type: 'h', label: 'Эффекты панелей' },
  { k: 'blur', label: 'Размытие фона панелей', type: 'range', min: 0, max: 30, step: 1 },
  { k: 'pr', label: 'Скругление панелей (0 = как в шаблоне)', type: 'range', min: 0, max: 60, step: 2 },
  { k: 'glow', label: 'Свечение панелей', type: 'range', min: 0, max: 100, step: 5 }
];
var COMMON_DEF = {
  platform: 'twitch', showPlatform: true, accent: '#9146ff', font: FONTS[0][0],
  textColor: '#ffffff', fs: 100, shadow: true, theme: 'glass', accent2: '#ff4fa3', themeId: '',
  dx: 0, dy: 0, opacity: 100, anim: 'none', scale: 100, rot: 0, animDelay: 0,
  blur: 8, pr: 0, glow: 0, caps: false, gfont: '',
  game: '', gameCustom: '', gameIcon: '', logo: '', showGame: true
};

function F(n) { return 'calc(' + (Math.round(n * 10) / 10) + 'px*var(--fs,1))'; }

var CSS = '' +
'.ov-stage{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;color:#fff;transform-origin:0 0;text-shadow:0 2px 8px rgba(0,0,0,.45)}' +
'.ov-stage.no-sh,.ov-stage.no-sh *{text-shadow:none}' +
'.ov-stage *{box-sizing:border-box}' +
'.ov-panel{backdrop-filter:blur(var(--blur,8px));-webkit-backdrop-filter:blur(var(--blur,8px))}' +
'.th-neon .ov-panel{border:2px solid var(--acc)!important;box-shadow:0 0 28px var(--acc),inset 0 0 16px rgba(255,255,255,.08)!important}' +
'.th-outline .ov-panel{background:transparent!important;border:3px solid var(--acc)!important;backdrop-filter:none}' +
'.th-solid .ov-panel{background:var(--acc)!important;border:0!important}' +
'.ov-t1{font-size:' + F(40) + ';font-weight:800;line-height:1.1}' +
'.ov-t2{font-size:' + F(24) + ';opacity:.85;margin-top:6px}' +
'.ov-badge{display:inline-block;padding:8px 18px;border-radius:999px;font-size:' + F(22) + ';font-weight:700;margin-left:24px;white-space:nowrap;text-shadow:none;color:#fff}' +
'.ov-game{display:inline-flex;align-items:center;gap:14px;padding:8px 22px 8px 14px;border-radius:14px;background:rgba(0,0,0,.55);border-left:6px solid var(--acc);font-size:' + F(30) + ';font-weight:700}' +
'.ov-game.big{font-size:' + F(48) + ';padding:12px 32px 12px 20px;border-radius:20px}' +
'.ov-gemo{font-size:1.25em;line-height:1}' +
'.ov-gimg{height:1.4em;max-width:3.4em;object-fit:contain}' +
'.ov-plate{display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:rgba(10,10,16,.78)}' +
'.ov-lbox{display:flex;align-items:center;gap:20px;padding:24px 48px}' +
'.ov-lbox .ov-t1{font-size:' + F(52) + '}.ov-lbox .ov-t2{font-size:' + F(28) + '}' +
'.ov-anim{animation:ovslide 14s ease-in-out infinite}' +
'@keyframes ovslide{0%{transform:translateX(calc(var(--dir)*110%))}6%,82%{transform:none}92%,100%{transform:translateX(calc(var(--dir)*110%))}}' +
'.ov-goal{position:absolute;padding:18px 26px;border-radius:20px}' +
'.ov-grow{display:flex;justify-content:space-between;gap:20px;font-size:' + F(32) + ';font-weight:700;margin-bottom:12px}' +
'.ov-bar{border-radius:22px;background:rgba(255,255,255,.18);overflow:hidden;position:relative}' +
'.ov-fill{height:100%;border-radius:22px;transition:width .6s}' +
'.ov-pct{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:' + F(24) + ';font-weight:800}' +
'.ov-full{position:absolute;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background-size:cover;background-position:center}' +
'.ov-orb{position:absolute;width:900px;height:900px;border-radius:50%;filter:blur(120px);animation:ovorb 12s ease-in-out infinite alternate}' +
'@keyframes ovorb{from{transform:translate(-500px,-250px)}to{transform:translate(500px,250px)}}' +
'.ov-center{position:relative}' +
'.ov-big{font-size:' + F(140) + ';font-weight:900;line-height:1}' +
'.ov-sub{font-size:' + F(44) + ';opacity:.9;margin-top:24px}' +
'.ov-count{font-size:' + F(200) + ';font-weight:900;margin-top:20px;font-variant-numeric:tabular-nums}' +
'.ov-dots{display:flex;gap:24px;justify-content:center;margin-top:48px}' +
'.ov-dots i{width:28px;height:28px;border-radius:50%;animation:ovdot 1.2s ease-in-out infinite}' +
'.ov-dots i:nth-child(2){animation-delay:.2s}.ov-dots i:nth-child(3){animation-delay:.4s}' +
'@keyframes ovdot{0%,100%{transform:scale(.5);opacity:.4}50%{transform:scale(1);opacity:1}}' +
'.ov-ticker{position:absolute;left:0;right:0;bottom:0;height:84px;background:rgba(0,0,0,.6);overflow:hidden;display:flex;align-items:center}' +
'.ov-track{display:flex;width:max-content;animation:ovmarq 40s linear infinite;font-size:' + F(34) + ';font-weight:700;white-space:nowrap}' +
'@keyframes ovmarq{to{transform:translateX(-50%)}}' +
'.ov-corner{position:absolute;right:40px;top:40px}.ov-corner .ov-badge{margin-left:0}' +
'.ov-gbox{position:absolute;display:flex;align-items:center;gap:26px;padding:22px 40px 22px 28px;border-radius:24px;background:rgba(10,10,16,.78);border-left:12px solid var(--acc)}' +
'.ov-glab{opacity:.8;font-weight:700;letter-spacing:.12em}' +
'.ov-gname{font-weight:900;line-height:1.05}' +
'.ov-chat{position:absolute;display:flex;flex-direction:column;overflow:hidden}' +
'.ov-chead{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;font-size:' + F(28) + ';font-weight:800;background:var(--acc)}' +
'.ov-soc{position:absolute;padding:22px 34px;border-radius:22px;background:rgba(10,10,16,.78);min-width:480px}' +
'.ov-soc h4{margin:0 0 10px;font-size:' + F(30) + ';font-weight:800;color:var(--acc)}' +
'.ov-sl{font-size:' + F(30) + ';font-weight:600;padding:5px 0}' +
'.ov-cyc{font-size:' + F(36) + ';font-weight:700;min-height:1.3em}' +
'.ov-a-fade{animation:ovfade .8s both}.ov-a-up{animation:ovup .8s both}.ov-a-zoom{animation:ovzoom .7s both}' +
'@keyframes ovfade{from{opacity:0}}' +
'@keyframes ovup{from{opacity:0;transform:translateY(70px)}}' +
'@keyframes ovzoom{from{opacity:0;transform:scale(.85)}}';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function hexA(h, a) {
  h = String(h).replace('#', '');
  if (h.length === 3) h = h.replace(/./g, '$&$&');
  var n = parseInt(h, 16) || 0;
  return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function badge(c) {
  if (!c.showPlatform) return '';
  var p = PLATFORMS[c.platform] || PLATFORMS.twitch;
  return '<span class="ov-badge" style="background:' + esc(c.accent) + '">' + esc(p.name) + '</span>';
}
function corner(pos, m) {
  return (pos.indexOf('r') > -1 ? 'right:' : 'left:') + m + 'px;' + (pos.indexOf('t') > -1 ? 'top:' : 'bottom:') + m + 'px;';
}
var FX_OPTS = [['none', 'Без эффекта'], ['orbs', 'Светящийся шар'], ['aurora', 'Северное сияние'], ['stars', 'Звёзды'], ['grid', 'Ретро-сетка']];
function fxHtml(c) {
  var f = c.fx || 'none';
  if (f === 'orbs') return '<div class="ov-orb" style="background:' + hexA(c.accent, .4) + '"></div>';
  if (f === 'aurora') return '<div class="ov-orb" style="background:' + hexA(c.accent, .4) + '"></div><div class="ov-orb" style="background:' + hexA(c.accent2 || c.accent, .35) + ';animation-delay:-6s;animation-direction:alternate-reverse"></div>';
  if (f === 'stars') return '<div class="ov-fx-stars"></div><div class="ov-fx-stars s2"></div>';
  if (f === 'grid') return '<div class="ov-fx-grid"></div>';
  return '';
}
function urlCss(u) {
  return 'url(' + esc(encodeURI(String(u)).replace(/[()'"]/g, escape)) + ')';
}
function bgStyle(c) {
  var grad = 'linear-gradient(135deg,' + hexA(c.c1, (c.alpha == null ? 100 : c.alpha) / 100) + ',' + hexA(c.c2, (c.alpha == null ? 100 : c.alpha) / 100) + ')';
  if (c.bgImg) return 'background-image:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),' + urlCss(c.bgImg) + ',' + grad + ';';
  return 'background-image:' + grad + ';';
}

/* ----- игра ----- */
function gameName(c) { return c.game === '__custom' ? String(c.gameCustom || '') : String(c.game || ''); }
function gameIcon(c, style) {
  if (c.logo) {
    return '<img class="ov-gimg" src="' + esc(c.logo) + '" alt="" style="' + (style || '') + '" onerror="this.style.display=\'none\'">';
  }
  var ic = c.game === '__custom' ? (c.gameIcon || '🎮') : (GAME_ICONS[gameName(c)] || '🎮');
  return '<span class="ov-gemo" style="' + (style || '') + '">' + esc(ic) + '</span>';
}
function gameChip(c, big) {
  if (!c.showGame) return '';
  var n = gameName(c);
  if (!n) return '';
  return '<span class="ov-game ov-panel' + (big ? ' big' : '') + '">' + gameIcon(c, '') + '<span>' + esc(n) + '</span></span>';
}

var TEMPLATES = {
  cam: {
    title: 'Рамка веб-камеры',
    desc: 'Рамка под камеру с плашкой имени. Внутри рамка прозрачная — подгони под неё камеру.',
    fields: [
      { k: 'name', label: 'Имя стримера', type: 'text' },
      { k: 'sub', label: 'Подпись', type: 'text' },
      { k: 'plate', label: 'Показывать плашку с именем', type: 'check' },
      { k: 'shape', label: 'Форма рамки', type: 'select', options: [['rect', 'Прямоугольник 16:9'], ['r43', 'Прямоугольник 4:3'], ['sq', 'Квадрат'], ['circle', 'Круг']] },
      { k: 'pos', label: 'Положение', type: 'select', options: [['bl', 'Слева внизу'], ['br', 'Справа внизу'], ['tl', 'Слева вверху'], ['tr', 'Справа вверху']] },
      { k: 'camW', label: 'Ширина камеры', type: 'range', min: 240, max: 960, step: 10 },
      { k: 'radius', label: 'Скругление углов', type: 'range', min: 0, max: 60, step: 2 },
      { k: 'border', label: 'Толщина рамки', type: 'range', min: 0, max: 20, step: 1 },
      { k: 'glow', label: 'Свечение рамки, %', type: 'range', min: 0, max: 100, step: 5 }
    ],
    defaults: { name: 'Твоё имя', sub: 'Играем и общаемся', plate: true, shape: 'rect', pos: 'bl', camW: 560, radius: 20, border: 6, glow: 55 },
    render: function (c) {
      var w = +c.camW, m = 40, ph = c.plate === false ? 0 : 84;
      var h = c.shape === 'circle' || c.shape === 'sq' ? w : (c.shape === 'r43' ? Math.round(w * 3 / 4) : Math.round(w * 9 / 16));
      var rad = c.shape === 'circle' ? '50%' : c.radius + 'px';
      var chip = gameChip(c);
      var gh = chip ? Math.round(72 * (c.fs || 100) / 100) : 0;
      var total = h + (ph ? 16 + ph : 0) + gh;
      var left = c.pos.indexOf('r') > -1 ? 1920 - m - w : m;
      var top = c.pos.indexOf('t') > -1 ? m : 1080 - m - total;
      var gl = (c.glow == null ? 55 : c.glow) / 100;
      return '<div style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + w + 'px">' +
        '<div style="height:' + h + 'px;border:' + c.border + 'px solid ' + esc(c.accent) + ';border-radius:' + rad + ';box-shadow:0 0 36px ' + hexA(c.accent, gl) + ',inset 0 0 24px ' + hexA(c.accent, gl / 2) + '"></div>' +
        (ph ? '<div class="ov-plate ov-panel" style="margin-top:16px;height:' + ph + 'px;border-radius:' + Math.min(c.radius, 24) + 'px;border-left:10px solid ' + esc(c.accent) + '">' +
          '<div><div class="ov-t1">' + esc(c.name) + '</div><div class="ov-t2">' + esc(c.sub) + '</div></div>' + badge(c) + '</div>' : '') +
        (chip ? '<div style="margin-top:10px">' + chip + '</div>' : '') + '</div>';
    }
  },

  lower: {
    title: 'Плашка с именем',
    desc: 'Нижняя плашка: имя, подпись и игра. Может плавно выезжать и уезжать по кругу.',
    fields: [
      { k: 'name', label: 'Имя / заголовок', type: 'text' },
      { k: 'sub', label: 'Подпись', type: 'text' },
      { k: 'side', label: 'Сторона', type: 'select', options: [['left', 'Слева'], ['right', 'Справа']] },
      { k: 'minW', label: 'Минимальная ширина', type: 'range', min: 300, max: 1200, step: 20 },
      { k: 'bg', label: 'Цвет фона', type: 'color' },
      { k: 'bgAlpha', label: 'Прозрачность фона, %', type: 'range', min: 0, max: 100, step: 5 },
      { k: 'animate', label: 'Выезжать по кругу', type: 'check' }
    ],
    defaults: { name: 'Твоё имя', sub: 'Стрим дня', side: 'left', minW: 560, bg: '#101018', bgAlpha: 85, animate: true },
    render: function (c) {
      var right = c.side === 'right';
      var st = 'position:absolute;bottom:90px;' + (right ? 'right' : 'left') + ':0;--dir:' + (right ? 1 : -1);
      var chip = gameChip(c);
      return '<div class="' + (c.animate ? 'ov-anim' : '') + '" style="' + st + '">' +
        '<div class="ov-lbox ov-panel" style="min-width:' + (+c.minW || 560) + 'px;background:' + hexA(c.bg, c.bgAlpha / 100) + ';border-' + (right ? 'right' : 'left') + ':14px solid ' + esc(c.accent) + '">' +
        '<div><div class="ov-t1">' + esc(c.name) + '</div><div class="ov-t2">' + esc(c.sub) + '</div>' + (chip ? '<div style="margin-top:12px">' + chip + '</div>' : '') + '</div>' + badge(c) + '</div></div>';
    }
  },

  goal: {
    title: 'Цель стрима',
    desc: 'Полоса прогресса: подписчики, донаты, всё что угодно. Меняй числа — полоса обновится.',
    fields: [
      { k: 'label', label: 'Название цели', type: 'text' },
      { k: 'cur', label: 'Сейчас', type: 'number' },
      { k: 'max', label: 'Цель', type: 'number' },
      { k: 'unit', label: 'Единица (₽, подписчиков…)', type: 'text' },
      { k: 'showPct', label: 'Показывать проценты', type: 'check' },
      { k: 'pos', label: 'Положение', type: 'select', options: [['top', 'Сверху'], ['bottom', 'Снизу']] },
      { k: 'width', label: 'Ширина', type: 'range', min: 600, max: 1800, step: 20 },
      { k: 'barH', label: 'Толщина полосы', type: 'range', min: 20, max: 90, step: 2 },
      { k: 'bg', label: 'Цвет фона', type: 'color' }
    ],
    defaults: { label: 'Цель: новый микрофон', cur: 35, max: 100, unit: '₽', showPct: true, pos: 'top', width: 1000, barH: 44, bg: '#101018' },
    render: function (c) {
      var pct = +c.max > 0 ? Math.max(0, Math.min(100, c.cur / c.max * 100)) : 0;
      var w = +c.width, bh = +c.barH || 44;
      var chip = gameChip(c), bd = badge(c).replace('margin-left:24px', 'margin-left:0');
      return '<div class="ov-goal ov-panel" style="' + (c.pos === 'top' ? 'top' : 'bottom') + ':36px;width:' + w + 'px;left:' + ((1920 - w) / 2) + 'px;background:' + hexA(c.bg, .8) + '">' +
        '<div class="ov-grow"><span>' + esc(c.label) + '</span><span>' + esc(c.cur) + ' / ' + esc(c.max) + ' ' + esc(c.unit) + '</span></div>' +
        '<div class="ov-bar" style="height:' + bh + 'px;border-radius:' + bh / 2 + 'px"><div class="ov-fill" style="width:' + pct + '%;border-radius:' + bh / 2 + 'px;background:' + esc(c.accent) + ';box-shadow:0 0 20px ' + hexA(c.accent, .8) + '"></div>' +
        (c.showPct === false ? '' : '<div class="ov-pct">' + Math.round(pct) + '%</div>') + '</div>' +
        ((chip || bd) ? '<div style="margin-top:12px;display:flex;gap:12px;align-items:center">' + chip + bd + '</div>' : '') + '</div>';
    }
  },

  starting: {
    title: 'Скоро начнём',
    full: true,
    desc: 'Заставка перед стримом с обратным отсчётом до времени старта.',
    fields: [
      { k: 'title', label: 'Заголовок', type: 'text' },
      { k: 'sub', label: 'Текст под заголовком', type: 'text' },
      { k: 'time', label: 'Время старта (сегодня)', type: 'time' },
      { k: 'after', label: 'Текст, когда время пришло', type: 'text' },
      { k: 'c1', label: 'Фон: цвет 1', type: 'color' },
      { k: 'c2', label: 'Фон: цвет 2', type: 'color' },
      { k: 'fx', label: 'Эффект фона', type: 'select', options: FX_OPTS },
      { k: 'bgImg', label: 'Картинка фона: ссылка или файл рядом с сайтом', type: 'text' }
    ],
    defaults: { title: 'Скоро начнём', sub: 'Стрим стартует через', time: '20:00', after: 'Начинаем!', c1: '#150d2e', c2: '#3a1c71', bgImg: '', fx: 'orbs' },
    render: function (c) {
      var chip = gameChip(c, true);
      return '<div class="ov-full" style="' + bgStyle(c) + '">' +
        fxHtml(c) +
        '<div class="ov-center"><div class="ov-big">' + esc(c.title) + '</div><div class="ov-sub">' + esc(c.sub) + '</div><div class="ov-count">--:--</div>' +
        (chip ? '<div style="margin-top:28px">' + chip + '</div>' : '') + '</div>' +
        (c.showPlatform ? '<div class="ov-corner">' + badge(c) + '</div>' : '') + '</div>';
    },
    init: function (root, c) {
      var el = root.querySelector('.ov-count');
      function tick() {
        var p = String(c.time || '20:00').split(':');
        var t = new Date();
        t.setHours(+p[0] || 0, +p[1] || 0, 0, 0);
        var d = Math.floor((t - new Date()) / 1000);
        if (d <= 0) { el.textContent = c.after; return; }
        var h = Math.floor(d / 3600), m = Math.floor(d % 3600 / 60), s = d % 60;
        el.textContent = (h ? pad(h) + ':' : '') + pad(m) + ':' + pad(s);
      }
      tick();
      var i = setInterval(tick, 1000);
      return function () { clearInterval(i); };
    }
  },

  brb: {
    title: 'Скоро вернусь',
    full: true,
    desc: 'Экран перерыва с бегущей строкой для ссылок и соцсетей.',
    fields: [
      { k: 'title', label: 'Заголовок', type: 'text' },
      { k: 'sub', label: 'Текст под заголовком', type: 'text' },
      { k: 'ticker', label: 'Бегущая строка', type: 'text' },
      { k: 'speed', label: 'Время одного круга строки, сек (больше = медленнее)', type: 'range', min: 10, max: 90, step: 5 },
      { k: 'c1', label: 'Фон: цвет 1', type: 'color' },
      { k: 'c2', label: 'Фон: цвет 2', type: 'color' },
      { k: 'alpha', label: 'Непрозрачность фона, %', type: 'range', min: 0, max: 100, step: 5 },
      { k: 'fx', label: 'Эффект фона', type: 'select', options: FX_OPTS },
      { k: 'bgImg', label: 'Картинка фона: ссылка или файл рядом с сайтом', type: 'text' }
    ],
    defaults: { title: 'Скоро вернусь', sub: 'Небольшой перерыв', ticker: 'Подписывайся на канал • Telegram: @твой_ник • Спасибо, что ты с нами', speed: 40, c1: '#0e1a2b', c2: '#1b3a5c', alpha: 92, bgImg: '', fx: 'none' },
    render: function (c) {
      var one = '', i;
      for (i = 0; i < 4; i++) one += esc(c.ticker) + '   •   ';
      var chip = gameChip(c, true);
      return '<div class="ov-full" style="' + bgStyle(c) + '">' +
        fxHtml(c) +
        '<div class="ov-center"><div class="ov-big">' + esc(c.title) + '</div><div class="ov-sub">' + esc(c.sub) + '</div>' +
        (chip ? '<div style="margin-top:28px">' + chip + '</div>' : '') +
        '<div class="ov-dots"><i style="background:' + esc(c.accent) + '"></i><i style="background:' + esc(c.accent) + '"></i><i style="background:' + esc(c.accent) + '"></i></div></div>' +
        (c.showPlatform ? '<div class="ov-corner">' + badge(c) + '</div>' : '') +
        '<div class="ov-ticker"><div class="ov-track" style="animation-duration:' + (+c.speed || 40) + 's"><span>' + one + '</span><span>' + one + '</span></div></div></div>';
    }
  },

  game: {
    title: 'Сейчас играем',
    desc: 'Крупная плашка с названием и значком игры. Выбери игру в разделе «Игра» справа.',
    fields: [
      { k: 'label', label: 'Подпись', type: 'text' },
      { k: 'pos', label: 'Положение', type: 'select', options: POS4 },
      { k: 'size', label: 'Размер плашки, %', type: 'range', min: 50, max: 160, step: 5 }
    ],
    defaults: { label: 'СЕЙЧАС ИГРАЕМ', pos: 'tl', size: 100, game: 'Minecraft' },
    render: function (c) {
      var s = (+c.size || 100) / 100, n = gameName(c) || 'Выбери игру';
      return '<div class="ov-gbox ov-panel" style="' + corner(c.pos, 40) + '">' + gameIcon(c, 'font-size:' + F(84 * s)) +
        '<div><div class="ov-glab" style="font-size:' + F(24 * s) + '">' + esc(c.label) + '</div>' +
        '<div class="ov-gname" style="font-size:' + F(64 * s) + '">' + esc(n) + '</div></div>' + (c.showPlatform ? badge(c) : '') + '</div>';
    }
  },

  chat: {
    title: 'Рамка чата',
    desc: 'Панель-рамка для чата. Внутри прозрачная область: поставь в неё окно чата.',
    fields: [
      { k: 'title', label: 'Заголовок', type: 'text' },
      { k: 'pos', label: 'Сторона', type: 'select', options: [['right', 'Справа'], ['left', 'Слева']] },
      { k: 'width', label: 'Ширина', type: 'range', min: 300, max: 800, step: 10 },
      { k: 'height', label: 'Высота', type: 'range', min: 300, max: 1000, step: 10 },
      { k: 'radius', label: 'Скругление углов', type: 'range', min: 0, max: 50, step: 2 },
      { k: 'bg', label: 'Цвет фона', type: 'color' },
      { k: 'bgAlpha', label: 'Прозрачность фона, %', type: 'range', min: 0, max: 100, step: 5 }
    ],
    defaults: { title: 'ЧАТ', pos: 'right', width: 460, height: 700, radius: 20, bg: '#101018', bgAlpha: 55 },
    render: function (c) {
      var w = +c.width, h = +c.height;
      var left = c.pos === 'left' ? 40 : 1920 - 40 - w;
      var top = Math.round((1080 - h) / 2);
      return '<div class="ov-chat ov-panel" style="left:' + left + 'px;top:' + top + 'px;width:' + w + 'px;height:' + h + 'px;border:3px solid ' + esc(c.accent) + ';border-radius:' + c.radius + 'px;background:' + hexA(c.bg, c.bgAlpha / 100) + '">' +
        '<div class="ov-chead"><span>' + esc(c.title) + '</span>' + badge(c) + '</div></div>';
    }
  },

  socials: {
    title: 'Соцсети',
    desc: 'Панель со ссылками: списком или по одной строке с плавной сменой.',
    fields: [
      { k: 'title', label: 'Заголовок', type: 'text' },
      { k: 'items', label: 'Строки (каждая с новой строки)', type: 'textarea' },
      { k: 'mode', label: 'Показ', type: 'select', options: [['list', 'Списком'], ['cycle', 'По одной строке']] },
      { k: 'period', label: 'Смена строки, сек', type: 'range', min: 2, max: 20, step: 1 },
      { k: 'pos', label: 'Положение', type: 'select', options: POS4 }
    ],
    defaults: { title: 'Я в сети', items: 'Telegram: @твой_ник\nYouTube: youtube.com/@канал\nVK: vk.com/твой_ник\nДонаты: ссылка', mode: 'list', period: 5, pos: 'bl' },
    render: function (c) {
      var lines = String(c.items || '').split(/\r?\n/).filter(function (x) { return x.trim(); });
      var body = c.mode === 'cycle'
        ? '<div class="ov-cyc">' + esc(lines[0] || '') + '</div>'
        : lines.map(function (l) { return '<div class="ov-sl">' + esc(l) + '</div>'; }).join('');
      return '<div class="ov-soc ov-panel" style="' + corner(c.pos, 40) + '">' + (c.title ? '<h4>' + esc(c.title) + '</h4>' : '') + body + '</div>';
    },
    init: function (root, c) {
      if (c.mode !== 'cycle') return null;
      var lines = String(c.items || '').split(/\r?\n/).filter(function (x) { return x.trim(); });
      var el = root.querySelector('.ov-cyc');
      if (!el || lines.length < 2) return null;
      var i = 0;
      var iv = setInterval(function () {
        i = (i + 1) % lines.length;
        el.textContent = lines[i];
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = 'ovfade .6s both';
      }, Math.max(2, +c.period || 5) * 1000);
      return function () { clearInterval(iv); };
    }
  }
};

TEMPLATES.alert = {
  title: 'Событие (подписчик, донат)',
  desc: 'Всплывающее окно о новом подписчике, донате или рейде. Показывается по кругу, чтобы ты видел, как оно выглядит.',
  fields: [
    { k: 'kind', label: 'Тип события', type: 'select', options: [['sub', '⭐ Новый подписчик'], ['donate', '💰 Донат'], ['raid', '🚀 Рейд'], ['follow', '❤️ Новый фолловер']] },
    { k: 'who', label: 'Имя зрителя', type: 'text' },
    { k: 'amount', label: 'Сумма или число (необязательно)', type: 'text' },
    { k: 'msg', label: 'Сообщение', type: 'text' },
    { k: 'pos', label: 'Положение', type: 'select', options: [['top', 'Сверху по центру'], ['center', 'По центру'], ['bottom', 'Снизу по центру']] },
    { k: 'showFor', label: 'Показывать, сек', type: 'range', min: 3, max: 15, step: 1 },
    { k: 'pause', label: 'Пауза между показами, сек', type: 'range', min: 0, max: 30, step: 1 },
    { k: 'loop', label: 'Повторять по кругу', type: 'check' },
    { k: 'bg', label: 'Цвет фона', type: 'color' }
  ],
  defaults: { kind: 'sub', who: 'Имя зрителя', amount: '', msg: 'Спасибо за поддержку!', pos: 'top', showFor: 6, pause: 6, loop: true, bg: '#101018' },
  render: function (c) {
    var K = { sub: ['⭐', 'Новый подписчик'], donate: ['💰', 'Донат'], raid: ['🚀', 'Рейд'], follow: ['❤️', 'Новый фолловер'] };
    var k = K[c.kind] || K.sub;
    var top = c.pos === 'center' ? 400 : (c.pos === 'bottom' ? 700 : 70);
    return '<div class="ov-alert-wrap" style="position:absolute;left:0;right:0;top:' + top + 'px;display:flex;justify-content:center">' +
      '<div class="ov-alert ov-panel" style="background:' + hexA(c.bg, .88) + ';border:4px solid ' + esc(c.accent) + ';box-shadow:0 0 40px ' + hexA(c.accent, .5) + '">' +
      '<div class="ov-aico">' + k[0] + '</div><div>' +
      '<div class="ov-glab" style="font-size:' + F(24) + ';color:' + esc(c.accent) + '">' + esc(k[1].toUpperCase()) + '</div>' +
      '<div class="ov-aname">' + esc(c.who) + (c.amount ? ' <span style="color:' + esc(c.accent) + '">' + esc(c.amount) + '</span>' : '') + '</div>' +
      (c.msg ? '<div class="ov-t2" style="font-size:' + F(30) + '">' + esc(c.msg) + '</div>' : '') +
      '</div></div></div>';
  },
  init: function (root, c) {
    var el = root.querySelector('.ov-alert');
    if (!el || c.loop === false) return null;
    var show = Math.max(2, +c.showFor || 6) * 1000, pause = Math.max(0, +c.pause || 0) * 1000;
    var t1, t2, dead = false;
    function cycle() {
      if (dead) return;
      el.style.animation = 'ovalert .7s both';
      el.style.opacity = '';
      t1 = setTimeout(function () {
        if (dead) return;
        el.style.animation = 'ovalertout .5s both';
        t2 = setTimeout(cycle, pause + 500);
      }, show);
    }
    cycle();
    return function () { dead = true; clearTimeout(t1); clearTimeout(t2); };
  }
};

TEMPLATES.recent = {
  title: 'Последние события',
  desc: 'Список последних подписчиков, донатов или любых строк. Удобно держать в углу.',
  fields: [
    { k: 'title', label: 'Заголовок', type: 'text' },
    { k: 'items', label: 'Строки (каждая с новой строки)', type: 'textarea' },
    { k: 'max', label: 'Сколько строк показывать', type: 'range', min: 1, max: 10, step: 1 },
    { k: 'numbered', label: 'Нумеровать строки', type: 'check' },
    { k: 'width', label: 'Ширина', type: 'range', min: 300, max: 900, step: 10 },
    { k: 'pos', label: 'Положение', type: 'select', options: POS4 },
    { k: 'bg', label: 'Цвет фона', type: 'color' },
    { k: 'bgAlpha', label: 'Прозрачность фона, %', type: 'range', min: 0, max: 100, step: 5 }
  ],
  defaults: { title: 'Последние события', items: '⭐ Anna — подписка\n💰 Ivan — 300 ₽\n❤️ Olga — фолловер\n🚀 Max — рейд 25', max: 5, numbered: false, width: 480, pos: 'tr', bg: '#101018', bgAlpha: 78 },
  render: function (c) {
    var lines = String(c.items || '').split(/\r?\n/).filter(function (x) { return x.trim(); }).slice(0, +c.max || 5);
    var body = lines.map(function (l, i) {
      return '<div class="ov-sl">' + (c.numbered ? '<span style="color:' + esc(c.accent) + ';font-weight:800">' + (i + 1) + '. </span>' : '') + esc(l) + '</div>';
    }).join('');
    return '<div class="ov-soc ov-panel" style="' + corner(c.pos, 40) + 'width:' + (+c.width || 480) + 'px;background:' + hexA(c.bg, c.bgAlpha / 100) + '">' +
      (c.title ? '<h4>' + esc(c.title) + '</h4>' : '') + body + '</div>';
  }
};

CSS += '' +
'.ov-alert{display:flex;align-items:center;gap:30px;padding:26px 56px 26px 36px;border-radius:28px;min-width:620px}' +
'.ov-aico{font-size:' + F(110) + ';line-height:1}' +
'.ov-aname{font-size:' + F(56) + ';font-weight:900;line-height:1.1}' +
'@keyframes ovalert{from{opacity:0;transform:translateY(-60px) scale(.9)}to{opacity:1;transform:none}}' +
'@keyframes ovalertout{to{opacity:0;transform:translateY(-40px) scale(.95)}}' +
'.th-gradient .ov-panel{background:linear-gradient(135deg,var(--acc),var(--acc2))!important;border:0!important}' +
'.th-gradient .ov-fill{background:#fff!important;box-shadow:none!important}' +
'.th-gradient .ov-badge,.th-solid .ov-badge{background:rgba(0,0,0,.35)!important}' +
'.th-solid .ov-fill{background:var(--acc2)!important;box-shadow:none!important}' +
'.th-pixel .ov-panel{border:4px solid var(--acc)!important;box-shadow:8px 8px 0 var(--acc2)!important;border-radius:0!important;backdrop-filter:none}' +
'.th-pixel .ov-fill,.th-pixel .ov-bar{border-radius:0!important}' +
'.ov-stage.static .ov-anim{animation:none!important}' +
'.ov-stage.has-pr .ov-panel{border-radius:var(--pr)!important}' +
'.ov-stage.has-gl .ov-panel{box-shadow:0 0 calc(var(--gl)*.7px) var(--acc)}' +
'.ov-a-left{animation:ovleft .8s both cubic-bezier(.2,.8,.2,1)}.ov-a-right{animation:ovright .8s both cubic-bezier(.2,.8,.2,1)}' +
'.ov-a-down{animation:ovdown .8s both cubic-bezier(.2,.8,.2,1)}.ov-a-bounce{animation:ovbounce 1s both}' +
'.ov-a-float{animation:ovfloat 4s ease-in-out infinite}.ov-a-pulse{animation:ovpulse 2.6s ease-in-out infinite}' +
'@keyframes ovleft{from{opacity:0;transform:translateX(-160px)}}' +
'@keyframes ovright{from{opacity:0;transform:translateX(160px)}}' +
'@keyframes ovdown{from{opacity:0;transform:translateY(-80px)}}' +
'@keyframes ovbounce{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.08)}70%{transform:scale(.95)}100%{transform:none}}' +
'@keyframes ovfloat{50%{transform:translateY(-14px)}}' +
'@keyframes ovpulse{50%{opacity:.6}}' +
'.ov-fx-stars{position:absolute;inset:0;opacity:.75;animation:ovtw 4s ease-in-out infinite alternate;' +
'background-image:radial-gradient(2px 2px at 20px 30px,#fff,transparent),radial-gradient(2px 2px at 120px 80px,#fff,transparent),radial-gradient(1.5px 1.5px at 200px 150px,#fff,transparent),radial-gradient(2.5px 2.5px at 300px 40px,#fff,transparent),radial-gradient(1.5px 1.5px at 60px 190px,#fff,transparent);background-size:340px 240px}' +
'.ov-fx-stars.s2{background-size:520px 380px;opacity:.5;animation:ovdrift 80s linear infinite}' +
'@keyframes ovtw{from{opacity:.4}to{opacity:.9}}@keyframes ovdrift{to{background-position:-520px 380px}}' +
'.ov-fx-grid{position:absolute;left:-50%;right:-50%;bottom:-8%;height:65%;opacity:.4;transform:perspective(500px) rotateX(62deg);animation:ovgrid 3s linear infinite;' +
'background-image:linear-gradient(var(--acc) 2px,transparent 2px),linear-gradient(90deg,var(--acc) 2px,transparent 2px);background-size:90px 90px;-webkit-mask-image:linear-gradient(transparent,#000 60%);mask-image:linear-gradient(transparent,#000 60%)}' +
'@keyframes ovgrid{to{background-position:0 90px}}';

var ORDER = ['cam', 'lower', 'game', 'alert', 'recent', 'goal', 'socials', 'chat', 'starting', 'brb'];

var COURIER = 'Courier New, monospace';
var THEMES = [
  { id: 'cyber', name: 'Киберпанк', p: { accent: '#00f0ff', accent2: '#ff2bd6', textColor: '#ffffff', font: 'Trebuchet MS, sans-serif', theme: 'neon', bg: '#0a0620', c1: '#0a0620', c2: '#2a0a4a' } },
  { id: 'space', name: 'Космос', p: { accent: '#8b5cf6', accent2: '#38bdf8', textColor: '#ffffff', font: 'Segoe UI, Arial, sans-serif', theme: 'glass', bg: '#0b0f26', c1: '#050816', c2: '#1e1b4b' } },
  { id: 'sunset', name: 'Закат', p: { accent: '#ff3d6e', accent2: '#ffb000', textColor: '#ffffff', font: 'Trebuchet MS, sans-serif', theme: 'gradient', bg: '#2b0a1f', c1: '#2b0a1f', c2: '#7a2a1a' } },
  { id: 'pastel', name: 'Пастель', p: { accent: '#ff9ec0', accent2: '#c7b8ff', textColor: '#3b2a4a', font: 'Trebuchet MS, sans-serif', theme: 'solid', bg: '#fff1f6', c1: '#ffe3ee', c2: '#e0d4ff' } },
  { id: 'retro', name: 'Ретро-пиксель', p: { accent: '#ffd400', accent2: '#ff3b3b', textColor: '#ffffff', font: COURIER, theme: 'pixel', bg: '#14141f', c1: '#14141f', c2: '#2a1f4d' } },
  { id: 'minimal', name: 'Минимал', p: { accent: '#ffffff', accent2: '#9a9db0', textColor: '#ffffff', font: 'Segoe UI, Arial, sans-serif', theme: 'outline', bg: '#000000', c1: '#0b0b0b', c2: '#1c1c1c' } },
  { id: 'forest', name: 'Лес', p: { accent: '#3ddc84', accent2: '#a3e635', textColor: '#ffffff', font: 'Georgia, serif', theme: 'glass', bg: '#06180f', c1: '#04140b', c2: '#12452a' } },
  { id: 'ice', name: 'Лёд', p: { accent: '#38bdf8', accent2: '#e0f2fe', textColor: '#ffffff', font: 'Arial, sans-serif', theme: 'glass', bg: '#06182a', c1: '#06182a', c2: '#0e4a7a' } }
];

// Применяет тему к настройкам: меняются только оформление и цвета, тексты и числа остаются
function applyTheme(tid, cfg, id) {
  var base = full(tid), out = Object.assign({}, cfg);
  var t = null;
  THEMES.forEach(function (x) { if (x.id === id) t = x; });
  if (!t) return out;
  Object.keys(t.p).forEach(function (k) { if (k in base) out[k] = t.p[k]; });
  out.themeId = id;
  return out;
}

function full(tid) { return Object.assign({}, COMMON_DEF, TEMPLATES[tid].defaults); }

function injectCSS() {
  if (document.getElementById('ov-css')) return;
  var s = document.createElement('style');
  s.id = 'ov-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function wrap(t, c, opts) {
  var inner = t.render(c);
  var tr = t.full ? '' : 'transform:translate(' + (+c.dx || 0) + 'px,' + (+c.dy || 0) + 'px) rotate(' + (+c.rot || 0) + 'deg) scale(' + ((+c.scale || 100) / 100) + ');';
  var op = (c.opacity == null ? 100 : c.opacity) / 100;
  var an = (opts && opts.noAnim) || !c.anim || c.anim === 'none' ? '' : ' ov-a-' + c.anim;
  var dl = an && +c.animDelay > 0 ? 'animation-delay:' + (+c.animDelay) + 's;' : '';
  var box = 'position:absolute;left:0;top:0;width:1920px;height:1080px;';
  return '<div style="' + box + tr + 'opacity:' + op + '"><div class="' + an.trim() + '" style="' + box + dl + '">' + inner + '</div></div>';
}

function mount(stage, tid, c, opts) {
  if (stage._clean) { stage._clean(); stage._clean = null; }
  var t = TEMPLATES[tid];
  stage.className = 'ov-stage th-' + (c.theme || 'glass') + (c.shadow === false ? ' no-sh' : '') + (opts && opts.noAnim ? ' static' : '') + (+c.pr > 0 ? ' has-pr' : '') + (+c.glow > 0 ? ' has-gl' : '');
  var gf = String(c.gfont || '').replace(/["'<>;{}]/g, '').trim();
  if (gf) loadGFont(gf);
  stage.style.fontFamily = gf ? '"' + gf + '",' + c.font : c.font;
  stage.style.textTransform = c.caps ? 'uppercase' : '';
  stage.style.color = c.textColor || '#fff';
  stage.style.setProperty('--fs', (c.fs || 100) / 100);
  stage.style.setProperty('--acc', c.accent);
  stage.style.setProperty('--acc2', c.accent2 || c.accent);
  stage.style.setProperty('--blur', (c.blur == null ? 8 : c.blur) + 'px');
  stage.style.setProperty('--pr', (+c.pr || 0) + 'px');
  stage.style.setProperty('--gl', +c.glow || 0);
  stage.innerHTML = wrap(t, c, opts);
  if (!t.full && ((+c.scale || 100) !== 100 || +c.rot)) setOrigin(stage);
  if (t.init) stage._clean = t.init(stage, c);
}

// Точка, вокруг которой слой масштабируется и поворачивается: центр самого содержимого
function setOrigin(stage) {
  var outer = stage.firstElementChild, inner = outer && outer.firstElementChild;
  if (!inner) return;
  var x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9, any = false;
  Array.prototype.forEach.call(inner.children, function (el) {
    if (!el.offsetWidth && !el.offsetHeight) return;
    any = true;
    x1 = Math.min(x1, el.offsetLeft);
    y1 = Math.min(y1, el.offsetTop);
    x2 = Math.max(x2, el.offsetLeft + el.offsetWidth);
    y2 = Math.max(y2, el.offsetTop + el.offsetHeight);
  });
  if (any) outer.style.transformOrigin = (x1 + x2) / 2 + 'px ' + (y1 + y2) / 2 + 'px';
}

function loadGFont(name) {
  var id = 'gf-' + name.replace(/\W+/g, '_');
  if (document.getElementById(id)) return;
  var l = document.createElement('link');
  l.id = id;
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(name).replace(/%20/g, '+') + ':wght@400;700;900&display=swap';
  document.head.appendChild(l);
}

function fit(stage, w, h) {
  stage.style.transform = 'scale(' + Math.min(w / 1920, h / 1080) + ')';
}

function enc(tid, c) {
  var d = full(tid), o = {};
  Object.keys(c).forEach(function (k) { if (c[k] !== d[k]) o[k] = c[k]; });
  var s = JSON.stringify(o);
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function dec(tid, s) {
  try {
    s = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var o = JSON.parse(decodeURIComponent(escape(atob(s))));
    return Object.assign(full(tid), o);
  } catch (e) { return full(tid); }
}

/* ---------- сцена: несколько слоёв в одной ссылке ---------- */
function b64e(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function b64d(s) {
  s = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return decodeURIComponent(escape(atob(s)));
}

// layers: [{tpl, cfg, on}] — рисуются по порядку, последний сверху
function mountScene(root, layers, opts) {
  (root._stages || []).forEach(function (s) { if (s._clean) { s._clean(); s._clean = null; } });
  root.innerHTML = '';
  root._stages = [];
  layers.forEach(function (L) {
    if (L.on === false || !TEMPLATES[L.tpl]) return;
    var st = document.createElement('div');
    root.appendChild(st);
    mount(st, L.tpl, Object.assign(full(L.tpl), L.cfg), opts);
    root._stages.push(st);
  });
}

function fitScene(root, w, h) {
  (root._stages || []).forEach(function (s) { fit(s, w, h); });
}

function encScene(layers) {
  return b64e(JSON.stringify(layers.map(function (L) {
    var d = full(L.tpl), o = {};
    Object.keys(L.cfg).forEach(function (k) { if (L.cfg[k] !== d[k]) o[k] = L.cfg[k]; });
    return [L.tpl, o, L.on === false ? 0 : 1];
  })));
}

function decScene(s) {
  try {
    return JSON.parse(b64d(s)).filter(function (a) { return TEMPLATES[a[0]]; }).map(function (a) {
      return { tpl: a[0], cfg: Object.assign(full(a[0]), a[1] || {}), on: a[2] !== 0 };
    });
  } catch (e) { return []; }
}

// Готовые сборки
var PRESETS = [
  { id: 'game', name: 'Игровой стрим', layers: [['cam', { pos: 'bl', camW: 480 }], ['game', { pos: 'tl' }], ['goal', { pos: 'bottom', width: 800 }], ['chat', { height: 520, pos: 'right' }], ['alert', { dx: 120 }]] },
  { id: 'talk', name: 'Общение', layers: [['cam', { pos: 'br', camW: 640 }], ['lower', {}], ['socials', { pos: 'tl' }], ['alert', {}]] },
  { id: 'start', name: 'Перед стримом', layers: [['starting', {}]] },
  { id: 'brb', name: 'Перерыв', layers: [['brb', {}]] }
];

function presetLayers(id, themeId) {
  var p = null;
  PRESETS.forEach(function (x) { if (x.id === id) p = x; });
  if (!p) return [];
  return p.layers.map(function (a) {
    var cfg = Object.assign(full(a[0]), a[1]);
    if (themeId) cfg = applyTheme(a[0], cfg, themeId);
    return { tpl: a[0], cfg: cfg, on: true };
  });
}

var fbp = null;
function loadFirebase() {
  if (fbp) return fbp;
  fbp = new Promise(function (res, rej) {
    if (!g.FIREBASE_CONFIG || !g.FIREBASE_CONFIG.apiKey) return rej(new Error('no-config'));
    var base = 'https://www.gstatic.com/firebasejs/10.12.2/';
    var libs = ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js'];
    (function next(i) {
      if (i >= libs.length) {
        try {
          if (!g.firebase.apps.length) g.firebase.initializeApp(g.FIREBASE_CONFIG);
          res(g.firebase);
        } catch (e) { rej(e); }
        return;
      }
      var s = document.createElement('script');
      s.src = base + libs[i];
      s.onload = function () { next(i + 1); };
      s.onerror = function () { rej(new Error('load')); };
      document.head.appendChild(s);
    })(0);
  });
  return fbp;
}

g.OV = {
  PLATFORMS: PLATFORMS, TEMPLATES: TEMPLATES, ORDER: ORDER, COMMON: COMMON,
  THEMES: THEMES, applyTheme: applyTheme,
  full: full, mount: mount, fit: fit, enc: enc, dec: dec,
  mountScene: mountScene, fitScene: fitScene, encScene: encScene, decScene: decScene,
  PRESETS: PRESETS, presetLayers: presetLayers, GAMES: GAMES,
  injectCSS: injectCSS, loadFirebase: loadFirebase, esc: esc
};
})(window);
