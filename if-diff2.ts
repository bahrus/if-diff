import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {IfDiffProps} from './types.d.js';
import('lazy-mt/lazy-mt.js');
import {LazyMTProps} from 'lazy-mt/types.d.js';

/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends HTMLElement implements IfDiffProps, ReactiveSurface {
    static is = 'if-diff';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    connectedCallback(){
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
    }

    disconnectedCallback(){
        if(this.lhsLazyMt && this.rhsLazyMt){
            const range = document.createRange();
            range.setStart(this.lhsLazyMt, 0);
            range.setEnd(this.rhsLazyMt, 0);
            range.deleteContents();
        }
    }

    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }

    disabled: boolean | undefined;



    /**
     * LHS Operand.
     * @attr
     */
    lhs: boolean | string | number | object | undefined;

    /**
     * RHS Operand.
     * @attr
     */
    rhs: boolean | string | number | object | undefined;

    /**
     * lhs must equal rhs to pass tests.
     * @attr
     */
    equals: boolean | undefined;

    /**
     * lhs must not equal rhs to pass tests.
     * @attr not-equals
     */
    notEquals: boolean | undefined;

    /**
     * For strings, this means lhs.indexOf(rhs) > -1
     * For arrays, this means lhs intersect rhs = rhs
     * For numbers, this means lhs >= rhs
     * For objects, this means all the properties of rhs match the same properties of lhs
     * @attr includes
     */
    includes: boolean | undefined; 

    /**
     * Maximum number of elements that are effected by condition.
     */
    m: number | undefined;

    /**
     * Computed based on values of  if / equals / not_equals / includes 
     */
    value: boolean | undefined;

    lhsLazyMt: LazyMTProps | undefined;

    rhsLazyMt: LazyMTProps | undefined;

    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * @attr
     */
    iff: boolean | undefined;

}


const linkValue = ({iff, lhs, equals, rhs, notEquals, includes, disabled, self}: IfDiff) => {
    if(disabled) return;
    evaluate(self);
}

async function evaluate(self: IfDiff){
    let val = self.iff;
    if(val){
        if(self.equals || self.notEquals){
            let eq = false;
            if(typeof self.lhs === 'object' && typeof self.rhs === 'object'){
                const {compare} = await import('./compare.js');
                eq = compare(self.lhs, self.rhs);
            }else{
                eq = self.lhs === self.rhs;
            }
            val = self.equals ? eq : !eq;
        }else if(self.includes){
            const {includes} = await import('./includes.js');
            val = includes(self.lhs, self.rhs);
        }
    }
    if(val !== self.value){
        (<any>self)[slicedPropDefs!.propLookup!.value!.alias!] = val;
    }
    findTemplate(self);
}

function findTemplate(self: IfDiff){
    if(self.lhsLazyMt !== undefined) return;
    const templ = self.querySelector('template');
    if(templ === null){
        setTimeout(() => findTemplate(self), 50);
        return;
    }
    createLazyMts(self, templ);
}

function createLazyMts(self: IfDiff, templ: HTMLTemplateElement){
    const lhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    const eLHS = lhsLazyMt as Element;
    lhsLazyMt.setAttribute('enter', '');
    self.insertAdjacentElement('afterend', lhsLazyMt as Element);
    eLHS.insertAdjacentElement('afterend', templ);
    const rhsLazyMt = document.createElement('lazy-mt') as any;
    rhsLazyMt.setAttribute('exit', '');
    templ.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
}

const toggleMt = ({value, lhsLazyMt, rhsLazyMt}: IfDiff) => {
    if(value){
        lhsLazyMt!.setAttribute('mount', '');
        rhsLazyMt!.setAttribute('mount', '');
        changeDisplay(lhsLazyMt!, rhsLazyMt!, true);
        
    }else{
        changeDisplay(lhsLazyMt!, rhsLazyMt!, false);
    }
}

function changeDisplay(lhsLazyMt: Element, rhsLazyMt: Element, display: boolean){
    let ns = lhsLazyMt as HTMLElement;
    while(ns !== null){
        ns.style.display = display ? 'initial' : 'none';
        if(ns === rhsLazyMt) return;
        ns = ns.nextElementSibling as HTMLElement;
    }
}



const propActions = [
    linkValue, toggleMt
] as PropAction[];

const baseProp: PropDef = {
    dry: true,
    async: true,
};

const bool1: PropDef = {
    ...baseProp,
    type: Boolean,
};
// const bool2: PropDef = {
//     ...bool1,
//     stopReactionsIfFalsy: true,
// }
const str1: PropDef = {
    ...baseProp,
    type: String,
};
const obj1: PropDef = {
    ...baseProp,
    type: Object,
    parse: true,
};
const obj2: PropDef = {
    ...baseProp,
    type: Object,
    obfuscate: true
}
const obj3: PropDef = {
    ...baseProp,
    type: Object,
    stopReactionsIfFalsy: true,
}
const propDefMap: PropDefMap<IfDiff> = {
    iff: bool1, equals: bool1, notEquals: bool1, disabled: bool1,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);

declare global {
    interface HTMLElementTagNameMap {
        "if-diff": IfDiff,
    }
}