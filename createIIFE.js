const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
const pdpu = 'node_modules/p-d.p-u/'
jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', xl + 'NavDown.js', 'if-diff.js'], 'if-diff.iife.js');
jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', xl + 'NavDown.js', pdpu + 'PDNavDown.js', pdpu + 'p.js', pdpu + 'p-d.js', 'if-diff.js'], 'combo.iife.js');