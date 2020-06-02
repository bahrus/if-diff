import { XtallatX, define, camelToLisp } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { debounce } from 'xtal-element/debounce.js';
import { NavDown } from 'xtal-element/NavDown.js';
import { insertAdjacentTemplate } from 'trans-render/insertAdjacentTemplate.js';
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
let IfDiff = /** @class */ (() => {
    class IfDiff extends XtallatX(hydrate(HTMLElement)) {
        constructor() {
            super(...arguments);
            /**
             * Computed based on values of  if / equals / not_equals / includes
             */
            this.value = false;
            this.propActions = [
                ({ lhs, equals, rhs, not_equals, includes, disabled }) => {
                    this.debouncer();
                }
            ];
            this._navDown = null;
        }
        get debouncer() {
            if (this._debouncer === undefined) {
                this._debouncer = debounce((getNew = false) => {
                    this.evaluateAndPassDown();
                }, 16);
            }
            return this._debouncer;
        }
        connectedCallback() {
            this.style.display = 'none';
            super.connectedCallback();
            if (!this.byos) {
                const style = document.createElement('style');
                style.innerHTML = /* css */ `
                [data-${camelToLisp(this.dataKeyName)}="-1"]{
                    display: none;
                }
            `;
                const rn = this.getRootNode();
                if (rn.host !== undefined) {
                    rn.appendChild(style);
                }
                else {
                    document.head.appendChild(style);
                }
            }
            setTimeout(() => {
                this.init();
            }, 50);
        }
        createDefaultStyle() { }
        init() {
            this.evaluateAndPassDown();
        }
        onPropsChange(name) {
            super.onPropsChange(name);
            if (name === 'if')
                this._debouncer();
        }
        loadTemplate(el, dataKeyName) {
            const tmpl = el.querySelector('template');
            if (!tmpl) {
                setTimeout(() => {
                    this.loadTemplate(el, dataKeyName);
                }, 50);
                return;
            }
            const insertedElements = insertAdjacentTemplate(tmpl, el, 'afterend');
            insertedElements.forEach(child => {
                child.dataset[dataKeyName] = '1';
            });
            el.remove();
        }
        do(el, ds, val, dataKeyName) {
            if (ds[dataKeyName] === '0') {
                if (val) {
                    this.loadTemplate(el, dataKeyName);
                    el.dataset[dataKeyName] = "1";
                }
            }
            else {
                el.dataset[dataKeyName] = val ? '1' : '-1';
            }
            if (this.enable) {
                const action = (val ? 'remove' : 'set') + 'Attribute';
                Array.from(el.querySelectorAll(this.enable)).concat(el).forEach(target => target[action]('disabled', ''));
            }
        }
        tagMatches(nd) {
            const matches = nd.matches;
            this.attr('mtch', matches.length.toString());
            const val = this.value;
            const dataKeyName = this.dataKeyName;
            matches.forEach(el => {
                const ds = el.dataset;
                this.do(el, ds, val, dataKeyName);
            });
        }
        async evaluate() {
            let val = this.if;
            if (val) {
                if (this.equals || this.not_equals) {
                    let eq = false;
                    if (typeof this.lhs === 'object' && typeof this.rhs === 'object') {
                        const { compare } = await import('./compare.js');
                        eq = compare(this.lhs, this.rhs);
                    }
                    else {
                        eq = this.lhs === this.rhs;
                    }
                    val = this.equals ? eq : !eq;
                }
                else if (this.includes) {
                    const { includes } = await import('./includes.js');
                    val = includes(this.lhs, this.rhs);
                }
            }
            return val;
        }
        async evaluateAndPassDown() {
            if (this.disabled) {
                return;
            }
            let val = await this.evaluate();
            if (this.value === val)
                return;
            this.value = val;
            if (this.dataKeyName) {
                if (this._navDown === null) {
                    const tag = this.dataKeyName;
                    const test = (el) => el.dataset && !!el.dataset[this.dataKeyName];
                    const max = this.m ? this.m : Infinity;
                    const bndTagMatches = this.tagMatches.bind(this);
                    this._navDown = new NavDown(this, test, undefined, (nd) => bndTagMatches(nd), max);
                    this._navDown.init();
                }
                else {
                    this.tagMatches(this._navDown);
                }
            }
        }
        disconnect() {
            if (this._navDown)
                this._navDown.disconnect();
        }
    }
    IfDiff.is = 'if-diff';
    IfDiff.attributeProps = ({ byos, lhs, rhs, equals, not_equals, disabled, enable, dataKeyName, m, value }) => {
        const bool = ['if', byos, equals, not_equals, disabled];
        const str = [enable, dataKeyName];
        const num = [m];
        const obj = [lhs, rhs];
        const reflect = [...bool, ...str, ...num, ...obj];
        return {
            bool,
            str,
            num,
            obj,
            jsonProp: obj,
            reflect,
            notify: [value]
        };
    };
    return IfDiff;
})();
export { IfDiff };
define(IfDiff);
