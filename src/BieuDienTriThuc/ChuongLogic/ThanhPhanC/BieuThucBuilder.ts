import { ToanTuFactory } from "../ThanhPhanOpts/ToanTuFactory";
import { ToanTu } from "../ThanhPhanOpts/ToanTuLogic";
import { BieuThucMenhDe } from "./BieuThucMenhDe";
import { Helper } from '../ThanhPhanFuncs/Helper';

export class BieuThucBuilder{
    private bieuThuc:BieuThucMenhDe;
    constructor(){
        this.bieuThuc = new BieuThucMenhDe();
    }
    
    public addBieuThucCon (bieuThuc:BieuThucMenhDe):BieuThucBuilder{
        this.bieuThuc.bieuThucCons.push(bieuThuc);
        bieuThuc.cha = this.bieuThuc;
        return this;  
    }


    //// HAM KHONG TIEN HANH SET CHA
    public addBieuThucCon2 (bieuThuc:BieuThucMenhDe):BieuThucBuilder{
        this.bieuThuc.bieuThucCons.push(bieuThuc);
        return this;  
    }


    public addID (id:string):BieuThucBuilder{
        this.bieuThuc.id = id;
        return this;  
    }

    public addToanTu (toanTu : number):BieuThucBuilder{
        this.bieuThuc.toanTu = new ToanTuFactory().create(toanTu);
        return this;  
    }

    public addCha (bt:BieuThucMenhDe|null):BieuThucBuilder{
        this.bieuThuc.cha = bt;
        return this;  
    }

    public addBieuThucSoCap(id: string ):BieuThucBuilder{
        this.bieuThuc.bieuThucCons.push(Helper.BIEU_THUC_SO_CAP(id));
        return this;
    }

    public build():BieuThucMenhDe{
        if(Helper.IS_BIEU_THUC_SO_CAP(this.bieuThuc)){
            let bt:BieuThucMenhDe= new BieuThucMenhDe();
            if(this.bieuThuc.id.includes('0') || this.bieuThuc.toanTu.tenToanTu=== ToanTu.PHU_DINH){
               bt = Helper.BIEU_THUC_SO_CAP(this.bieuThuc.id.split('0')[1]);
               bt.toanTu = new ToanTuFactory().create(ToanTu.PHU_DINH);
            }
            else{ 
               bt =  Helper.BIEU_THUC_SO_CAP(this.bieuThuc.id);
              // bt.toanTu = this.bieuThuc.toanTu;
            }
            bt.cha = this.bieuThuc.cha;
            return bt;
        }
        if(this.bieuThuc.bieuThucCons.length === 1 && Helper.IS_BIEU_THUC_SO_CAP(this.bieuThuc.bieuThucCons[0])){

            let bt:BieuThucMenhDe= new BieuThucMenhDe();
            if(this.bieuThuc.id.includes('0') || this.bieuThuc.toanTu.tenToanTu=== ToanTu.PHU_DINH)
               bt = Helper.BIEU_THUC_SO_CAP(this.bieuThuc.bieuThucCons[0].id.split('0')[1]);
            else 
               bt =  Helper.BIEU_THUC_SO_CAP(this.bieuThuc.bieuThucCons[0].id);

            bt.cha = this.bieuThuc.cha;
            // console.log('nani')
            return bt;
        }
        return this.bieuThuc;
    }

    sizeBuilder ():number{
        return this.bieuThuc.bieuThucCons.length;
    }

}