import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class KeoTheo extends ToanTu{
    constructor(){
        super('\u2192');
        this.tenToanTu = ToanTu.KEO_THEO;

    }

    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        return false;
    }
}