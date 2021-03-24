import { xc } from 'xtal-element/lib/XtalCore.js';
import('lazy-mt/lazy-mt.js');
import 'mut-obs/mut-obs.js';
const p_d_std = 'p_d_std';
const attachedParents = new WeakSet();
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
            this.lhsLazyMt.remove();
            this.rhsLazyMt.remove();
        }
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
}
IfDiff.is = 'if-diff';
const styleMap = new WeakSet();
const linkValue = ({ iff, lhs, equals, rhs, notEquals, includes, disabled, self }) => {
    if (disabled)
        return;
    evaluate(self);
};
async function evaluate(self) {
    let val = self.iff;
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
    let rootNode = self.getRootNode();
    if (rootNode.host === undefined) {
        rootNode = document.head;
    }
    if (!styleMap.has(rootNode)) {
        styleMap.add(rootNode);
        const style = document.createElement('style');
        style.innerHTML = /* css */ `
            [data-if-diff-display="false"]{
                display:none;
            }
        `;
        rootNode.appendChild(style);
    }
    const lhsLazyMt = document.createElement('lazy-mt');
    const eLHS = lhsLazyMt;
    lhsLazyMt.setAttribute('enter', '');
    self.insertAdjacentElement('afterend', lhsLazyMt);
    eLHS.insertAdjacentElement('afterend', templ);
    const rhsLazyMt = document.createElement('lazy-mt');
    rhsLazyMt.setAttribute('exit', '');
    templ.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}
function addMutObj(self) {
    const parent = self.parentElement;
    if (parent !== null) {
        if (!attachedParents.has(parent)) {
            attachedParents.add(parent);
            const mutObs = document.createElement('mut-obs');
            const s = mutObs.setAttribute.bind(mutObs);
            s('bubbles', '');
            s('dispatch', p_d_std);
            s('child-list', '');
            s('observe', 'parentElement');
            s('on', '*');
            parent.appendChild(mutObs);
        }
        parent.addEventListener(p_d_std, e => {
            e.stopPropagation();
            changeDisplay(self.lhsLazyMt, self.rhsLazyMt, !!self.value);
        });
    }
}
const toggleMt = ({ value, lhsLazyMt, rhsLazyMt }) => {
    if (value) {
        lhsLazyMt.setAttribute('mount', '');
        rhsLazyMt.setAttribute('mount', '');
        changeDisplay(lhsLazyMt, rhsLazyMt, true);
    }
    else {
        changeDisplay(lhsLazyMt, rhsLazyMt, false);
    }
};
function changeDisplay(lhsLazyMt, rhsLazyMt, display) {
    let ns = lhsLazyMt;
    //TODO: mutation observer
    while (ns !== null) {
        ns.dataset.ifDiffDisplay = display.toString();
        if (ns === rhsLazyMt)
            return;
        ns = ns.nextElementSibling;
    }
}
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
    notify: true,
    obfuscate: true
};
const obj3 = {
    ...baseProp,
    type: Object,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
    iff: bool1, equals: bool1, notEquals: bool1, disabled: bool1,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);
