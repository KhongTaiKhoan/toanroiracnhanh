"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToanTu = void 0;
class ToanTu {
    constructor(kyHieu) {
        this._tenToanTu = -1;
        this._kyHieu = kyHieu;
    }
    get kyHieu() {
        return this._kyHieu;
    }
    get tenToanTu() {
        return this._tenToanTu;
    }
    set tenToanTu(value) {
        this._tenToanTu = value;
    }
    toString() {
        if (this.tenToanTu !== ToanTu.NONE)
            return this._tenToanTu + "";
        return "";
    }
}
exports.ToanTu = ToanTu;
ToanTu.kyHieus = ['\u00AC', '\u2194', '\u2192', '\u2228', '\u2227'];
ToanTu.NONE = -1;
ToanTu.PHU_DINH = 0;
ToanTu.HOI = 1;
ToanTu.TUYEN = 2;
ToanTu.KEO_THEO = 3;
ToanTu.TUONG_DUONG = 4;
