const CACHE='olimpo-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./favicon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        try{var u=new URL(req.url); if(u.origin===location.origin){var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);});}}catch(_){}
        return res;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
