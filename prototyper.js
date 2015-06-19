;(function(global, factory){
    if (typeof exports === "object") {
        module.exports = factory();
    }
    else if ( typeof define === 'function' && define.amd ) {
        define(factory);
    }
    else {
        global.Prototyper = factory();
    }
})(this, function() {

    var extend = function(origin, target) {
        for (key in target) {
            if (target.hasOwnProperty(key)) {
                origin[key] = target[key];
            }
        }
        return origin;
    };

    var Prototyper = function() {
        this.construct.apply(this, arguments);
    };
    Prototyper.prototype.construct = function() {};
    Prototyper.prototype.getMethod = function(name) {
        var bindedMethod = this[name];
        var self = this;
        return function() {
            return bindedMethod.apply(self, arguments);
        };
    };
    Prototyper.extend = function(methods) {

        methods = methods || {};

        var SubPrototyper = function() {
            this.construct.apply(this, arguments);
        };

        extend(SubPrototyper, this);

        // instance methods inheritance
        SubPrototyper.prototype = Object.create(this.prototype, {
            constructor: {
                value: SubPrototyper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        extend(SubPrototyper.prototype, methods);

        SubPrototyper.prototype.construct = methods.construct || this.prototype.construct;
        SubPrototyper.prototype.super = this.prototype;

        return SubPrototyper;
    };
    Prototyper.isParentOf = function(child) {
        return (child instanceof this);
    };

    return Prototyper;
});