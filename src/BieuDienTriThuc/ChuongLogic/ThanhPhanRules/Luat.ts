import { BieuThucMenhDe } from '../ThanhPhanC/BieuThucMenhDe';
import { ILuat } from './ILuat';
import { LuatMessage } from './LuatMessage';
export class Luat  implements ILuat{
    private _tenLuat: string;
    private _Iluat: ILuat ;
    private _id: number = 0;
    
    constructor(id:number,_tenLuat: string, _Iluat:ILuat) {
        this._tenLuat = _tenLuat;
        this._Iluat = _Iluat;
        this.id = id;
    }
    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
        return this.Iluat.boKiemTra(P);
    }
    ketQua(P: BieuThucMenhDe, con?: LuatMessage): BieuThucMenhDe {
        if(con === undefined)
        return this.Iluat.ketQua(P);
        return this.Iluat.ketQua(P,con);
    }


    run(P:BieuThucMenhDe):{goc:BieuThucMenhDe,con:BieuThucMenhDe}|null{
        let con: LuatMessage | null = null;
        con = this.boKiemTra(P);
        if (con !== null) {
            // console.log(`- AP DUNG ${this.tenLuat} cho bieu thuc: ${con.bieuThuc.id}, DUOC KET QUA:`);
            return {goc:this.ketQua(P, con),con:con.bieuThuc };
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


    public get Iluat(): ILuat  {
        return this._Iluat;
    }
    public set Iluat(value: ILuat ) {
        this._Iluat = value;
    }


    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

}