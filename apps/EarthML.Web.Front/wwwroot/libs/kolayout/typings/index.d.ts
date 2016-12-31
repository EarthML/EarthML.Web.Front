export interface KnockoutTemplateBindingHandlerOptions {
    name?: string;
    nodes?: Array<Node>;
    data?: any;
    if?: any;
    foreach?: any;
    as?: string;
    afterRender?: (elements: Node[]) => void;
    afterAdd?: (data: any) => void;
    beforeRemove?: (data: any) => void;
}
export interface IKoLayout {
    templateOptions(element?: HTMLElement): KnockoutTemplateBindingHandlerOptions;
}
export declare class KoLayout implements IKoLayout {
    protected options: KnockoutTemplateBindingHandlerOptions;
    constructor(options: KnockoutTemplateBindingHandlerOptions);
    templateOptions(element?: HTMLElement): KnockoutTemplateBindingHandlerOptions;
}
