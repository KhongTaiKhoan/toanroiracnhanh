import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class Tuyen extends ToanTu{
    constructor(){
        super('\u2228');
        this.tenToanTu = ToanTu.TUYEN;
    }

    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        for(let i = 0;i<bieuThuc.bieuThucCons.length;i++){
            if(bieuThuc.bieuThucCons[i].chanTri === true) return true;  
        }
        return false;
    }
    
}