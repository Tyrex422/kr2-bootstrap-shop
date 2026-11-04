// Данные и минимальная логика (поиск, фильтры, сортировка, пагинация, валидация)
const C = {
  g: ['Гитары', '🎸'],
  k: ['Клавишные', '🎹'],
  d: ['Ударные', '🥁'],
  w: ['Духовые', '🎷'],
  a: ['Звук', '🔊']
};

// id, название, бренд, категория, цена/сутки, цена/неделя, популярность, новинка, доступен
const I = [
  [1, 'Акустическая гитара D-100', 'Yamaha', 'g', 600, 3000, 95, 0, 1],
  [2, 'Электрогитара Stratocaster', 'Fender', 'g', 900, 4500, 98, 0, 1],
  [3, 'Бас-гитара Jazz Bass', 'Squier', 'g', 800, 4000, 70, 1, 1],
  [4, 'Цифровое пианино P-45', 'Yamaha', 'k', 1200, 6000, 90, 0, 1],
  [5, 'Синтезатор Prophet-12', 'Sequential', 'k', 1800, 9000, 60, 1, 0],
  [6, 'MIDI-клавиатура Keystation', 'M-Audio', 'k', 400, 2000, 55, 0, 1],
  [7, 'Ударная установка Stage', 'Pearl', 'd', 2000, 10000, 85, 0, 1],
  [8, 'Электронные барабаны TD-1', 'Roland', 'd', 1500, 7500, 75, 1, 1],
  [9, 'Саксофон альт AS-100', 'Yamaha', 'w', 1000, 5000, 65, 0, 0],
  [10, 'Флейта FL-221', 'Jupiter', 'w', 500, 2500, 50, 0, 1],
  [11, 'Акустическая система Eon', 'JBL', 'a', 1100, 5500, 80, 1, 1],
  [12, 'Микрофон SM58', 'Shure', 'a', 300, 1500, 88, 0, 1],
].map(a => ({ id: a[0], n: a[1], b: a[2], c: a[3], d: a[4], w: a[5], p: a[6], nw: a[7], av: a[8] }));

const $ = s => document.querySelector(s);
const put = (s, h) => {
  const e = $(s);
  if (e) e.innerHTML = h;
};
const rub = n => n.toLocaleString('ru-RU') + ' ₽';
const cost = (x, n) => Math.floor(n / 7) * x.w + (n % 7) * x.d;
const p = document.body.dataset.p, qs = new URLSearchParams(location.search);

const steps = [
  ['Выберите инструмент', 'Найдите нужный в каталоге.'],
  ['Забронируйте дату', 'Оставьте заявку на удобные даты.'],
  ['Заберите и пользуйтесь', 'Мы настроим инструмент перед выдачей.']
];

const faqRent = [
  ['Можно ли продлить аренду?', 'Да, позвоните или напишите нам за сутки до окончания срока.'],
  ['Есть ли доставка?', 'Да, по городу от 300 ₽. Самовывоз бесплатный.'],
  ['Что входит в стоимость?', 'Настройка, чехол/кейс, базовые аксессуары и гарантия исправности.']
];

const faqAll = [
  ['Как оформить возврат?', 'Привезите инструмент в студию или вызовите курьера — залог вернём в день сдачи.'],
  ['Как работает доставка?', 'Привозим в удобное время, стоимость зависит от района.'],
  ['Как продлить аренду?', 'Сообщите нам по телефону или через форму до окончания срока.'],
  ['Что с гарантией исправности?', 'Каждый инструмент проверяется перед выдачей; при неполадке заменим без доплат.']
];

const faq = l => put('#faq', l.map((f, i) => `
  <div class="accordion-item">
    <h3 class="accordion-header">
      <button class="accordion-button ${i ? 'collapsed' : ''}" data-bs-toggle="collapse" data-bs-target="#f${i}">${f[0]}</button>
    </h3>
    <div id="f${i}" class="accordion-collapse collapse ${i ? '' : 'show'}" data-bs-parent="#faq">
      <div class="accordion-body">${f[1]}</div>
    </div>
  </div>
`).join(''));

// Навигация и подвал
const pages = [
  ['index', 'Главная'],
  ['catalog', 'Каталог'],
  ['rent', 'Аренда'],
  ['contacts', 'Отзывы и контакты']
];

const act = { product: 'catalog', order: 'rent' }[p] || p;

put('#nav', `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="index.html">🎵 Звук</a>
      <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Переключить навигацию">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          ${pages.map(a => `
            <li class="nav-item">
              <a class="nav-link ${a[0] == act ? 'active' : ''}" ${a[0] == act ? 'aria-current="page"' : ''} href="${a[0]}.html">${a[1]}</a>
            </li>
          `).join('')}
          <li class="nav-item ms-lg-2">
            <a class="btn btn-warning btn-sm" href="order.html">Забронировать</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
`);

put('#foot', `
  <div class="bg-dark text-white py-4 mt-5">
    <div class="container">
      <div class="row align-items-center g-3">
        <div class="col-12 col-md-6">© 2026 Студия «Звук». Учебный проект.</div>
        <div class="col-12 col-md-6 text-md-end fs-4">
          <a class="text-white me-3" href="#" aria-label="Telegram"><i class="bi bi-telegram"></i></a>
          <a class="text-white me-3" href="#" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
          <a class="text-white" href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
        </div>
      </div>
    </div>
  </div>
`);

// Карточка инструмента (m: 'c' — каталог с модальным окном, 'r' — аренда с итогом за срок)
const card = (x, m, n = 1) => `
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm">
      <div class="bg-body-secondary text-center py-4 emoji">${C[x.c][1]}</div>
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between gap-2">
          <h2 class="h5 card-title">${x.n}</h2>
          ${x.nw ? '<span class="badge bg-success align-self-start">Новинка</span>' : ''}
        </div>
        <p class="text-muted small mb-2">${x.b} · ${C[x.c][0]}</p>
        <p class="mb-1">${rub(x.d)}/сутки · ${rub(x.w)}/неделя</p>
        ${m == 'r' ? `<p class="fw-bold">За ${n} дн.: ${rub(cost(x, n))}</p>` : ''}
        <div class="mt-auto d-flex flex-wrap gap-2 pt-2">
          <a class="btn btn-outline-primary" href="product.html?id=${x.id}">Подробнее</a>
          ${x.av
            ? (m == 'c'
                ? `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#bookModal" data-book="${x.id}">Забронировать</button>`
                : `<a class="btn btn-primary" href="order.html?id=${x.id}">Забронировать</a>`)
            : '<span class="badge bg-secondary align-self-center">Сейчас в аренде</span>'}
        </div>
      </div>
    </div>
  </div>
`;

// Главная
put('#adv', [
  ['patch-check', 'Проверенные инструменты'],
  ['sliders', 'Бесплатная настройка перед выдачей'],
  ['play-circle', 'Тест-драйв в студии'],
  ['shield-check', 'Гарантия исправности'],
  ['calendar-check', 'Гибкие сроки'],
  ['truck', 'Доставка по городу']
].map(a => `
  <div class="col-12 col-md-6 col-lg-4">
    <div class="p-4 border rounded bg-white h-100 d-flex gap-3 align-items-center">
      <i class="bi bi-${a[0]} fs-1 text-primary"></i>
      <h3 class="h6 mb-0">${a[1]}</h3>
    </div>
  </div>
`).join(''));

put('#cats', Object.entries(C).map(([k, v]) => `
  <div class="col-6 col-md-4 col-lg-2">
    <a class="card text-center text-decoration-none shadow-sm h-100" href="catalog.html?cat=${k}">
      <div class="card-body">
        <div class="emoji">${v[1]}</div>
        <div class="fw-semibold mt-2">${v[0]}</div>
      </div>
    </a>
  </div>
`).join(''));

put('#pop', [...I].sort((a, b) => b.p - a.p).slice(0, 3).map(x => card(x, 'r')).join(''));

put('#steps', steps.map((s, i) => `
  <div class="col-12 col-md-4">
    <div class="card h-100 text-center shadow-sm">
      <div class="card-body">
        <span class="badge rounded-pill bg-primary fs-5 mb-2">${i + 1}</span>
        <h3 class="h5">${s[0]}</h3>
        <p class="text-muted mb-0">${s[1]}</p>
      </div>
    </div>
  </div>
`).join(''));

// Каталог / Аренда
document.querySelectorAll('select[data-inst]').forEach(s => 
  s.innerHTML = '<option value="">Выберите инструмент</option>' + I.map(x => `<option value="${x.id}">${x.n}</option>`).join('')
);

let pg = 1;

if ($('#cat')) {
  $('#cat').innerHTML = '<option value="">Все категории</option>' + Object.entries(C).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('');
  if (qs.get('cat')) $('#cat').value = qs.get('cat');

  const draw = () => {
    const t = $('#q').value.toLowerCase(),
          c = $('#cat').value,
          lo = +($('#min')?.value) || 0,
          hi = +($('#max')?.value) || 1e9,
          s = $('#sort')?.value,
          n = +($('#term')?.value) || 1;

    const r = I.filter(x =>
      (p == 'catalog' || x.av) &&
      (x.n + ' ' + x.b).toLowerCase().includes(t) &&
      (!c || x.c == c) &&
      x.d >= lo && x.d <= hi
    );

    if (s == 'price') r.sort((a, b) => a.d - b.d);
    if (s == 'pop') r.sort((a, b) => b.p - a.p);
    if (s == 'new') r.sort((a, b) => b.nw - a.nw || b.id - a.id);

    const pages = Math.ceil(r.length / 6) || 1;
    pg = Math.min(pg, pages);

    put('#grid', (p == 'catalog' ? r.slice((pg - 1) * 6, pg * 6) : r).map(x => card(x, p == 'catalog' ? 'c' : 'r', n)).join('') || '<div class="alert alert-warning">Ничего не найдено</div>');

    if (p == 'catalog') {
      put('#pager', Array.from({ length: pages }, (_, i) => `
        <li class="page-item ${i + 1 == pg ? 'active' : ''}">
          <a class="page-link" href="#" data-pg="${i + 1}">${i + 1}</a>
        </li>
      `).join(''));
    }
  };

  $('#flt').addEventListener('input', () => { pg = 1; draw(); });
  $('#flt').addEventListener('submit', e => e.preventDefault());

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pg]');
    if (a) {
      e.preventDefault();
      pg = +a.dataset.pg;
      draw();
    }
  });

  draw();
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-book]');
  if (b) put('#mi', I.find(x => x.id == b.dataset.book).n);
});

if (p == 'rent') {
  put('#steps', ['Выбрать инструмент', 'Забронировать дату', 'Забрать и пользоваться'].map((s, i) => `
    <div class="col-12 col-md-4">
      <div class="card h-100 text-center shadow-sm">
        <div class="card-body">
          <span class="badge rounded-pill bg-primary fs-5 mb-2">${i + 1}</span>
          <h3 class="h5 mb-0">${s}</h3>
        </div>
      </div>
    </div>
  `).join(''));
  faq(faqRent);
}

// Страница инструмента
if (p == 'product') {
  const x = I.find(a => a.id == qs.get('id')) || I[0],
        day = 864e5,
        fmt = d => d.toLocaleDateString('ru-RU');

  const b1 = new Date(Date.now() + (x.id % 5 + 2) * day),
        b2 = new Date(+b1 + 3 * day),
        st = x.id % 3 ? 'Отличное' : 'Хорошее';

  const sim = I.filter(a => a.c == x.c && a.id != x.id)
    .concat(I.filter(a => a.c != x.c))
    .slice(0, 3);

  put('#prod', `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="index.html">Главная</a></li>
        <li class="breadcrumb-item"><a href="catalog.html">Каталог</a></li>
        <li class="breadcrumb-item active" aria-current="page">${x.n}</li>
      </ol>
    </nav>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="text-center py-5 bg-body-secondary" style="font-size:9rem;line-height:1.2">${C[x.c][1]}</div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <span class="badge bg-${x.av ? 'success' : 'secondary'} mb-2">${x.av ? 'Доступен' : 'Сейчас в аренде'}</span>
        ${x.nw ? '<span class="badge bg-warning text-dark mb-2">Новинка</span>' : ''}
        <h1 class="h2">${x.n}</h1>
        <p class="text-muted">${x.b} · ${C[x.c][0]}</p>
        <p class="fs-3 fw-bold mb-1">${rub(x.d)} <small class="fs-6 text-muted">/сутки</small></p>
        <p class="mb-3">${rub(x.w)} за неделю</p>
        <a class="btn btn-primary btn-lg ${x.av ? '' : 'disabled'}" href="order.html?id=${x.id}">Забронировать</a>
      </div>
    </div>
    <ul class="nav nav-tabs mt-5" role="tablist">
      <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#t1">Описание</button></li>
      <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#t2">Характеристики</button></li>
      <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#t3">Состояние</button></li>
    </ul>
    <div class="tab-content bg-white border border-top-0 p-4">
      <div class="tab-pane fade show active" id="t1">${x.n} от ${x.b}: надёжный инструмент для репетиций, записи и концертов. Перед выдачей настраиваем и проверяем.</div>
      <div class="tab-pane fade" id="t2">
        <div class="table-responsive">
          <table class="table table-striped mb-0">
            <tbody>
              <tr><th>Бренд</th><td>${x.b}</td></tr>
              <tr><th>Категория</th><td>${C[x.c][0]}</td></tr>
              <tr><th>Цена за сутки</th><td>${rub(x.d)}</td></tr>
              <tr><th>Цена за неделю</th><td>${rub(x.w)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="tab-pane fade" id="t3">Состояние: <b>${st}</b>. Последнее обслуживание — в этом месяце.</div>
    </div>
    <h2 class="h4 mt-5">Доступность по датам</h2>
    <div class="alert alert-warning">Занят: ${fmt(b1)} – ${fmt(b2)}</div>
    <form id="av" class="row g-3 align-items-end">
      <div class="col-6 col-md-3">
        <label class="form-label" for="d1">С</label>
        <input id="d1" type="date" class="form-control" required>
      </div>
      <div class="col-6 col-md-3">
        <label class="form-label" for="d2">По</label>
        <input id="d2" type="date" class="form-control" required>
      </div>
      <div class="col-12 col-md-3">
        <button class="btn btn-outline-primary">Проверить</button>
      </div>
    </form>
    <div id="res" class="mt-3"></div>
    <h2 class="h4 mt-5 mb-3">Похожие инструменты</h2>
    <div class="row g-4">${sim.map(a => card(a, 'r')).join('')}</div>
  `);

  $('#av').addEventListener('submit', e => {
    e.preventDefault();
    const a = new Date($('#d1').value),
          b = new Date($('#d2').value),
          n = (b - a) / day + 1;

    put('#res',
      !(n > 0)
        ? '<div class="alert alert-danger">Проверьте даты</div>'
        : !x.av || (a <= b2 && b >= b1)
          ? '<div class="alert alert-danger">На эти даты инструмент занят</div>'
          : `<div class="alert alert-success">Свободно! ${n} дн. — ${rub(cost(x, n))}</div>`
    );
  });
}

// Заявка: подставить инструмент из ссылки
if (p == 'order' && qs.get('id')) $('#pr').value = qs.get('id');

// Отзывы и FAQ
if (p == 'contacts') {
  put('#rev', [
    ['Анна', 'Брала гитару на неделю — звучит отлично, настроена идеально.', 5, 'g'],
    ['Игорь', 'Арендовал барабаны на репетиции. Привезли и собрали бесплатно.', 5, 'd'],
    ['Мария', 'Пианино в отличном состоянии, продлили без проблем.', 4, 'k']
  ].map(r => `
    <div class="col-12 col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-2">
            <span class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:48px;height:48px">${r[0][0]}</span>
            <div>
              <b>${r[0]}</b>
              <div class="text-warning">${'<i class="bi bi-star-fill"></i>'.repeat(r[2])}${'<i class="bi bi-star"></i>'.repeat(5 - r[2])}</div>
            </div>
          </div>
          <p>${r[1]}</p>
          <span class="badge bg-light text-dark border">${C[r[3]][1]} фото инструмента</span>
        </div>
      </div>
    </div>
  `).join(''));
  faq(faqAll);
}

// Bootstrap-валидация форм
document.querySelectorAll('.needs-validation').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  f.classList.add('was-validated');
  if (f.checkValidity()) {
    f.reset();
    f.classList.remove('was-validated');
    f.closest('.card, .modal-content, section')?.querySelector('.ok')?.classList.remove('d-none');
  }
}));