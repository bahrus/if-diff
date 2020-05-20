import {XtallatX, define} from 'xtal-element/xtal-latx.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';
import {debounce} from 'xtal-element/debounce.js';
import {NavDown} from 'xtal-element/NavDown.js';
import {insertAdjacentTemplate} from 'trans-render/insertAdjacentTemplate.js';
import {IfDiffProps} from 'types.d.js';
import {AttributeProps} from 'xtal-element/types.d.js';

const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const data_key_name = 'data-key-name';
const equals = 'equals';
const not_equals = 'not_equals';
const enable = 'enable';
const m$ = 'm'; //TODO:  share mixin with p-d.p-u?
const byos = 'byos'; //bring your own style
type prop = keyof IfDiffProps;

const cTlRe = /[\w]([A-Z])/g;
//https://vladimir-ivanov.net/camelcase-to-snake_case-and-vice-versa-with-javascript/
export function camelToLisp(s: string){
    return s.replace(/[\w]([A-Z])/g, function(m) {
        return m[0] + "-" + m[1];
    }).toLowerCase();
}

/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends XtallatX(hydrate(HTMLElement)) implements IfDiffProps{

    static is = 'if-diff';

    static attributeProps = ({byos, lhs, rhs, equals, not_equals, disabled, enable, dataKeyName, m}: IfDiff) =>{
        const bool = ['if', byos, equals, not_equals, disabled];
        const str = [enable, dataKeyName];
        const numeric = [m];
        const object = [lhs, rhs];
        const refl = [...bool, ...str, ...numeric, ...object];
        return {
            boolean: bool,
            string: str,
            numeric: numeric,
            object: object,
            parsedObject: object,
            reflect: refl
        } as AttributeProps;
    }

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


    _debouncer!: any;
    connectedCallback(){
        this.style.display = 'none';
        this._debouncer = debounce((getNew: boolean = false) => {
            this.passDown();
        }, 16);
        super.connectedCallback();
        if(!this.byos){
            const style = document.createElement('style');
            style.innerHTML = /* css */`
                [data-${camelToLisp(this.dataKeyName)}="-1"]{
                    display: none;
                }
            `;
            const rn = this.getRootNode();
            if((<any>rn).host !== undefined){
                rn.appendChild(style);
            }else{
                document.head.appendChild(style);
            }
        }
        setTimeout(() => {
            this.init();
        }, 50);

    }
    createDefaultStyle(){}

    init(){
        this.passDown();
    }



    _navDown: NavDown | null = null;

    onPropsChange(name: string){
        super.onPropsChange(name);
        if(!this._connected || this._disabled) return;        
        this._debouncer();
        
    }
    _value = false;
    get value(){
        return this._value;
    }
    set value(nv){
        this._value = nv;
        this.de('value', {
            value: nv,
        });
    }
    loadTemplate(el: Element, dataKeyName: string){
        const tmpl = el.querySelector('template') as HTMLTemplateElement;
        if(!tmpl){
            setTimeout(() =>{
                this.loadTemplate(el, dataKeyName);
            }, 50);
            return;
        }
        const insertedElements = insertAdjacentTemplate(tmpl, el, 'afterend');
        insertedElements.forEach(child =>{
            (<HTMLElement>child).dataset[dataKeyName] = '1';
        })
        el.remove();
        //return insertedElements;
    }

    do(el: Element, ds: any, val: boolean, dataKeyName: string){
        if(ds[dataKeyName] === '0'){
            if(val){
                this.loadTemplate(el, dataKeyName);
                (<any>el).dataset[dataKeyName] = "1";
            }
        }else{
            (<any>el).dataset[dataKeyName] = val ? '1' : '-1';
        }
        if(this.enable){
            const action  = (val ? 'remove' : 'set') + 'Attribute';
            Array.from(el.querySelectorAll(this.enable)).concat(el).forEach(target => (<any>target)[action]('disabled', ''));

        }
        // if(this._propProxyMap){
        //     for(const key in this._propProxyMap){
        //         const val = (<any>this)[key];
        //         if(val === undefined) continue;
        //         const prop = (<any>this._propProxyMap)[key];
        //         (<any>el)[prop] = val;
        //     }
        // }
    }
    
    tagMatches(nd: NavDown){
        const matches = nd.matches;
        this.attr('mtch', matches.length.toString());
        const val = this.value;
        const dataKeyName = this.dataKeyName;
        matches.forEach(el =>{
            const ds = (<any>el).dataset;
            this.do(el, ds, val, dataKeyName);
        });
    }
    async passDown(){
        let val = this.if;
        if(val && (this.equals || this.not_equals)){
            let eq = false;
            if(typeof this.lhs === 'object' && typeof this.rhs === 'object'){
                const {compare} = await import('./compare.js');
                eq = compare(this.lhs, this.rhs);
            }else{
                eq = this.lhs === this.rhs;
            }
            val = this.equals ? eq : !eq;
        }
        if(this._value === val) return;
        this.value = val;
        if(this.dataKeyName){
            if(this._navDown === null){
                const tag = this.dataKeyName;
                const test = (el: Element | null) =>  (<any>el).dataset && !!(<HTMLElement>el).dataset[this.dataKeyName];
                const max = this.m ? this.m : Infinity;
                const bndTagMatches = this.tagMatches.bind(this);
                this._navDown = new NavDown(this, test, undefined, (nd) => bndTagMatches(nd), max);
                this._navDown.init();
            }else{
                this.tagMatches(this._navDown);
            }
        }

    }

    // _prop1: any | undefined;
    // get prop1(){
    //     return this._prop1;
    // }
    // set prop1(val){
    //     this._prop1 = val;
    //     this.onPropsChange();
    // }

    // _prop2: any | undefined;
    // get prop2(){
    //     return this._prop2;
    // }
    // set prop2(val){
    //     this._prop2 = val;
    //     this.onPropsChange();
    // }

    // _prop3: any | undefined;
    // get prop3(){
    //     return this._prop3;
    // }
    // set prop3(val){
    //     this._prop3 = val;
    //     this.onPropsChange();
    // }

    // _prop4: any | undefined;
    // get prop4(){
    //     return this._prop1;
    // }
    // set prop4(val){
    //     this._prop4 = val;
    //     this.onPropsChange();
    // }

    // _prop5: any | undefined;
    // get prop5(){
    //     return this._prop5;
    // }
    // set prop5(val){
    //     this._prop5 = val;
    //     this.onPropsChange();
    // }



    // _prop6: any | undefined;
    // get prop6(){
    //     return this._prop5;
    // }
    // set prop6(val){
    //     this._prop6 = val;
    //     this.passDown();
    // }

    // _prop7: any | undefined;
    // get prop7(){
    //     return this._prop7;
    // }
    // set prop7(val){
    //     this._prop7 = val;
    //     this.passDown();
    // }


    // _propProxyMap: object | undefined;
    // get propProxyMap(){
    //     return this._propProxyMap;
    // }
    // set propProxyMap(val){
    //     this._propProxyMap = val;
    //     this.onPropsChange();
    // }

    disconnect(){
        if(this._navDown)  this._navDown.disconnect();
    }


}
define(IfDiff);