import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import {ToanTu} from "./ToanTuLogic"; 
export class PhuDinh extends ToanTu{

    constructor(){
        super('\u00AC');
        this.tenToanTu = ToanTu.PHU_DINH;
    }
    tinhToan(bieuThuc:BieuThucMenhDe): boolean {
       return !bieuThuc.chanTri;
    }
}