import { XtallatX, disabled } from "./node_modules/xtal-latx/xtal-latx.js";
import { define } from "./node_modules/xtal-latx/define.js";
import { debounce } from "./node_modules/xtal-latx/debounce.js";
import { NavDown } from "./node_modules/xtal-latx/NavDown.js";
var if$ = 'if';
var lhs = 'lhs';
var rhs = 'rhs';
var tag = 'tag';
var equals = 'equals';
var not_equals = 'not_equals';
var m$ = 'm'; //TODO:  share mixin with p-d.p-u?

export var IfDiff =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(IfDiff, _XtallatX);

  function IfDiff() {
    var _this;

    babelHelpers.classCallCheck(this, IfDiff);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(IfDiff).apply(this, arguments));
    _this._conn = false;
    _this._navDown = null;
    _this._lastMatches = null;
    return _this;
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
      var _this2 = this;

      this.style.display = 'none';

      this._upgradeProperties(IfDiff.observedAttributes);

      this._conn = true;
      this._debouncer = debounce(function () {
        var getNew = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _this2.passDown();
      }, 16);
      setTimeout(function () {
        _this2.init();
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
      var _this3 = this;

      var tmpl = el.querySelector('template');

      if (!tmpl) {
        setTimeout(function () {
          _this3.loadTemplate(el);
        }, 50);
        return;
      }

      el.appendChild(tmpl.content.cloneNode(true));
      tmpl.remove();
    }
  }, {
    key: "tagMatches",
    value: function tagMatches() {
      var _this4 = this;

      var matches = this._navDown.matches;
      var val = this.value;
      var t = this._tag;
      matches.forEach(function (el) {
        var ds = el.dataset;

        if (ds[t] === '0') {
          if (val) {
            _this4.loadTemplate(el);

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
      var _this5 = this;

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
            return el.dataset && !!el.dataset[_this5._tag];
          };

          var max = this._m ? this._m : Infinity;
          var bndTagMatches = this.tagMatches.bind(this);
          this._navDown = new NavDown(this, test, function () {
            return bndTagMatches();
          }, max);

          this._navDown.init();
        } else {
          this.tagMatches();
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
define(IfDiff); //# sourceMappingURL=if-diff.js.map