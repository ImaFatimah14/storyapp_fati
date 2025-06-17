// ==================== src/utils/push-notification.js ====================
const VAPID_PUBLIC_KEY = 'BBOzWVKaj9DYKwjf2XZVdBPEDYK9RwEBP8EG_sQODyL6TmmE_oD7DO-GYr9TuO_XxK-9nUoP8PbGSGx9CQXL7oo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

const PushNotificationHelper = {
  async register(serviceWorkerRegistration) {
    if (!('PushManager' in window)) {
      console.warn('PushManager tidak tersedia di browser ini.');
      return;
    }

    try {
      const existingSubscription = await serviceWorkerRegistration.pushManager.getSubscription();

      if (existingSubscription) {
        console.log('✅ Sudah berlangganan push notification:', existingSubscription);
      } else {
        console.log('📭 Belum ada langganan push notification.');
      }
    } catch (error) {
      console.error('❌ Gagal mengecek subscription push notification:', error);
    }
  },

  async subscribe(serviceWorkerRegistration) {
    try {
      const subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('✅ Push Subscription berhasil:', JSON.stringify(subscription));
      alert('Push notification berhasil diaktifkan!');

      return subscription;
    } catch (err) {
      console.error('❌ Gagal subscribe push notification:', err);
      alert('Gagal mengaktifkan push notification: ' + err.message);
    }
  },
};

export async function subscribePush() {
  if (!('serviceWorker' in navigator)) {
    alert('Service worker tidak didukung browser ini.');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await PushNotificationHelper.subscribe(registration);
}

export default PushNotificationHelper;
