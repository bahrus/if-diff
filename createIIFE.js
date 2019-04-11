const jiife = require('jiife');
//const xl = 'node_modules/xtal-latx/';
//const pdpu = 'node_modules/p-d.p-u/'
jiife.processFiles(['if-diff.js'], 'dist/if-diff.js', true);
//jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', xl + 'NavDown.js', pdpu + 'p.js', pdpu + 'p-d.js', 'if-diff.js'], 'dist/combo.iife.js');