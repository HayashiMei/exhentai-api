const cheerio = require('cheerio');
const { http } = require('../utils/http');
const RegExpHelper = require('../utils/regexp');

const open = url =>
  http.get(url).then(res => {
    return parseTorrentPage(res.data);
  });

const parseTorrentPage = html => {
  const $ = cheerio.load(html);

  const torrentsNode = $('[name=gtid]');

  const torrentCount = torrentsNode.length;

  const torrents = torrentsNode
    .map((i, el) => {
      const table = $(el).next();

      const info = table
        .find('td')
        .map(function() {
          return $(this).text();
        })
        .get()
        .filter(item => item);

      const postTime = RegExpHelper.parseDateTime(info[0])[0];
      const fileSize = RegExpHelper.parseFileSize(info[1])[0];
      const seeds = RegExpHelper.parseNumber(info[2])[0];
      const peers = RegExpHelper.parseNumber(info[3])[0];
      const downloads = RegExpHelper.parseNumber(info[4])[0];
      const uploader = info[5].replace('Uploader: ', '');
      const fileName = info[6].trim();

      const torrentUrl = table.find('a').attr('href');

      return {
        postTime,
        fileSize,
        seeds,
        peers,
        downloads,
        uploader,
        fileName,
        torrentUrl,
      };
    })
    .get();

  return {
    torrentCount,
    torrents,
  };
};

module.exports = {
  open,
};
