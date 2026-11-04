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