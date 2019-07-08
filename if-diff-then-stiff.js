import { IfDiff } from './if-diff.js';
import { define } from 'trans-render/define.js';
const templKey = Symbol('cache');
export class IfDiffThenStiff extends IfDiff {
    static get is() { return 'if-diff-then-stiff'; }
    loadTemplate(el) {
        let tmpl = el[templKey];
        if (tmpl === undefined) {
            tmpl = el.querySelector('template');
            if (tmpl === null) {
                setTimeout(() => {
                    this.loadTemplate(el);
                }, 50);
                return;
            }
            else {
                el[templKey] = tmpl;
                tmpl.remove();
            }
        }
        //el.innerHTML = '';
        el.appendChild(tmpl.content.cloneNode(true));
    }
    do(el, ds, val, dataKeyName) {
        if (ds[dataKeyName] === '0') {
            if (val) {
                this.loadTemplate(el);
                el.dataset[dataKeyName] = "1";
            }
        }
        else {
            if (!val) {
                el.innerHTML = '';
                el.dataset[dataKeyName] = "0";
            }
        }
        if (this._enable) {
            const action = (val ? 'remove' : 'set') + 'Attribute';
            el.querySelectorAll(this._enable).forEach(child => child[action]('disabled', ''));
        }
    }
}
define(IfDiffThenStiff);
