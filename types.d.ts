export interface IfDiffProps{
    if: boolean, 
    lhs: boolean | string | number | object, 
    rhs: boolean | string | number | object, 
    dataKeyName : string, 
    equals: boolean, 
    not_equals: boolean, 
    disabled: boolean | number, 
    enable: string, 
    m: number
}