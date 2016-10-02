
declare namespace __Modernizr {
    interface FeatureDetects {
        autoplay: boolean;
    }
    interface ModernizrStatic {
        addAsyncTest(func: Function);
    }
}

declare module "modernizr" {
    export = Modernizr;
}

declare module "headroom" {
    export = Headroom;
}
declare module "class_list_ployfill" {
}
declare module "classie" {
    export function has(el, cls): boolean;
    export function add(el, cls): boolean;
    export function remove(el, cls): boolean;
}

interface Window {
    opera: string;
}