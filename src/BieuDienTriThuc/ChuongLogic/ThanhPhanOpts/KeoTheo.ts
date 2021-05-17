import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTu } from "./ToanTuLogic";

export class KeoTheo extends ToanTu{
    constructor(){
        super('\u2192');
        this.tenToanTu = ToanTu.KEO_THEO;

    }

    tinhToan(bieuThuc: BieuThucMenhDe): boolean {
        // console.log(`- CT: ${bieuThuc.bieuThucCons[0].chanTri}   ${bieuThuc.bieuThucCons[1].chanTri}`)
        if(bieuThuc.bieuThucCons[0].chanTri === true &&  bieuThuc.bieuThucCons[1].chanTri === false)
        return false;
        return true;
    }
}