import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
import { define } from 'xtal-latx/define.js';
import { debounce } from 'xtal-latx/debounce.js';
const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const tag = 'tag';
const equals = 'equals';
const not_equals = 'not_equals';
export class IfDiff extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._conn = false;
    }
    static get is() { return 'if-diff'; }
    static get observedAttributes() {
        return [if$, lhs, rhs, tag, equals, not_equals, disabled];
    }
    get if() {
        return this._if;
    }
    set if(nv) {
        this.attr(if$, !!nv, '');
    }
    get lhs() {
        return this._lhs;
    }
    set lhs(nv) {
        this.attr(lhs, nv.toString());
    }
    get rhs() {
        return this._rhs;
    }
    set rhs(nv) {
        this.attr(rhs, nv.toString());
    }
    get equals() {
        return this._equals;
    }
    set equals(nv) {
        this.attr(equals, nv, '');
    }
    get not_equals() {
        return this._not_equals;
    }
    set not_equals(nv) {
        this.attr(not_equals, nv, '');
    }
    get tag() {
        return this._tag;
    }
    set tag(nv) {
        this.attr(tag, nv);
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        const u = '_' + n;
        switch (n) {
            case equals:
            case not_equals:
            case if$:
                this[u] = (nv !== null);
                break;
            case tag:
            case lhs:
            case rhs:
                this[u] = nv;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(IfDiff.observedAttributes);
        this._conn = true;
        this._debouncer = debounce(() => {
            this.passDown();
        }, 16);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._conn || this._disabled)
            return;
        this.addMutObs(); //TODO:  let breathe;
        this._debouncer();
    }
    loadTemplate(el) {
        const tmpl = el.querySelector('template');
        if (!tmpl) {
            setTimeout(() => {
                this.loadTemplate(el);
            }, 50);
            return;
        }
        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
    }
    passDown() {
        let val = this._if;
        if (val && (this._equals || this._not_equals)) {
            if (this._equals) {
                val = (this._lhs === this._rhs);
            }
            else {
                val = (this._lhs !== this._rhs);
            }
        }
        this.value = val;
        this.de('value', {
            value: val
        });
        if (this._tag) {
            let ns = this.nextElementSibling;
            while (ns) {
                const ds = ns.dataset[this._tag];
                if (ds) {
                    if (ds === '0') {
                        if (val) {
                            this.loadTemplate(ns);
                            ns.dataset[this._tag] = "1";
                        }
                    }
                    else {
                        ns.dataset[this._tag] = val ? '1' : '-1';
                    }
                }
                ns = ns.nextElementSibling;
            }
        }
    }
    addMutObs() {
        let elToObs = this.parentElement;
        if (!elToObs)
            return; //TODO
        this._sibObs = new MutationObserver((m) => {
            this._debouncer();
        });
        this._sibObs.observe(elToObs, { childList: true });
    }
    disconnect() {
        if (this._sibObs)
            this._sibObs.disconnect();
    }
}
define(IfDiff);
//# sourceMappingURL=if-diff.js.map