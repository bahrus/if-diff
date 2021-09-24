export function includes(lhs: any, rhs: any){
    if(Array.isArray(lhs) && Array.isArray(rhs)){
        const [lhsa, rhsa] = [lhs as any[], rhs as any[]];
        for(let i = 0, ii = rhsa.length; i < ii; i++){
            if(!lhsa.includes(rhsa[i])) return false;
        }
        
        return true;
    }
    if(typeof lhs !== typeof rhs) return false;
    switch(typeof lhs){
        case 'number':
            return lhs >= rhs;
        case 'boolean':
            return (lhs === rhs);
        case 'string':
            return (lhs as string).includes(rhs as string);
        case 'object':
            if(!includes(Object.keys(lhs), Object.keys(rhs))) return false;
            for(const key in rhs){
                if(!includes(lhs[key], rhs[key])) return false;
            }
            return true;
    }

    return false;
}