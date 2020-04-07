import { XtallatX } from 'xtal-element/xtal-latx.js';
import { disabled, hydrate } from 'trans-render/hydrate.js';
import { define } from 'trans-render/define.js';
import { debounce } from 'xtal-element/debounce.js';
import { NavDown } from 'xtal-element/NavDown.js';
import { insertAdjacentTemplate } from 'trans-render/insertAdjacentTemplate.js';
const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const data_key_name = 'data-key-name';
const equals = 'equals';
const not_equals = 'not_equals';
const enable = 'enable';
const m$ = 'm'; //TODO:  share mixin with p-d.p-u?
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._conn = false;
        this._navDown = null;
        this._value = false;
    }
    static get is() { return 'if-diff'; }
    static get observedAttributes() {
        return [if$, lhs, rhs, data_key_name, equals, not_equals, disabled, enable, m$];
    }
    get if() {
        return this._if;
    }
    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * @attr
     */
    set if(nv) {
        this.attr(if$, !!nv, '');
    }
    get lhs() {
        return this._lhs;
    }
    /**
     * LHS Operand.
     * @attr
     */
    set lhs(nv) {
        switch (typeof nv) {
            case 'string':
            case 'number':
                this.attr(lhs, nv.toString());
                break;
            case 'object':
                this._lhs = nv;
                this.onPropsChange();
                break;
        }
    }
    get rhs() {
        return this._rhs;
    }
    /**
     * RHS Operand.
     * @attr
     */
    set rhs(nv) {
        switch (typeof nv) {
            case 'string':
            case 'number':
                this.attr(rhs, nv.toString());
                break;
            case 'object':
                this._rhs = nv;
                this.onPropsChange();
                break;
        }
    }
    get equals() {
        return this._equals;
    }
    /**
     * lhs must equal rhs to pass tests.
     * @attr
     */
    set equals(nv) {
        this.attr(equals, nv, '');
    }
    get not_equals() {
        return this._not_equals;
    }
    /**
     * lhs must not equal rhs to pass tests.
     * @attr not-equals
     */
    set not_equals(nv) {
        this.attr(not_equals, nv, '');
    }
    get enable() {
        return this._enable;
    }
    /**
     * css selector of children of matching element  to remove disabled attribute
     */
    set enable(nv) {
        this.attr(enable, nv);
    }
    get dataKeyName() {
        return this._dataKeyName;
    }
    /**
     * Name of dataset key to set to 1 if true and -1 if false, if dataset key is present
     * @attr data-key-name
     */
    set dataKeyName(nv) {
        this.attr(data_key_name, nv);
    }
    get m() {
        return this._m;
    }
    /**
     * Maximum number of elements that are effected by condition.
     */
    set m(v) {
        this.attr(m$, v.toString());
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
            case lhs:
            case rhs:
            case m$:
            case enable:
                this[u] = nv;
                break;
            case data_key_name:
                this._dataKeyName = nv;
                break;
        }
        this.onPropsChange();
    }
    init() {
        //this.addMutObs();
        this.passDown();
    }
    connectedCallback() {
        this.style.display = 'none';
        this.propUp(['if', 'lhs', 'rhs', 'dataKeyName', 'equals', 'not_equals', 'disabled',
            'enable', 'm', 'prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'propProxyMap']);
        this._conn = true;
        this._debouncer = debounce((getNew = false) => {
            this.passDown();
        }, 16);
        setTimeout(() => {
            this.init();
        }, 50);
    }
    onPropsChange() {
        if (!this._conn || this._disabled)
            return;
        this._debouncer();
    }
    get value() {
        return this._value;
    }
    set value(nv) {
        this._value = nv;
        this.de('value', {
            value: nv,
        });
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
        return insertedElements;
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
        if (this._enable) {
            const action = (val ? 'remove' : 'set') + 'Attribute';
            Array.from(el.querySelectorAll(this._enable)).concat(el).forEach(target => target[action]('disabled', ''));
        }
        if (this._propProxyMap) {
            for (const key in this._propProxyMap) {
                const val = this[key];
                if (val === undefined)
                    continue;
                const prop = this._propProxyMap[key];
                el[prop] = val;
            }
        }
    }
    tagMatches(nd) {
        const matches = nd.matches;
        this.attr('mtch', matches.length.toString());
        const val = this.value;
        const dataKeyName = this._dataKeyName;
        matches.forEach(el => {
            const ds = el.dataset;
            this.do(el, ds, val, dataKeyName);
        });
    }
    async passDown() {
        let val = this._if;
        if (val && (this._equals || this._not_equals)) {
            let eq = false;
            if (typeof this._lhs === 'object' && typeof this._rhs === 'object') {
                const { compare } = await import('./compare.js');
                eq = compare(this._lhs, this._rhs);
            }
            else {
                eq = this._lhs === this._rhs;
            }
            val = this._equals ? eq : !eq;
        }
        if (this._value === val)
            return;
        this.value = val;
        if (this._dataKeyName) {
            if (this._navDown === null) {
                const tag = this._dataKeyName;
                const test = (el) => el.dataset && !!el.dataset[this._dataKeyName];
                const max = this._m ? this._m : Infinity;
                const bndTagMatches = this.tagMatches.bind(this);
                this._navDown = new NavDown(this, test, undefined, (nd) => bndTagMatches(nd), max);
                this._navDown.init();
            }
            else {
                this.tagMatches(this._navDown);
            }
        }
    }
    get prop1() {
        return this._prop1;
    }
    set prop1(val) {
        this._prop1 = val;
        this.onPropsChange();
    }
    get prop2() {
        return this._prop2;
    }
    set prop2(val) {
        this._prop2 = val;
        this.onPropsChange();
    }
    get prop3() {
        return this._prop3;
    }
    set prop3(val) {
        this._prop3 = val;
        this.onPropsChange();
    }
    get prop4() {
        return this._prop1;
    }
    set prop4(val) {
        this._prop4 = val;
        this.onPropsChange();
    }
    get prop5() {
        return this._prop5;
    }
    set prop5(val) {
        this._prop5 = val;
        this.onPropsChange();
    }
    get propProxyMap() {
        return this._propProxyMap;
    }
    set propProxyMap(val) {
        this._propProxyMap = val;
        this.onPropsChange();
    }
    // _prop6: any | undefined;
    // get prop6(){
    //     return this._prop5;
    // }
    // set prop6(val){
    //     this._prop6 = val;
    //     this.passDown();
    // }
    // _prop7: any | undefined;
    // get prop7(){
    //     return this._prop7;
    // }
    // set prop7(val){
    //     this._prop7 = val;
    //     this.passDown();
    // }
    // _prop8: any | undefined;
    // get prop8(){
    //     return this._prop8;
    // }
    // set prop8(val){
    //     this._prop8 = val;
    //     this.passDown();
    // }
    // _prop9: any | undefined;
    // get prop9(){
    //     return this._prop9;
    // }
    // set prop9(val){
    //     this._prop9 = val;
    //     this.passDown();
    // }
    // _prop10: any | undefined;
    // get prop10(){
    //     return this._prop1;
    // }
    // set prop10(val){
    //     this._prop10 = val;
    //     this.passDown();
    // }
    // _prop11: any | undefined;
    // get prop11(){
    //     return this._prop11;
    // }
    // set prop11(val){
    //     this._prop11 = val;
    //     this.passDown();
    // }
    disconnect() {
        if (this._navDown)
            this._navDown.disconnect();
    }
}
define(IfDiff);
