const cheerio = require('cheerio');
const { BASE_URL, http } = require('../utils/http');
const RegExpHelper = require('../utils/regexp');

const galleryCountPerPage = 25;

const category = {
  NON_H: 'non-h',
  DOUJINSHI: 'doujinshi',
  MANGA: 'manga',
  COSPLAY: 'cosplay',
};

const searchByCategory = (keyword, page, ct) => {
  const params = {
    f_search: keyword,
    page,
    f_apply: 'Apply Filter',
  };

  return http.get(ct, { params }).then(res => {
    const { currentPage, galleryCount, pageCount, galleries } = parseSearchPage(res.data);
    return {
      keyword,
      pageCount,
      currentPage,
      galleryCount,
      galleries,
    };
  });
};

const search = (keyword, page) => searchByCategory(keyword, page, '/');

const nonh = (keyword, page) => searchByCategory(keyword, page, category.NON_H);

const doujinshi = (keyword, page) => searchByCategory(keyword, page, category.DOUJINSHI);

const manga = (keyword, page) => searchByCategory(keyword, page, category.MANGA);

const cosplay = (keyword, page) => searchByCategory(keyword, page, category.COSPLAY);

const tagType = {
  ARTIST: 'artist',
};

const searchByTag = (tag, page) => {
  const params = {
    page,
  };

  return http.get(`tag/${tag}`, { params }).then(res => {
    const { pageCount, currentPage, galleryCount, galleries } = parseSearchPage(res.data);
    return {
      tag: unescape(tag),
      pageCount,
      currentPage,
      galleryCount,
      galleries,
    };
  });
};

const tagArtist = (tag, page) => searchByTag(`${tagType.ARTIST}:${escape(tag)}`, page);

const tagMisc = (tag, page) => searchByTag(escape(tag), page);

const parseSearchPage = html => {
  const $ = cheerio.load(html);

  const { pageCount, currentPage, galleryCount } = parsePageCount($);

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
    pageCount,
    currentPage,
    galleryCount,
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
        uploaderPage,
      };
    })
    .get();

module.exports = {
  search,
  Category: {
    nonh,
    doujinshi,
    manga,
    cosplay,
  },
  Tag: {
    artist: tagArtist,
    misc: tagMisc,
  },
};
