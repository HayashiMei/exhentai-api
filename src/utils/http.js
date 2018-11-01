const axios = require('axios');
const fs = require('fs');

const LOGIN_URL = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01';
const BASE_URL = 'https://exhentai.org';
const SETTING_URL = 'uconfig.php';

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    Origin: 'https://exhentai.org',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3596.1 Safari/537.36'
  }
});

const download = (url, path) => {
  return http
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(res => {
      const ext = getExt(res.headers['content-type']);
      const fileName = ext ? `${path}.${ext}` : path;

      fs.writeFileSync(fileName, new Buffer(res.data, 'binary'));
    });
};

const getExt = ext => {
  switch (ext) {
    case 'image/jpeg':
      return 'jpg';

    case 'image/png':
      return 'png';

    case 'application/zip':
      return 'zip';

    case 'image/webp':
      return 'webp';

    case 'text/plain':
      return 'txt';

    case 'application/x-bittorrent':
      return 'torrent';

    default:
      return '';
  }
};

module.exports = {
  LOGIN_URL,
  BASE_URL,
  SETTING_URL,
  http,
  download
};
