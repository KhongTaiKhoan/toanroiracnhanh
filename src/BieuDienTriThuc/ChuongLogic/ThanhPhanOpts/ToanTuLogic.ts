import {BieuThucMenhDe} from "../ThanhPhanC/BieuThucMenhDe";
abstract class ToanTu {
    
    public static  kyHieus:string[] = ['\u00AC','\u2194','\u2192','\u2228','\u2227'] ;
    private _kyHieu: string;
    
    public get kyHieu(): string {
        return this._kyHieu;
    }
    
    private _tenToanTu: number = -1;
    
    static NONE:number = -1;
    static PHU_DINH:number = 0;
    static HOI:number = 1;
    static TUYEN:number = 2;
    static KEO_THEO:number = 3;
    static TUONG_DUONG:number = 4;



    constructor(kyHieu:string){
        this._kyHieu = kyHieu;
    }
    abstract tinhToan(bieuThuc:BieuThucMenhDe):boolean;

    public get tenToanTu(): number {
        return this._tenToanTu;
    }
    public set tenToanTu(value: number) {
        this._tenToanTu = value;
    }
    toString(){
        if(this.tenToanTu !== ToanTu.NONE)
        return this._tenToanTu+"";
        return "";
    }
}

export{ToanTu};