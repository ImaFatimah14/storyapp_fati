const PushNotificationHelper = {
  async register() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      console.log('Push notification tidak didukung di browser ini.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Cek endpoint VAPID, jika 404 tampilkan pesan error yang jelas
      const vapidUrl = 'https://story-api.dicoding.dev/v1/push/web/vapid';
      const response = await fetch(vapidUrl);
      if (!response.ok) {
        throw new Error(`VAPID endpoint returned ${response.status}`);
      }
      const { vapidPublicKey } = await response.json();
      if (!vapidPublicKey) {
        throw new Error('No VAPID publicKey in response');
      }

      // Minta izin notifikasi hanya jika belum granted
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }
      if (permission !== 'granted') {
        console.log('Izin push notification ditolak.');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this._urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch('https://story-api.dicoding.dev/v1/push/web/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      console.log('Push notification berhasil didaftarkan!');
    } catch (error) {
      console.error('Gagal mendaftarkan push notification:', error);
    }
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  },
};

export default PushNotificationHelper;
