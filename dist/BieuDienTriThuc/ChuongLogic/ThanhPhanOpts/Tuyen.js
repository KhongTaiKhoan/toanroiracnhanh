"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tuyen = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
class Tuyen extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u2228');
        this.tenToanTu = ToanTuLogic_1.ToanTu.TUYEN;
    }
    tinhToan(bieuThuc) {
        throw new Error("Method not implemented.");
    }
}
exports.Tuyen = Tuyen;
