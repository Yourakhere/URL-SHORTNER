self.addEventListener('install', () => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', () => {
  // You can cache or intercept requests here later
});
