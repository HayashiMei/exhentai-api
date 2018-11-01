const Common = {
  imageLoadSettings: {
    name: 'uh',
    type: 'radio',
    values: {
      0: 'Yes',
      1: 'No'
    },
    defaultValue: 'Yes'
  },
  imageSizeSettings: {
    name: 'xr',
    type: 'radio',
    values: {
      0: 'Auto',
      1: '780x',
      2: '980x',
      3: '1280x',
      4: '1600x',
      5: '2400x'
    },
    defaultValue: 'Auto'
  },
  horizontal: {
    name: 'rx',
    type: 'text',
    value: 0
  },
  vertical: {
    name: 'ry',
    type: 'text',
    value: 0
  },
  galleryNameDisplay: {
    name: 'tl',
    type: 'radio',
    values: {
      0: 'Default Title',
      1: 'Japanese Title'
    },
    defaultValue: 'Default Title'
  },
  archiverSettings: {
    name: 'ar',
    type: 'radio',
    values: {
      0: 'Manual Select, Manual Start',
      1: 'Manual Select, Auto Start',
      2: 'Auto Select Original, Manual Start',
      3: 'Auto Select Original, Auto Start',
      4: 'Auto Select Resample, Manual Start',
      5: 'Auto Select Resample, Auto Start'
    },
    defaultValue: 'Manual Select, Manual Start'
  },
  frontPageSettings: {
    name: 'dm',
    type: 'radio',
    values: {
      0: 'List View',
      1: 'Thumbnail View'
    },
    defaultValue: 'List View'
  },
  ratingsColor: {
    name: 'ru',
    type: 'text',
    value: 'RRGGB'
  },
  searchResultCount: {
    name: 'rc',
    type: 'radio',
    values: {
      0: 25,
      1: 50,
      2: 100,
      3: 200
    },
    defaultValue: 25
  },
  thumbnailLoad: {
    name: 'lt',
    type: 'radio',
    values: {
      0: 'On mouse-over',
      1: 'On page load'
    },
    defaultValue: 'On mouse-over'
  }
};

module.exports = Common;
