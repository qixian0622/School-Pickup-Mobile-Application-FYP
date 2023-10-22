const exclusionList = require('metro-config/src/defaults/exclusionList');
// const { getDefaultConfig } = require('expo/metro-config');

// exclusionList is a function that takes an array of regexes and combines
// them with the default exclusions to return a single regex.

module.exports = {
  resolver: {
    blockList: exclusionList([/#current-cloud-backend\/.*/])
  }
};