"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToanTuFactory = void 0;
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const PhuDinh_1 = require("../ThanhPhanOpts/PhuDinh");
const TuongDuong_1 = require("./TuongDuong");
const KeoTheo_1 = require("./KeoTheo");
const Hoi_1 = require("./Hoi");
const Tuyen_1 = require("./Tuyen");
class ToanTuFactory {
    constructor() {
    }
    create(loaiToanTu) {
        switch (loaiToanTu) {
            case ToanTuLogic_1.ToanTu.PHU_DINH:
                return new PhuDinh_1.PhuDinh();
                break;
            case ToanTuLogic_1.ToanTu.TUONG_DUONG:
                return new TuongDuong_1.TuongDuong();
                break;
            case ToanTuLogic_1.ToanTu.KEO_THEO:
                return new KeoTheo_1.KeoTheo();
                break;
            case ToanTuLogic_1.ToanTu.HOI:
                return new Hoi_1.Hoi();
                break;
            case ToanTuLogic_1.ToanTu.TUYEN:
                return new Tuyen_1.Tuyen();
                break;
            default:
                return new class extends ToanTuLogic_1.ToanTu {
                    constructor() {
                        super("");
                    }
                    tinhToan(_bieuThuc) {
                        return _bieuThuc.chanTri;
                    }
                }();
        }
    }
    create2(loaiToanTu) {
        switch (loaiToanTu) {
            case '\u00AC':
                return new PhuDinh_1.PhuDinh();
                break;
            case '\u2194':
                return new TuongDuong_1.TuongDuong();
                break;
            case '\u2192':
                return new KeoTheo_1.KeoTheo();
                break;
            case '\u2227':
                return new Hoi_1.Hoi();
                break;
            case '\u2228':
                return new Tuyen_1.Tuyen();
                break;
            default:
                return new class extends ToanTuLogic_1.ToanTu {
                    constructor() {
                        super("");
                    }
                    tinhToan(_bieuThuc) {
                        return _bieuThuc.chanTri;
                    }
                }();
        }
    }
}
exports.ToanTuFactory = ToanTuFactory;
