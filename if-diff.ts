import {XtallatX, disabled} from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';
import {debounce} from 'xtal-latx/debounce.js';
import {filterDown} from 'xtal-latx/filterDown.js';
const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const tag = 'tag';
const equals = 'equals';
const not_equals = 'not_equals';
const m$ = 'm'; //TODO:  share mixin with p-d.p-u?

export class IfDiff extends XtallatX(HTMLElement){
    static get is(){return 'if-diff';}
    static get observedAttributes(){
        return [if$, lhs, rhs, tag, equals, not_equals, disabled, m$];
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
    _tag!: string;
    get tag(){
        return this._tag;
    }
    set tag(nv){
        this.attr(tag, nv)
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
            case tag:
            case lhs:
            case rhs:
            case m$:
                (<any>this)[u] = nv;
                break;
        }
        this.onPropsChange();
    }
    _conn: boolean = false;
    _debouncer!: any;
    init(){
        this.addMutObs();
        this.onPropsChange();
    }
    connectedCallback(){
        this.style.display = 'none';
        this._upgradeProperties(IfDiff.observedAttributes);
        this._conn = true;
        this._debouncer = debounce(() => {
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
        if(this._tag){
            let max = this._m ? this._m : Infinity;
            const tag = this._tag;
            const test = (el: Element | null) =>  (<any>el).dataset && !!(<HTMLElement>el).dataset[tag];
            const matches = filterDown(this.nextElementSibling,  test, max )
            matches.forEach(el =>{
                const ds = (<any>el).dataset;
                if(ds[tag] === '0'){
                    if(val){
                        this.loadTemplate(el);
                        (<any>el).dataset[tag] = "1";
                    }
                }else{
                    (<any>el).dataset[tag] = val ? '1' : '-1';
                }
            })

        }

    }
    //TODO:  share mixin with p-d.p-u?
    _addedSMO!: boolean; //addedSiblingMutationObserver
    addMutObs() {
        let elToObs = this.parentElement;
        if (!elToObs) return; //TODO
        this._sibObs = new MutationObserver((m: MutationRecord[]) => {
            this._debouncer();
        });
        this._sibObs.observe(elToObs, { childList: true });
    }
    disconnect(){
        if(this._sibObs)  this._sibObs.disconnect();
    }

    _sibObs!: MutationObserver;
}
define(IfDiff);