import { xc } from 'xtal-element/lib/XtalCore.js';
import('lazy-mt/lazy-mt.js');
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
        /**
         * Computed based on values of  if / equals / not_equals / includes
         */
        this.value = false;
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
    }
    disconnectedCallback() {
        if (this.lhsLazyMt && this.rhsLazyMt) {
            const range = document.createRange();
            range.setStart(this.lhsLazyMt, 0);
            range.setEnd(this.rhsLazyMt, 0);
            range.deleteContents();
        }
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * @attr
     */
    get if() {
        return !!this._if;
    }
    set if(val) {
        this._if = val;
        linkValue(this);
    }
}
IfDiff.is = 'if-diff';
const linkValue = ({ lhs, equals, rhs, notEquals, includes, disabled, self }) => {
    if (disabled)
        return;
    evaluate(self);
};
async function evaluate(self) {
    let val = self.if;
    if (val) {
        if (self.equals || self.notEquals) {
            let eq = false;
            if (typeof self.lhs === 'object' && typeof self.rhs === 'object') {
                const { compare } = await import('./compare.js');
                eq = compare(self.lhs, self.rhs);
            }
            else {
                eq = self.lhs === self.rhs;
            }
            val = self.equals ? eq : !eq;
        }
        else if (self.includes) {
            const { includes } = await import('./includes.js');
            val = includes(self.lhs, self.rhs);
        }
    }
    if (val !== self.value) {
        self[slicedPropDefs.propLookup.value.alias] = val;
    }
    findTemplate(self);
}
function findTemplate(self) {
    if (self.lhsLazyMt !== undefined)
        return;
    const templ = self.querySelector('template');
    if (templ === null) {
        setTimeout(() => findTemplate(self), 50);
        return;
    }
    createLazyMts(self, templ);
}
function createLazyMts(self, templ) {
    const lhsLazyMt = document.createElement('lazy-mt'); //TODO provide type file for lazymt
    lhsLazyMt.enter = true;
    self.insertAdjacentElement('afterend', lhsLazyMt);
    const rhsLazyMt = document.createElement('lazy-mt');
    rhsLazyMt.enter = true;
    lhsLazyMt.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
}
const toggleMt = ({ value, lhsLazyMt, rhsLazyMt }) => {
    if (value) {
        lhsLazyMt.mount = true;
        rhsLazyMt.mount = true;
        lhsLazyMt.removeAttribute('hidden');
    }
    else {
        lhsLazyMt.setAttribute('hidden');
    }
};
const propActions = [
    linkValue, toggleMt
];
const baseProp = {
    dry: true,
    async: true,
};
const bool1 = {
    ...baseProp,
    type: Boolean,
};
// const bool2: PropDef = {
//     ...bool1,
//     stopReactionsIfFalsy: true,
// }
const str1 = {
    ...baseProp,
    type: String,
};
const obj1 = {
    ...baseProp,
    type: Object,
    parse: true,
};
const obj2 = {
    ...baseProp,
    type: Object,
    obfuscate: true
};
const obj3 = {
    ...baseProp,
    type: Object,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
    if: bool1, equals: bool1, notEquals: bool1, disabled: bool1,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);
