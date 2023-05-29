/* eslint-disable */

import { showAlerts } from './alerts';

export async function login(email, password) {
  try {
    // TODO: Learn to do this the vanilla way
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: { email, password },
    });
    if (res.data.status === 'success') {
      showAlerts('success', 'Login Successful');
      window.setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  } catch (err) {
    showAlerts('error', err.message);
  }
}

export async function logout() {
  try {
    // TODO: Learn to do this the vanilla way
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      showAlerts('success', 'Logout Successful');
      location.reload(true);
        window.setTimeout(() => {
          window.location.href = '/';
        }, 100);
    }
  } catch (err) {
    showAlerts('error', err.message);
  }
}
