import {XE} from 'xtal-element/src/XE.js';
import {IfDiffActions, IfDiffProps} from './types';
import { LazyMTProps } from 'lazy-mt/types';
import('mut-obs/mut-obs.js');
import('lazy-mt/lazy-mt.js');

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
export class IfDiffCore extends HTMLElement implements IfDiffActions{
    async evaluate({iff, matchesMediaQuery, equals, notEquals, lhs, rhs, includes, isNonEmptyArray}: this){
        let val = false;
        switch(typeof iff){
            case 'boolean':
                val = iff;
                break;
            case 'object':
                if(isNonEmptyArray){
                    val = Array.isArray(iff) && iff.length > 0;
                }else{
                    val = !!iff;
                }
        }
        val= val && !(matchesMediaQuery === false);
        if (val) {
            if (val) {
                if (equals || notEquals) {
                    let eq = false;
                    if (typeof lhs === 'object' && typeof rhs === 'object') {
                        const { compare } = await import('./compare.js');
                        eq = compare(lhs, rhs);
                    } else {
                        eq = lhs === rhs;
                    }
                    val = equals ? eq : !eq;
                } else if (includes) {
                    const { includes } = await import('./includes.js');
                    val = includes(lhs, rhs);
                }
    
            }
    
        }
        return {
            value: val,
            evaluated: true,
        };
    }

    findTemplate({lazyDelay}: this){
        const templ = this.querySelector('template');
        if (templ === null) {
            setTimeout(() => {
                if(this.lhsLazyMt !== undefined) return;
                this.findTemplate(this);
            }, 50);
            return {};
        }
        setTimeout(() => {
            this.removeAttribute('lazy-delay');
        }, lazyDelay);
        this.insertAdjacentElement('afterend', templ);
        return {
            startingElementToWrap: templ,
            endingElementToWrap: templ,
        };
    

    }

    claimOwnership({ownedSiblingCount}: this){
        let ns = this as Element | null;
        let count = 0;
        let startingElementToWrap: Element | undefined;
        let endingElementToWrap: Element | undefined;
        while (ns !== null && count < ownedSiblingCount) {
            ns = ns.nextElementSibling;
            count++;
            if(ns !== null){
                if (count === 1) startingElementToWrap = ns;
                if (count === ownedSiblingCount) endingElementToWrap = ns;
            }

        }
        if (ns === null || count < ownedSiblingCount) {
            setTimeout(() => this.claimOwnership(this), 50);
            return {};
        }
        return {
            startingElementToWrap, endingElementToWrap
        };
    }

    wrapLazyMTsAroundOwnedSiblings({startingElementToWrap, endingElementToWrap, lazyDisplay}: this){
        const eLHS = document.createElement('lazy-mt');
        const lhsLazyMt = eLHS as LazyMTProps & HTMLElement;
        lhsLazyMt.setAttribute('enter', '');
        if(!lazyDisplay){
            lhsLazyMt.setAttribute('treat-as-visible', '');
        }
        
        startingElementToWrap.insertAdjacentElement('beforebegin', eLHS);
        const rhsLazyMt = document.createElement('lazy-mt') as LazyMTProps & HTMLElement;
        rhsLazyMt.setAttribute('exit', '');
        if(!lazyDisplay){
            rhsLazyMt.setAttribute('treat-as-visible', '');
        }
        endingElementToWrap.insertAdjacentElement('afterend', rhsLazyMt);
        return {
            lhsLazyMt,
            rhsLazyMt
        }
    }

    applyConditionalDisplay({lhsLazyMt, rhsLazyMt, value, setAttr, setPart, setClass}: this){
        let ns = lhsLazyMt! as HTMLElement;
        //TODO: mutation observer
        while (ns !== null) {
            ns.dataset.ifDiffDisplay = value!.toString();
            if (setAttr !== undefined) {
                if (value) {
                    ns.setAttribute(setAttr, '');
                } else {
                    ns.removeAttribute(setAttr);
                }
            }
            const verb = value ? 'add' : 'remove';
            const part = setPart;
            if (part !== undefined) {
                (<any>ns)[verb](part);
            }
            const className = setClass;
            if (className !== undefined) {
                ns.classList[verb](className);
            }
            if (ns === rhsLazyMt) return;
            ns = ns.nextElementSibling as HTMLElement;
        }
    }

    mountMTs({ lhsLazyMt, rhsLazyMt }: this){
        lhsLazyMt!.setAttribute('mount', '');
        rhsLazyMt!.setAttribute('mount', '');
    }
    #mediaQueryHandler = (e: MediaQueryListEvent) => {
            this.matchesMediaQuery = e.matches;
    }

    addStyle({hiddenStyle}: this){
        let rootNode = this.getRootNode();
        if ((<any>rootNode).host === undefined) {
            rootNode = document.head;
        }
        if (!styleMap.has(rootNode)) {
            styleMap.add(rootNode);
            const style = document.createElement('style');
            style.innerHTML = /* css */`
                [data-if-diff-display="false"]{
                    ${hiddenStyle}
                }
                if-diff:not([lazy-delay]){
                    display:none;
                }
            `;
            rootNode.appendChild(style);
        }
    }

    addMutObj({}: this){
        const parent = this.parentElement;
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
                this.applyConditionalDisplay(this);
            })
        }
    }

    #mql: MediaQueryList | undefined;
    addMediaListener = ({ mediaMatches}: this) => {
        this.disconnect();
        this.#mql = window.matchMedia(mediaMatches!);
        this.#mql.addEventListener('change', this.#mediaQueryHandler);
        this.matchesMediaQuery = this.#mql.matches;
    }

    setMediaMatchesToTrue = setMediaMatchesToTrue;

    disconnect() {

        // https://www.youtube.com/watch?v=YDU_3WdfkxA&list=LL&index=2
        if (this.#mql) this.#mql.removeEventListener('change', this.#mediaQueryHandler);
    }

    disconnectedCallback(){
        this.disconnect();
        //TODO remove owned siblings
    }

    configureLazyMt(lazyMT: LazyMTProps) { }
}

const setMediaMatchesToTrue = ({}: IfDiffProps) => ({matchesMediaQuery: true});

export interface IfDiffCore extends IfDiffProps{}

const styleMap = new WeakSet<Node>();
const p_d_std = 'p_d_std';
const attachedParents = new WeakSet<Element>();

const ce = new XE<IfDiffProps, IfDiffActions>({
    config:{
        tagName: 'if-diff',
        propDefaults:{
            isC: true,
            ownedSiblingCount: 0,
            evaluated: false,
            iff: false,
            matchesMediaQuery: false,
            equals: false,
            notEquals: false,
            includes: false,
            hiddenStyle: 'display:none',
            lazyDelay: 16,
            mediaMatches: '',
            isNonEmptyArray: false,
            value: false,
            debouncedValue: false,
        },
        propInfo:{
            value:{
                notify:{
                    dispatch: true,
                    echoTo: 'debouncedValue',
                    echoDelay: 'lazyDelay'
                }
            }
        },
        actions:{
            evaluate:{
                async: true,
                ifKeyIn: ['iff', 'matchesMediaQuery', 'equals', 'notEquals', 'lhs', 'rhs', 'includes']
            },
            findTemplate:{
                ifNoneOf: ['lhsLazyMt', 'ownedSiblingCount'],
                ifKeyIn: ['evaluated']
            },
            claimOwnership:{
                ifNoneOf: ['lhsLazyMt'],
                ifAllOf: ['ownedSiblingCount']
            },
            wrapLazyMTsAroundOwnedSiblings: {
                ifAllOf: ['startingElementToWrap', 'endingElementToWrap']
            },
            mountMTs:{
                ifAllOf: ['lhsLazyMt', 'rhsLazyMt', 'value', 'debouncedValue'],
            },
            applyConditionalDisplay: {
                ifAllOf: ['lhsLazyMt', 'rhsLazyMt'],
                ifKeyIn: ['value'],
            },
            addStyle:{
                ifAllOf: ['isC'],
            },
            addMutObj:{
                ifAllOf: ['lhsLazyMt', 'rhsLazyMt'],
            },
            addMediaListener:{
                ifAllOf: ['mediaMatches']
            },
            setMediaMatchesToTrue:{
                ifNoneOf: ['mediaMatches'],
            }
        }
    },
    superclass: IfDiffCore
});

export const IfDiff = ce.classDef;

declare global {
    interface HTMLElementTagNameMap {
        "if-diff": IfDiffCore,
    }
}