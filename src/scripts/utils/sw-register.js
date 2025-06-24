// Service Worker registration helper
export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupported');
    return;
  }
  // Hanya daftarkan service worker di production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Service worker hanya didaftarkan di production.');
    return;
  }
  let swPath = '/service-worker.js';
  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('Service worker telah terpasang', registration);
  } catch (error) {
    console.log('Failed to install service worker:', error);
  }
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw-custom.js')
      .then((registration) => {
        // Registration was successful
        // console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        // registration failed :(
        // console.log('ServiceWorker registration failed: ', error);
      });
  });
}
