export interface IfDiffProps extends Partial<HTMLElement>{
    if?: boolean, 
    lhs?: boolean | string | number | object , 
    rhs?: boolean | string | number | object, 
    equals?: boolean, 
    notEquals?: boolean,
    includes?: boolean,
    disabled?: boolean | number, 
    value?: boolean | undefined,
}

export interface IfDiffEventNameMap {
    'template-cloned': TemplateClonedDetail;
}

export interface TemplateClonedDetail {
    clonedTemplate: DocumentFragment;
}