import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface, IReactor} from 'xtal-element/lib/XtalCore.js';
import {IfDiffProps} from './types.d.js';
import('lazy-mt/lazy-mt.js');
import {LazyMTProps} from 'lazy-mt/types.d.js';
import ('mut-obs/mut-obs.js');

const p_d_std = 'p_d_std';
const attachedParents = new WeakSet<Element>();

/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * No DOM deletion takes place on non matching elements.
 * [More Info](https://github.com/bahrus/if-diff)
 * @element if-diff
 */
export class IfDiff extends HTMLElement implements IfDiffProps, ReactiveSurface {
    static is = 'if-diff';

    self = this;
    propActions = propActions;
    reactor: IReactor = new xc.Rx(this);

    connectedCallback(){
        this.style.display = 'none';
        xc.mergeProps<Partial<IfDiffProps>>(this, slicedPropDefs, {
            hiddenStyle:'display:none'
        });
    }

    disconnectedCallback(){
        if(!this._doNotCleanUp) this.ownedRange?.deleteContents();
    }

    get ownedRange(){
        const typedThis = this as IfDiffProps;
        if(typedThis.lhsLazyMt && typedThis.rhsLazyMt){
            const range = document.createRange();
            range.setStartBefore(typedThis.lhsLazyMt);
            range.setEndAfter(typedThis.rhsLazyMt);
            return range;
        }
    }
    _doNotCleanUp = false;

    extractContents(){
        const typedThis = this as unknown as IfDiffProps;
        this._doNotCleanUp = true;
        const range = document.createRange();
        range.setStartBefore(this);
        range.setEndAfter(typedThis.rhsLazyMt ?? this);
        return range.extractContents();
    }

    get nextUnownedSibling(){
        const typedThis = this as unknown as IfDiffProps;
        if(typedThis.rhsLazyMt !== undefined){
            return typedThis.rhsLazyMt.nextElementSibling;
        }
        return this.nextElementSibling;
    }

    onPropChange(n: string, propDef: PropDef, newVal: any){
        this.reactor.addToQueue(propDef, newVal);
    }






    addStyle(self: IfDiffProps){
        let rootNode = self.getRootNode();
        if((<any>rootNode).host === undefined){
            rootNode = document.head;
        }
        if(!styleMap.has(rootNode)){
            styleMap.add(rootNode);
            const style = document.createElement('style');
            style.innerHTML = /* css */`
                [data-if-diff-display="false"]{
                    ${self.hiddenStyle}
                }
            `;
            rootNode.appendChild(style);      
        }
    }

    configureLazyMt(lazyMT: LazyMTProps){}

}

const styleMap = new WeakSet<Node>();


const linkValue = ({iff, lhs, equals, rhs, notEquals, includes, disabled, self}: IfDiffProps) => {
    if(disabled) return;
    evaluate(self);
}

async function evaluate(self: IfDiffProps){
    let val = self.iff;
    if(val){
        if(self.isNonEmptyArray){
            if(!Array.isArray(val) || val.length === 0){
                val = false;
            }
        }
        if(val){
            if(self.equals || self.notEquals){
                let eq = false;
                if(typeof self.lhs === 'object' && typeof self.rhs === 'object'){
                    const {compare} = await import('./compare.js');
                    eq = compare(self.lhs, self.rhs);
                }else{
                    eq = self.lhs === self.rhs;
                }
                val = self.equals ? eq : !eq;
            }else if(self.includes){
                const {includes} = await import('./includes.js');
                val = includes(self.lhs, self.rhs);
            }
        }

    }
    if(val !== self.value){
        (<any>self)[slicedPropDefs!.propLookup!.value!.alias!] = val;
    }
    findTemplate(self);
}

function findTemplate(self: IfDiffProps){
    if(self.lhsLazyMt !== undefined) return;
    if(self.ownedSiblingCount === undefined){
        const templ = self.querySelector('template');
        if(templ === null){
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        createLazyMts(self, templ);
    }else{
        let ns = self as Element | null;
        let count = 0;
        let lhsElement : Element | undefined;
        while(ns!==null && count < self.ownedSiblingCount){
            ns = ns.nextElementSibling;
            count++;
            if(count === 1 && ns!== null) lhsElement = ns;
        }
        if(ns === null || count < self.ownedSiblingCount){
            setTimeout(() => findTemplate(self), 50);
            return;
        }
        wrapLazyMts(self, lhsElement!, ns);
    }

}

function wrapLazyMts(self: IfDiffProps, lhsElement: Element, rhsElement: Element){
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    lhsLazyMt.enter = true;
    self.configureLazyMt(lhsLazyMt);
    lhsElement.insertAdjacentElement('beforebegin', lhsLazyMt);
    const rhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    rhsLazyMt.exit = true;
    self.configureLazyMt(rhsLazyMt);
    rhsElement.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}


function createLazyMts(self: IfDiffProps, templ: HTMLTemplateElement){
    self.addStyle(self);
    const lhsLazyMt = document.createElement('lazy-mt') as LazyMTProps;
    const eLHS = lhsLazyMt as Element;
    lhsLazyMt.setAttribute('enter', '');
    self.insertAdjacentElement('afterend', lhsLazyMt as Element);
    eLHS.insertAdjacentElement('afterend', templ);
    const rhsLazyMt = document.createElement('lazy-mt') as any;
    rhsLazyMt.setAttribute('exit', '');
    templ.insertAdjacentElement('afterend', rhsLazyMt);
    self.lhsLazyMt = lhsLazyMt;
    self.rhsLazyMt = rhsLazyMt;
    addMutObj(self);
}

function addMutObj(self: IfDiffProps){
    const parent = self.parentElement;
    if(parent !== null){
        if(!attachedParents.has(parent)){
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
            changeDisplay(self, self.lhsLazyMt!, self.rhsLazyMt!, !!self.value);
        })
    }    
}

const toggleMt = ({value, lhsLazyMt, rhsLazyMt, self}: IfDiffProps) => {
    if(value){
        lhsLazyMt!.setAttribute('mount', '');
        rhsLazyMt!.setAttribute('mount', '');
        changeDisplay(self, lhsLazyMt!, rhsLazyMt!, true);
        
    }else{
        changeDisplay(self, lhsLazyMt!, rhsLazyMt!, false);
    }
}

function changeDisplay(self: IfDiffProps, lhsLazyMt: Element, rhsLazyMt: Element, display: boolean){
    let ns = lhsLazyMt as HTMLElement;
    //TODO: mutation observer
    while(ns !== null){
        ns.dataset.ifDiffDisplay = display.toString();
        const attr = self.setAttr;
        if(attr !== undefined){
            if(display) {
                ns.setAttribute(attr, '');
            }else{
                ns.removeAttribute(attr);
            }
        }
        const verb = display ? 'add' : 'remove';
        const part = self.setPart;
        if(part !== undefined){
            (<any>ns)[verb](part);
        }
        const className = self.setClass;
        if(className !== undefined){
            ns.classList[verb](className);
        }
        if(ns === rhsLazyMt) return;
        ns = ns.nextElementSibling as HTMLElement;
    }
}



const propActions = [
    linkValue, toggleMt
] as PropAction[];

const baseProp: PropDef = {
    dry: true,
    async: true,
};

const bool1: PropDef = {
    ...baseProp,
    type: Boolean,
};

const str1: PropDef = {
    ...baseProp,
    type: String,
};
const obj1: PropDef = {
    ...baseProp,
    type: Object,
    parse: true,
};
const obj2: PropDef = {
    ...baseProp,
    type: Object,
    notify: true,
    obfuscate: true
};
const obj3: PropDef = {
    ...baseProp,
    type: Object,
    stopReactionsIfFalsy: true,
};
const num1: PropDef = {
    ...baseProp,
    type: Number,
};
const sync: PropDef = {
    ...baseProp,
    type: Object,
    syncProps: true,
};
const propDefMap: PropDefMap<IfDiffProps> = {
    iff: bool1, equals: bool1, notEquals: bool1, disabled: bool1,
    isNonEmptyArray: bool1,
    lhs: obj1, rhs: obj1, value: obj2, lhsLazyMt: obj3, rhsLazyMt: obj3,
    ownedSiblingCount: num1, setAttr: str1, setClass: str1, setPart: str1,
    hiddenStyle: str1,
    syncPropsFromServer: sync,
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(IfDiff, slicedPropDefs, 'onPropChange');
xc.define(IfDiff);

declare global {
    interface HTMLElementTagNameMap {
        "if-diff": IfDiff,
    }
}