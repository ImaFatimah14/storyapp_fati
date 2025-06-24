// Import CSS utama
import '../styles/styles.css';

// Import komponen utama dan helper push notification
import App from './pages/app.js';
import PushNotificationHelper from './utils/push-notification.js';
import { registerServiceWorker } from './utils/sw-register.js';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe
} from './utils/notification-helper.js';

// Inisialisasi aplikasi saat DOM dimuat
function initNotifToggleBtn() {
  const notifBtn = document.getElementById('notif-toggle-btn');
  const notifText = document.getElementById('notif-btn-text');
  const notifIcon = document.getElementById('notif-btn-icon');
  if (!notifBtn || !notifText || !notifIcon) return;
  notifBtn.onclick = async () => {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      await unsubscribe();
      if (Notification.permission === 'granted') {
        new Notification('Notifikasi Laporan!', {
          body: 'Notifikasi dinonaktifkan. Anda tidak akan menerima pemberitahuan.',
          icon: '/icons/icon-192x192.png',
        });
      }
    } else {
      await subscribe();
      if (Notification.permission === 'granted') {
        new Notification('Notifikasi Laporan!', {
          body: 'Notifikasi diaktifkan! Anda akan menerima pemberitahuan.',
          icon: '/icons/icon-192x192.png',
        });
      }
    }
    updateNotifButtonState();
  };
  async function updateNotifButtonState() {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      notifBtn.classList.remove('nonaktif');
      notifBtn.classList.add('aktif');
      notifText.textContent = 'Nonaktifkan Notifikasi';
      notifIcon.innerHTML = '<i class="fas fa-bell-slash"></i>';
    } else {
      notifBtn.classList.remove('aktif');
      notifBtn.classList.add('nonaktif');
      notifText.textContent = 'Aktifkan Notifikasi';
      notifIcon.innerHTML = '<i class="fas fa-bell"></i>';
    }
  }
  updateNotifButtonState();
}

document.addEventListener('DOMContentLoaded', async () => {
  await registerServiceWorker();

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  // Render ulang halaman saat hash di URL berubah
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  initNotifToggleBtn();
});

window.addEventListener('hashchange', () => {
  setTimeout(initNotifToggleBtn, 0);
});

// Unregister service worker lama di mode development agar tidak error precache
if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
      console.log('Service worker lama di-unregister di mode dev:', reg);
    }
  });
}

// Clear seluruh cache browser (Cache Storage) di mode development
if (process.env.NODE_ENV === 'development' && 'caches' in window) {
  window.addEventListener('load', async () => {
    const cacheNames = await caches.keys();
    for (const name of cacheNames) {
      await caches.delete(name);
      console.log('Cache storage dihapus:', name);
    }
  });
}
