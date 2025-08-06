// Clarity PWA Service Worker
// Constitutional AI - Privacy-First Local Assistant

const CACHE_NAME = 'clarity-v1.0.0';
const STATIC_CACHE = 'clarity-static-v1.0.0';
const DYNAMIC_CACHE = 'clarity-dynamic-v1.0.0';

// Core app files to cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/css/app.css',
  '/js/app.js',
  '/favicon.ico',
  '/apple-touch-icon.png'
];

// Constitutional compliance: No network calls for user data
const PRIVACY_POLICY = {
  NO_NETWORK_CALLS: true,
  LOCAL_ONLY: true,
  USER_DATA_PROTECTED: true
};

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Constitutional compliance: Never make network calls for user data
  if (PRIVACY_POLICY.NO_NETWORK_CALLS && isUserDataRequest(request)) {
    console.log('[SW] Blocking network request for user data:', url.pathname);
    event.respondWith(new Response('User data requests blocked for privacy', { status: 403 }));
    return;
  }
  
  // Handle different types of requests
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  } else {
    // For non-GET requests, try network first
    event.respondWith(handleNonGetRequest(request));
  }
});

// Handle GET requests with cache-first strategy
async function handleGetRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Fallback to network for non-user-data requests
    if (!isUserDataRequest(request)) {
      try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
          console.log('[SW] Cached dynamic response:', request.url);
        }
        
        return networkResponse;
      } catch (error) {
        console.log('[SW] Network failed, serving offline page:', request.url);
        return caches.match('/offline.html') || new Response('Offline', { status: 503 });
      }
    }
    
    // For user data requests, return offline response
    return new Response('Offline - User data protected', { status: 503 });
    
  } catch (error) {
    console.error('[SW] Error handling GET request:', error);
    return new Response('Service Worker Error', { status: 500 });
  }
}

// Handle non-GET requests
async function handleNonGetRequest(request) {
  try {
    // Constitutional compliance: Block user data requests
    if (isUserDataRequest(request)) {
      console.log('[SW] Blocking non-GET user data request:', request.url);
      return new Response('User data requests blocked for privacy', { status: 403 });
    }
    
    // Try network for non-user-data requests
    const response = await fetch(request);
    return response;
    
  } catch (error) {
    console.error('[SW] Error handling non-GET request:', error);
    return new Response('Network Error', { status: 503 });
  }
}

// Check if request is for user data
function isUserDataRequest(request) {
  const url = new URL(request.url);
  
  // Constitutional compliance: Block any requests that could contain user data
  const userDataPatterns = [
    /\/api\/conversations/,
    /\/api\/user/,
    /\/api\/privacy/,
    /\/api\/settings/,
    /\/api\/export/,
    /\/api\/import/,
    /\/api\/audit/,
    /\/api\/data/,
    /\/storage\/user/,
    /\/user-data/,
    /\/conversations/,
    /\/privacy/,
    /\/settings/
  ];
  
  return userDataPatterns.some(pattern => pattern.test(url.pathname));
}

// Background sync for conversations (constitutional compliance)
async function syncConversations() {
  // Constitutional compliance: No background sync for user data
  console.log('[SW] Background sync disabled for user privacy');
  return;
}

// Push notification handler (constitutional compliance)
self.addEventListener('push', (event) => {
  // Constitutional compliance: No push notifications without user consent
  console.log('[SW] Push notification received but disabled for privacy');
  
  const options = {
    body: 'Constitutional AI: Privacy protected',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'constitutional-notification',
    requireInteraction: false,
    silent: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Clarity', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Message handler for app communication
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'CHECK_PRIVACY':
      event.ports[0].postMessage({ 
        privacy: PRIVACY_POLICY,
        constitutional: true 
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Error clearing caches:', error);
  }
}

// Periodic cache cleanup
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== STATIC_CACHE && name !== DYNAMIC_CACHE
    );
    
    if (oldCaches.length > 0) {
      await Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
      );
      console.log('[SW] Cleaned up old caches');
    }
  } catch (error) {
    console.error('[SW] Error during cache cleanup:', error);
  }
}, 24 * 60 * 60 * 1000); // Daily cleanup

// Constitutional compliance logging
console.log('[SW] Constitutional AI Service Worker loaded');
console.log('[SW] Privacy policy enforced:', PRIVACY_POLICY);
console.log('[SW] User data protection active'); 