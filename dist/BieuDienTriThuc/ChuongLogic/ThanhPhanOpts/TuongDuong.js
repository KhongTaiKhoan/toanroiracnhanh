"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuongDuong = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
class TuongDuong extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u2194');
        this.tenToanTu = ToanTuLogic_1.ToanTu.TUONG_DUONG;
    }
    tinhToan(bieuThuc) {
        return bieuThuc.bieuThucCons[0].chanTri === bieuThuc.bieuThucCons[1].chanTri;
    }
}
exports.TuongDuong = TuongDuong;
