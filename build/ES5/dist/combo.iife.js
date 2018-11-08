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
      var mutDebounce = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 50;
      babelHelpers.classCallCheck(this, NavDown);
      this.seed = seed;
      this.match = match;
      this.notify = notify;
      this.max = max;
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

  var p_d_if = 'p-d-if';

  var PDNavDown =
  /*#__PURE__*/
  function (_NavDown) {
    babelHelpers.inherits(PDNavDown, _NavDown);

    function PDNavDown() {
      var _this6;

      babelHelpers.classCallCheck(this, PDNavDown);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDNavDown).apply(this, arguments));
      _this6.children = [];
      return _this6;
    }

    babelHelpers.createClass(PDNavDown, [{
      key: "sibCheck",
      value: function sibCheck(sib, c) {
        if (sib.__aMO) return;
        var attr = sib.getAttribute(p_d_if);

        if (attr === null) {
          sib.__aMO = true;
          return;
        }

        var fec = sib.firstElementChild;
        if (fec === null) return;

        if (this.root.matches(attr)) {
          var pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
          pdnd.root = this.root;
          this.children.push(pdnd);
          pdnd.init();
          sib.__aMO = true;
        }
      }
    }, {
      key: "getMatches",
      value: function getMatches() {
        var ret = this.matches;
        this.children.forEach(function (child) {
          ret = ret.concat(child.getMatches());
        });
        return ret;
      }
    }]);
    return PDNavDown;
  }(NavDown);

  var on = 'on';
  var noblock = 'noblock';
  var iff = 'if';
  var to = 'to';

  var P =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(P, _XtallatX);

    function P() {
      var _this7;

      babelHelpers.classCallCheck(this, P);
      _this7 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(P).call(this));
      _this7._connected = false;
      return _this7;
    }

    babelHelpers.createClass(P, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        var f = '_' + name;

        switch (name) {
          case iff:
          case on:
            this[f] = newVal;
            break;

          case to:
            this._destIsNA = newVal === '{NA}';
            if (newVal.endsWith('}')) newVal += ';';
            this._to = newVal;
            this.parseTo();
            if (this._lastEvent) this._hndEv(this._lastEvent);
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
      key: "getPSib",
      value: function getPSib() {
        var pS = this;

        while (pS && pS.tagName.startsWith('P-')) {
          pS = pS.previousElementSibling;
        }

        return pS;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this8 = this;

        this.style.display = 'none';

        this._upgradeProperties([on, to, noblock, iff]);

        setTimeout(function () {
          return _this8.doFake();
        }, 50);
      } //_addedSMO = false;

    }, {
      key: "doFake",
      value: function doFake() {
        if (!this._if && !this.hasAttribute('skip-init')) {
          var lastEvent = this._lastEvent;

          if (!lastEvent) {
            lastEvent = {
              target: this.getPSib(),
              isFake: true
            };
          }

          if (this._hndEv) this._hndEv(lastEvent);
        } // if(!(<any>this)._addedSMO && (<any>this).addMutationObserver){
        //     (<any>this).addMutationObserver(<any>this as HTMLElement, false);
        //     this._addedSMO = true;
        // }

      }
    }, {
      key: "detach",
      value: function detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var pS = this.getPSib();
        if (pS && this._bndHndlEv) this.detach(pS);
      }
    }, {
      key: "_hndEv",
      value: function _hndEv(e) {
        if (this.hasAttribute('debug')) debugger;
        if (!e) return;
        if (e.stopPropagation && !this._noblock) e.stopPropagation();
        if (this._if && !e.target.matches(this._if)) return;
        this._lastEvent = e;

        if (!this._cssPropMap) {
          return;
        }

        this.pass(e);
      }
    }, {
      key: "attchEvListnrs",
      value: function attchEvListnrs() {
        var attrFilters = [];
        var pS = this.getPSib();
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
      key: "onPropsChange",
      value: function onPropsChange() {
        if (!this._connected || !this._on || !this._to) return;
        this.attchEvListnrs();
      }
    }, {
      key: "parseMapping",
      value: function parseMapping(mapTokens, cssSelector) {
        var splitPropPointer = mapTokens[1].split(':');

        this._cssPropMap.push({
          cssSelector: cssSelector,
          propTarget: splitPropPointer[0],
          propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
        });
      }
    }, {
      key: "parseTo",
      value: function parseTo() {
        var _this9 = this;

        if (this._cssPropMap && this._to === this._lastTo) return;
        this._lastTo = this._to;
        this._cssPropMap = [];

        var splitPassDown = this._to.split('};');

        var onlyOne = splitPassDown.length <= 2;
        splitPassDown.forEach(function (pdItem) {
          if (!pdItem) return;
          var mT = pdItem.split('{');
          var cssSel = mT[0];

          if (!cssSel && onlyOne) {
            cssSel = '*';
            _this9._m = 1;
            _this9._hasMax = true;
          }

          _this9.parseMapping(mT, cssSel);
        });
      }
    }, {
      key: "setVal",
      value: function setVal(e, target, map) {
        var gpfp = this.getPropFromPath.bind(this);
        var propFromEvent = map.propSource ? gpfp(e, map.propSource) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, map, propFromEvent);
      }
    }, {
      key: "commit",
      value: function commit(target, map, val) {
        if (val === undefined) return;
        target[map.propTarget] = val;
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
      } // _input: any;
      // get input(){
      //     return this._input;
      // }
      // set input(val){
      //     this._input = val;
      // }

    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff]);
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
      var _this10;

      babelHelpers.classCallCheck(this, PD);
      _this10 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
      _this10._pdNavDown = []; //_hasMax!: boolean;

      _this10._m = Infinity;
      return _this10;
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        var _this11 = this;

        this._lastEvent = e;
        this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

        this._pdNavDown.forEach(function (pdnd) {
          _this11.applyProps(pdnd);
        });

        this.attr('pds', '👂');
      }
    }, {
      key: "applyProps",
      value: function applyProps(pd) {
        var _this12 = this;

        pd.getMatches().forEach(function (el) {
          _this12._cssPropMap.filter(function (map) {
            return map.cssSelector === pd.match;
          }).forEach(function (map) {
            _this12.setVal(_this12._lastEvent, el, map);
          });
        });
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
          case m:
            if (newVal !== null) {
              this._m = parseInt(newVal); //this._hasMax = true;
            } else {//this._hasMax = false;
              }

        }

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
        this.onPropsChange();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this13 = this;

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

        this._upgradeProperties([m]);

        this._connected = true;
        this.attr('pds', '📞');
        var bndApply = this.applyProps.bind(this);

        this._cssPropMap.forEach(function (pm) {
          var pdnd = new PDNavDown(_this13, pm.cssSelector, function (nd) {
            return bndApply(nd);
          }, _this13.m);
          pdnd.root = _this13;
          pdnd.init();

          _this13._pdNavDown.push(pdnd);
        });

        this.onPropsChange();
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
      var _this14;

      babelHelpers.classCallCheck(this, IfDiff);
      _this14 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(IfDiff).apply(this, arguments));
      _this14._conn = false;
      _this14._navDown = null;
      return _this14;
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
        var _this15 = this;

        this.style.display = 'none';

        this._upgradeProperties(IfDiff.observedAttributes);

        this._conn = true;
        this._debouncer = debounce(function () {
          var getNew = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          _this15.passDown();
        }, 16);
        setTimeout(function () {
          _this15.init();
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
        var _this16 = this;

        var tmpl = el.querySelector('template');

        if (!tmpl) {
          setTimeout(function () {
            _this16.loadTemplate(el);
          }, 50);
          return;
        }

        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
      } //_lastMatches: Element[] | null = null;

    }, {
      key: "tagMatches",
      value: function tagMatches(nd) {
        var _this17 = this;

        var matches = nd.matches;
        var val = this.value;
        var t = this._tag;
        matches.forEach(function (el) {
          var ds = el.dataset;

          if (ds[t] === '0') {
            if (val) {
              _this17.loadTemplate(el);

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
        var _this18 = this;

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
              return el.dataset && !!el.dataset[_this18._tag];
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