import { IfDiff } from './if-diff.js';
/**
 * @element if-diff
 */
export class IfDiffDoc extends IfDiff {
    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * Can also be an object.  Condition is based on the property being truty.
     * @attr
     */
    iff;
    /**
     * LHS Operand.
     * @attr
     */
    lhs;
    /**
     * Iff property has to be a non empty array.
     */
    isNonEmptyArray;
    /**
     * RHS Operand.
     * @attr
     */
    rhs;
    /**
     * lhs must equal rhs to pass tests.
     * @attr
     */
    equals;
    disabled;
    lhsLazyMt;
    rhsLazyMt;
    ownedSiblingCount;
    hiddenStyle;
    setAttr;
    setClass;
    setPart;
    /**
     * lhs must not equal rhs to pass tests.
     * @attr not-equals
     */
    notEquals;
    syncPropsFromServer;
    /**
     * For strings, this means lhs.indexOf(rhs) > -1
     * For arrays, this means lhs intersect rhs = rhs
     * For numbers, this means lhs >= rhs
     * For objects, this means all the properties of rhs match the same properties of lhs
     * @attr includes
     */
    includes;
    /**
     * Computed based on values of  if / equals / not_equals / includes
     */
    value;
    /**
     * Maximum number of elements that are effected by condition.
     */
    m;
}
