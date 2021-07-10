import { xc } from 'xtal-element/lib/XtalCore.js';
import('lazy-mt/lazy-mt.js');
import('mut-obs/mut-obs.js');
const p_d_std = 'p_d_std';
const attachedParents = new WeakSet();
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.[More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 * @event {ValueEvent} value-changed - When conditions change, causing a change to the computed condition, this event is fired.
 * @event {CustomEvent} matches-media-query-changed - If and-media-matches condition is present, fires this event when the media query changes in value (regardless of the large condition expression).
 * @prop {boolean} iff - Must be true to pass test(s). Can also be an object.  Condition is based on the property being truthy.
 * @attr {boolean} iff - Must be true (exists) to pass test(s)
 * @prop {boolean | string | number | object} [lhs] - LHS Operand.
 * @attr {boolean | string | number | object} [lhs] - LHS Operand.  Is JSON parsed.
 * @prop {boolean} [isNonEmptyArray] - Iff property has to be a non empty array.
 * @attr {boolean} is-non-empty-array Iff property has to be a non empty array.
 * @prop {boolean | string | number | object} [rhs] - RHS Operand.
 * @attr {boolean | string | number | object} [rhs] - RHS Operand.  Is JSON parsed.
 * @prop {boolean} [equals] - lhs must equal rhs to pass tests.
 * @attr {boolean} [equals] - lhs must equal rhs to pass tests.
 * @prop {boolean} [disabled] - Do not evaluate expression until disabled setting is removed.
 * @attr {boolean} [disabled] - Do not evaluate expression until disabled setting is removed.
 * @prop {number} [ownedSiblingCount] - If content is rendered by the server, the server can indicate which nodes that it rendered can be hidden / displayed by if-diff on the client.
 * @prop {string} [hiddenStyle = display:none] - Specify exact manner in which non visible content should be hidden.
 * @prop {number} [ownedSiblingCount] - If content is rendered by the server, the server can indicate which nodes that it rendered can be hidden / displayed by if-diff on the client.
 * @attr {number} [owned-sibling-count] - If content is rendered by the server, the server can indicate which nodes that it rendered can be hidden / displayed by if-diff on the client.
 * @prop {string} [hiddenStyle = display:none] - Specify exact manner in which non-visible content should be hidden.
 * @attr {string} [hidden-style = display:none] - Specify exact manner in which non-visible content should be hidden.
 * @prop {string} [setAttr] - Specify name of attribute to add when conditions are satisfied / removed when not satisfied
 * @attr {string} [set-attr] - Specify name of attribute to add when conditions are satisfied / removed when not satisfied
 * @prop {string} [setClass] - Specify name of class to add when conditions are satisfied / removed when not satisfied
 * @attr {string} [set-class] - Specify name of class to add when conditions are satisfied / removed when not satisfied
 * @prop {string} [setPart] - Specify name of part to add when conditions are satisfied / removed when not satisfied
 * @attr {string} [set-part] - Specify name of part to add when conditions are satisfied / removed when not satisfied
 * @prop {boolean} [notEquals] - lhs must not equal rhs to pass tests.
 * @attr {boolean} [not-equals] - lhs must not equal rhs to pass tests.
 * @prop {boolean} [includes] - For strings, this means lhs.indexOf(rhs) > -1.  For arrays, this means lhs intersect rhs = rhs. For numbers, this means lhs >= rhs.  For objects, this means all the properties of rhs match the same properties of lhs
 * @attr {boolean} [includes] - For strings, this means lhs.indexOf(rhs) > -1.  For arrays, this means lhs intersect rhs = rhs. For numbers, this means lhs >= rhs.  For objects, this means all the properties of rhs match the same properties of lhs
 * @readonly @prop {boolean} [value] - Computed based on values of  if / equals / not_equals / includes and other property values
 * @prop {number} [m] - Maximum number of elements that are effected by condition.
 * @attr {number} [m] - Maximum number of elements that are effected by condition.
 * @prop {string} [andMediaMatches] - Additional condition for a media query to be added for tests to be satisfied.
 * @attr {string} [and-media-matches] - Additional condition for a media query to be added for tests to be satisfied.

 */
export class IfDiff extends HTMLElement {
    static is = 'if-diff';
    /**
     * @private
     */
    self = this;
    /**
     * @private
     */
    propActions = propActions;
    /**
     * @private
     */
    reactor = new xc.Rx(this);
    /**
     * @private
     */
    _mql;
    static isLocked = false;
    connectedCallback() {
        this.style.display = 'none';
        xc.mergeProps(this, slicedPropDefs, {
            hiddenStyle: 'display:none',
            lazyDelay: -1,
        });
        //causing issues -- maybe isn't necessary, since this._mql will be garbage collected?
        //if (this._mql) this._mql.addEventListener('change', this.mediaQueryHandler);
    }
    disconnectedCallback() {
        if (!this._doNotCleanUp) {
            setTimeout(() => {
                //TODO:  Make connectedCallback cancel the setTimeout.
                this.cleanupIfNoParentElement();
            }, 1000);
        }
        this.disconnect();
    }
    /**
     * @private
     */
    mediaQueryHandler = (e) => {
        this[slicedPropDefs.propLookup.matchesMediaQuery.alias] = e.matches;
    };
    disconnect() {
        //causing issues -- maybe isn't necessary, since this._mql will be garbage collected?
        //if (this._mql) this._mql.removeEventListener('change', this.mediaQueryHandler);
    }
    cleanupIfNoParentElement() {
        if (this.parentElement === null) {
            this.ownedRange?.deleteContents();
        }
    }
    get ownedRange() {
        const typedThis = this;
        if (typedThis.lhsLazyMt && typedThis.rhsLazyMt) {
            const range = document.createRange();
            range.setStartBefore(typedThis.lhsLazyMt);
            range.setEndAfter(typedThis.rhsLazyMt);
            return range;
        }
    }
    /**
     * @private
     */
    _doNotCleanUp = false;
    extractContents() {
        const typedThis = this;
        this._doNotCleanUp = true;
        const range = document.createRange();
        range.setStartBefore(this);
        range.setEndAfter(typedThis.rhsLazyMt ?? this);
        return range.extractContents();
    }
    get nextUnownedSibling() {
        const typedThis = this;
        if (typedThis.rhsLazyMt !== undefined) {
            return typedThis.rhsLazyMt.nextElementSibling;
        }
        return this.nextElementSibling;
    }
    onPropChange(n, propDef, newVal) {
        this.reactor.addToQueue(propDef, newVal);
    }
    addStyle(self) {
        let rootNode = self.getRootNode();
        if (rootNode.host === undefined) {
            rootNode = document.head;
        }
        if (!styleMap.has(rootNode)) {
            styleMap.add(rootNode);
            const style = document.createElement('style');
            style.innerHTML = /* css */ `
                [data-if-diff-display="false"]{
                    ${self.hiddenStyle}
                }
            `;
            rootNode.appendChild(style);
        }
    }
    configureLazyMt(lazyMT) { }
}
const styleMap = new WeakSet();
const linkValue = ({ iff, lhs, equals, rhs, notEquals, includes, disabled, matchesMediaQuery, self }) => {
    if (disabled)
        return;
    if (typeof iff !== 'boolean') {
        if (self.isNonEmptyArray) {
            self.iff = (iff !== undefined && Array.isArray(iff) && iff.length > 0);
        }
        else {
            self.iff = !!iff;
        }
        return;
    }
    evaluate(self);
};
async function evaluate(self) {
    let val = self.iff && !(self.matchesMediaQuery === false);
    if (val) {
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
    }
    if (val !== self.value) {
        self[slicedPropDefs.propLookup.value.alias] = val;
    }
    findTemplate(self);
}
function findTemplate(self) {
    if (self.lhsLazyMt !== undefined)
        return;
    if (self.ownedSiblingCount === undefined) {
        const templ = self.querySelector('template');
        if (templ === null) {
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        if (self.lazyDelay > 0) {
            if (IfDiff.isLocked) {
                setTimeout(() => {
                    findTemplate(self);
                }, self.lazyDelay);
                return;
            }
            IfDiff.isLocked = true;
        }
        createLazyMts(self, templ);
        if (self.lazyDelay > 0) {
            setTimeout(() => {
                IfDiff.isLocked = false;
            }, self.lazyDelay);
        }
    }
    else {
        let ns = self;
        let count = 0;
        let lhsElement;
        while (ns !== null && count < self.ownedSiblingCount) {
            ns = ns.nextElementSibling;
            count++;
            if (count === 1 && ns !== null)
                lhsElement = ns;
        }
        if (ns === null || count < self.ownedSiblingCount) {
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        wrapLazyMts(self, lhsElement, ns);
    }
}
function wrapLazyMts(self, lhsElement, rhsElement) {
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt');
    lhsLazyMt.enter = true;
    self.configureLazyMt(lhsLazyMt);
    lhsElement.insertAdjacentElement('beforebegin', lhsLazyMt);
    const rhsLazyMt = document.createElement('lazy-mt');
    rhsLazyMt.exit = true;
    self.configureLazyMt(rhsLazyMt);
    rhsElement.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}
function createLazyMts(self, templ) {
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt');
    const eLHS = lhsLazyMt;
    lhsLazyMt.setAttribute('enter', '');
    lhsLazyMt.setAttribute('treat-as-visible', '');
    self.insertAdjacentElement('afterend', lhsLazyMt);
    eLHS.insertAdjacentElement('afterend', templ);
    const rhsLazyMt = document.createElement('lazy-mt');
    rhsLazyMt.setAttribute('exit', '');
    rhsLazyMt.setAttribute('treat-as-visible', '');
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
            changeDisplay(self, self.lhsLazyMt, self.rhsLazyMt, !!self.value);
        });
    }
}
const toggleMt = ({ value, lhsLazyMt, rhsLazyMt, self }) => {
    if (value) {
        lhsLazyMt.setAttribute('mount', '');
        rhsLazyMt.setAttribute('mount', '');
        changeDisplay(self, lhsLazyMt, rhsLazyMt, true);
    }
    else {
        changeDisplay(self, lhsLazyMt, rhsLazyMt, false);
    }
};
function changeDisplay(self, lhsLazyMt, rhsLazyMt, display) {
    let ns = lhsLazyMt;
    //TODO: mutation observer
    while (ns !== null) {
        ns.dataset.ifDiffDisplay = display.toString();
        const attr = self.setAttr;
        if (attr !== undefined) {
            if (display) {
                ns.setAttribute(attr, '');
            }
            else {
                ns.removeAttribute(attr);
            }
        }
        const verb = display ? 'add' : 'remove';
        const part = self.setPart;
        if (part !== undefined) {
            ns[verb](part);
        }
        const className = self.setClass;
        if (className !== undefined) {
            ns.classList[verb](className);
        }
        if (ns === rhsLazyMt)
            return;
        ns = ns.nextElementSibling;
    }
}
const onAndMediaMatches = ({ andMediaMatches, self }) => {
    self._mql = window.matchMedia(andMediaMatches);
    self._mql.addEventListener('change', self.mediaQueryHandler.bind(self));
    self[slicedPropDefs.propLookup.matchesMediaQuery.alias] = self._mql.matches;
};
const propActions = [
    linkValue, toggleMt, onAndMediaMatches
];
const baseProp = {
    dry: true,
    async: true,
};
const bool1 = {
    ...baseProp,
    type: Boolean,
};
const bool2 = {
    ...bool1,
    notify: true,
    obfuscate: true,
};
const str1 = {
    ...baseProp,
    type: String,
};
const str2 = {
    ...str1,
    stopReactionsIfFalsy: true,
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
const num1 = {
    ...baseProp,
    type: Number,
};
const sync = {
    ...baseProp,
    type: Object,
    syncProps: true,
};
const propDefMap = {
    iff: bool1, equals: bool1, notEquals: bool1, disabled: bool1, matchesMediaQuery: bool2,
    isNonEmptyArray: bool1, andMediaMatches: str2,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3,
    ownedSiblingCount: num1, setAttr: str1, setClass: str1, setPart: str1,
    hiddenStyle: str1,
    syncPropsFromServer: sync,
    lazyDelay: num1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);
