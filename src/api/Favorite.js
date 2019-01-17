const cheerio = require('cheerio');
const { BASE_URL, http } = require('../utils/http');
const RegExpHelper = require('../utils/regexp');

const galleryCountPerPage = 25;

const search = options => {
  const { favcat = 'all', keyword, page } = options || {};
  const params = {
    favcat,
    f_search: keyword,
    page,
    f_apply: 'Search Favorites',
  };

  return http.get('favorites.php', { params }).then(res => {
    const { currentPage, galleryCount, pageCount, galleries } = parseFavoritePage(res.data);

    return {
      favcat,
      keyword,
      pageCount,
      currentPage,
      galleryCount,
      galleries,
    };
  });
};

const parseFavoritePage = html => {
  const $ = cheerio.load(html);

  const { currentPage, galleryCount, pageCount } = parsePageCount($);
  const galleries = parseGalleries($);

  return {
    pageCount,
    currentPage,
    galleryCount,
    galleries,
  };
};

const parsePageCount = $ => {
  const currentPage = +$('.ptt .ptds').text();
  const galleryCount = RegExpHelper.parseNumber($('.ip').text())[2];
  const pageCount = Math.ceil(galleryCount / galleryCountPerPage);

  return {
    currentPage,
    galleryCount,
    pageCount,
  };
};

const parseGalleries = $ =>
  $('.itdc')
    .map((i, el) => {
      const type = $(el)
        .find('img')
        .attr('alt');
      const timeNode = $(el).next();
      const postTime = timeNode.text();
      const detialNode = timeNode.next();
      const coverNode = detialNode.find('.it2').find('img');

      let title = '';
      let cover = '';

      if (coverNode.length) {
        title = coverNode.attr('alt');
        cover = coverNode.attr('src');
      } else {
        const parsedDetial = detialNode
          .find('.it2')
          .text()
          .split('~');

        title = parsedDetial[3];
        cover = BASE_URL + parsedDetial[2];
      }

      const torrentsPage = detialNode.find('.i a').attr('href');
      const galleryPage = detialNode.find('.it5 a').attr('href');
      const favoriteTime = detialNode.next().text();

      return {
        type,
        postTime,
        title,
        cover,
        torrentsPage,
        galleryPage,
        favoriteTime,
      };
    })
    .get();

module.exports = {
  search,
};
