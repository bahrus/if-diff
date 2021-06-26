import { IfDiff } from './if-diff.js';
import { xc } from 'xtal-element/lib/XtalCore.js';
/**
 * Alternative to Polymer's dom-if element that allows comparison between two operands, as well as progressive enhancement.
 * DOM deletion takes place on non matching elements.
 * @element if-diff-then-stiff
 */
export class IfDiffThenStiff extends IfDiff {
    static is = 'if-diff-then-stiff';
    addStyle(self) {
        //no need for styles to hide things.
    }
    configureLazyMt(lazyMT) {
        lazyMT.minMem = true;
    }
}
xc.define(IfDiffThenStiff);
