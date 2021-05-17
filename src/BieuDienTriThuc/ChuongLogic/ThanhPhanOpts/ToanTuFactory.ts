import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "../ThanhPhanOpts/ToanTuLogic"
import { PhuDinh } from "../ThanhPhanOpts/PhuDinh";
import { TuongDuong } from "./TuongDuong";
import { KeoTheo } from './KeoTheo';
import { Hoi } from './Hoi';
import { Tuyen } from './Tuyen';
class ToanTuFactory {
    constructor() {

    }

    create(loaiToanTu: number) {
        switch (loaiToanTu) {
            case ToanTu.PHU_DINH:
                return new PhuDinh();
                break;

            case ToanTu.TUONG_DUONG:
                return new TuongDuong();
                break;

            case ToanTu.KEO_THEO:
                return new KeoTheo();
                break;

            case ToanTu.HOI:
                return new Hoi();
                break;

            case ToanTu.TUYEN:
                return new Tuyen();
                break;
                
            default:
                return new class extends ToanTu {
                    constructor() {
                        super("");
                    }
                    tinhToan(_bieuThuc: BieuThucMenhDe): boolean {
                        return _bieuThuc.chanTri;
                    }
                }();
        }
    }
    
    create2(loaiToanTu: string) {
        switch (loaiToanTu) {
            case '\u00AC':
                return new PhuDinh();
                break;

            case '\u2194':
                return new TuongDuong();
                break;

            case '\u2192':
                return new KeoTheo();
                break;

            case '\u2227':
                return new Hoi();
                break;

            case '\u2228':
                return new Tuyen();
                break;
                
            default:
                return new class extends ToanTu {
                    constructor() {
                        super("");
                    }
                    tinhToan(_bieuThuc: BieuThucMenhDe): boolean {
                        return _bieuThuc.chanTri;
                    }
                }();
        }
    }
}

export { ToanTuFactory }