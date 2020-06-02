export function includes(lhs, rhs) {
    if (Array.isArray(lhs) && Array.isArray(rhs)) {
        const [lhsa, rhsa] = [lhs, rhs];
        for (let i = 0, ii = rhsa.length; i < ii; i++) {
            if (!lhsa.includes(rhsa[i]))
                return false;
        }
        return true;
    }
    if (typeof lhs !== typeof rhs)
        return false;
    switch (typeof lhs) {
        case 'number':
            return lhs > rhs;
        case 'boolean':
            return false;
        case 'string':
            return lhs.includes(rhs);
        case 'object':
            if (!includes(Object.keys(lhs), Object.keys(rhs)))
                return false;
            for (const key in rhs) {
                if (!includes(lhs[key], rhs[key]))
                    return false;
            }
            return true;
    }
    return false;
}
