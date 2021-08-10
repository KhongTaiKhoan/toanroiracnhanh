"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapHopBuilder = exports.PhanTuLietKe = exports.TapHop = void 0;
class TapHop {
    constructor() {
        this._array = [];
        this._dieuKien = null;
        this.array = [];
        this.dieuKien = null;
    }
    getKind() {
        if (this.array.length === 0 && this.dieuKien === null)
            return -1;
        if (this.array.length === 0)
            return TapHop.TAP_HOP_DIEU_KIEN;
        if (this.dieuKien === null)
            return TapHop.TAP_HOP_LIET_KE;
        return -1;
    }
    toString() {
        var _a;
        if (this.getKind() === TapHop.TAP_HOP_LIET_KE)
            return `${this.array}`;
        return `Với mọi a,b thuộc Z | ${(_a = this.dieuKien) === null || _a === void 0 ? void 0 : _a.toString()}`;
    }
    //#region  GETTER AND SETTER
    get array() {
        return this._array;
    }
    set array(value) {
        this._array = value;
    }
    get dieuKien() {
        return this._dieuKien;
    }
    set dieuKien(value) {
        this._dieuKien = value;
    }
}
exports.TapHop = TapHop;
TapHop.INVALID = -1;
TapHop.TAP_HOP_LIET_KE = 0;
TapHop.TAP_HOP_DIEU_KIEN = 1;
class PhanTuLietKe {
    constructor(element) {
        this._element = [];
        this.element = element;
    }
    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    toString() {
        if (this.element.length === 1)
            return this.element[0] + '';
        return this.element + '';
    }
}
exports.PhanTuLietKe = PhanTuLietKe;
class TapHopBuilder {
    constructor() {
        this.builder = new TapHop();
    }
    addCondition(R) {
        this.builder.dieuKien = R;
        return this;
    }
    addArray(array) {
        let arr = [];
        for (let i = 0; i < array.length; i++) {
            arr.push(new PhanTuLietKe([array[i]]));
        }
        this.builder.array = arr;
        return this;
    }
    addArray2D(array) {
        let arr = [];
        for (let i = 0; i < array.length; i++) {
            arr.push(new PhanTuLietKe(array[i]));
        }
        this.builder.array = arr;
        return this;
    }
    build() {
        if (this.builder.getKind() === TapHop.INVALID) {
            throw new Error('Chua khoi tao thuoc tinh cho tap hop');
        }
        let T = this.builder;
        this.builder = new TapHop();
        return T;
    }
}
exports.TapHopBuilder = TapHopBuilder;
