
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
const if$ = 'if';
const lhs = 'lhs';
const rhs = 'rhs';
const tag = 'tag';
const equals = 'equals';
const not_equals = 'not_equals';
const m$ = 'm'; //TODO:  share mixin with p-d.p-u?
class IfDiff extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._conn = false;
    }
    static get is() { return 'if-diff'; }
    static get observedAttributes() {
        return [if$, lhs, rhs, tag, equals, not_equals, disabled, m$];
    }
    get if() {
        return this._if;
    }
    set if(nv) {
        this.attr(if$, !!nv, '');
    }
    get lhs() {
        return this._lhs;
    }
    set lhs(nv) {
        this.attr(lhs, nv.toString());
    }
    get rhs() {
        return this._rhs;
    }
    set rhs(nv) {
        this.attr(rhs, nv.toString());
    }
    get equals() {
        return this._equals;
    }
    set equals(nv) {
        this.attr(equals, nv, '');
    }
    get not_equals() {
        return this._not_equals;
    }
    set not_equals(nv) {
        this.attr(not_equals, nv, '');
    }
    get tag() {
        return this._tag;
    }
    set tag(nv) {
        this.attr(tag, nv);
    }
    get m() {
        return this._m;
    }
    set m(v) {
        this.attr(m$, v.toString());
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        const u = '_' + n;
        switch (n) {
            case equals:
            case not_equals:
            case if$:
                this[u] = (nv !== null);
                break;
            case tag:
            case lhs:
            case rhs:
            case m$:
                this[u] = nv;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(IfDiff.observedAttributes);
        this._conn = true;
        this._debouncer = debounce(() => {
            this.passDown();
        }, 16);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._conn || this._disabled)
            return;
        this.addMutObs(); //TODO:  let breathe;
        this._debouncer();
    }
    loadTemplate(el) {
        const tmpl = el.querySelector('template');
        if (!tmpl) {
            setTimeout(() => {
                this.loadTemplate(el);
            }, 50);
            return;
        }
        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
    }
    passDown() {
        let val = this._if;
        if (val && (this._equals || this._not_equals)) {
            if (this._equals) {
                val = (this._lhs === this._rhs);
            }
            else {
                val = (this._lhs !== this._rhs);
            }
        }
        this.value = val;
        this.de('value', {
            value: val
        });
        if (this._tag) {
            let max = this._m ? this._m : Infinity;
            let c = 0;
            let ns = this.nextElementSibling;
            while (ns) {
                const ds = ns.dataset[this._tag];
                if (ds) {
                    c++;
                    if (ds === '0') {
                        if (val) {
                            this.loadTemplate(ns);
                            ns.dataset[this._tag] = "1";
                        }
                    }
                    else {
                        ns.dataset[this._tag] = val ? '1' : '-1';
                    }
                }
                if (c > max)
                    break;
                ns = ns.nextElementSibling;
            }
        }
    }
    addMutObs() {
        let elToObs = this.parentElement;
        if (!elToObs)
            return; //TODO
        this._sibObs = new MutationObserver((m) => {
            this._debouncer();
        });
        this._sibObs.observe(elToObs, { childList: true });
    }
    disconnect() {
        if (this._sibObs)
            this._sibObs.disconnect();
    }
}
define(IfDiff);
    })();  
        