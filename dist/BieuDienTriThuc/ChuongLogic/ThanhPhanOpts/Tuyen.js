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
        for (let i = 0; i < bieuThuc.bieuThucCons.length; i++) {
            if (bieuThuc.bieuThucCons[i].chanTri === true)
                return true;
        }
        return false;
    }
}
exports.Tuyen = Tuyen;
