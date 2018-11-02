const axios = require('axios');
const fs = require('fs');

const LOGIN_URL = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01';
const BASE_URL = 'https://exhentai.org';
const SETTING_URL = 'uconfig.php';

const cookies = new Map();

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    Origin: 'https://exhentai.org',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3598.0 Safari/537.36',
  },
});

http.interceptors.response.use(
  response => {
    const oldCookies = http.defaults.headers.common['Cookie'];
    const newCookies = response.headers['set-cookie'];
    http.defaults.headers.common['Cookie'] = updateCookie(oldCookies, newCookies);
    return response;
  },
  error => Promise.reject(error)
);

const updateCookie = (oldCookies, newCookies = []) => {
  // init cookies
  if (!cookies.size && oldCookies) {
    oldCookies.split(';').map(kvStr => {
      const kv = kvStr.split('=')
      if (kv.length === 2) {
        cookies.set(kv[0], kv[1]);
      }
    });
  }

  // update cookies
  for (const c of newCookies) {
    const kvStr = c.split('; ')[0];
    const kv = kvStr.split('=');
    if (kv) {
      cookies.set(kv[0], kv[1]);
    }
  }

  let cookie = '';

  for (let [key, value] of cookies) {
    cookie += cookie ? ';' : '';
    cookie += `${key}=${value}`;
  }

  return cookie;
};

const download = (url, path) => http.get(url, {
  responseType: 'arraybuffer',
}).then(res => {
  const ext = getExt(res.headers['content-type']);
  const fileName = ext ? `${path}.${ext}` : path;

  fs.writeFileSync(fileName, new Buffer(res.data, 'binary'));
});

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
  download,
};
