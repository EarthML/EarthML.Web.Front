define(["require", "exports"], function (require, exports) {
    "use strict";
    function isDefined(variable) {
        return variable !== null && typeof (variable) !== "undefined";
    }
    exports.isDefined = isDefined;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});
