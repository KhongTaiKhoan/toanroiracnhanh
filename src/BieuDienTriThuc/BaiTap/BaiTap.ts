import { BieuThucMenhDe } from "../ChuongLogic/ThanhPhanC/BieuThucMenhDe";
import { TapLuat } from '../ChuongLogic/ThanhPhanRules/TapLuatTuongDuong';
import { LoiGiaiChuyenDoi } from "./BaiTap_Logic/LoiGiaiChuyenDoi";

export abstract class BaiTap{
    protected tapLuat:TapLuat;  
    constructor(){
        this.tapLuat = new TapLuat();
    }
    abstract giai(deBai?:string):LoiGiaiChuyenDoi|any;
}