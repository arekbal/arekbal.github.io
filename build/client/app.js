/// <reference path="../../typings/knockout/knockout.d.ts"/>
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var my;
(function (my) {
    var Anulus = (function () {
        function Anulus(hahah) {
            this.hahah = hahah;
            var arr = ['a', 'b', 'c'];
            for (var _i = 0; _i < arr.length; _i++) {
                var i = arr[_i];
                console.log(i);
            }
        }
        Anulus.prototype.goTo = function () {
            console.log('goTo');
        };
        Object.defineProperty(Anulus.prototype, "goTo",
            __decorate([
                doc('hellotrue', 'debede')
            ], Anulus.prototype, "goTo", Object.getOwnPropertyDescriptor(Anulus.prototype, "goTo")));
        return Anulus;
    })();
    my.Anulus = Anulus;
})(my || (my = {}));
function doc(b, c) {
    return function (target, name, descriptor) {
        descriptor.enumerable = false;
        return descriptor;
    };
}
ko.punches.enableAll();
ko.applyBindings({ name: 'testing punches' });

//# sourceMappingURL=app.js.map