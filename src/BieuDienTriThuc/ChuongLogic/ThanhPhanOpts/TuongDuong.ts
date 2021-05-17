import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class TuongDuong extends ToanTu{

    constructor(){
        super('\u2194');
        this.tenToanTu = ToanTu.TUONG_DUONG;
    }
    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        return bieuThuc.bieuThucCons[0].chanTri === bieuThuc.bieuThucCons[1].chanTri;
    }
    
}