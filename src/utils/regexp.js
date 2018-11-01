const parseFileSize = str => str.match(/\d+(\.\d+)?\s[A-Z]B/g) || [];

const parseNumber = str => str.match(/\d+(\.\d+)?/g).map(item => +item) || [];

const parseDateTime = str => str.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g) || [];

module.exports = {
  parseFileSize,
  parseNumber,
  parseDateTime
};
