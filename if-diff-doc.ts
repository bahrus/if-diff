import {IfDiff} from './if-diff.js';
import { IfDiffProps } from './types.js';
import {LazyMTProps} from 'lazy-mt/types.d.js';
/**
 * @element if-diff
 */
export class IfDiffDoc extends IfDiff {
    /**
     * Boolean property / attribute -- must be true to pass test(s)
     * Can also be an object.  Condition is based on the property being truty.
     * @attr
     */
     iff?: boolean | undefined;

     /**
      * LHS Operand.
      * @attr
      */
     lhs?: boolean | string | number | object; 
 
     /**
      * Iff property has to be a non empty array.
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
     equals?: boolean;
     disabled?: boolean | number;
 
     lhsLazyMt?: LazyMTProps | undefined;
 
     rhsLazyMt?: LazyMTProps | undefined;
 
     ownedSiblingCount?: number | undefined;
 
     hiddenStyle?: string | undefined;
 
     setAttr?: string | undefined;
 
     setClass?: string | undefined;
 
     setPart?: string | undefined;
 
 
     /**
      * lhs must not equal rhs to pass tests.
      * @attr not-equals
      */
     notEquals?: boolean | undefined;
 
     syncPropsFromServer?: IfDiffProps | undefined;
 
     
 
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
}