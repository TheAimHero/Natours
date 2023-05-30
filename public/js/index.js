import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateSettings, updatePassword } from './updateSettings.js';

const loginForm = document.querySelector('.form--login');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

const mapBox = document.getElementById('map');
if (mapBox) {
  const { locations } = mapBox.dataset;
  const locationsArray = JSON.parse(locations);
  displayMap(locationsArray);
}

const logoutBtn = document.querySelector('.nav__el--logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

const userDataForm = document.querySelector('.form--user-data');
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email });
  });
}

const userPassword = document.querySelector('.form-user-settings');
if (userPassword) {
  userPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordConfirm = document.getElementById('password-confirm').value;
    const newPassword = document.getElementById('password').value;
    const oldPassword = document.getElementById('password-current').value;
    updatePassword({ oldPassword, newPassword, passwordConfirm });
  });
}
