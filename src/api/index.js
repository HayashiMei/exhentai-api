const { stringify } = require('querystring');
const { LOGIN_URL, http } = require('../utils/http');
const { search, Category, Tag } = require('./Search');
const Gallery = require('./Gallery');
const Torrent = require('./Torrent');
const Setting = require('./Setting');

const cookies = new Map();

const login = async (username, password) => {
  const data = {
    CookieDate: '1',
    b: 'd',
    bt: '1-1',
    UserName: username,
    PassWord: password,
    ipb_login_submit: 'Login!'
  };

  const res = await http.post(LOGIN_URL, stringify(data));
  updateCookie(res.headers['set-cookie']);

  return http.post().then(res => updateCookie(res.headers['set-cookie']));
};

const updateCookie = setCookies => {
  for (const c of setCookies) {
    const kvStr = c.split('; ')[0];
    const kv = kvStr.split('=');
    if (kv) {
      cookies.set(kv[0], kv[1]);
    }
  }

  let cookie = '';
  for (let [key, value] of cookies) {
    cookie += `${key}=${value};`;
  }

  http.defaults.headers.common['Cookie'] = cookie;

  return cookie;
};

module.exports = {
  login,
  search,
  Category,
  Tag,
  Gallery,
  Torrent,
  Setting
};
