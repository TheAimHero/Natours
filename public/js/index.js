import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

const loginForm = document.querySelector('form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}

const mapBox = document.getElementById('map');
if (mapBox) {
  const { locations } = mapBox.dataset;
  const locationsArray = JSON.parse(locations);
  displayMap(locationsArray);
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
