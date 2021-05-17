import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTuFactory } from "../ThanhPhanOpts/ToanTuFactory";
import { ToanTu } from "../ThanhPhanOpts/ToanTuLogic";
import { BieuThucBuilder } from '../ThanhPhanC/BieuThucBuilder';
import { TapLuat } from '../ThanhPhanRules/TapLuatTuongDuong';

export class Helper{

    static PHU_DINH_MENH_DE(P:BieuThucMenhDe): BieuThucMenhDe{
        let rs:BieuThucMenhDe ;   
        if(this.IS_BIEU_THUC_SO_CAP(P)){
            if (!P.id.includes('0')) {
              
                return new BieuThucBuilder().addToanTu(ToanTu.PHU_DINH)
                                            .addID(P.id)
                                            .build();
            }
            else {
              
                return new BieuThucBuilder().addID(P.id.split('0')[1]).build();
            }
            
        } 
        else{
           
           rs = new BieuThucBuilder().addBieuThucCon(P)
                                     .addToanTu(ToanTu.PHU_DINH)
                                     .build();  
        
        } 
        return rs;
    }

    static BIEU_THUC_SO_CAP(id:string,toanTu?:number ):BieuThucMenhDe{
        let rs:BieuThucMenhDe = new BieuThucMenhDe();
        if(id.includes('0')) {
            id =id.split('0')[1];
            toanTu = new ToanTuFactory().create(ToanTu.PHU_DINH).tenToanTu;
        }
        rs.id = id;
        if(toanTu!==undefined)
           rs.toanTu = new ToanTuFactory().create(toanTu);
        return rs;
    }

    static HANG_SAI():BieuThucMenhDe{
        return  this.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_SAI);  
    }

    static HANG_DUNG():BieuThucMenhDe{
        return  this.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_DUNG);  
    }

    static BIEUTHUCSOCAP_TU_BIEUTHUC(id:string, P:BieuThucMenhDe){ 
      let rs:BieuThucMenhDe = this.BIEU_THUC_SO_CAP(id);
      rs.cha = P.cha;
       
      return rs;
    }

    static IS_BIEU_THUC_SO_CAP(P:BieuThucMenhDe):boolean{
       return P.bieuThucCons.length==0 ; 
    }

    static IS_ROOT(P:BieuThucMenhDe):boolean{
        return P.cha == null;
    }
    
    static CHUYEN_CAP(P:BieuThucMenhDe, cha:BieuThucMenhDe ):BieuThucMenhDe{
        P.cha = cha.cha;
        return P;
    }

    static SAO_CHEP(P:BieuThucMenhDe):BieuThucMenhDe{
        if(this.IS_BIEU_THUC_SO_CAP(P)) return this.BIEU_THUC_SO_CAP(P.id) ;
        let rs = new BieuThucMenhDe();
        rs.bieuThucCons = [];
        for(let i:number = 0 ;i<P.bieuThucCons.length;i++){
            rs.bieuThucCons.push( this.SAO_CHEP(P.bieuThucCons[i])) ;
        }
        rs.toanTu = P.toanTu;
        return rs;
    }

    static DO_UU_TIEN(P:BieuThucMenhDe):number{
        if(Helper.IS_BIEU_THUC_SO_CAP(P)){
            if(P.toanTu.tenToanTu !== ToanTu.PHU_DINH)
               return 0;
            else return 0.5;
        }
        let rs:number = 0;
        for(let i:number=0;i<P.bieuThucCons.length;i++){
            if(!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
             rs+=this.DO_UU_TIEN(P.bieuThucCons[i])+0.1;
        }
  
        if(P.toanTu.tenToanTu === ToanTu.HOI || P.toanTu.tenToanTu === ToanTu.TUYEN)
          rs += (P.bieuThucCons.length-1); 

        if(P.toanTu.tenToanTu === ToanTu.TUONG_DUONG)
          rs += 4;

        if(P.toanTu.tenToanTu === ToanTu.KEO_THEO)
          rs+=2;
        return rs;
    }

    static DOI_NGAU(P:BieuThucMenhDe):BieuThucMenhDe{
        P = this.PHU_DINH_MENH_DE(P);
        if(Helper.IS_BIEU_THUC_SO_CAP(P))return P;
        let tt = P.bieuThucCons[0].toanTu.tenToanTu === ToanTu.HOI ? new ToanTuFactory().create(ToanTu.TUYEN) : new ToanTuFactory().create(ToanTu.HOI);          
        let builder = new BieuThucBuilder().addToanTu(tt.tenToanTu);
        for(let i:number=0;i<P.bieuThucCons[0].bieuThucCons.length;i++){
            // console.log(P.bieuThucCons[0].bieuThucCons[i].id)
            let bl:BieuThucMenhDe = Helper.PHU_DINH_MENH_DE(P.bieuThucCons[0].bieuThucCons[i]);
            builder.addBieuThucCon(bl);                                             
        }
        builder.addCha(P.cha);
        return builder.build();
        
    }

    static DE_MORGAN(P:BieuThucMenhDe):BieuThucMenhDe{
        if(Helper.IS_BIEU_THUC_SO_CAP(P))return P;
        let tt = P.bieuThucCons[0].toanTu.tenToanTu === ToanTu.HOI ? new ToanTuFactory().create(ToanTu.TUYEN) : new ToanTuFactory().create(ToanTu.HOI);          
        let builder = new BieuThucBuilder().addToanTu(tt.tenToanTu);
        for(let i:number=0;i<P.bieuThucCons[0].bieuThucCons.length;i++){
            // console.log(P.bieuThucCons[0].bieuThucCons[i].id)
            let bl:BieuThucMenhDe = Helper.PHU_DINH_MENH_DE(P.bieuThucCons[0].bieuThucCons[i]);
            builder.addBieuThucCon(bl);                                             
        }
        builder.addCha(P.cha);
        return builder.build(); 
    }

    static  IN (P:BieuThucMenhDe):string{
        if (Helper.IS_BIEU_THUC_SO_CAP(P)) {
            if (P.toanTu.tenToanTu == ToanTu.PHU_DINH) {
                // console.log('cai lon gi the')
                return P.toanTu.kyHieu + `${P.id.split('0')[1]}`;
            } else {
                if(P.id.includes('0'))
                return ToanTu.kyHieus[0] + `${P.id.split('0')[1]}`;
                return P.id;
            }
        }

        if (P.toanTu.tenToanTu == ToanTu.PHU_DINH) {
            // console.log(this.IN(P.bieuThucCons[0] ))
            return P.toanTu.kyHieu+`(${this.IN(P.bieuThucCons[0])})`
        }
        let str:string  = '';
        if(!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[0]))str+=`(${this.IN(P.bieuThucCons[0])})`;
        else str+= this.IN(P.bieuThucCons[0]);

        for(let i:number=1;i<P.bieuThucCons.length;i++){
            str+= P.toanTu.kyHieu;
            if(!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))str+=`(${this.IN(P.bieuThucCons[i])})`;
            else str+= this.IN(P.bieuThucCons[i]);
        }
       return str ; 
    }
}