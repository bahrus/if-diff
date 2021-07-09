import {LazyMTProps} from 'lazy-mt/types.d.js';
import {IfDiff} from './if-diff.js';

export interface IfDiffProps extends HTMLElement{
    
    /**
     * @prop {boolean} iff Must be true to pass test(s). Can also be an object.  Condition is based on the property being truthy.
     * @attr {boolean} iff Must be true (exists) to pass test(s)
     */
    iff?: boolean | undefined;

    /**
     * @prop {any} lhs LHS Operand.
     * @attr {string} lhs LHS Operand.
     */
    lhs?: boolean | string | number | object; 

    /**
     * @prop {boolean} isNonEmptyArray Iff property has to be a non empty array.
     * @attr {boolean} is-non-empty-array Iff property has to be a non empty array.
     */
    isNonEmptyArray?: boolean | undefined;

    /**
     * RHS Operand.
     * @attr
     */
    rhs?: boolean | string | number | object;

    /**
     * lhs must equal rhs to pass tests.
     * @attr
     */ 
    equals?: boolean, 
    disabled?: boolean | undefined, 

    lhsLazyMt?: LazyMTProps | undefined;

    rhsLazyMt?: LazyMTProps | undefined;

    ownedSiblingCount?: number | undefined;

    hiddenStyle?: string | undefined;

    addStyle(self: IfDiffProps): void;

    
    setAttr?: string | undefined;

    setClass?: string | undefined;

    setPart?: string | undefined;


    /**
     * lhs must not equal rhs to pass tests.
     * @attr not-equals
     */
    notEquals?: boolean | undefined;

    syncPropsFromServer?: IfDiffProps | undefined;

    configureLazyMt(lazyMT: LazyMTProps): void;

    /**
     * For strings, this means lhs.indexOf(rhs) > -1
     * For arrays, this means lhs intersect rhs = rhs
     * For numbers, this means lhs >= rhs
     * For objects, this means all the properties of rhs match the same properties of lhs
     * @attr includes
     */
    includes?: boolean | undefined; 

    /**
     * Computed based on values of  if / equals / not_equals / includes 
     */
    value?: boolean | undefined;

    /**
     * Maximum number of elements that are effected by condition.
     */
    m?: number | undefined;

    lazyDelay?: number | undefined;

}

export interface IfDiffEventNameMap {
    'template-cloned': TemplateClonedDetail;
}

export interface TemplateClonedDetail {
    clonedTemplate: DocumentFragment;
}