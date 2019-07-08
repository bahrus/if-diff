import {IfDiff} from './if-diff.js';

import {define} from 'trans-render/define.js';
const templKey = Symbol('cache');


export class IfDiffThenStiff extends IfDiff{
    static get is(){return 'if-diff-then-stiff';}

    loadTemplate(el: Element){
        let tmpl  = (<any>el)[templKey] as HTMLTemplateElement | undefined | null;
        if(tmpl === undefined){
            tmpl = el.querySelector('template') as HTMLTemplateElement;
            if(tmpl === null){
                setTimeout(() =>{
                    this.loadTemplate(el);
                }, 50);
                return;
            }else{
                (<any>el)[templKey] = tmpl;
                tmpl.remove();
            }
        }
        //el.innerHTML = '';
        el.appendChild(tmpl!.content.cloneNode(true));
    }

    do(el: Element, ds: any, val: boolean, dataKeyName: string){
        if(ds[dataKeyName] === '0'){
            if(val){
                this.loadTemplate(el);
                (<any>el).dataset[dataKeyName] = "1";
            }
        }else{
            if(!val){
                el.innerHTML = '';
                (<any>el).dataset[dataKeyName] = "0";
            }
             
        }
        if(this._enable){
            const action  = (val ? 'remove' : 'set') + 'Attribute';
            el.querySelectorAll(this._enable).forEach(child => (<any>child)[action]('disabled', ''));
        }
    }
}

define(IfDiffThenStiff);