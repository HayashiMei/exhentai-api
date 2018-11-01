const cheerio = require('cheerio');
const { BASE_URL, http } = require('../utils/http');
const RegExpHelper = require('../utils/regexp');

const galleryCountPerPage = 25;

const category = {
  NON_H: 'non-h',
  DOUJINSHI: 'doujinshi',
  MANGA: 'manga',
  COSPLAY: 'cosplay'
};

const searchByCategory = (key, page, c) => {
  const params = {
    f_search: key,
    page,
    f_apply: 'Apply Filter'
  };

  return http.get(c, { params }).then(res => {
    const { currentPage, galleryCount, pageCount, galleries } = parseSearchPage(res.data);
    return {
      key,
      currentPage,
      galleryCount,
      pageCount,
      galleries
    };
  });
};

const search = (key, page) => searchByCategory(key, page, '/');

const nonh = (key, page) => searchByCategory(key, page, category.NON_H);

const doujinshi = (key, page) => searchByCategory(key, page, category.DOUJINSHI);

const manga = (key, page) => searchByCategory(key, page, category.MANGA);

const cosplay = (key, page) => searchByCategory(key, page, category.COSPLAY);

const tagType = {
  ARTIST: 'artist'
};

const searchByTag = (tag, page) => {
  const params = {
    page
  };

  return http.get(`tag/${tag}`, { params }).then(res => {
    const { currentPage, galleryCount, pageCount, galleries } = parseSearchPage(res.data);
    return {
      tag,
      currentPage,
      galleryCount,
      pageCount,
      galleries
    };
  });
};

const tagArtist = (tag, page) => searchByTag(`${tagType.ARTIST}:${escape(tag)}`, page);

const tagMisc = (tag, page) => searchByTag(escape(tag), page);

const parseSearchPage = html => {
  const $ = cheerio.load(html);

  const { currentPage, galleryCount, pageCount } = parsePageCount($);

  const galleries = parseGalleries($);

  return {
    currentPage,
    galleryCount,
    pageCount,
    galleries
  };
};

const parsePageCount = $ => {
  const currentPage = +$('.ptt .ptds').text();
  const galleryCount = RegExpHelper.parseNumber($('.ip').text())[2];
  const pageCount = Math.ceil(galleryCount / galleryCountPerPage);

  return {
    currentPage,
    galleryCount,
    pageCount
  };
};

const parseGalleries = $ =>
  $('.itdc')
    .map((i, el) => {
      const type = $(el)
        .find('a')
        .attr('href');

      const timeNode = $(el).next();
      const postTime = timeNode.text();

      const detialNode = timeNode.next();
      const coverNode = detialNode.find('.it2').find('img');
      let title = '',
        cover = '';

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

      const uploaderNode = detialNode.next();
      const uploader = uploaderNode.text();
      const uploaderPage = uploaderNode.find('a').attr('href');

      return {
        type,
        postTime,
        title,
        cover,
        torrentsPage,
        galleryPage,
        uploader,
        uploaderPage
      };
    })
    .get();

module.exports = {
  search,
  Category: {
    nonh,
    doujinshi,
    manga,
    cosplay
  },
  Tag: {
    artist: tagArtist,
    misc: tagMisc
  }
};
