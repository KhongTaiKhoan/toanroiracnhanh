"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeoTheo = void 0;
const ToanTuLogic_1 = require("./ToanTuLogic");
class KeoTheo extends ToanTuLogic_1.ToanTu {
    constructor() {
        super('\u2192');
        this.tenToanTu = ToanTuLogic_1.ToanTu.KEO_THEO;
    }
    tinhToan(bieuThuc) {
        // console.log(`- CT: ${bieuThuc.bieuThucCons[0].chanTri}   ${bieuThuc.bieuThucCons[1].chanTri}`)
        if (bieuThuc.bieuThucCons[0].chanTri === true && bieuThuc.bieuThucCons[1].chanTri === false)
            return false;
        return true;
    }
}
exports.KeoTheo = KeoTheo;
