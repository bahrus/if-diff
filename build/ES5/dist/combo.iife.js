//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var debounce = function debounce(fn, time) {
    var timeout;
    return function () {
      var _this = this,
          _arguments = arguments;

      var functionCall = function functionCall() {
        return fn.apply(_this, _arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this2;

          babelHelpers.classCallCheck(this, _class);
          _this2 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this2._evCount = {};
          return _this2;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
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

        }, {
          key: "de",
          value: function de(name, detail, asIs) {
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this3 = this;

            props.forEach(function (prop) {
              if (_this3.hasOwnProperty(prop)) {
                var value = _this3[prop];
                delete _this3[prop];
                _this3[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  var NavDown =
  /*#__PURE__*/
  function () {
    function NavDown(seed, match, notify, max) {
      var ignore = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var mutDebounce = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 50;
      babelHelpers.classCallCheck(this, NavDown);
      this.seed = seed;
      this.match = match;
      this.notify = notify;
      this.max = max;
      this.ignore = ignore;
      this.mutDebounce = mutDebounce; //this.init();
    }

    babelHelpers.createClass(NavDown, [{
      key: "init",
      value: function init() {
        var _this4 = this;

        this._debouncer = debounce(function () {
          _this4.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
      }
    }, {
      key: "addMutObs",
      value: function addMutObs(elToObs) {
        var _this5 = this;

        if (elToObs === null) return;
        this._mutObs = new MutationObserver(function (m) {
          _this5._debouncer(true);
        });

        this._mutObs.observe(elToObs, {
          childList: true
        }); // (<any>elToObs)._addedMutObs = true;

      }
    }, {
      key: "sibCheck",
      value: function sibCheck(sib, c) {}
    }, {
      key: "sync",
      value: function sync() {
        var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var isF = typeof this.match === 'function';
        this.matches = [];
        var ns = this.seed.nextElementSibling;

        while (ns !== null) {
          if (this.ignore === null || !ns.matches(this.ignore)) {
            var isG = isF ? this.match(ns) : ns.matches(this.match);

            if (isG) {
              this.matches.push(ns);
              c++;

              if (c >= this.max) {
                this.notify(this);
                return;
              }

              ;
            }

            this.sibCheck(ns, c);
          }

          ns = ns.nextElementSibling;
        }

        this.notify(this);
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        this._mutObs.disconnect();
      }
    }]);
    return NavDown;
  }();

  var on = 'on';
  var noblock = 'noblock';
  var iff = 'if';
  var to = 'to';
  var prop = 'prop';
  var val = 'val';

  var P =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(P, _XtallatX);

    function P() {
      var _this6;

      babelHelpers.classCallCheck(this, P);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(P).call(this));
      _this6._lastEvent = null;
      return _this6;
    }

    babelHelpers.createClass(P, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        var f = '_' + name;

        switch (name) {
          case iff:
          case on:
          case prop:
          case val:
          case to:
            this[f] = newVal;
            break;

          case noblock:
            this[f] = newVal !== null;
            break;
        }

        babelHelpers.get(babelHelpers.getPrototypeOf(P.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      }
      /**
       * get previous sibling
       */

    }, {
      key: "getPreviousSib",
      value: function getPreviousSib() {
        var pS = this;

        while (pS && pS.tagName.startsWith('P-')) {
          pS = pS.previousElementSibling;
        }

        return pS;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'none';

        this._upgradeProperties([on, to, noblock, iff, prop, val]);

        this.init();
      }
    }, {
      key: "init",
      value: function init() {
        this.attchEvListnrs();
        this.doFake();
      }
    }, {
      key: "attchEvListnrs",
      value: function attchEvListnrs() {
        var attrFilters = [];
        var pS = this.getPreviousSib();
        if (!pS) return;

        if (this._bndHndlEv) {
          return;
        } else {
          this._bndHndlEv = this._hndEv.bind(this);
        }

        pS.addEventListener(this._on, this._bndHndlEv);
        var da = pS.getAttribute('disabled');

        if (da !== null) {
          if (da.length === 0 || da === "1") {
            pS.removeAttribute('disabled');
          } else {
            pS.setAttribute('disabled', (parseInt(da) - 1).toString());
          }
        }
      }
    }, {
      key: "skI",
      value: function skI() {
        return this.hasAttribute('skip-init');
      }
    }, {
      key: "doFake",
      value: function doFake() {
        if (!this._if && !this.skI()) {
          var lastEvent = this._lastEvent;

          if (!lastEvent) {
            lastEvent = {
              target: this.getPreviousSib(),
              isFake: true
            };
          }

          if (this._hndEv) this._hndEv(lastEvent);
        }
      }
    }, {
      key: "_hndEv",
      value: function _hndEv(e) {
        if (this.hasAttribute('debug')) debugger;
        if (!e) return;
        if (e.stopPropagation && !this._noblock) e.stopPropagation();
        if (this._if && !e.target.matches(this._if)) return;
        this._lastEvent = e;
        this.pass(e);
      }
    }, {
      key: "setVal",
      value: function setVal(e, target) {
        var gpfp = this.getPropFromPath.bind(this);
        var propFromEvent = this.val ? gpfp(e, this.val) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, propFromEvent);
      }
    }, {
      key: "commit",
      value: function commit(target, val) {
        if (val === undefined) return;
        target[this.prop] = val;
      }
    }, {
      key: "getPropFromPath",
      value: function getPropFromPath(val, path) {
        if (!path || path === '.') return val;
        return this.getProp(val, path.split('.'));
      }
    }, {
      key: "getProp",
      value: function getProp(val, pathTokens) {
        var context = val;
        var firstToken = true;
        var cp = 'composedPath';
        var cp_ = cp + '_';
        pathTokens.forEach(function (token) {
          if (context) {
            if (firstToken && context[cp]) {
              firstToken = false;
              var cpath = token.split(cp_);

              if (cpath.length === 1) {
                context = context[cpath[0]];
              } else {
                context = context[cp]()[parseInt(cpath[1])];
              }
            } else {
              context = context[token];
            }
          }
        });
        return context;
      }
    }, {
      key: "detach",
      value: function detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var pS = this.getPreviousSib();
        if (pS && this._bndHndlEv) this.detach(pS);
      }
    }, {
      key: "on",
      get: function get() {
        return this._on;
      },
      set: function set(val) {
        this.attr(on, val);
      }
    }, {
      key: "to",
      get: function get() {
        return this._to;
      },
      set: function set(val) {
        this.attr(to, val);
      }
    }, {
      key: "noblock",
      get: function get() {
        return this._noblock;
      },
      set: function set(val) {
        this.attr(noblock, val, '');
      }
    }, {
      key: "if",
      get: function get() {
        return this._if;
      },
      set: function set(val) {
        this.attr(iff, val);
      }
    }, {
      key: "prop",
      get: function get() {
        return this._prop;
      },
      set: function set(val) {
        this.attr(prop, val);
      }
    }, {
      key: "val",
      get: function get() {
        return this._val;
      },
      set: function set(val) {
        this.attr(prop, val);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff, prop, val]);
      }
    }]);
    return P;
  }(XtallatX(HTMLElement));

  var m = 'm';
  /**
   * `p-d`
   *  Pass data from one element down the DOM tree to other elements
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var PD =
  /*#__PURE__*/
  function (_P) {
    babelHelpers.inherits(PD, _P);

    function PD() {
      var _this7;

      babelHelpers.classCallCheck(this, PD);
      _this7 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
      _this7._pdNavDown = null; //_hasMax!: boolean;

      _this7._m = Infinity;
      _this7._iIP = false;
      return _this7;
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        this._lastEvent = e;
        this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

        var count = this.applyProps(this._pdNavDown);
        this.attr('pds', '👂');
        this.attr('mtch', count.toString());
      }
    }, {
      key: "getMatches",
      value: function getMatches(pd) {
        return pd.matches;
      }
    }, {
      key: "applyProps",
      value: function applyProps(pd) {
        var _this8 = this;

        //if(this._iIP && this.skI()) return;
        if (this._iIP) return 0;
        var matches = this.getMatches(pd); //const matches = pd.getMatches();

        matches.forEach(function (el) {
          _this8.setVal(_this8._lastEvent, el);
        });
        return matches.length;
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
          case m:
            if (newVal !== null) {
              this._m = parseInt(newVal);
            } else {}

        }

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      }
    }, {
      key: "newNavDown",
      value: function newNavDown() {
        var bndApply = this.applyProps.bind(this);
        return new NavDown(this, this.to, bndApply, this.m);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._upgradeProperties([m]);

        this.attr('pds', '📞');

        if (!this.to) {
          //apply to next only
          this.to = '*';
          this.m = 1;
        }

        var pdnd = this.newNavDown(); //const pdnd = new PDNavDown(this, this.to, nd => bndApply(nd), this.m);
        //pdnd.root = this;

        pdnd.ignore = 'p-d,p-d-x,p-d-r,script';
        this._iIP = true;
        pdnd.init();
        this._iIP = false;
        this._pdNavDown = pdnd;
        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);
      }
    }, {
      key: "m",
      get: function get() {
        return this._m;
      },
      set: function set(val) {
        this.attr(m, val.toString());
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-d';
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(PD), "observedAttributes", this).concat([m]);
      }
    }]);
    return PD;
  }(P);

  define(PD);
  var if$ = 'if';
  var lhs = 'lhs';
  var rhs = 'rhs';
  var tag = 'tag';
  var equals = 'equals';
  var not_equals = 'not_equals';
  var m$ = 'm'; //TODO:  share mixin with p-d.p-u?

  var IfDiff =
  /*#__PURE__*/
  function (_XtallatX2) {
    babelHelpers.inherits(IfDiff, _XtallatX2);

    function IfDiff() {
      var _this9;

      babelHelpers.classCallCheck(this, IfDiff);
      _this9 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(IfDiff).apply(this, arguments));
      _this9._conn = false;
      _this9._navDown = null;
      return _this9;
    }

    babelHelpers.createClass(IfDiff, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(n, ov, nv) {
        babelHelpers.get(babelHelpers.getPrototypeOf(IfDiff.prototype), "attributeChangedCallback", this).call(this, n, ov, nv);
        var u = '_' + n;

        switch (n) {
          case equals:
          case not_equals:
          case if$:
            this[u] = nv !== null;
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
    }, {
      key: "init",
      value: function init() {
        //this.addMutObs();
        this.passDown();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this10 = this;

        this.style.display = 'none';

        this._upgradeProperties(IfDiff.observedAttributes);

        this._conn = true;
        this._debouncer = debounce(function () {
          var getNew = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          _this10.passDown();
        }, 16);
        setTimeout(function () {
          _this10.init();
        }, 50);
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        if (!this._conn || this._disabled) return;

        this._debouncer();
      }
    }, {
      key: "loadTemplate",
      value: function loadTemplate(el) {
        var _this11 = this;

        var tmpl = el.querySelector('template');

        if (!tmpl) {
          setTimeout(function () {
            _this11.loadTemplate(el);
          }, 50);
          return;
        }

        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
      } //_lastMatches: Element[] | null = null;

    }, {
      key: "tagMatches",
      value: function tagMatches(nd) {
        var _this12 = this;

        var matches = nd.matches;
        var val = this.value;
        var t = this._tag;
        matches.forEach(function (el) {
          var ds = el.dataset;

          if (ds[t] === '0') {
            if (val) {
              _this12.loadTemplate(el);

              el.dataset[t] = "1";
            }
          } else {
            el.dataset[t] = val ? '1' : '-1';
          }
        });
      }
    }, {
      key: "passDown",
      value: function passDown() {
        var _this13 = this;

        var val = this._if;

        if (val && (this._equals || this._not_equals)) {
          if (this._equals) {
            val = this._lhs === this._rhs;
          } else {
            val = this._lhs !== this._rhs;
          }
        }

        this.value = val;
        this.de('value', {
          value: val
        });

        if (this._tag) {
          if (this._navDown === null) {
            var _tag = this._tag;

            var test = function test(el) {
              return el.dataset && !!el.dataset[_this13._tag];
            };

            var max = this._m ? this._m : Infinity;
            var bndTagMatches = this.tagMatches.bind(this);
            this._navDown = new NavDown(this, test, function (nd) {
              return bndTagMatches(nd);
            }, max);

            this._navDown.init();
          } else {
            this.tagMatches(this._navDown);
          }
        }
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        if (this._navDown) this._navDown.disconnect();
      }
    }, {
      key: "if",
      get: function get() {
        return this._if;
      },
      set: function set(nv) {
        this.attr(if$, !!nv, '');
      }
    }, {
      key: "lhs",
      get: function get() {
        return this._lhs;
      },
      set: function set(nv) {
        this.attr(lhs, nv.toString());
      }
    }, {
      key: "rhs",
      get: function get() {
        return this._rhs;
      },
      set: function set(nv) {
        this.attr(rhs, nv.toString());
      }
    }, {
      key: "equals",
      get: function get() {
        return this._equals;
      },
      set: function set(nv) {
        this.attr(equals, nv, '');
      }
    }, {
      key: "not_equals",
      get: function get() {
        return this._not_equals;
      },
      set: function set(nv) {
        this.attr(not_equals, nv, '');
      }
    }, {
      key: "tag",
      get: function get() {
        return this._tag;
      },
      set: function set(nv) {
        this.attr(tag, nv);
      }
    }, {
      key: "m",
      get: function get() {
        return this._m;
      },
      set: function set(v) {
        this.attr(m$, v.toString());
      }
    }], [{
      key: "is",
      get: function get() {
        return 'if-diff';
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        return [if$, lhs, rhs, tag, equals, not_equals, disabled, m$];
      }
    }]);
    return IfDiff;
  }(XtallatX(HTMLElement));

  define(IfDiff);
})();