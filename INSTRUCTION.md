# Сайт оверлеев V.5: полная инструкция

**Что нового в V.5.** Теперь оверлеи собираются в сцену из нескольких слоёв, и в OBS вставляется ОДНА ссылка на всю сцену (один источник «Браузер» вместо нескольких). Добавились готовые сборки (игровой стрим, общение, перед стримом, перерыв), размер и поворот слоя, 10 типов анимации с задержкой, размытие, скругление и свечение панелей, свой шрифт Google Fonts, эффекты фона заставок, новый дизайн сайта. Набор файлов тот же, 4 штуки: чтобы обновиться с V.4, загрузи 3 изменённых (index.html, overlay.html, overlays.js) поверх старых. config.js не трогай. Старые ссылки на отдельные оверлеи продолжают работать.

Итоговый адрес сайта: https://renk11.github.io/overlays/

## Файлы (4 шт.)

| Файл | Для чего |
|---|---|
| index.html | сайт-редактор (шаблоны, темы, настройки) |
| overlay.html | страница, которую открывает OBS |
| overlays.js | шаблоны, темы, игры, вся логика оверлеев |
| config.example.js | образец настроек Firebase. Из него делаешь свой config.js (шаг 4) |

Пятый файл, config.js, создаёшь сам на шаге 4. Он нужен только для входа через Google и постоянных ссылок. Без него сайт работает, но оверлеи сохраняются только в твоём браузере.

## Шаг 1. Создай репозиторий

1. Открой github.com, нажми «+» справа вверху → New repository.
2. Repository name: `overlays`. Тип: Public.
3. Нажми Create repository.

## Шаг 2. Загрузи файлы

1. В новом репозитории нажми «uploading an existing file» (или Add file → Upload files).
2. Перетащи 4 файла: index.html, overlay.html, overlays.js, config.example.js.
3. Внизу нажми Commit changes.

## Шаг 3. Включи сайт (GitHub Pages)

1. В репозитории: Settings → Pages.
2. Build and deployment → Source: Deploy from a branch.
3. Branch: `main`, папка `/ (root)` → Save.
4. Через 1–2 минуты сайт откроется по адресу https://renk11.github.io/overlays/

Уже сейчас всё работает: выбираешь шаблон и тему, копируешь ссылку для OBS. Дальше шаг 4 нужен, если хочешь вход через Google и постоянную ссылку, которая обновляется сама.

## Шаг 4. Вход и облако (необязательно)

### 4.1. Возьми данные Firebase
Проще всего скопировать из MetalCut: в его index.html найди блок `firebaseConfig` с полями apiKey, authDomain, projectId, appId.

Или в Firebase console: шестерёнка → Project settings → General → Your apps → веб-приложение (значок `</>`) → SDK setup and configuration → Config.

### 4.2. Создай config.js
В репозитории `overlays`: Add file → Create new file. Имя файла: `config.js`. Содержимое (вставь свои значения):

```js
window.FIREBASE_CONFIG = {
  apiKey: 'ТВОЙ_apiKey',
  authDomain: 'ТВОЙ_authDomain',
  projectId: 'ТВОЙ_projectId',
  appId: 'ТВОЙ_appId'
};
```

Нажми Commit changes. Ключ apiKey в публичном репозитории это нормально: защита делается правилами базы (шаг 4.4).

### 4.3. Включи вход через Google
1. Firebase console → Authentication → Sign-in method → Google → Enable → Save.
2. Там же: Settings → Authorized domains. Должен быть `renk11.github.io`. Если нет, нажми Add domain и добавь.

### 4.4. База и правила
1. Firebase console → Firestore Database. Если базы ещё нет, нажми Create database.
2. Вкладка Rules. Если у тебя там уже правила (например, для MetalCut), НЕ заменяй весь текст. Добавь этот блок внутрь `match /databases/{database}/documents { ... }`, рядом с имеющимися:

```
match /overlays/{id} {
  allow read: if true;
  allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
  allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
}
```

Если проект новый, правила целиком:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /overlays/{id} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}
```

3. Нажми Publish.

## Шаг 5. Собери сцену и проверь

1. Открой сайт (Ctrl+F5). Если настроил шаг 4, справа вверху будет кнопка «Войти через Google». Войди.
2. Раздел «Выбери шаблоны»: нажимай на шаблоны, чтобы добавить их в сцену. Или в «Слоях сцены» выбери готовую сборку.
3. В списке слоёв выбери слой и настрой его справа. Слои можно скрывать (глаз), двигать вверх и вниз, дублировать и удалять. Слой можно двигать мышью прямо на превью.
4. Тему из блока «Тема для всей сцены» применяй сразу ко всем слоям.
5. Нажми «Сохранить». Появится «Постоянная ссылка» (если вошёл): её и вставляй в OBS. Без входа бери «Одну ссылку для OBS на всю сцену».

## Шаг 6. Вставь в OBS (Twitch, YouTube, VK Видео)

1. В OBS: блок «Источники» → «+» → «Браузер».
2. URL: вставь ссылку на сцену. Ширина 1920, высота 1080. Пользовательский CSS не трогай.
3. Фон прозрачный сам. Поставь источник над игрой и камерой.
4. Для анимации появления: в свойствах источника включи «Обновлять браузер, когда сцена становится активной».
5. Одна сцена на одну ситуацию: игра, общение, «Скоро начнём», перерыв. В каждой OBS-сцене свой источник «Браузер» со своей ссылкой.
6. Рамка камеры: подгони окно камеры под рамку. Рамка чата: поставь окно чата внутрь.

Оверлей один для всех площадок: OBS отправляет картинку на Twitch, YouTube и VK Видео одинаково.

## Свой логотип игры или фон

Положи картинку в репозиторий рядом с сайтом (Add file → Upload files), например `logo.png`. На сайте впиши её имя в поле «Свой логотип».

## Как обновлять сайт

1. В репозитории: Add file → Upload files, загрузи изменённые файлы (одноимённые заменятся).
2. Commit changes. Подожди минуту, на сайте нажми Ctrl+F5.
3. В OBS: правой кнопкой по источнику → «Обновить кэш страницы».
4. config.js не трогай и не загружай поверх.

## Если что-то не работает

| Что видишь | Что делать |
|---|---|
| Сайт даёт 404 | Подожди 2 минуты. Проверь, что Pages включены (шаг 3) |
| Надпись «Без входа…» вместо кнопки | config.js не создан, назван иначе или в нём лишняя/пропущенная запятая или кавычка |
| Ошибка входа: unauthorized-domain | Добавь `renk11.github.io` в Authorized domains (шаг 4.3) |
| Ошибка при сохранении: permissions | Не опубликованы правила Firestore (шаг 4.4) |
| В OBS пусто | Скопируй ссылку целиком, размер источника 1920×1080 |
| Логотип не виден | Проверь имя файла (регистр букв важен) и что файл лежит в репозитории |

---

## V.8: цель, события и донаты из сервисов

Новый файл: **live.js** (кладётся рядом с overlays.js). Заменить: index.html, overlays.js, overlay.html. В config.example.js добавилась строка DONATIONALERTS_CLIENT_ID (в свой config.js допиши её сам, файл целиком не заменяй).

### StreamElements (Twitch, YouTube)
1. streamelements.com → Настройки (Account settings) → Channels: скопируй «Channel ID» и «JWT Token».
2. На сайте в блоке «Подключения» вставь оба значения, нажми «Подключить».

### DonationAlerts (в том числе донаты VK)
1. donationalerts.com/application/clients → создай приложение. Redirect URI: адрес твоего сайта с конечным слэшем, например https://жестянщик11.рф/overlays/ (и такой же для renk11.github.io, если пользуешься обоими).
2. Скопируй ID приложения в config.js: `window.DONATIONALERTS_CLIENT_ID = '...';`
3. На сайте нажми «Войти через DonationAlerts», разреши доступ. Токен подставится сам.
4. «Считать цель с даты» нужна, чтобы цель «сумма донатов» шла от нужного дня.

### Как включить в слоях
- «Цель стрима»: поле «Откуда брать число» → выбери источник.
- «Событие» и «Последние события»: галочка «Брать реальные события».
- Кнопки «Пробное событие» показывают, как выглядит окно.

### Безопасность
Токены попадают в ссылку на сцену (`&k=`) и в облачную копию. Ссылку не показывай на стриме. Если утекла, смени токен в сервисе. Правила Firestore: чтение документа по id разрешено всем, список документов только владельцу:
```
match /overlays/{id} {
  allow get: if true;
  allow list: if request.auth != null && resource.data.uid == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
  allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
}
```
YouTube и VK напрямую не подключаются: их донаты приходят через DonationAlerts или StreamElements. Прямое подключение Twitch (EventSub) не делал.
