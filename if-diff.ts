import { xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor } from 'xtal-element/lib/XtalCore.js';
import { IfDiffProps, ValueEvent } from './types.d.js';
import('lazy-mt/lazy-mt.js');
import { LazyMTProps } from 'lazy-mt/types.d.js';
import('mut-obs/mut-obs.js');

const p_d_std = 'p_d_std';
const attachedParents = new WeakSet<Element>();

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
 * @prop {string} [mediaMatches] - Additional condition for a media query to be added for tests to be satisfied.
 * @attr {string} [media-matches] - Additional condition for a media query to be added for tests to be satisfied.

 */
export class IfDiff extends HTMLElement implements ReactiveSurface {
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
    reactor: IReactor = new xc.Rx(this);
    /**
     * @private
     */
    _mql: MediaQueryList | undefined;

    //static isLocked = false;

    connectedCallback() {
        //this.style.display = 'none';
        xc.mergeProps<Partial<IfDiffProps>>(this, slicedPropDefs, {
            hiddenStyle: 'display:none',
            lazyDelay: 0,
        });
        setTimeout(() => {
            this.removeAttribute('defer-hydrate');
        }, 100);
        
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
    mediaQueryHandler = (e: MediaQueryListEvent) => {
        (<any>this)[slicedPropDefs.propLookup.matchesMediaQuery!.alias!] = e.matches;
    }

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
        const typedThis = this as IfDiffProps;
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
        const typedThis = this as unknown as IfDiffProps;
        this._doNotCleanUp = true;
        const range = document.createRange();
        range.setStartBefore(this);
        range.setEndAfter(typedThis.rhsLazyMt ?? this);
        return range.extractContents();
    }

    get nextUnownedSibling() {
        const typedThis = this as unknown as IfDiffProps;
        if (typedThis.rhsLazyMt !== undefined) {
            return typedThis.rhsLazyMt.nextElementSibling;
        }
        return this.nextElementSibling;
    }

    onPropChange(n: string, propDef: PropDef, newVal: any) {
        this.reactor.addToQueue(propDef, newVal);
    }






    addStyle(self: IfDiffProps) {
        let rootNode = self.getRootNode();
        if ((<any>rootNode).host === undefined) {
            rootNode = document.head;
        }
        if (!styleMap.has(rootNode)) {
            styleMap.add(rootNode);
            const style = document.createElement('style');
            style.innerHTML = /* css */`
                [data-if-diff-display="false"]{
                    ${self.hiddenStyle}
                }
                if-diff:not([lazy-delay]){
                    display:none;
                }
            `;
            rootNode.appendChild(style);
        }
    }

    configureLazyMt(lazyMT: LazyMTProps) { }

}

export interface IfDiff extends IfDiffProps { }

const styleMap = new WeakSet<Node>();


const linkValue = ({ iff, lhs, equals, rhs, notEquals, includes, disabled, matchesMediaQuery, self }: IfDiff) => {
    if (disabled) return;
    if (typeof iff !== 'boolean') {
        self.passedInIff = iff;
        if (self.isNonEmptyArray) {
            self.iff = (iff !== undefined && Array.isArray(iff) && (iff as any).length > 0)
        } else {
            self.iff = !!iff;
        }

        return;
    }
    evaluate(self);
}

async function evaluate(self: IfDiff) {
    let val = self.iff && !(self.matchesMediaQuery === false);
    if (val) {
        if (val) {
            if (self.equals || self.notEquals) {
                let eq = false;
                if (typeof self.lhs === 'object' && typeof self.rhs === 'object') {
                    const { compare } = await import('./compare.js');
                    eq = compare(self.lhs, self.rhs);
                } else {
                    eq = self.lhs === self.rhs;
                }
                val = self.equals ? eq : !eq;
            } else if (self.includes) {
                const { includes } = await import('./includes.js');
                val = includes(self.lhs, self.rhs);
            }

        }

    }
    if (val !== self.value) {
        (<any>self)[slicedPropDefs!.propLookup!.value!.alias!] = val;
    }
    findTemplate(self);
}

function findTemplate(self: IfDiff) {
    if (self.lhsLazyMt !== undefined) return;

    if (self.ownedSiblingCount === undefined) {
        const templ = self.querySelector('template');
        if (templ === null) {
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        // if (self.lazyDelay! > 0) {
        //     if (IfDiff.isLocked) {
        //         setTimeout(() => {
        //             findTemplate(self);
        //         }, self.lazyDelay);
        //         return;
        //     }
        //     IfDiff.isLocked = true;
        // }
        createLazyMts(self, templ);
        // if (self.lazyDelay! > 0) {
        //     setTimeout(() => {
        //         IfDiff.isLocked = false;
        //     }, self.lazyDelay);
        // }
    } else {
        let ns = self as Element | null;
        let count = 0;
        let lhsElement: Element | undefined;
        while (ns !== null && count < self.ownedSiblingCount) {
            ns = ns.nextElementSibling;
            count++;
            if (count === 1 && ns !== null) lhsElement = ns;
        }
        if (ns === null || count < self.ownedSiblingCount) {
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        wrapLazyMts(self, lhsElement!, ns);
    }
    setTimeout(() => {
        self.removeAttribute('lazy-delay');
    }, self.lazyDelay);
    
}

function wrapLazyMts(self: IfDiff, lhsElement: Element, rhsElement: Element) {
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    lhsLazyMt.enter = true;
    self.configureLazyMt(lhsLazyMt);
    lhsElement.insertAdjacentElement('beforebegin', lhsLazyMt);
    const rhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    rhsLazyMt.exit = true;
    self.configureLazyMt(rhsLazyMt);
    rhsElement.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}


function createLazyMts(self: IfDiff, templ: HTMLTemplateElement) {
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    const eLHS = lhsLazyMt as Element;
    lhsLazyMt.setAttribute('enter', '');
    if(!self.lazyDisplay){
        lhsLazyMt.setAttribute('treat-as-visible', '');
    }
    
    self.insertAdjacentElement('afterend', lhsLazyMt as Element);
    eLHS.insertAdjacentElement('afterend', templ);
    const rhsLazyMt = document.createElement('lazy-mt') as any;
    rhsLazyMt.setAttribute('exit', '');
    if(!self.lazyDisplay){
        rhsLazyMt.setAttribute('treat-as-visible', '');
    }
    templ.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}

function addMutObj(self: IfDiffProps) {
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
            changeDisplay(self, self.lhsLazyMt!, self.rhsLazyMt!, !!self.value);
        })
    }
}

const toggleMt = ({ value, lhsLazyMt, rhsLazyMt, self }: IfDiff) => {
    if (value) {
        lhsLazyMt!.setAttribute('mount', '');
        rhsLazyMt!.setAttribute('mount', '');
        changeDisplay(self, lhsLazyMt!, rhsLazyMt!, true);

    } else {
        changeDisplay(self, lhsLazyMt!, rhsLazyMt!, false);
    }
}

function changeDisplay(self: IfDiffProps, lhsLazyMt: Element, rhsLazyMt: Element, display: boolean) {
    let ns = lhsLazyMt as HTMLElement;
    //TODO: mutation observer
    while (ns !== null) {
        ns.dataset.ifDiffDisplay = display.toString();
        const attr = self.setAttr;
        if (attr !== undefined) {
            if (display) {
                ns.setAttribute(attr, '');
            } else {
                ns.removeAttribute(attr);
            }
        }
        const verb = display ? 'add' : 'remove';
        const part = self.setPart;
        if (part !== undefined) {
            (<any>ns)[verb](part);
        }
        const className = self.setClass;
        if (className !== undefined) {
            ns.classList[verb](className);
        }
        if (ns === rhsLazyMt) return;
        ns = ns.nextElementSibling as HTMLElement;
    }
}

const onMediaMatches = ({ mediaMatches, self }: IfDiff) => {
    self._mql = window.matchMedia(mediaMatches!);
    self._mql.addEventListener('change', self.mediaQueryHandler.bind(self));
    (<any>self)[slicedPropDefs.propLookup.matchesMediaQuery!.alias!] = self._mql.matches;
}

const propActions = [
    linkValue, toggleMt, onMediaMatches
] as PropAction[];

const baseProp: PropDef = {
    dry: true,
    async: true,
};

const bool1: PropDef = {
    ...baseProp,
    type: Boolean,
};

const bool2: PropDef = {
    ...bool1,
    notify: true,
    obfuscate: true,
}

const str1: PropDef = {
    ...baseProp,
    type: String,
};
const str2: PropDef = {
    ...str1,
    stopReactionsIfFalsy: true,
}
const obj1: PropDef = {
    ...baseProp,
    type: Object,
    parse: true,
};
const obj2: PropDef = {
    ...baseProp,
    type: Object,
    notify: true,
    obfuscate: true
};
const obj3: PropDef = {
    ...baseProp,
    type: Object,
    stopReactionsIfFalsy: true,
};
const num1: PropDef = {
    ...baseProp,
    type: Number,
};
// const sync: PropDef = {
//     ...baseProp,
//     type: Object,
//     syncProps: true,
// };
const propDefMap: PropDefMap<IfDiffProps> = {
    iff: bool1, equals: bool1, notEquals: bool1, disabled: bool1, matchesMediaQuery: bool2,
    passedInIff: obj1,
    isNonEmptyArray: bool1, mediaMatches: str2,
    lazyDisplay: bool1,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3,
    ownedSiblingCount: num1, setAttr: str1, setClass: str1, setPart: str1,
    hiddenStyle: str1,
    // syncPropsFromServer: sync,
    lazyDelay: num1,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);

declare global {
    interface HTMLElementTagNameMap {
        "if-diff": IfDiff,
    }
}