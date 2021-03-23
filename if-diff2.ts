import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {IfDiffProps} from './types.d.js';

export class IfDiff extends HTMLElement implements IfDiffProps, ReactiveSurface {
    static is = 'if-diff';

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    /**
     * Bring your own style.  If false (default), the if-diff adds a style to set target element's display to none when test fails.
    */
    byos!: boolean;

    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * @attr
     */
    if!: boolean;


    /**
     * LHS Operand.
     * @attr
     */
    lhs!: boolean | string | number | object;

    /**
     * RHS Operand.
     * @attr
     */
    rhs!: boolean | string | number | object;

    /**
     * lhs must equal rhs to pass tests.
     * @attr
     */
    equals!: boolean;

    /**
     * lhs must not equal rhs to pass tests.
     * @attr not-equals
     */
    not_equals!: boolean;

    /**
     * For strings, this means lhs.indexOf(rhs) > -1
     * For arrays, this means lhs intersect rhs = rhs
     * For numbers, this means lhs >= rhs
     * For objects, this means all the properties of rhs match the same properties of lhs
     * @attr includes
     */
    includes!: boolean; 

    /**
     * css selector of children of matching element  to remove disabled attribute
     */
    enable!: string;


    /**
     * Name of dataset key to set to 1 if true and -1 if false, if dataset key is present
     * @attr data-key-name
     */
    dataKeyName!: string;

    /**
     * Maximum number of elements that are effected by condition.
     */
    m!: number;

    /**
     * Computed based on values of  if / equals / not_equals / includes 
     */
    value: boolean = false;
}

const propActions = [

] as PropAction[];

xc.define(IfDiff);