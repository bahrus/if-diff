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

  var if$ = 'if';
  var lhs = 'lhs';
  var rhs = 'rhs';
  var tag = 'tag';
  var equals = 'equals';
  var not_equals = 'not_equals';
  var m$ = 'm'; //TODO:  share mixin with p-d.p-u?

  var IfDiff =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(IfDiff, _XtallatX);

    function IfDiff() {
      var _this6;

      babelHelpers.classCallCheck(this, IfDiff);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(IfDiff).apply(this, arguments));
      _this6._conn = false;
      _this6._navDown = null;
      return _this6;
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
        var _this7 = this;

        this.style.display = 'none';

        this._upgradeProperties(IfDiff.observedAttributes);

        this._conn = true;
        this._debouncer = debounce(function () {
          var getNew = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          _this7.passDown();
        }, 16);
        setTimeout(function () {
          _this7.init();
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
        var _this8 = this;

        var tmpl = el.querySelector('template');

        if (!tmpl) {
          setTimeout(function () {
            _this8.loadTemplate(el);
          }, 50);
          return;
        }

        el.appendChild(tmpl.content.cloneNode(true));
        tmpl.remove();
      } //_lastMatches: Element[] | null = null;

    }, {
      key: "tagMatches",
      value: function tagMatches(nd) {
        var _this9 = this;

        var matches = nd.matches;
        var val = this.value;
        var t = this._tag;
        matches.forEach(function (el) {
          var ds = el.dataset;

          if (ds[t] === '0') {
            if (val) {
              _this9.loadTemplate(el);

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
        var _this10 = this;

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
              return el.dataset && !!el.dataset[_this10._tag];
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