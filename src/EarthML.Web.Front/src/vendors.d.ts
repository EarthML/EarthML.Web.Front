
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