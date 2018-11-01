const Common = require('./Common');
const Category = require('./Category');
const Tag = require('./Tag');
const Favorite = require('./Favorite');
const Gallery = require('./Gallery');
const Language = require('./Language');
const Other = require('./Other');

const SettingsDescriptor = Object.assign({}, Common, Category, Tag, Favorite, Gallery, Language, Other);

module.exports = SettingsDescriptor;
