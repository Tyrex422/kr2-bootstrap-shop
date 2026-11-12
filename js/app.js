// Данные инструментов (для страницы товара). Файлы фото лежат в images/.
var CATS = { g: 'Гитары', k: 'Клавишные', d: 'Ударные', w: 'Духовые', a: 'Звук' };
var EMOJI = { g: '🎸', k: '🎹', d: '🥁', w: '🎷', a: '🔊' };
var PRODUCTS = [
  { id: 1, name: 'Акустическая гитара D-100', brand: 'Yamaha', cat: 'g', day: 600, week: 3000, img: 'Акустическая гитара D-100.jpg' },
  { id: 2, name: 'Электрогитара Stratocaster', brand: 'Fender', cat: 'g', day: 900, week: 4500, img: 'Stratocaster.jpg' },
  { id: 3, name: 'Бас-гитара Fender Player II Jazz Bass RW 3-Color Sunburst', brand: 'Fender', cat: 'g', day: 800, week: 4000, img: 'FENDER Player II Jazz Bass RW 3-Color Sunburst.jpg', isNew: true },
  { id: 4, name: 'Цифровое пианино YAMAHA P-145B', brand: 'Yamaha', cat: 'k', day: 1200, week: 6000, img: 'Цифровое пианино YAMAHA P-145B.jpg' },
  { id: 5, name: 'Синтезатор KORG PA1000', brand: 'Korg', cat: 'k', day: 1800, week: 9000, img: 'Синтезатор KORG PA1000.jpg', isNew: true, busy: true },
  { id: 6, name: 'MIDI-клавиатура Arturia MiniLab MK3', brand: 'Arturia', cat: 'k', day: 400, week: 2000, img: 'Midi клавиатура Arturia minilab MK3.jpg' },
  { id: 7, name: 'Акустическая ударная установка TAMA ST52H4-BNS STAGESTAR', brand: 'Tama', cat: 'd', day: 2000, week: 10000, img: 'Акустическая ударная установка TAMA ST52H4-BNS STAGESTAR.jpg' },
  { id: 8, name: 'Электронные барабаны ROCKDALE Tempest Mesh 2', brand: 'Rockdale', cat: 'd', day: 1500, week: 7500, img: 'ROCKDALE Tempest Mesh 2.jpg', isNew: true },
  { id: 10, name: 'Блокфлейта сопрано YAMAHA YRS-24B', brand: 'Yamaha', cat: 'w', day: 500, week: 2500, img: 'Блокфлейта сопрано YAMAHA YRS-24B.jpeg' },
  { id: 11, name: 'Активная акустическая система BEHRINGER B115D', brand: 'Behringer', cat: 'a', day: 1100, week: 5500, img: 'Активная акустическая система BEHRINGER B115D.jpg', isNew: true }
];

function money(n) { return n.toLocaleString('ru-RU') + ' ₽'; }
function photoSrc(p) { return 'images/' + encodeURI(p.img); }

// Страница товара: подставляем данные по ?id=N
var currentProduct = PRODUCTS[1];
if (document.body.dataset.p === 'product') {
  var pid = parseInt(new URLSearchParams(location.search).get('id'), 10);
  currentProduct = PRODUCTS.filter(function (x) { return x.id === pid; })[0] || PRODUCTS[1];
  var p = currentProduct;
  var $ = function (id) { return document.getElementById(id); };

  document.title = p.name + ' — Резонанс';
  $('pCrumb').textContent = p.name;
  $('pTitle').textContent = p.name;
  $('pMeta').textContent = p.brand + ' · ' + CATS[p.cat];
  $('pDay').textContent = money(p.day);
  $('pWeek').textContent = money(p.week) + ' за неделю';

  if (p.img) {
    $('pImg').className = 'ratio ratio-4x3 bg-white rounded';
    $('pImg').innerHTML = '<img src="' + photoSrc(p) + '" class="object-fit-contain p-4" alt="' + p.name + '">';
  } else {
    $('pImg').className = 'd-flex align-items-center justify-content-center bg-body-secondary rounded py-5';
    $('pImg').style.fontSize = '9rem';
    $('pImg').textContent = EMOJI[p.cat];
  }

  var badge = $('pBadge'), book = $('pBook');
  if (p.busy) {
    badge.className = 'badge bg-secondary mb-2';
    badge.textContent = 'Сейчас в аренде';
    book.classList.add('disabled');
    book.setAttribute('aria-disabled', 'true');
  } else {
    book.href = 'order.html?id=' + p.id;
  }

  document.querySelector('[data-desc]').textContent = p.name + ' от ' + p.brand +
    ': надёжный инструмент для репетиций, записи и концертов. Перед выдачей настраиваем и проверяем.';
  $('pSpecs').innerHTML =
    '<tr><th>Бренд</th><td>' + p.brand + '</td></tr>' +
    '<tr><th>Категория</th><td>' + CATS[p.cat] + '</td></tr>' +
    '<tr><th>Цена за сутки</th><td>' + money(p.day) + '</td></tr>' +
    '<tr><th>Цена за неделю</th><td>' + money(p.week) + '</td></tr>';

  // Похожие: сначала та же категория, затем остальные; всего 3
  var others = PRODUCTS.filter(function (x) { return x.id !== p.id; });
  var sim = others.filter(function (x) { return x.cat === p.cat; })
    .concat(others.filter(function (x) { return x.cat !== p.cat; })).slice(0, 3);
  $('pSim').innerHTML = sim.map(function (s) {
    var media = s.img
      ? '<div class="bg-white border-bottom rounded-top p-3" style="height:220px"><img src="' + photoSrc(s) + '" class="w-100 h-100 object-fit-contain" alt="' + s.name + '"></div>'
      : '<div class="bg-body-secondary text-center py-4 emoji">' + EMOJI[s.cat] + '</div>';
    var action = s.busy
      ? '<span class="badge bg-secondary align-self-center">Сейчас в аренде</span>'
      : '<a class="btn btn-primary" href="order.html?id=' + s.id + '">Забронировать</a>';
    return '<div class="col-12 col-md-6 col-lg-4"><div class="card h-100 shadow-sm">' + media +
      '<div class="card-body d-flex flex-column"><div class="d-flex justify-content-between gap-2">' +
      '<h2 class="h5 card-title">' + s.name + '</h2>' +
      (s.isNew ? '<span class="badge bg-success align-self-start">Новинка</span>' : '') + '</div>' +
      '<p class="text-muted small mb-2">' + s.brand + ' · ' + CATS[s.cat] + '</p>' +
      '<p class="mb-1">' + money(s.day) + '/сутки · ' + money(s.week) + '/неделя</p>' +
      '<div class="mt-auto d-flex flex-wrap gap-2 pt-2"><a class="btn btn-outline-primary" href="product.html?id=' + s.id + '">Подробнее</a>' +
      action + '</div></div></div></div>';
  }).join('');
}

// Небольшие скрипты: подстановка названия в модалку, проверка дат, валидация форм.

// Подстановка названия инструмента в заголовок модалки быстрой брони
document.querySelectorAll('[data-book]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = btn.closest('.card');
    var title = card ? card.querySelector('.card-title').textContent : '';
    var target = document.getElementById('mi');
    if (target) target.textContent = title;
  });
});

// Проверка доступности на странице товара
var avForm = document.getElementById('av');
if (avForm) {
  avForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var d1 = document.getElementById('d1').value;
    var d2 = document.getElementById('d2').value;
    var res = document.getElementById('res');

    if (!d1 || !d2) {
      res.innerHTML = '<div class="alert alert-danger">Проверьте даты</div>';
      return;
    }

    var from = new Date(d1);
    var to = new Date(d2);
    var days = Math.round((to - from) / 86400000) + 1;

    if (days <= 0) {
      res.innerHTML = '<div class="alert alert-danger">Проверьте даты</div>';
    } else if (from <= new Date('2026-11-13') && to >= new Date('2026-11-10')) {
      res.innerHTML = '<div class="alert alert-danger">На эти даты инструмент занят</div>';
    } else {
      // цены берём у текущего инструмента
      var total = Math.floor(days / 7) * currentProduct.week + (days % 7) * currentProduct.day;
      res.innerHTML = '<div class="alert alert-success">Свободно! ' + days + ' дн. — ' +
        total.toLocaleString('ru-RU') + ' ₽</div>';
    }
  });
}

// Bootstrap-валидация форм
document.querySelectorAll('.needs-validation').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('was-validated');
    var extraOk = window.beforeSubmit ? window.beforeSubmit(form) : true;
    if (!form.checkValidity() || !extraOk) return;

    var sentNote = window.afterSubmitNote ? window.afterSubmitNote(form) : '';
    form.reset();
    form.classList.remove('was-validated');
    var ok = form.closest('.card, .modal-content, section');
    if (ok) {
      var alert = ok.querySelector('.ok');
      if (alert) {
        if (sentNote) alert.textContent = sentNote;
        alert.classList.remove('d-none');
      }
    }
  });
});

// Кнопка «Наверх»: появляется после прокрутки, плавно возвращает к началу страницы
(function () {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'toTop';
  btn.className = 'btn btn-primary rounded-circle shadow position-fixed end-0 me-3 z-3 d-none align-items-center justify-content-center';
  btn.style.bottom = '5rem';
  btn.style.width = '48px';
  btn.style.height = '48px';
  btn.setAttribute('aria-label', 'Наверх');
  btn.title = 'Наверх';
  btn.innerHTML = '▲';
  document.body.appendChild(btn);

  function toggle() {
    var show = window.scrollY > 300;
    btn.classList.toggle('d-none', !show);
    btn.classList.toggle('d-flex', show);
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', function () {
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });
})();


/* =====================================================================
   Новые возможности: тёмная тема, избранное, увеличение фото,
   набор инструментов для аренды, чат-консультант
   ===================================================================== */
(function () {
  'use strict';

  // ---------- помощники ----------
  function store(key, def) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* хранилище недоступно */ }
  }
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function node(markup) {
    var t = document.createElement('template');
    t.innerHTML = markup.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function thumb(p, size) {
    size = size || 56;
    return p.img
      ? '<img src="' + photoSrc(p) + '" alt="" class="rounded border object-fit-contain flex-shrink-0" style="background:#fff;width:' + size + 'px;height:' + size + 'px">'
      : '<span class="rounded border d-flex align-items-center justify-content-center flex-shrink-0 bg-body-secondary" style="width:' + size + 'px;height:' + size + 'px">' + EMOJI[p.cat] + '</span>';
  }

  // ---------- стили ----------
  var style = document.createElement('style');
  style.textContent =
    '[data-bs-theme="dark"] .bg-light{background-color:var(--bs-body-bg)!important}' +
    '[data-bs-theme="dark"] .bg-white:not(:has(img)){background-color:var(--bs-tertiary-bg)!important}' +
    '[data-bs-theme="dark"] .bg-white:has(img){color:#212529}' +
    '.rz-media{cursor:zoom-in}' +
    '.rz-card-tools{z-index:3}' +
    '#chatPanel{width:min(380px,calc(100vw - 2rem));height:min(520px,calc(100vh - 7.5rem));bottom:4.75rem;z-index:1040}' +
    '#chatLog{overflow-y:auto}' +
    '.rz-msg{max-width:88%;word-wrap:break-word}' +
    '.rz-msg ul{margin:.25rem 0 0;padding-left:1.1rem}' +
    '.rz-typing span{display:inline-block;width:6px;height:6px;margin:0 1px;border-radius:50%;background:currentColor;opacity:.4;animation:rzdot 1s infinite}' +
    '.rz-typing span:nth-child(2){animation-delay:.2s}.rz-typing span:nth-child(3){animation-delay:.4s}' +
    '@keyframes rzdot{0%,80%,100%{opacity:.2}40%{opacity:.9}}' +
    '@media (prefers-reduced-motion:reduce){.rz-typing span{animation:none}}' +
    '.rz-theme-anim,.rz-theme-anim *,.rz-theme-anim *::before,.rz-theme-anim *::after{transition:background-color .45s ease,color .45s ease,border-color .45s ease,box-shadow .45s ease,fill .45s ease!important}' +
    '@media (prefers-reduced-motion:reduce){.rz-theme-anim,.rz-theme-anim *,.rz-theme-anim *::before,.rz-theme-anim *::after{transition:none!important}}';
  document.head.appendChild(style);

  // ---------- 1. Тёмная тема ----------
  var THEME_KEY = 'rez_theme';
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getTheme() { return store(THEME_KEY, null) || systemTheme(); }
  function setTheme(t, persist) {
    document.documentElement.setAttribute('data-bs-theme', t);
    if (persist) save(THEME_KEY, t);
    var b = document.getElementById('themeToggle');
    if (b) {
      b.querySelector('i').className = t === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
      var label = t === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
      b.setAttribute('aria-label', label);
      b.title = label;
    }
  }

  // ---------- кнопки в навбаре ----------
  var navList = document.querySelector('#mainNav .navbar-nav');
  if (navList) {
    var anchor = navList.lastElementChild; // кнопка «Забронировать»
    var items = [
      '<li class="nav-item ms-lg-2 my-1 my-lg-0"><button type="button" class="btn btn-outline-light btn-sm" id="themeToggle"><i class="bi bi-moon-stars"></i></button></li>',
      '<li class="nav-item ms-lg-1 my-1 my-lg-0"><button type="button" class="btn btn-outline-light btn-sm position-relative" id="favOpen" aria-label="Избранное" title="Избранное"><i class="bi bi-heart"></i><span id="favCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">0</span></button></li>',
      '<li class="nav-item ms-lg-1 my-1 my-lg-0"><a class="btn btn-outline-light btn-sm position-relative" id="cartLink" href="order.html" aria-label="Набор для аренды" title="Набор для аренды"><i class="bi bi-bag"></i><span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark d-none">0</span></a></li>'
    ];
    items.forEach(function (m) { navList.insertBefore(node(m), anchor); });
  }
  setTheme(getTheme(), false);
  var themeBtn = document.getElementById('themeToggle');
  var themeTimer;
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var root = document.documentElement;
    root.classList.add('rz-theme-anim'); // плавный переход только на время переключения
    setTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark', true);
    clearTimeout(themeTimer);
    themeTimer = setTimeout(function () { root.classList.remove('rz-theme-anim'); }, 600);
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSys = function () { if (!store(THEME_KEY, null)) setTheme(systemTheme(), false); };
    if (mq.addEventListener) mq.addEventListener('change', onSys);
  }

  // ---------- 2. Избранное ----------
  var FAV_KEY = 'rez_fav';
  function getFav() { return store(FAV_KEY, []).filter(function (id) { return byId(id); }); }
  function toggleFav(id) {
    var f = getFav(), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    save(FAV_KEY, f);
    refreshUI();
  }
  function favInner(on, label) {
    return '<i class="bi ' + (on ? 'bi-heart-fill text-danger' : 'bi-heart') + '"></i>' + (label ? ' ' + (on ? 'В избранном' : 'В избранное') : '');
  }

  var favPanel = node(
    '<div class="offcanvas offcanvas-end" tabindex="-1" id="favPanel" aria-labelledby="favTitle">' +
    '<div class="offcanvas-header"><h2 class="offcanvas-title h5" id="favTitle">Избранное</h2>' +
    '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button></div>' +
    '<div class="offcanvas-body" id="favBody"></div></div>');
  document.body.appendChild(favPanel);
  var favOpen = document.getElementById('favOpen');
  if (favOpen) favOpen.addEventListener('click', function () {
    bootstrap.Offcanvas.getOrCreateInstance(favPanel).show();
  });

  function renderFavPanel() {
    var body = document.getElementById('favBody');
    var f = getFav();
    if (!f.length) {
      body.innerHTML = '<p class="text-body-secondary">Пока пусто. Нажмите ♥ на карточке инструмента, чтобы сохранить его здесь.</p>' +
        '<a class="btn btn-primary" href="catalog.html">Перейти в каталог</a>';
      return;
    }
    body.innerHTML = '<ul class="list-group">' + f.map(function (id) {
      var p = byId(id);
      return '<li class="list-group-item d-flex align-items-center gap-3">' + thumb(p, 56) +
        '<div class="flex-grow-1 min-w-0"><a class="fw-semibold small text-decoration-none" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
        '<div class="text-body-secondary small">' + money(p.day) + '/сутки</div></div>' +
        '<div class="d-flex flex-column gap-1">' +
        (p.busy ? '<span class="badge bg-secondary">В аренде</span>' : '<button type="button" class="btn btn-sm btn-outline-secondary cart-btn" data-id="' + p.id + '"></button>') +
        '<button type="button" class="btn btn-sm btn-outline-danger fav-btn" data-id="' + p.id + '" aria-label="Убрать из избранного"></button>' +
        '</div></li>';
    }).join('') + '</ul>';
  }

  // ---------- 4. Набор инструментов для аренды ----------
  var CART_KEY = 'rez_cart';
  function getCart() {
    return store(CART_KEY, []).filter(function (id) { var p = byId(id); return p && !p.busy; });
  }
  function setCart(c) { save(CART_KEY, c); refreshUI(); }
  function toggleCart(id) {
    var c = getCart(), i = c.indexOf(id);
    if (i > -1) c.splice(i, 1); else c.push(id);
    setCart(c);
  }
  var TERM_PRICE = {
    '1 сутки': function (p) { return p.day; },
    '3 суток': function (p) { return 3 * p.day; },
    'Неделя': function (p) { return p.week; },
    '2 недели': function (p) { return 2 * p.week; },
    'Месяц': function (p) { return 4 * p.week; }
  };
  function rentPrice(p, term) {
    return (TERM_PRICE[term] || TERM_PRICE['1 сутки'])(p);
  }
  function plural(n, a, b, c) {
    var m = n % 100, d = n % 10;
    if (m > 10 && m < 20) return c;
    if (d === 1) return a;
    return d > 1 && d < 5 ? b : c;
  }

  function renderOrderCart() {
    var list = document.getElementById('cartList');
    if (!list) return;
    var sel = document.getElementById('pr');
    if (sel && !sel.dataset.built) {
      sel.innerHTML = '<option value="">Выберите инструмент</option>' + PRODUCTS.map(function (p) {
        return '<option value="' + p.id + '"' + (p.busy ? ' disabled' : '') + '>' + p.name + (p.busy ? ' (сейчас в аренде)' : '') + '</option>';
      }).join('');
      sel.dataset.built = '1';
    }
    var cart = getCart();
    var termSel = document.getElementById('o5');
    var term = termSel ? termSel.value : '1 сутки';
    list.innerHTML = cart.length ? cart.map(function (id) {
      var p = byId(id);
      return '<li class="list-group-item d-flex align-items-center gap-3">' + thumb(p, 56) +
        '<div class="flex-grow-1"><div class="fw-semibold small">' + p.name + '</div>' +
        '<div class="text-body-secondary small">' + money(p.day) + '/сутки · ' + money(p.week) + '/неделя</div></div>' +
        '<div class="fw-semibold text-nowrap">' + money(rentPrice(p, term)) + '</div>' +
        '<button type="button" class="btn btn-sm btn-outline-danger cart-remove" data-id="' + p.id + '" aria-label="Убрать из набора: ' + esc(p.name) + '"><i class="bi bi-x-lg"></i></button></li>';
    }).join('') : '<li class="list-group-item text-body-secondary">Пока ничего не выбрано — добавьте инструменты выше или нажмите «В набор» в каталоге.</li>';

    var total = cart.reduce(function (s, id) { return s + rentPrice(byId(id), term); }, 0);
    var box = document.getElementById('cartTotal');
    if (box) box.innerHTML = cart.length
      ? '<div class="d-flex justify-content-between align-items-center flex-wrap gap-2"><span>' + cart.length + ' ' + plural(cart.length, 'инструмент', 'инструмента', 'инструментов') + ' · срок: ' + esc(term) + '</span><strong class="fs-5">Итого: ' + money(total) + '</strong></div>' +
        '<div class="small text-body-secondary mt-1">Доставка по городу от 300 ₽, самовывоз бесплатный. Залог — 30% стоимости инструмента, возвращается при сдаче.</div>'
      : 'Итоговая стоимость появится после выбора инструментов.';
    var field = document.getElementById('cartField');
    if (field) field.value = cart.join(',');
    var err = document.getElementById('cartErr');
    if (err && cart.length) err.classList.add('d-none');
  }

  // проверка формы брони: нужен хотя бы один инструмент
  var lastCount = 0;
  window.beforeSubmit = function (form) {
    if (!form.hasAttribute('data-cart-form')) return true;
    var n = getCart().length;
    var err = document.getElementById('cartErr');
    if (err) err.classList.toggle('d-none', n > 0);
    lastCount = n;
    return n > 0;
  };
  window.afterSubmitNote = function (form) {
    if (!form.hasAttribute('data-cart-form')) return '';
    return 'Спасибо! Заявка на ' + lastCount + ' ' + plural(lastCount, 'инструмент', 'инструмента', 'инструментов') + ' отправлена, мы свяжемся с вами.';
  };

  var orderForm = document.querySelector('form[data-cart-form]');
  if (orderForm) {
    var params = new URLSearchParams(location.search);
    var pre = (params.get('ids') || params.get('id') || '').split(',')
      .map(function (x) { return parseInt(x, 10); })
      .filter(function (id) { var p = byId(id); return p && !p.busy; });
    if (pre.length) {
      var cur = getCart();
      pre.forEach(function (id) { if (cur.indexOf(id) < 0) cur.push(id); });
      save(CART_KEY, cur);
    }
    var addBtn = document.getElementById('cartAdd');
    var selPr = document.getElementById('pr');
    addBtn.addEventListener('click', function () {
      var id = parseInt(selPr.value, 10);
      if (!id) return;
      var c = getCart();
      if (c.indexOf(id) < 0) { c.push(id); setCart(c); }
      selPr.value = '';
    });
    document.getElementById('o5').addEventListener('change', renderOrderCart);
    orderForm.addEventListener('reset', function () {
      setTimeout(function () { setCart([]); orderForm.classList.remove('was-validated'); }, 0);
    });
  }

  // ---------- 3. Увеличение фото ----------
  var zoomList = PRODUCTS.filter(function (p) { return p.img; });
  var zoomIdx = 0;
  var zoomEl = node(
    '<div class="modal fade" id="zoomModal" tabindex="-1" aria-labelledby="zoomTitle" aria-hidden="true">' +
    '<div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content">' +
    '<div class="modal-header"><h2 class="modal-title h5" id="zoomTitle"></h2>' +
    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button></div>' +
    '<div class="modal-body bg-white position-relative p-0" style="height:min(70vh,560px)">' +
    '<img id="zoomImg" class="w-100 h-100 object-fit-contain p-3" alt="">' +
    '<button type="button" id="zoomPrev" class="btn btn-dark rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 opacity-75" style="width:44px;height:44px" aria-label="Предыдущее фото"><i class="bi bi-chevron-left"></i></button>' +
    '<button type="button" id="zoomNext" class="btn btn-dark rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 opacity-75" style="width:44px;height:44px" aria-label="Следующее фото"><i class="bi bi-chevron-right"></i></button>' +
    '</div>' +
    '<div class="modal-footer justify-content-between"><span class="text-body-secondary small" id="zoomCount"></span>' +
    '<a class="btn btn-outline-primary" id="zoomLink" href="#">Подробнее</a></div>' +
    '</div></div></div>');
  document.body.appendChild(zoomEl);

  function showZoom(i) {
    zoomIdx = (i + zoomList.length) % zoomList.length;
    var p = zoomList[zoomIdx];
    var img = document.getElementById('zoomImg');
    img.src = photoSrc(p);
    img.alt = p.name;
    document.getElementById('zoomTitle').textContent = p.name;
    document.getElementById('zoomCount').textContent = (zoomIdx + 1) + ' из ' + zoomList.length;
    document.getElementById('zoomLink').href = 'product.html?id=' + p.id;
  }
  function openZoom(id) {
    var i = 0;
    zoomList.forEach(function (p, k) { if (p.id === id) i = k; });
    showZoom(i);
    bootstrap.Modal.getOrCreateInstance(zoomEl).show();
  }
  document.getElementById('zoomPrev').addEventListener('click', function () { showZoom(zoomIdx - 1); });
  document.getElementById('zoomNext').addEventListener('click', function () { showZoom(zoomIdx + 1); });
  document.addEventListener('keydown', function (e) {
    if (!zoomEl.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') showZoom(zoomIdx - 1);
    if (e.key === 'ArrowRight') showZoom(zoomIdx + 1);
  });

  // ---------- карточки: ♥, лупа, «В набор» ----------
  function enhanceCards(root) {
    root.querySelectorAll('.card').forEach(function (card) {
      if (card.dataset.enh) return;
      var link = card.querySelector('a[href^="product.html?id="]');
      if (!link) return;
      var id = parseInt(link.getAttribute('href').split('=')[1], 10);
      var p = byId(id);
      if (!p) return;
      card.dataset.enh = '1';

      card.insertAdjacentHTML('beforeend',
        '<button type="button" class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-2 rz-card-tools fav-btn" data-id="' + id + '" style="width:36px;height:36px;padding:0"></button>' +
        (p.img ? '<button type="button" class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 start-0 m-2 rz-card-tools" data-zoom="' + id + '" style="width:36px;height:36px;padding:0" aria-label="Увеличить фото" title="Увеличить фото"><i class="bi bi-arrows-fullscreen"></i></button>' : ''));

      var media = card.firstElementChild;
      if (p.img && media) {
        media.classList.add('rz-media');
        media.dataset.zoom = id;
      }
      var actions = card.querySelector('.mt-auto');
      if (actions && !p.busy) {
        actions.insertAdjacentHTML('beforeend', '<button type="button" class="btn cart-btn" data-id="' + id + '"></button>');
      }
    });
  }
  enhanceCards(document);

  // ---------- страница товара ----------
  if (document.body.dataset.p === 'product') {
    var pp = currentProduct;
    var book = document.getElementById('pBook');
    if (book) {
      var wrap = document.createElement('div');
      wrap.className = 'd-flex flex-wrap gap-2';
      book.parentNode.insertBefore(wrap, book);
      wrap.appendChild(book);
      wrap.insertAdjacentHTML('beforeend',
        (pp.busy ? '' : '<button type="button" class="btn btn-lg cart-btn" data-size="btn-lg" data-id="' + pp.id + '"></button>') +
        '<button type="button" class="btn btn-lg btn-outline-danger fav-btn" data-label="1" data-id="' + pp.id + '"></button>');
    }
    var pimg = document.getElementById('pImg');
    if (pimg && pp.img) {
      var holder = pimg.parentElement;
      holder.classList.add('position-relative');
      pimg.classList.add('rz-media');
      pimg.dataset.zoom = pp.id;
      holder.insertAdjacentHTML('beforeend',
        '<button type="button" class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-2 rz-card-tools" data-zoom="' + pp.id + '" style="width:36px;height:36px;padding:0" aria-label="Увеличить фото" title="Увеличить фото"><i class="bi bi-arrows-fullscreen"></i></button>');
    }
  }

  // ---------- единое обновление интерфейса ----------
  function setBadge(id, n) {
    var b = document.getElementById(id);
    if (!b) return;
    b.textContent = n;
    b.classList.toggle('d-none', n === 0);
  }
  function refreshUI() {
    var fav = getFav(), cart = getCart();
    setBadge('favCount', fav.length);
    setBadge('cartCount', cart.length);
    renderFavPanel();
    renderOrderCart();
    document.querySelectorAll('.fav-btn').forEach(function (b) {
      var on = fav.indexOf(parseInt(b.dataset.id, 10)) > -1;
      b.innerHTML = favInner(on, b.dataset.label);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.title = on ? 'Убрать из избранного' : 'В избранное';
      b.setAttribute('aria-label', b.title);
    });
    document.querySelectorAll('.cart-btn').forEach(function (b) {
      var on = cart.indexOf(parseInt(b.dataset.id, 10)) > -1;
      b.className = 'btn cart-btn ' + (on ? 'btn-success' : 'btn-outline-secondary') + (b.dataset.size ? ' ' + b.dataset.size : '');
      b.innerHTML = on ? '<i class="bi bi-bag-check"></i> В наборе' : '<i class="bi bi-bag-plus"></i> В набор';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var f = t.closest('.fav-btn');
    if (f) { toggleFav(parseInt(f.dataset.id, 10)); return; }
    var c = t.closest('.cart-btn');
    if (c) { toggleCart(parseInt(c.dataset.id, 10)); return; }
    var r = t.closest('.cart-remove');
    if (r) { toggleCart(parseInt(r.dataset.id, 10)); return; }
    var z = t.closest('[data-zoom]');
    if (z) { openZoom(parseInt(z.dataset.zoom, 10)); }
  });
  window.addEventListener('storage', refreshUI); // синхронизация между вкладками
  refreshUI();

  // ---------- 5. Консультант (чат) ----------
  var PHONE = '+7 (988) 833-96-15';
  var CHAT_KEY = 'rez_chat';
  var chatBtn = node(
    '<button type="button" id="chatOpen" class="btn btn-primary rounded-pill shadow position-fixed bottom-0 end-0 m-3 z-3 px-3" aria-expanded="false" aria-controls="chatPanel">' +
    '<i class="bi bi-chat-dots-fill"></i><span class="d-none d-sm-inline ms-2">Консультант</span></button>');
  var chatPanel = node(
    '<section id="chatPanel" class="card shadow-lg position-fixed end-0 me-3 d-none" aria-label="Чат с консультантом">' +
    '<div class="card-header bg-primary text-white d-flex align-items-center gap-2">' +
    '<i class="bi bi-headset fs-4"></i><div class="flex-grow-1 lh-sm"><div class="fw-semibold">Консультант «Резонанса»</div><div class="small opacity-75">Отвечает сразу</div></div>' +
    '<button type="button" class="btn-close btn-close-white" id="chatClose" aria-label="Закрыть чат"></button></div>' +
    '<div id="chatLog" class="card-body d-flex flex-column gap-2 flex-grow-1" role="log" aria-live="polite"></div>' +
    '<div class="px-3 pb-2 d-flex flex-wrap gap-1" id="chatChips"></div>' +
    '<form id="chatForm" class="card-footer p-2"><div class="input-group">' +
    '<input id="chatInput" class="form-control" placeholder="Напишите вопрос…" aria-label="Ваш вопрос" autocomplete="off" maxlength="200">' +
    '<button class="btn btn-primary" type="submit" aria-label="Отправить"><i class="bi bi-send-fill"></i></button></div></form></section>');
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatPanel);

  var chatLog = document.getElementById('chatLog');
  var chatInput = document.getElementById('chatInput');
  var chatHistory = [];
  try { chatHistory = JSON.parse(sessionStorage.getItem(CHAT_KEY) || '[]'); } catch (e) { chatHistory = []; }

  function addMsg(role, htmlText, remember) {
    var m = document.createElement('div');
    m.className = 'rz-msg rounded-3 px-3 py-2 small ' + (role === 'user' ? 'bg-primary text-white align-self-end' : 'bg-body-secondary align-self-start');
    m.innerHTML = htmlText;
    chatLog.appendChild(m);
    chatLog.scrollTop = chatLog.scrollHeight;
    if (remember !== false) {
      chatHistory.push({ role: role, html: htmlText });
      try { sessionStorage.setItem(CHAT_KEY, JSON.stringify(chatHistory.slice(-40))); } catch (e) { /* ок */ }
    }
    return m;
  }

  function norm(s) { return s.toLowerCase().replace(/ё/g, 'е'); }
  function has(t, words) {
    for (var i = 0; i < words.length; i++) if (t.indexOf(words[i]) > -1) return true;
    return false;
  }
  function plist(ps) {
    return '<ul>' + ps.map(function (p) {
      return '<li><a href="product.html?id=' + p.id + '">' + p.name + '</a> — ' + money(p.day) + '/сутки' +
        (p.busy ? ' <span class="text-body-secondary">(сейчас в аренде)</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  function minmax() {
    var d = PRODUCTS.map(function (p) { return p.day; });
    return { min: Math.min.apply(null, d), max: Math.max.apply(null, d) };
  }

  var CAT_WORDS = {
    g: ['гитар'],
    k: ['пианин', 'клавиш', 'синтез', 'фортепиан', 'midi', 'миди'],
    d: ['барабан', 'ударн'],
    w: ['флейт', 'духов'],
    a: ['колонк', 'акустическая систем', 'звук', 'усилител', 'аудио']
  };
  var CAT_NAMES = { g: 'Гитары', k: 'Клавишные', d: 'Ударные', w: 'Духовые', a: 'Звук' };

  function reply(raw) {
    var t = norm(raw);

    if (/^\s*(привет|здравствуй|здравствуйте|добрый день|добрый вечер|доброе утро|хай|hello|hi)[\s!.,]*$/.test(t)) {
      return 'Здравствуйте! Подскажу по инструментам, ценам и условиям аренды. Что вас интересует?';
    }
    if (has(t, ['спасибо', 'благодар'])) return 'Пожалуйста! Если появятся ещё вопросы — пишите.';

    // условия и сервис
    if (has(t, ['залог'])) return 'Залог — 30% стоимости инструмента, он возвращается при сдаче (в день сдачи).';
    if (has(t, ['достав', 'привез', 'курьер', 'самовывоз'])) return 'Доставка по городу — от 300 ₽ (точная цена зависит от района), самовывоз из студии бесплатный. Привозим в удобное время.';
    if (has(t, ['продл'])) return 'Да, продлить можно: позвоните или напишите нам за сутки до окончания срока — по телефону ' + PHONE + ' или через форму на странице <a href="contacts.html">«Контакты»</a>.';
    if (has(t, ['возврат', 'сдать', 'сдач', 'вернуть'])) return 'Привезите инструмент в студию или вызовите курьера — залог вернём в день сдачи.';
    if (has(t, ['срок', 'на сколько', 'длительн', 'как долго'])) return 'Арендовать можно от 1 суток до 3 месяцев. В форме брони доступны сроки: 1 сутки, 3 суток, неделя, 2 недели и месяц.';
    if (has(t, ['поломк', 'слом', 'неисправ', 'гаранти', 'не работает'])) return 'Каждый инструмент проверяем перед выдачей. При поломке сразу позвоните нам — заменим инструмент; ремонт по вине арендатора оплачивается.';
    if (has(t, ['что входит', 'комплект', 'кейс', 'чехол', 'аксессуар', 'настройк', 'настро'])) return 'В стоимость входят настройка, чехол/кейс, базовые аксессуары и гарантия исправности.';
    if (has(t, ['контакт', 'телефон', 'позвонить', 'адрес', 'где наход', 'добраться', 'время работы', 'часы работы', 'график', 'работаете', 'почта', 'email', 'e-mail'])) {
      return 'Студия: г. Москва, ул. Музыкальная, д. 12, ежедневно 10:00–20:00.<br>Телефон: <a href="tel:+79888339615">' + PHONE + '</a><br>Почта: <a href="mailto:info@rezonans.example">info@rezonans.example</a>';
    }
    if (has(t, ['акци', 'скидк', 'выгод', 'спецпредлож'])) return 'Сейчас действуют акции: неделя по цене 5 суток на все клавишные до конца месяца и −20% на ударные для репетиций (доставка и сборка в подарок). Подробности — на <a href="rent.html">странице аренды</a>.';
    if (has(t, ['несколько', 'сразу', 'набор', 'корзин', 'комплект инструмент'])) return 'Да, можно арендовать несколько инструментов одной заявкой: нажимайте «В набор» на карточках, затем откройте <a href="order.html">форму брони</a> — там будет итоговая сумма.';
    if (has(t, ['избранн', 'сердечк'])) return 'Нажмите ♥ на карточке инструмента — он сохранится в «Избранном» (кнопка с сердечком в меню).';
    if (has(t, ['тёмн', 'темн', 'ночн'])) return 'Тема переключается кнопкой с луной/солнцем в меню сверху.';
    if (has(t, ['забронир', 'как арендовать', 'как оформить', 'как заказать', 'бронь'])) return 'Выберите инструмент в <a href="catalog.html">каталоге</a>, нажмите «Забронировать» или «В набор» и заполните <a href="order.html">форму брони</a>. Мы свяжемся с вами для подтверждения.';

    // отсутствующие в каталоге позиции
    if (has(t, ['саксофон', 'микрофон'])) return 'Саксофонов и микрофонов сейчас нет в каталоге. Из духовых есть блокфлейта YAMAHA YRS-24B. Остальное можно уточнить по телефону ' + PHONE + '.';

    // бюджет
    var bm = t.match(/(?:до|не дороже|дешевле|бюджет)\s*(\d[\d\s]{1,6})/);
    if (bm) {
      var limit = parseInt(bm[1].replace(/\s/g, ''), 10);
      var cheap = PRODUCTS.filter(function (p) { return p.day <= limit; }).sort(function (a, b) { return a.day - b.day; });
      return cheap.length ? 'В пределах ' + money(limit) + ' за сутки есть:' + plist(cheap) : 'Дешевле ' + money(limit) + ' за сутки сейчас ничего нет — самый доступный вариант ' + money(minmax().min) + '/сутки.';
    }
    if (has(t, ['дешев', 'недорог', 'эконом', 'самый бюджет'])) {
      return 'Самые доступные по цене:' + plist(PRODUCTS.slice().sort(function (a, b) { return a.day - b.day; }).slice(0, 3));
    }
    if (has(t, ['начина', 'новичк', 'первый раз', 'ребёнк', 'ребенк', 'для детей'])) {
      return 'Для начинающих удобно взять:' + plist([byId(1), byId(4), byId(10)]) + 'Все инструменты настраиваем перед выдачей.';
    }

    // конкретные модели и бренды (латиница/цифры)
    var tokens = t.split(/[^a-zа-я0-9\-]+/).filter(function (x) { return x.length >= 3 && /[a-z0-9]/.test(x); });
    if (tokens.length) {
      var hits = PRODUCTS.filter(function (p) {
        var hay = norm(p.name + ' ' + p.brand);
        return tokens.some(function (x) { return hay.indexOf(x) > -1; });
      });
      if (hits.length) return 'Нашёл:' + plist(hits);
    }

    // категории
    var cats = Object.keys(CAT_WORDS).filter(function (k) { return has(t, CAT_WORDS[k]); });
    if (cats.length) {
      var ps = PRODUCTS.filter(function (p) { return cats.indexOf(p.cat) > -1; });
      return 'Из раздела «' + cats.map(function (k) { return CAT_NAMES[k]; }).join(', ') + '» доступно:' + plist(ps) + '<a href="catalog.html?cat=' + cats[0] + '">Открыть в каталоге</a>';
    }

    if (has(t, ['подобрать', 'посоветуй', 'посоветуйте', 'что выбрать', 'порекомендуй', 'рекоменд', 'какой инструмент'])) {
      return 'Что вы играете или хотите попробовать? Выберите раздел ниже, и я покажу варианты.';
    }
    if (has(t, ['цена', 'цены', 'стоит', 'стоимост', 'сколько', 'прайс', 'тариф'])) {
      var mm = minmax();
      return 'Аренда стоит от ' + money(mm.min) + ' до ' + money(mm.max) + ' в сутки, неделя стоит как 5 суток, то есть выгоднее. Назовите инструмент — подскажу точную цену.';
    }

    return 'Не уверен, что правильно понял вопрос. Могу рассказать о ценах, залоге, доставке, продлении, или подобрать инструмент. Либо позвоните: <a href="tel:+79888339615">' + PHONE + '</a>.';
  }
  window.rezBotReply = reply; // для проверки в консоли

  var CHIPS = ['Подобрать инструмент', 'Сколько стоит аренда?', 'Залог и условия', 'Доставка', 'Контакты'];
  var CAT_CHIPS = ['Гитары', 'Клавишные', 'Ударные', 'Духовые', 'Звук'];
  function showChips(list) {
    var box = document.getElementById('chatChips');
    box.innerHTML = list.map(function (c) {
      return '<button type="button" class="btn btn-outline-primary btn-sm rounded-pill" data-chip="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
  }

  var typing = false;
  function ask(text) {
    text = text.trim();
    if (!text || typing) return;
    addMsg('user', esc(text));
    var wait = addMsg('bot', '<span class="rz-typing" aria-label="Консультант печатает"><span></span><span></span><span></span></span>', false);
    typing = true;
    setTimeout(function () {
      wait.remove();
      var ans = reply(text);
      addMsg('bot', ans);
      typing = false;
      showChips(/Выберите раздел ниже/.test(ans) ? CAT_CHIPS : CHIPS);
    }, 550);
  }

  function openChat(open) {
    chatPanel.classList.toggle('d-none', !open);
    chatBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (!chatLog.children.length) {
        if (chatHistory.length) {
          chatHistory.forEach(function (m) { addMsg(m.role, m.html, false); });
        } else {
          addMsg('bot', 'Здравствуйте! Я консультант студии «Резонанс». Помогу выбрать инструмент и отвечу про условия аренды.');
        }
      }
      showChips(CHIPS);
      chatInput.focus();
    }
  }
  chatBtn.addEventListener('click', function () { openChat(chatPanel.classList.contains('d-none')); });
  document.getElementById('chatClose').addEventListener('click', function () { openChat(false); chatBtn.focus(); });
  document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = chatInput.value;
    chatInput.value = '';
    ask(v);
  });
  document.getElementById('chatChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-chip]');
    if (b) ask(b.getAttribute('data-chip'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !chatPanel.classList.contains('d-none') && !document.querySelector('.modal.show')) openChat(false);
  });
})();