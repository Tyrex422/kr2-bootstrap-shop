
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

      // 900 ₽ в сутки, 4500 ₽ в неделю — как у Stratocaster
      var total = Math.floor(days / 7) * 4500 + (days % 7) * 900;

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
    if (!form.checkValidity()) return;

    form.reset();
    form.classList.remove('was-validated');
    var ok = form.closest('.card, .modal-content, section');
    if (ok) {
      var alert = ok.querySelector('.ok');
      if (alert) alert.classList.remove('d-none');
    }
  });

});

});

// Кнопка «Наверх»: появляется после прокрутки, плавно возвращает к началу страницы
(function () {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'toTop';
  btn.className = 'btn btn-primary rounded-circle shadow position-fixed bottom-0 end-0 m-3 z-3 d-none align-items-center justify-content-center';
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
