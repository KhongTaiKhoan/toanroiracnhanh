import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class Hoi extends ToanTu{
    constructor(){
        super('\u2227');
        this.tenToanTu = ToanTu.HOI;
    }
    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        for(let i = 0;i<bieuThuc.bieuThucCons.length;i++){
            if(bieuThuc.bieuThucCons[i].chanTri === false) return false;  
        }
        return true;
    }
    
}