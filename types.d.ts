import {LazyMTProps} from 'lazy-mt/types.d.js';


export interface IfDiffProps{
    
    /**
     * @prop {boolean} iff - Must be true to pass test(s). Can also be an object.  Condition is based on the property being truthy.
     * @attr {boolean} iff - Must be true (exists) to pass test(s)
     */
    iff?: boolean;

    passedInIff?: any;

    /**
     * @prop {boolean | string | number | object} [lhs] - LHS Operand.
     * @attr {boolean | string | number | object} [lhs] - LHS Operand.  Is JSON parsed.
     */
    lhs?: boolean | string | number | object; 

    /**
     * @prop {boolean} [isNonEmptyArray] - Iff property has to be a non empty array.
     * @attr {boolean} is-non-empty-array Iff property has to be a non empty array.
     */
    isNonEmptyArray?: boolean;

    /**
     * @prop {boolean | string | number | object} [rhs] - RHS Operand.
     * @attr {boolean | string | number | object} [rhs] - RHS Operand.  Is JSON parsed.
     */
    rhs?: boolean | string | number | object;

    /**
     * @prop {boolean} [equals] - lhs must equal rhs to pass tests.
     * @attr {boolean} [equals] - lhs must equal rhs to pass tests.
     */ 
    equals?: boolean, 

    /**
     * @prop {boolean} [disabled] - Do not evaluate expression until disabled setting is removed.
     * @attr {boolean} [disabled] - Do not evaluate expression until disabled setting is removed.
     */
    disabled?: boolean, 

    /**
     * @private
     */
    lhsLazyMt?: LazyMTProps & HTMLElement;

    /**
     * @private
     */
    rhsLazyMt?: LazyMTProps & HTMLElement;

    /**
     * @prop {number} [ownedSiblingCount] - If content is rendered by the server, the server can indicate which nodes that it rendered can be hidden / displayed by if-diff on the client.
     * @attr {number} [owned-sibling-count] - If content is rendered by the server, the server can indicate which nodes that it rendered can be hidden / displayed by if-diff on the client.
     */
    ownedSiblingCount: number;

    /**
     * @prop {string} [hiddenStyle = display:none] - Specify exact manner in which non-visible content should be hidden.
     * @attr {string} [hidden-style = display:none] - Specify exact manner in which non-visible content should be hidden.
     */
    hiddenStyle?: string;


    /**
     * @prop {string} [setAttr] - Specify name of attribute to add when conditions are satisfied / removed when not satisfied
     * @attr {string} [set-attr] - Specify name of attribute to add when conditions are satisfied / removed when not satisfied
     */
    setAttr?: string;
    /**
     * @prop {string} [setClass] - Specify name of class to add when conditions are satisfied / removed when not satisfied
     * @attr {string} [set-class] - Specify name of class to add when conditions are satisfied / removed when not satisfied
     */
    setClass?: string;

    /**
     * @prop {string} [setPart] - Specify name of part to add when conditions are satisfied / removed when not satisfied
     * @attr {string} [set-part] - Specify name of part to add when conditions are satisfied / removed when not satisfied
     */
    setPart?: string;


    /**
     * @prop {boolean} [notEquals] - lhs must not equal rhs to pass tests.
     * @attr {boolean} [not-equals] - lhs must not equal rhs to pass tests.
     */ 
    notEquals?: boolean;



    /**
     * @prop {boolean} [includes] - For strings, this means lhs.indexOf(rhs) > -1.  For arrays, this means lhs intersect rhs = rhs. For numbers, this means lhs >= rhs.  For objects, this means all the properties of rhs match the same properties of lhs
     * @attr {boolean} [includes] - For strings, this means lhs.indexOf(rhs) > -1.  For arrays, this means lhs intersect rhs = rhs. For numbers, this means lhs >= rhs.  For objects, this means all the properties of rhs match the same properties of lhs
     */
    includes?: boolean; 

    /**
     * @readonly
     * @prop {boolean} [value] - Computed based on values of  if / equals / not_equals / includes and other property values
     */
    value?: boolean;

    /**
     * @prop {number} [m] - Maximum number of elements that are effected by condition.
     * @attr {number} [m] - Maximum number of elements that are effected by condition.
     */
    m?: number;

    /**
     * @prop {boolean} [lazyDisplay] -- Only clone the template contents and add into the live DOM tree when absolutely necessary.  Experimental.
     * @attr {boolean} [lazy-display] -- Only clone the template contents and add into the live DOM tree when absolutely necessary.  Experimental.
     */
    lazyDisplay: boolean;

    lazyDelay?: number;

    /**
     * @prop {string} [andMediaMatches] - Additional condition for a media query to be added for tests to be satisfied.
     * @attr {string} [and-media-matches] - Additional condition for a media query to be added for tests to be satisfied.
     */
    mediaMatches: string;

    /**
     * @private
     */
    matchesMediaQuery: boolean;

    evaluated: boolean;

    //templ: HTMLTemplateElement;

    startingElementToWrap: Element;
    endingElementToWrap: Element;
    isC: boolean;

}

export interface IfDiffActions {
    evaluate: (self: this) => Promise<Partial<IfDiffProps>>;
    findTemplate: (self: this) => Partial<IfDiffProps>;
    wrapLazyMTsAroundOwnedSiblings: (self: this) => Partial<IfDiffProps>;
    claimOwnership: (self: this) => Partial<IfDiffProps>;
    applyConditionalDisplay: (self: this) => void;
    addStyle: (self: this) => void;
    addMutObj: (self: this) => void;
    addMediaListener: (self: this) => void;
    setMediaMatchesToTrue: (self: this) => Partial<IfDiffProps>;
    mountMTs: (self: this) => void;
}

export interface ValueDetail {
    value: any,
}
export interface ValueEvent extends CustomEvent<ValueDetail>{}

export interface IfDiffEventNameMap {
    'template-cloned': TemplateClonedDetail;
}

export interface TemplateClonedDetail {
    clonedTemplate: DocumentFragment;
}