import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {IfDiffProps} from './types.d.js';
import('lazy-mt/lazy-mt.js');

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

    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }

    disabled: boolean | undefined;

    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * @attr
     */
    if: boolean | undefined;


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
    value: boolean = false;
}

const propActions = [

] as PropAction[];

const baseProp: PropDef = {
    dry: true,
    async: true,
};

const bool1: PropDef = {
    ...baseProp,
    type: Boolean,
};
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
const propDefMap: PropDefMap<IfDiff> = {
    if: bool1, equals: bool1, notEquals: bool1, disabled: bool1,
    lhs: obj1, rhs: obj1, value: obj2,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);

declare global {
    interface HTMLElementTagNameMap {
        "if-diff": IfDiff,
    }
}