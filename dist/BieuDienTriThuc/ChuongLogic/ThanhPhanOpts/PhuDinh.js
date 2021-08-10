"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhuDinh = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
class PhuDinh extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u00AC');
        this.tenToanTu = ToanTuLogic_1.ToanTu.PHU_DINH;
    }
    tinhToan(bieuThuc) {
        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(bieuThuc))
            return !bieuThuc.chanTri;
        return !bieuThuc.bieuThucCons[0].chanTri;
    }
}
exports.PhuDinh = PhuDinh;
