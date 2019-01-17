const { stringify } = require('querystring');
const cheerio = require('cheerio');
const { LOGIN_URL, http } = require('../utils/http');
const { search, Category, Tag } = require('./Search');
const Gallery = require('./Gallery');
const Torrent = require('./Torrent');
const Favorite = require('./Favorite');
const Setting = require('./Setting');

const login = async (username, password) => {
  const data = {
    CookieDate: '1',
    b: 'd',
    bt: '1-1',
    UserName: username,
    PassWord: password,
    ipb_login_submit: 'Login!',
  };

  try {
    const loginResponse = await http.post(LOGIN_URL, stringify(data));

    const errorMessage = parseLoginResultPage(loginResponse.data);

    if (errorMessage) {
      return Promise.reject(new TypeError(errorMessage));
    }

    return http.get('favorites.php').then(() => {
      return {
        cookie: http.defaults.headers.common['Cookie'],
      };
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

const parseLoginResultPage = html => {
  const $ = cheerio.load(html);
  let errorMessage = '';

  const errorNode = $('.tablepad');
  if (errorNode.length) {
    errorMessage = errorNode.text();
  }

  return errorMessage;
};

const setCookie = cookie => {
  http.defaults.headers.common['Cookie'] = cookie;
};

module.exports = {
  login,
  setCookie,
  search,
  Category,
  Tag,
  Gallery,
  Torrent,
  Favorite,
  Setting,
};
