import {XtallatX, define, camelToLisp} from 'xtal-element/xtal-latx.js';
import {PropAction} from 'xtal-element/types.d.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';
import {debounce} from 'xtal-element/debounce.js';
import {NavDown} from 'xtal-element/NavDown.js';
import {insertAdjacentTemplate} from 'trans-render/insertAdjacentTemplate.js';
import {IfDiffProps} from 'types.d.js';
import {AttributeProps} from 'xtal-element/types.d.js';


/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends XtallatX(hydrate(HTMLElement)) implements IfDiffProps{

    static is = 'if-diff';

    static attributeProps = ({byos, lhs, rhs, equals, not_equals, disabled, enable, dataKeyName, m, value}: IfDiff) =>{
        const bool = ['if', byos, equals, not_equals, disabled];
        const str = [enable, dataKeyName];
        const num = [m];
        const obj = [lhs, rhs];
        const reflect = [...bool, ...str, ...num, ...obj];
        return {
            bool,
            str,
            num,
            obj,
            jsonProp: obj,
            reflect,
            notify: [value]
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

    _debouncer!: any;

    connectedCallback(){
        this.style.display = 'none';
        this._debouncer = debounce((getNew: boolean = false) => {
            this.evaluateAndPassDown();
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
        this.evaluateAndPassDown();
    }

    propActions = [
        ({lhs, equals, rhs, not_equals, includes, disabled}: IfDiff) =>{
            this._debouncer();
        }
    ] as PropAction[];

    _navDown: NavDown | null = null;

    onPropsChange(name: string){
        super.onPropsChange(name);
        if(name === 'if' && this._debouncer !== undefined) this._debouncer();
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
    async evaluateAndPassDown(){
        if (this._disabled) {
            return;
        }
        let val = this.if;
        if(val){
            if(this.equals || this.not_equals){
                let eq = false;
                if(typeof this.lhs === 'object' && typeof this.rhs === 'object'){
                    const {compare} = await import('./compare.js');
                    eq = compare(this.lhs, this.rhs);
                }else{
                    eq = this.lhs === this.rhs;
                }
                val = this.equals ? eq : !eq;
            }else if(this.includes){
                const {includes} = await import('./includes.js');
                val = includes(this.lhs, this.rhs);
            }
        }
        if(this.value === val) return;
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


    disconnect(){
        if(this._navDown)  this._navDown.disconnect();
    }


}
define(IfDiff);