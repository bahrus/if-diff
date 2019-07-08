import { IfDiff } from './if-diff.js';
const templKey = Symbol('cache');
export class IfDiffStiff extends IfDiff {
    static get is() { return 'if-diff-stiff'; }
}
