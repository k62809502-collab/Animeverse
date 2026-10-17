self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
let queue = [];
let isDownloading = false;
self.addEventListener('message', async (e) => {
  if (e.data.type === 'START_QUEUE') {
    queue = e.data.queue;
    if (!isDownloading) processQueue();
  }
});
async function processQueue() {
  if (queue.length === 0) { isDownloading = false; return; }
  isDownloading = true;
  let item = queue.shift();
  try {
    let response = await fetch(item.url);
    if (response.ok) {
      let clients = await self.clients.matchAll();
      clients.forEach(c => c.postMessage({type: 'PIC_DONE', key: item.key, url: item.url, name: item.name}));
    }
  } catch (err) {}
  setTimeout(() => processQueue(), 45000);
}
