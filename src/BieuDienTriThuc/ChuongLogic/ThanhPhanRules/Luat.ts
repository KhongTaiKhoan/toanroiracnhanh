import { BieuThucMenhDe } from '../ThanhPhanC/BieuThucMenhDe';
import { ILuat } from './ILuat';
import { LuatMessage } from './LuatMessage';
import { DieuKien } from './DieuKienLuat';
import { KetQua } from './KetQuaLuat';
export class Luat {
    private _tenLuat: string;
    private _id: number = 0;
    private _dieuKien: DieuKien;
    private _ketQua: KetQua;
    
   
    constructor(id:number,_tenLuat: string,dieuKien:DieuKien,ketQua:KetQua ) {
        this._tenLuat = _tenLuat;
        this.id = id;
        this._dieuKien = dieuKien;
        this._ketQua = ketQua;
    }
    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
        return this.dieuKien.boKiemTra(P);
    }
    nhanKetQua(P: BieuThucMenhDe, con?: LuatMessage): BieuThucMenhDe {
        if(con === undefined)
        return this.ketQua.ketQua(P);
        return this.ketQua.ketQua(P,con);
    }


    run(P:BieuThucMenhDe):{goc:BieuThucMenhDe,con:BieuThucMenhDe}|null{
        let con: LuatMessage | null = null;
        con = this.boKiemTra(P);
        if (con !== null) {
            // console.log(`- AP DUNG ${this.tenLuat} cho bieu thuc: ${con.bieuThuc.id}, DUOC KET QUA:`);
            return {goc:this.ketQua.ketQua(P, con),con:con.bieuThuc };
        }
        return null;
      
    }

    /// GETTER AND SETTER
    public get tenLuat(): string {
        return this._tenLuat;
    }
    public set tenLuat(value: string) {
        this._tenLuat = value;
    }



    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get dieuKien(): DieuKien {
        return this._dieuKien;
    }
    public set dieuKien(value: DieuKien) {
        this._dieuKien = value;
    }
    
    public get ketQua(): KetQua {
        return this._ketQua;
    }
    public set ketQua(value: KetQua) {
        this._ketQua = value;
    }
   
}