const { stringify } = require('querystring');
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

  await http.post(LOGIN_URL, stringify(data));
  return http.get('favorites.php');
};

module.exports = {
  login,
  search,
  Category,
  Tag,
  Gallery,
  Torrent,
  Favorite,
  Setting,
};
