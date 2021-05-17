import { BieuThucMenhDe } from "../../ChuongLogic/ThanhPhanC/BieuThucMenhDe";

export class LoiGiaiChuyenDoi{
    public loiGiai:{
        idLuat:number,
        bieuThucApDung:string,
        bieuThucKetQua:string,
        bieuThucGoc:string,
        bieuThucGoc_id:string,
    }[]=[];
    public ketQua:BieuThucMenhDe = new BieuThucMenhDe();

}