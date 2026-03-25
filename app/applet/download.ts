import fs from 'fs';
import https from 'https';

const url = 'https://storage.googleapis.com/mms-data/messages/attachments/3a233b3a62f840d2969966d5b00c634d/image.jpeg';
const file = fs.createWriteStream('./public/hero-logo.jpg');

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed.');
  });
}).on('error', (err) => {
  fs.unlink('./public/hero-logo.jpg', () => {});
  console.error('Error downloading file:', err.message);
});
