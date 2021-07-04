import { KhonGianSoNguyen } from "../ThanhPhanC/BieuThucDaiSo";

export namespace HelperBieuThucDaiSo{
    export class Helper{

        static TAO_HANG_SO(value:number){
            let bt:KhonGianSoNguyen.BieuThuc= new KhonGianSoNguyen.BieuThuc();
            bt.value = value;
            bt.id = value+'';
            bt.operator = '';
            bt.kind = KhonGianSoNguyen.BieuThuc.HANG_SO;
            return bt;

        }

        static TAO_BIEN_SO(id:string){
            let bt:KhonGianSoNguyen.BieuThuc= new KhonGianSoNguyen.BieuThuc();
            bt.id = id;
            bt.kind = KhonGianSoNguyen.BieuThuc.BIEN_SO;
            return bt;
        }

      
    }
}