import { IfDiff } from './if-diff.js';
import { insertAdjacentTemplate } from 'trans-render/insertAdjacentTemplate.js';
import { define } from 'xtal-element/xtal-latx.js';
const templKey = Symbol('cache');
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * DOM deletion takes place on non matching elements.
 * @element if-diff-then-stiff
 */
let IfDiffThenStiff = /** @class */ (() => {
    class IfDiffThenStiff extends IfDiff {
        loadTemplate(el, dataKeyName) {
            let tmpl = el[templKey];
            if (tmpl === undefined) {
                tmpl = el.querySelector('template');
                if (tmpl === null) {
                    setTimeout(() => {
                        this.loadTemplate(el, dataKeyName);
                    }, 50);
                    return;
                }
                el[templKey] = tmpl;
            }
            if (tmpl !== undefined && tmpl !== null) {
                const insertedElements = insertAdjacentTemplate(tmpl, el, 'afterend');
                insertedElements.forEach(child => {
                    child.dataset[dataKeyName] = '1';
                });
                el.style.display = 'none';
                el.innerHTML = '';
            }
        }
        do(el, ds, val, dataKeyName) {
            let skipEnable = false;
            if (ds[dataKeyName] === '0') {
                if (val) {
                    this.loadTemplate(el, dataKeyName);
                    el.dataset[dataKeyName] = "1";
                }
            }
            else {
                if (!val) {
                    if (el[templKey] !== undefined) {
                        el.dataset[dataKeyName] = "0";
                    }
                    else {
                        el.remove();
                    }
                    skipEnable = true;
                }
            }
            if (this.enable && !skipEnable) {
                const action = (val ? 'remove' : 'set') + 'Attribute';
                el.querySelectorAll(this.enable).forEach(child => child[action]('disabled', ''));
            }
        }
    }
    IfDiffThenStiff.is = 'if-diff-then-stiff';
    return IfDiffThenStiff;
})();
export { IfDiffThenStiff };
define(IfDiffThenStiff);
