"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoi = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
class Hoi extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u2227');
        this.tenToanTu = ToanTuLogic_1.ToanTu.HOI;
    }
    tinhToan(bieuThuc) {
        for (let i = 0; i < bieuThuc.bieuThucCons.length; i++) {
            if (bieuThuc.bieuThucCons[i].chanTri === false)
                return false;
        }
        return true;
    }
}
exports.Hoi = Hoi;
