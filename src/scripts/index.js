// Import CSS
import '../styles/styles.css';


// Import App dan helper push notification
import App from './pages/app.js';
import PushNotificationHelper from './utils/push-notification.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

// Daftarkan service worker & push notification
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker berhasil didaftarkan.');
      await PushNotificationHelper.register();
    } catch (error) {
      console.error('Gagal mendaftarkan Service Worker atau Push:', error);
    }
  });
}
