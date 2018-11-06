const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', xl + 'NavDown.js', 'if-diff.js'], 'if-diff.iife.js');