"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhuDinh = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
class PhuDinh extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u00AC');
        this.tenToanTu = ToanTuLogic_1.ToanTu.PHU_DINH;
    }
    tinhToan(bieuThuc) {
        return !bieuThuc.chanTri;
    }
}
exports.PhuDinh = PhuDinh;
