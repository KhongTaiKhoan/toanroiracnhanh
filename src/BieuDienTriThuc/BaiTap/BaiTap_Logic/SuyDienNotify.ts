import { BieuThucMenhDe } from "../../ChuongLogic/ThanhPhanC/BieuThucMenhDe";
import { SuyDien } from './SuyLuanLogic';
// export namespace SuyDien {
export interface SuyDienNotify {
    themLoiGiai(data:SuyDien.dataNotiFy, target?:number[]): boolean;
    truyVet(bt:BieuThucMenhDe):number;
    soSanhKetQua(P:BieuThucMenhDe):boolean;
    ghiSuKien(P:BieuThucMenhDe,target:BieuThucMenhDe[]):void;
    getChiSoLoiGiaiLonNhat():number;
}
// }