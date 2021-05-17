import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import {ToanTu} from "./ToanTuLogic"; 
import { Helper } from '../ThanhPhanFuncs/Helper';
export class PhuDinh extends ToanTu{

    constructor(){
        super('\u00AC');
        this.tenToanTu = ToanTu.PHU_DINH;
    }
    tinhToan(bieuThuc:BieuThucMenhDe): boolean {
        if(Helper.IS_BIEU_THUC_SO_CAP(bieuThuc))
           return !bieuThuc.chanTri;
        return !bieuThuc.bieuThucCons[0].chanTri;   
    }
}