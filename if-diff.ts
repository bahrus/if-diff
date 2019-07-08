import {XtallatX} from 'xtal-element/xtal-latx.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';
import {define} from 'trans-render/define.js';
import {debounce} from 'xtal-element/debounce.js';
import {NavDown} from 'xtal-element/NavDown.js'
const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const data_key_name = 'data-key-name';
const equals = 'equals';
const not_equals = 'not_equals';
const enable = 'enable';
const m$ = 'm'; //TODO:  share mixin with p-d.p-u?

export class IfDiff extends XtallatX(hydrate(HTMLElement)){
    static get is(){return 'if-diff';}
    static get observedAttributes(){
        return [if$, lhs, rhs, data_key_name, equals, not_equals, disabled, enable, m$];
    }
    _if!: boolean;
    get if(){
        return this._if;
    }
    set if(nv){
        this.attr(if$, !!nv, '');
    }
    _lhs!: string;
    get lhs(){
        return this._lhs;
    }
    set lhs(nv){
        this.attr(lhs, nv.toString())
    }
    _rhs!: string;
    get rhs(){
        return this._rhs;
    }
    set rhs(nv){
        this.attr(rhs, nv.toString())
    }
    _equals!: boolean;
    get equals(){
        return this._equals;
    }
    set equals(nv){
        this.attr(equals, nv, '');
    }
    _not_equals!: boolean;
    get not_equals(){
        return this._not_equals;
    }
    set not_equals(nv){
        this.attr(not_equals, nv, '');
    }
    _enable!: string;
    get enable(){
        return this._enable;
    }
    set enable(nv){
        this.attr(enable, nv);
    }
    _dataKeyName!: string;
    get dataKeyName(){
        return this._dataKeyName;
    }
    set dataKeyName(nv){
        this.attr(data_key_name, nv)
    }
    _m!: number;
    get m(){
        return this._m;
    }
    set m(v){
        this.attr(m$, v.toString());
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        super.attributeChangedCallback(n, ov, nv);
        const u = '_' + n;
        switch(n){
            case equals:
            case not_equals:
            case if$:
                (<any>this)[u] = (nv !== null);
                break;
            
            case lhs:
            case rhs:
            case m$:
                (<any>this)[u] = nv;
                break;
            case data_key_name:
                this._dataKeyName = nv;
                break;
            
        }
        this.onPropsChange();
    }
    _conn: boolean = false;
    _debouncer!: any;
    _navDown: NavDown | null = null;
    init(){
        //this.addMutObs();
        this.passDown();
    }
    connectedCallback(){
        this.style.display = 'none';
        this.propUp(IfDiff.observedAttributes);
        this._conn = true;
        this._debouncer = debounce((getNew: boolean = false) => {
            this.passDown();
        }, 16);
        setTimeout(() => {
            this.init();
        }, 50);

    }
    onPropsChange(){
        if(!this._conn || this._disabled) return;        
        this._debouncer();
    }
    value!: boolean;
    loadTemplate(el: Element){
        const tmpl = el.querySelector('template') as HTMLTemplateElement;
        if(!tmpl){
            setTimeout(() =>{
                this.loadTemplate(el);
            }, 50);
            return;
        }
        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
    }
    
    //_lastMatches: Element[] | null = null;
    tagMatches(nd: NavDown){
        const matches = nd.matches;
        const val = this.value;
        const dataKeyName = this._dataKeyName;
        matches.forEach(el =>{
            const ds = (<any>el).dataset;
            if(ds[dataKeyName] === '0'){
                if(val){
                    this.loadTemplate(el);
                    (<any>el).dataset[dataKeyName] = "1";
                }
            }else{
                (<any>el).dataset[dataKeyName] = val ? '1' : '-1';
            }
            if(this._enable){
                const action  = (val ? 'remove' : 'set') + 'Attribute';
                el.querySelectorAll(this._enable).forEach(child => (<any>child)[action]('disabled', ''));
            }
        });
    }

    passDown(){
        let val = this._if;
        if(val && (this._equals || this._not_equals)){
            if(this._equals){
                val = (this._lhs === this._rhs);
            }else{
                val = (this._lhs !== this._rhs);
            }
        }
        this.value = val;
        this.de('value', {
            value: val
        });
        if(this._dataKeyName){
            if(this._navDown === null){
                const tag = this._dataKeyName;
                const test = (el: Element | null) =>  (<any>el).dataset && !!(<HTMLElement>el).dataset[this._dataKeyName];
                const max = this._m ? this._m : Infinity;
                const bndTagMatches = this.tagMatches.bind(this);
                this._navDown = new NavDown(this, test, (nd) => bndTagMatches(nd), max);
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