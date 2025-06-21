// Import CSS utama
import '../styles/styles.css';

// Import komponen utama dan helper push notification
import App from './pages/app.js';
import PushNotificationHelper, { subscribePush } from './utils/push-notification.js';

// Inisialisasi aplikasi saat DOM dimuat
document.addEventListener('DOMContentLoaded', async () => {
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

  // Inisialisasi tombol push notification & Add to Homescreen (A2HS)
  let deferredPrompt;
  const subscribeBtn = document.getElementById('subscribe-push-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (subscribeBtn) {
      subscribeBtn.style.display = 'block';

      subscribeBtn.addEventListener('click', async () => {
        try {
          // ✅ 1. Subscribe push
          await subscribePush();

          // ✅ 2. Tampilkan prompt A2HS
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            console.log(choice.outcome === 'accepted'
              ? '✅ User menerima prompt A2HS'
              : '❌ User menolak prompt A2HS');
            deferredPrompt = null;
            subscribeBtn.style.display = 'none';
          }
        } catch (err) {
          console.error('Gagal langganan push atau A2HS:', err);
        }
      });
    }
  });
});

// Daftarkan Service Worker dan inisialisasi Push Notification
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      // Gunakan path relatif agar cocok di GitHub Pages
      const registration = await navigator.serviceWorker.register('service-worker.js');
      console.log('✅ Service Worker berhasil didaftarkan.');

      await PushNotificationHelper.register(registration);
    } catch (error) {
      console.error('❌ Gagal mendaftarkan Service Worker atau Push Notification:', error);
    }
  });
}
