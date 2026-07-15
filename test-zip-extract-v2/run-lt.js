const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 5000 });
    console.log('Backend tunnel URL:', tunnel.url);
    fs.writeFileSync('lt-backend.txt', tunnel.url);
    
    // Don't exit the process so the tunnel stays open
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
})();
