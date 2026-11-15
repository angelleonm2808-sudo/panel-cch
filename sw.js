const CACHE_NAME = 'cch146b-v2'; // Sube la versión si haces cambios grandes
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './mapa-cch.jpg',
  './manifest.json'
];

// 1. Instalación robusta: Forzamos la activación inmediata
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usamos un ciclo para evitar que si un archivo falla, se caiga todo el SW
      return Promise.all(
        ASSETS.map(path => {
          return cache.add(path).catch(err => console.log('Fallo al cachear:', path, err));
        })
      );
    })
  );
  self.skipWaiting(); // Obliga al navegador a usar esta nueva versión ya
});

// 2. Activación: Limpia los cachés antiguos para liberar espacio y evitar bugs
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra versiones viejas (ej. v1)
          }
        })
      );
    })
  );
  self.clients.claim(); // Toma el control de la página abierta al instante
});

// 3. Fetch inteligente (Stale-While-Revalidate): Muestra rápido lo que hay en caché pero busca actualizaciones en segundo plano
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // Si hay internet, actualizamos la caché silenciosamente
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si no hay internet, devolvemos la caché si existe
        return cachedResponse;
      });

      // Devuelve la respuesta en caché de inmediato si la tiene, si no espera a la red
      return cachedResponse || fetchPromise;
    })
  );
});
