export function showAlerts(type, msg) {
  hideAlert();
  const markup = `<div class="alert" alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
}

export function hideAlert() {
  const el = document.querySelector('.alert');
  el && el.remove();
}
