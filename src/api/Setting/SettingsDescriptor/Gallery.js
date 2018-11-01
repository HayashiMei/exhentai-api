const Gallery = {
  thumbnailSize: {
    name: 'ts',
    type: 'radio',
    values: {
      0: 'Normal',
      1: 'Large'
    },
    defaultValue: 'Normal'
  },
  thumbnailRow: {
    name: 'tr',
    type: 'radio',
    values: {
      0: 4,
      1: 10,
      2: 20,
      3: 40
    },
    defaultValue: 4
  },
  commentsSortOrder: {
    name: 'cs',
    type: 'radio',
    values: {
      0: 'Oldest comments first',
      1: 'Recent comments first',
      2: 'By highest score'
    },
    defaultValue: 'Oldest comments first'
  },
  showCommentVotes: {
    name: 'sc',
    type: 'radio',
    values: {
      0: 'On score hover or click',
      1: 'Recent comments first'
    },
    defaultValue: 'Oldest comments first'
  },
  tagsSortOrder: {
    name: 'sc',
    type: 'radio',
    values: {
      0: 'Alphabetical',
      1: 'By tag power'
    },
    defaultValue: 'Alphabetical'
  },
  showPageNumbers: {
    name: 'pn',
    type: 'radio',
    values: {
      0: 'No',
      1: 'Yes'
    },
    defaultValue: 'No'
  }
};

module.exports = Gallery;
