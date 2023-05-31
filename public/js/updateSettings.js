import { showAlerts } from './alerts.js';

export async function updateSettings(data) {
  try {
    // eslint-disable-next-line no-undef
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/update-me',
      data: data,
    });
    if (res.data.status === 'success') {
      showAlerts('success', 'Settings updated successfully');
      window.location.reload(true);
    }
  } catch (err) {
    showAlerts('error', err.response.data.message);
  }
}

export async function updatePassword(data) {
  try {
    // eslint-disable-next-line no-undef
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/update-password',
      data: data,
    });
    if (res.data.status === 'success') {
      showAlerts('success', 'Password updated successfully');
    }
  } catch (err) {
    showAlerts('error', err.response.data.message);
  }
}
