export interface IfDiffProps extends Partial<HTMLElement>{
    if: boolean, 
    lhs: boolean | string | number | object, 
    rhs: boolean | string | number | object, 
    dataKeyName : string, 
    equals: boolean, 
    not_equals: boolean, 
    disabled: boolean | number, 
    enable: string, 
    m: number,
    // prop1: any,
    // prop2: any,
    // prop3: any,
    // prop4: any,
    // prop5: any,
    // prop6: any,
    // prop7: any,
    // propProxyMap: object | undefined,
    byos: boolean,
}

export interface IfDiffEventNameMap {
    'template-cloned': TemplateClonedDetail;
}

export interface TemplateClonedDetail {
    clonedTemplate: DocumentFragment;
}