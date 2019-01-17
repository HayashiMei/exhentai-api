const cheerio = require('cheerio');
const { http } = require('../utils/http');
const RegExpHelper = require('../utils/regexp');

const imageCountPerPage = 20;

const open = (url, p) => {
  const params = {
    inline_set: 'ts_l',
    p,
  };

  return http.get(url, { params }).then(res => {
    return parseGalleryPage(res.data);
  });
};

const openImage = url => {
  return http.get(url).then(res => {
    return parseImage(res.data);
  });
};

const parseGalleryPage = html => {
  const $ = cheerio.load(html);

  const title = $('#gn').text();
  const cover = $('#gd1 div')
    .attr('style')
    .match(/url\((.*)\)/)[1];
  const info = parseInfo($);
  const tagList = parseTags($);
  const { currentPage, pageCount } = parsePageCount($, info);
  const imageSet = parseImageSet($);

  return {
    title,
    cover,
    info,
    tagList,
    currentPage,
    pageCount,
    imageSet,
  };
};

const parseInfo = $ => {
  const uploader = $('#gdn').text();

  const info = $('#gdd .gdt2')
    .map((i, el) => {
      return $(el)
        .text()
        .trim();
    })
    .get();

  info[5] = RegExpHelper.parseNumber(info[5])[0];
  info[6] = RegExpHelper.parseNumber(info[6])[0];

  const [postTime, parent, visible, language, fileSize, length, favoriteCount] = info;

  const ratingCount = +$('#rating_count').text();
  const ratingAvg = RegExpHelper.parseNumber($('#rating_label').text())[0];

  return {
    uploader,
    postTime,
    parent,
    visible,
    language,
    fileSize,
    length,
    favoriteCount,
    ratingCount,
    ratingAvg,
  };
};

const parseTags = $ => {
  return $('#taglist tr')
    .map((i, tr) => {
      const tagType = $(tr)
        .find('.tc')
        .text()
        .replace(':', '');
      const tags = $(tr)
        .find('td div')
        .map((j, div) => {
          return $(div).text();
        })
        .get();
      return { tagType, tags };
    })
    .get();
};

const parsePageCount = ($, info) => {
  const currentPage = +$('.ptb .ptds').text();
  const pageCount = Math.ceil(info.length / imageCountPerPage);
  return {
    currentPage,
    pageCount,
  };
};

const parseImageSet = $ => {
  return $('.gdtl')
    .map((i, el) => {
      const src = $(el)
        .find('a')
        .attr('href');

      const imgNode = $(el).find('img');
      const title = imgNode.attr('title');
      const thumb = imgNode.attr('src');

      return {
        src,
        title,
        thumb,
      };
    })
    .get();
};

const parseImage = html => {
  const $ = cheerio.load(html);

  const src = $('#img').attr('src');
  const [first, prev, next, last] = $('#i2 .sn a')
    .map((i, el) => {
      return $(el).attr('href');
    })
    .get();

  const originalNode = $('#i7 a');
  const originalSrc = originalNode.attr('href');
  const originalSize = RegExpHelper.parseFileSize(originalNode.text())[0];

  return {
    src,
    originalSrc,
    originalSize,
    first,
    prev,
    next,
    last,
  };
};

module.exports = {
  open,
  openImage,
};
