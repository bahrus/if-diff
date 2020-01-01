import {IfDiff} from './if-diff.js';
import {insertAdjacentTemplate} from 'trans-render/insertAdjacentTemplate.js';
import {define} from 'trans-render/define.js';
const templKey = Symbol('cache');

/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * DOM deletion takes place on non matching elements.
 * @element if-diff-then-stiff
 */
export class IfDiffThenStiff extends IfDiff{
    static get is(){return 'if-diff-then-stiff';}



    loadTemplate(el: Element, dataKeyName: string){
        let tmpl  = (<any>el)[templKey] as HTMLTemplateElement | undefined | null;
        if(tmpl === undefined){
            tmpl = el.querySelector('template') as HTMLTemplateElement;
            if(tmpl === null){
                setTimeout(() =>{
                    this.loadTemplate(el, dataKeyName);
                }, 50);
                return;
            }
            (<any>el)[templKey] = tmpl;
        }
        if(tmpl !== undefined && tmpl !== null){
            const insertedElements = insertAdjacentTemplate(tmpl, el, 'afterend');
            insertedElements.forEach(child =>{
                (<HTMLElement>child).dataset[dataKeyName] = '1';
            });
            (el as HTMLElement).style.display = 'none';
            el.innerHTML = '';
        }


    }

    do(el: Element, ds: any, val: boolean, dataKeyName: string){
        let skipEnable = false;
        if(ds[dataKeyName] === '0'){
            if(val){
                this.loadTemplate(el, dataKeyName);
                (<any>el).dataset[dataKeyName] = "1";
            }
        }else{
            if(!val){
                if((<any>el)[templKey]!==undefined){
                    (<any>el).dataset[dataKeyName] = "0";
                }else{
                    el.remove();
                }
                skipEnable = true;
            }
             
        }
        if(this._enable && !skipEnable){
            const action  = (val ? 'remove' : 'set') + 'Attribute';
            el.querySelectorAll(this._enable).forEach(child => (<any>child)[action]('disabled', ''));
        }
    }
}

define(IfDiffThenStiff);