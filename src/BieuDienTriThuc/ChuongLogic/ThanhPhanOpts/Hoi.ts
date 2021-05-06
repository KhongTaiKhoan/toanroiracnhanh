import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class Hoi extends ToanTu{
    constructor(){
        super('\u2227');
        this.tenToanTu = ToanTu.HOI;
    }
    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        throw new Error("Method not implemented.");
    }
    
}