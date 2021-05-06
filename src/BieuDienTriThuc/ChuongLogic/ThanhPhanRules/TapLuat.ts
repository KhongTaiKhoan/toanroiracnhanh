import { Luat } from './Luat';
import { ILuat } from './ILuat';
import { BieuThucMenhDe } from '../ThanhPhanC/BieuThucMenhDe';
import { ToanTu } from '../ThanhPhanOpts/ToanTuLogic';
import { ToanTuFactory } from '../ThanhPhanOpts/ToanTuFactory';
import { BieuThucBuilder } from '../ThanhPhanC/BieuThucBuilder';
import { Helper } from '../ThanhPhanFuncs/Helper';
import { LuatMessage } from './LuatMessage';
export class TapLuat {
    private tapLuat: Luat[];
    
    constructor() {
        this.tapLuat = [];
        this.xayDungTapLuat();
    }

    xayDungTapLuat() {
        /// LUAT PHEP TUONG DUONG
        this.tapLuat.push(
            new Luat(1,"Luat phep tuong duong", new class implements ILuat {
                boKiemTra(P: BieuThucMenhDe): LuatMessage|null {
                    if(P.toanTu.tenToanTu === ToanTu.TUONG_DUONG)
                         return new LuatMessage(P);
                    return null;
                }
                ketQua(P: BieuThucMenhDe): BieuThucMenhDe {
                    let left:BieuThucMenhDe = P.bieuThucCons[0];
                    let right:BieuThucMenhDe = P.bieuThucCons[1];

                    let S: BieuThucMenhDe = new BieuThucBuilder()
                                                .addBieuThucCon(left)
                                                .addBieuThucCon(right)
                                                .addToanTu(ToanTu.KEO_THEO)
                                                .addCha(P)
                                                .build();

                    let R: BieuThucMenhDe = new BieuThucBuilder()
                                                .addBieuThucCon(right)
                                                .addBieuThucCon(left)
                                                .addToanTu(ToanTu.KEO_THEO)
                                                .addCha(P)
                                                .build();

                    let rs: BieuThucMenhDe = new BieuThucBuilder()
                                                .addBieuThucCon(S)
                                                .addBieuThucCon(R)
                                                .addToanTu(ToanTu.HOI)
                                                .addCha(P.cha)
                                                .build();
                    return rs;
                }
            }())
        );
        /// LUAT PHEP KEO THEO
        this.tapLuat.push(
            new Luat(2,"Luat phep keo theo", new class implements ILuat{
                boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                    if(P.toanTu.tenToanTu === ToanTu.KEO_THEO)
                          return new LuatMessage(P);
                    return null;
                }
                ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                    let left:BieuThucMenhDe = P.bieuThucCons[0];
                    let right:BieuThucMenhDe = P.bieuThucCons[1];
                    
                    let rs: BieuThucMenhDe = 
                    new BieuThucBuilder().addBieuThucCon(Helper.PHU_DINH_MENH_DE(left))
                                         .addBieuThucCon(right)
                                         .addToanTu(ToanTu.TUYEN)
                                         .addCha(P.cha)
                                         .build();
                                         
                    // console.log(rs.id);                     
                    return rs; 
                }
            }())
        );

        /// LUAT DONG NHAT
        this.tapLuat.push(
            new Luat(3,
            "Luat dong nhat",
            new class implements ILuat{
                boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                    if (P.toanTu.tenToanTu === ToanTu.TUYEN&& P.id.includes(BieuThucMenhDe.MA_HANG_SAI)){
                        let bt:BieuThucMenhDe= new BieuThucBuilder().addBieuThucCon(P.bieuThucCons[0])
                                                    .addBieuThucCon2(Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_SAI))
                                                    .addCha(P.cha)
                                                    .addToanTu(P.toanTu.tenToanTu)
                                                    .build();
                        return new LuatMessage(bt);
                    }
                    return null;
                }
                ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                    /// B1: LOAI BO HANG SAI
                    let index= P.bieuThucCons.findIndex(element=>element.id===BieuThucMenhDe.MA_HANG_SAI);
                    P.bieuThucCons.splice(index,1);
                    /// B2: NEU MENH DE CHI CON 1 BIEU THUC CON, MENH DE TRO THANH MENH DE SO CAP

                    
                    if(P.bieuThucCons.length === 1)
                        P = Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id,P);
                    
                    return P;
                }
            }()
        ));

        /// LUAT DONG NHAT
        this.tapLuat.push(
            new Luat(4,
            "Luat dong nhat",
            new class implements ILuat{
                boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                    if (P.toanTu.tenToanTu === ToanTu.HOI&& P.id.includes(BieuThucMenhDe.MA_HANG_DUNG))
                        return new LuatMessage( new BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[0])
                                                    .addBieuThucCon2(Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_DUNG))
                                                    .addCha(P.cha)
                                                    .addToanTu(P.toanTu.tenToanTu)
                                                    .build());
                    return null;
                }
                ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                    /// B1: LOAI BO HANG SAI
                    let index= P.bieuThucCons.findIndex(element=>element.id===BieuThucMenhDe.MA_HANG_DUNG);
                    P.bieuThucCons.splice(index,1);
                    /// B2: NEU MENH DE CHI CON 1 BIEU THUC CON, MENH DE TRO THANH MENH DE SO CAP
                    
                    if(P.bieuThucCons.length === 1)
                        P = Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id,P);
                    
                    return P;
                }
            }()
        ));

        /// LUAT NUOT
        this.tapLuat.push(
            new Luat(5,
                'Luat nuot',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        if(P.toanTu.tenToanTu === ToanTu.HOI && P.id.includes(BieuThucMenhDe.MA_HANG_SAI)){
                            return new LuatMessage(P);
                        }
                        return null
                    }
                    ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                        return Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(BieuThucMenhDe.MA_HANG_SAI,P);  
                    }
                }()
            )
        );

        /// LUAT NUOT
        this.tapLuat.push(
            new Luat(6,
                'Luat nuot',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        if (P.toanTu.tenToanTu === ToanTu.TUYEN && P.id.includes(BieuThucMenhDe.MA_HANG_DUNG))
                        return new LuatMessage(P);
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                        return Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(BieuThucMenhDe.MA_HANG_DUNG,P); 
                    }
                }()
            )
        );

        /// LUAT LUY DANG
        this.tapLuat.push(
            new Luat(7,
                'Luat luy dang',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let ktTrung:boolean = false;
                        let i:number=-1;
                        let j:number= -1;
                        for(i=0;i<P.bieuThucCons.length;i++){
                            for(j=0;j<P.bieuThucCons.length;j++){
                                if(i===j)continue;
                                if(P.bieuThucCons[i].id === P.bieuThucCons[j].id ){
                                    ktTrung = true;
                                    break;
                                }
                            }
                            if(ktTrung)break;
                        }
                        if ((P.toanTu.tenToanTu === ToanTu.HOI || P.toanTu.tenToanTu === ToanTu.TUYEN) && ktTrung)   {
                            return new LuatMessage( new BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[i])
                                                        .addBieuThucCon2(P.bieuThucCons[i])
                                                        .addToanTu(P.toanTu.tenToanTu)
                                                        .build()); 
                        }
                        return null;

                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                       let i:number = 0;
                       
                       i = P.bieuThucCons.findIndex(e=>e.id = con.bieuThuc.id);

                       P.bieuThucCons.splice(i,1);
                       if(P.bieuThucCons.length==1){
                           P =Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id,P); 
                       }
                       return P;  
                    }
                }()
            )
        )

        ///Luat Phu dinh kep
        this.tapLuat.push(
            new Luat(8,
                'Luat phu dinh kep',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        if(P.toanTu.tenToanTu === ToanTu.PHU_DINH && P.bieuThucCons[0].toanTu.tenToanTu == ToanTu.PHU_DINH )
                           return new LuatMessage(P);
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
                       let rs:BieuThucMenhDe= new BieuThucBuilder().addBieuThucCon(P.bieuThucCons[0].bieuThucCons[0])
                                                   .addToanTu(P.bieuThucCons[0].bieuThucCons[0].toanTu.tenToanTu)
                                                   .addCha(P.cha)
                                                   .build();
                        return Helper.CHUYEN_CAP(rs.bieuThucCons[0],rs);

                    }
                }()
            )
        );

        /// LUAT PHAN TU BU
        this.tapLuat.push(
            new Luat(9,
                'Luat phan tu bu',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let ktTrung:boolean = false;
                        let i:number=-1;
                        let j:number= -1;
                        
                        for(i=0;i<P.bieuThucCons.length;i++){
                            for(j=0;j<P.bieuThucCons.length;j++){
                                if(i===j)continue;
                                if(P.bieuThucCons[i].id === Helper.PHU_DINH_MENH_DE(Helper.SAO_CHEP(P.bieuThucCons[j])).id ){
                                    ktTrung = true;
                                    break;
                                }
                            }
                            if(ktTrung)break;
                        }
                       
                        let kt = P.toanTu.tenToanTu === ToanTu.TUYEN ||  P.toanTu.tenToanTu === ToanTu.HOI;
                        if(kt&&ktTrung){
                            return new LuatMessage(  new BieuThucBuilder().addBieuThucCon(P.bieuThucCons[i])
                                                       .addBieuThucCon(P.bieuThucCons[j])
                                                       .addToanTu(P.toanTu.tenToanTu)
                                                       .build(),i,j); 
                            
                        }
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        let index: number = con.msg1;
                        P.bieuThucCons.splice(index, 1);
                        index = P.bieuThucCons.findIndex(ele =>  ele.id == con.bieuThuc.bieuThucCons[1].id );
                        P.bieuThucCons.splice(index, 1);
                       
                        let rs:BieuThucMenhDe =   con.bieuThuc.toanTu.tenToanTu === ToanTu.HOI ? Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_SAI):Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_DUNG);
                        
                        if( P.bieuThucCons.length == 0 )
                            return rs;
                        P.bieuThucCons.push(rs);    
                        return P;
                    }
                }()
            )
        )
       
        //Luat hap thu
        this.tapLuat.push(
            new Luat(10,
                'Luat hap thu',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let i:number=0;
                        let j:number=0;
                        let kt:boolean = false;
                        for (i = 0; i < P.bieuThucCons.length; i++) {
                          for(j = 0;j < P.bieuThucCons.length;j++){
                            if(i===j)continue;   
                            if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[j]))continue;
                            if(P.bieuThucCons[j].bieuThucCons.length < 2)continue;
                            if(P.bieuThucCons[j].bieuThucCons[0].id === P.bieuThucCons[i].id || P.bieuThucCons[j].bieuThucCons[1].id === P.bieuThucCons[i].id){
                                kt=true;
                                break;
                            }
                          }
                          if(kt)break;
                        }
                        if(kt)
                        if(P.bieuThucCons[j].toanTu.tenToanTu !== P.toanTu.tenToanTu){
                               return new LuatMessage( new BieuThucBuilder().addBieuThucCon(P.bieuThucCons[i])
                                                           .addBieuThucCon(P.bieuThucCons[j])
                                                           .addToanTu(P.toanTu.tenToanTu)
                                                           .build(),j);
                               
                           }
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        let index:number = con.msg1;
                        P.bieuThucCons.splice(index,1);
                        
                        if(P.bieuThucCons.length==1){
                            P = Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id,P);
                        }
                        return P;
                    }
                }()
            )
        )
        
        /// LUAT PHAN PHOI
        this.tapLuat.push(
            new Luat(11,
                'Luat phan phoi',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let arr:number[][] = [];  //// CAC CAP CHI SO CHI CAC PHAN TU CHUNG TRONG HAI TAP DANG XET
                        let i:number = 0;         ///  CHI SO TAP TRAI TRONG BIEU THUC P
                        let j:number = 0;         ///  CHI SO TAP PHAI TRONG BIEU THUC P 
                        let kt:boolean = false;
                        for(i = 0;i<P.bieuThucCons.length;i++){
                            if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))continue;
                            for(j=0;j<P.bieuThucCons.length;j++){
                                if( i === j) continue;
                                if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[j]))continue;
                                for(let z:number=0;z<P.bieuThucCons[i].bieuThucCons.length;z++){
                                    let index:number = P.bieuThucCons[j].bieuThucCons.findIndex(e=>e.id === P.bieuThucCons[i].bieuThucCons[z].id);
                                    if(index !== -1){
                                        kt=true;
                                        arr.push([z,index]);
                                    }
                                }

                                if(kt)break;
                            }
                            if(kt)break;
                        }
                        if(kt)
                        if(P.bieuThucCons[i].toanTu.tenToanTu === P.bieuThucCons[j].toanTu.tenToanTu && P.bieuThucCons[i].toanTu.tenToanTu !== P.toanTu.tenToanTu){
                            return new LuatMessage( new BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[i])
                                                        .addBieuThucCon2(P.bieuThucCons[j])
                                                        .addToanTu(P.toanTu.tenToanTu)
                                                        .build(), arr,[i,j]); 
                        }
                        
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        /// PHAN GIONG NHAU GIUA CAC BEU THUC CON arr: LA CAP CHI SO CUA NO
                       let arr:number [][] = con.msg1;
                       /// BIEU THUC CON BEN TRAI
                       let l_ar:number[] = [];
                       //// BIEU THUC CON BEN PHAI
                       let r_ar:number[] = [];

                       /// CHUA CAC MANG TRUNG NHAU GIUA CAC BIEU THUC CON
                       let chung:BieuThucBuilder = new BieuThucBuilder().addCha(P);
                       if(arr.length > 1)
                           chung.addToanTu(con.bieuThuc.bieuThucCons[0].toanTu.tenToanTu);

                       /// TIEN HANH ADD CUA PHAN TU, DE TAO MOT BIEU THUC MOI LA CAC BIEU THUC CHUNG CUA CA HAI BIEU THUC CON    
                       for(let i:number=0;i<arr.length;i++){
                           chung.addBieuThucCon(con.bieuThuc.bieuThucCons[0].bieuThucCons[arr[i][0]]);
                           l_ar.push(arr[i][0]);
                           r_ar.push(arr[i][1]);
                       } 
                       
                       /// add lai vao bieu thuc ben con ben ttrai cac gia tri khong phai la giong nhau giua hai bieu thuc
                       let newBuilder:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                       for(let i:number=0;i<con.bieuThuc.bieuThucCons[0].bieuThucCons.length;i++){
                           if(l_ar.findIndex(e=>e === i)!== -1)continue;
                           newBuilder.addBieuThucCon(con.bieuThuc.bieuThucCons[0].bieuThucCons[i]);   
                       }

                       /// add lai vao bieu thuc ben con ben phai cac gia tri khong phai la giong nhau giua hai bieu thuc
                       for(let i:number=0;i<con.bieuThuc.bieuThucCons[1].bieuThucCons.length;i++){
                        if(r_ar.findIndex(e=>e === i)!== -1)continue;
                        newBuilder.addBieuThucCon(con.bieuThuc.bieuThucCons[1].bieuThucCons[i]);   
                       }
                      
                       
                       let newMd:BieuThucBuilder = new BieuThucBuilder().addBieuThucCon(chung.build())
                                                                        .addBieuThucCon(newBuilder.build())
                                                                        .addToanTu(con.bieuThuc.bieuThucCons[0].toanTu.tenToanTu);

                      
                        /// cuoi cung add lai cac bieu thuc con cua P ma khong ap dung vao luat phan phoi   
                        let finalBulider = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);                                            
                        let i:number=0;
                        for(i = 0;i<P.bieuThucCons.length;i++){
                            if(i!== con.msg2[0] && i!== con.msg2[1])
                            finalBulider.addBieuThucCon(P.bieuThucCons[i])
                        }
                        if(2 === P.bieuThucCons.length){
                            return newMd.build();
                        }    
                       P = finalBulider.addBieuThucCon(newMd.build()).build();
                       return P;
                        
                    }
                }()
            )
        );

        /// LUAT KET HOP
        this.tapLuat.push(
            new Luat(12,
                'Luat ket hop 1',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let tt:ToanTu = P.toanTu;
                        let kt:boolean = false;
                        let arr:number[] = [];
                        let builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(tt.tenToanTu);
                        if(P.toanTu.tenToanTu === ToanTu.PHU_DINH)return null;
                        for(let i:number = 0;i<P.bieuThucCons.length;i++){
                            if(!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])&& (tt.tenToanTu === P.bieuThucCons[i].toanTu.tenToanTu || tt.tenToanTu === ToanTu.NONE)){
                                kt = true; 
                                builder.addBieuThucCon(P.bieuThucCons[i]);
                                arr.push(i);
                            }
                        }
                        if(kt)
                        return new LuatMessage(builder.build(),arr);
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        let builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                        let index:number=0;
                        let arr:number[] = con.msg1;
                        for(let i:number=0;i<P.bieuThucCons.length;i++){
                            if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])){
                               builder.addBieuThucCon(P.bieuThucCons[i]);  
                            }else if(!arr.includes(i)){
                                builder.addBieuThucCon(P.bieuThucCons[i]);  
                            }
                            else{
                               for(let j:number=0;j<P.bieuThucCons[i].bieuThucCons.length;j++)
                                  builder.addBieuThucCon(P.bieuThucCons[i].bieuThucCons[j]);  
                            }
                        }
                        builder.addCha(P.cha);
                        return builder.build();

                    }
                }()
            )
        );

        /// LUAT DE MORGAN
        this.tapLuat.push(
            new Luat(13,
                'Luat De Morgan',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let builder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                        let count:number = 0;
                        if(P.bieuThucCons.length <= 1) return null;
                        for(let i:number=0;i<P.bieuThucCons.length;i++){
                            if(P.bieuThucCons[i].toanTu.tenToanTu === ToanTu.PHU_DINH){
                                builder.addBieuThucCon(P.bieuThucCons[i]);
                                count++;
                            }
                        }

                        if(count === P.bieuThucCons.length){
                            builder.addCha(P);
                            return new LuatMessage (builder.build());
                        }

                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        let tt:number = P.toanTu.tenToanTu ===  ToanTu.HOI ? ToanTu.TUYEN :ToanTu.HOI;
                        let builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(tt);
                        for(let i:number = 0 ;i<P.bieuThucCons.length;i++){
                            if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])){
                                builder.addBieuThucCon(Helper.BIEU_THUC_SO_CAP(P.bieuThucCons[i].id.split(ToanTu.PHU_DINH+"")[1]));
                            }else
                                builder.addBieuThucCon(P.bieuThucCons[i].bieuThucCons[0]);
                            
                            
                        }
                        return  new BieuThucBuilder().addToanTu(ToanTu.PHU_DINH).addBieuThucCon(builder.build()).build();
                       
                    }
                }()
            )
        )

        /// LUAT DE MORGAN
        this.tapLuat.push(
            new Luat(14,
                'Luat DE Morgan',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let tapLuat:TapLuat = new TapLuat();
                        let kt:boolean = true;
                        
                        /// KIEM TRA BIEU THUC CHA CO AP DUNG LUAT KHONG
                        for(let i:number=0;i<tapLuat.tapLuat.length;i++){
                            if(P.cha!==null)
                            if(tapLuat.tapLuat[i].boKiemTra(P.cha)!==null){
                               let id:number = tapLuat.tapLuat[i].id;
                               if(id>2&&id<=13){kt=false;break;}  
                            }
                        }
                       
                        if(kt)
                        if(P.toanTu.tenToanTu === ToanTu.PHU_DINH && !Helper.IS_BIEU_THUC_SO_CAP(P) ){
                            return new LuatMessage(P);
                        }
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe):BieuThucMenhDe{
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
                }()
            )
        );

        /// LUAT KET HOP
        this.tapLuat.push(
            new Luat(15,
            'Luat ket hop 2',
            new class implements ILuat{
                boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                    if(P.toanTu.tenToanTu === ToanTu.PHU_DINH) return null;
                    let bt = new BieuThucBuilder();
                    let kt:boolean = false;
                    let i:number = 0;
                    let j:number = 0;
                    bt.addToanTu (P.toanTu.tenToanTu);
                    for(let i:number= 0;i<P.bieuThucCons.length;i++){
                        if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                            bt.addBieuThucCon2(P.bieuThucCons[i]);
                    }
                    let b:BieuThucMenhDe = bt.build();                    
                    if(b.bieuThucCons.length < 2)return null;
                    for(i = 0; i<P.bieuThucCons.length;i++){
                        if(!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])){
                           for(j = 0;j<P.bieuThucCons[i].bieuThucCons.length;j++){
                            // if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i].bieuThucCons[j])) continue;
                               if(P.bieuThucCons[i].toanTu.tenToanTu !== b.toanTu.tenToanTu) break;
                               if(b.id.includes(P.bieuThucCons[i].bieuThucCons[j].id)){
                                   kt =true;
                               }
                           }  
                        }
                        
                    }
                    if(kt)return new LuatMessage (P,i,j);        
                    return null;
                }
                ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                    let bt:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                    let new_bt:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                    for(let i:number= 0;i<P.bieuThucCons.length;i++){
                        if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])){
                            let b:boolean = false;
                            for(let j:number = 0;j<con.bieuThuc.bieuThucCons.length;j++){
                                if(con.bieuThuc.bieuThucCons[j].id.includes(P.bieuThucCons[i].id)){
                                    b =true;
                                    bt.addBieuThucCon(P.bieuThucCons[i]);
                                    break;
                                }
                            }  
                            if(!b)
                            new_bt.addBieuThucCon(P.bieuThucCons[i]);
                        }
                        else new_bt.addBieuThucCon(P.bieuThucCons[i]);
                    }
                    let f_bt:BieuThucMenhDe = new_bt.addBieuThucCon(bt.build()).build();       
                    return f_bt;
                }
            }()
        ));

        /// LUAT PHU DINH KEP
        this.tapLuat.push(
            new Luat(
                16,
                'Luat phu dinh kep',
                new class implements ILuat {
                    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
                        let i:number = 0;
                        let j:number = 0;
                        let tapHopDoiNgau:BieuThucBuilder = new BieuThucBuilder();
                        let arr:number[]=[];
                        for(i=0;i<P.bieuThucCons.length;i++){
                            tapHopDoiNgau = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                            if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))continue;
                            if(P.bieuThucCons[i].toanTu.tenToanTu === P.toanTu.tenToanTu) continue;
                            for(j=0;j<P.bieuThucCons[i].bieuThucCons.length;j++){
                               let doiNgau:BieuThucMenhDe = Helper.DOI_NGAU(P.bieuThucCons[i].bieuThucCons[j]);
                               let index:number = P.bieuThucCons.findIndex(e=>e.id === doiNgau.id);
                               if(index!== -1){
                                   tapHopDoiNgau.addBieuThucCon2(P.bieuThucCons[index]);
                                   arr.push(index);
                               }
                            }

                            let bt: BieuThucMenhDe = tapHopDoiNgau.build();
                            if (bt.bieuThucCons.length >= 2 || (bt.bieuThucCons.length === 1 && !Helper.IS_BIEU_THUC_SO_CAP(bt))) {
                                // return new LuatMessage(bt, arr, i);
                                break;
                            }
                        }
                        let bt:BieuThucMenhDe = tapHopDoiNgau.build();
                        if(bt.bieuThucCons.length >= 2 || (bt.bieuThucCons.length === 1 && !Helper.IS_BIEU_THUC_SO_CAP(bt)) ){
                            return new LuatMessage(bt,arr,i);
                        }

                        return null;
                    }
                    ketQua(P: BieuThucMenhDe,con:LuatMessage): BieuThucMenhDe {
                        let id_duocChon:number = con.msg2;
                        let tapDoiNgau:number[] = con.msg1;
                        let builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                
                        for (let i: number = 0; i < P.bieuThucCons.length; i++){
                            if(tapDoiNgau.includes(i) && i !== id_duocChon){
                                let bt:BieuThucMenhDe = con.bieuThuc;
                                let tt = P.toanTu.tenToanTu === ToanTu.HOI ? new ToanTuFactory().create(ToanTu.TUYEN) : new ToanTuFactory().create(ToanTu.HOI);          

                                let con_builder = new BieuThucBuilder().addToanTu(tt.tenToanTu);
                                for(let j:number=0;j<bt.bieuThucCons.length;j++){
                                    con_builder.addBieuThucCon(Helper.DOI_NGAU(bt.bieuThucCons[j]));
                                }
                                builder.addBieuThucCon(Helper.PHU_DINH_MENH_DE(con_builder.build()));
                            }
                            else if(i === id_duocChon){
                                builder.addBieuThucCon(P.bieuThucCons[id_duocChon]);         
                            }
                            else 
                                builder.addBieuThucCon(P.bieuThucCons[i]);
                        }
                        
                        return builder.build();
                    }
                }()
        ))

        /// LUAT PHAN PHOI
        this.tapLuat.push(
            new Luat(16,
                'Luat phan phoi',
                new class implements ILuat{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        ///console.log(Helper.IS_ROOT(P));
                        if(Helper.IS_ROOT(P) && P.bieuThucCons.length >= 2){
                            let index:number = P.bieuThucCons.findIndex(e=> !Helper.IS_BIEU_THUC_SO_CAP(e));
                            let a:number = 0
                            if(index ===0 )a=1;
                            if(index !== -1){
                                
                               return new LuatMessage(new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu)
                                                                           .addBieuThucCon(P.bieuThucCons[a])
                                                                           .addBieuThucCon(P.bieuThucCons[index]).build(),index,a);
                            }else
                               return null;
                        }
                        return null;
                    }
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        let index:number = con.msg1;
                        let a:number = con.msg2;
                        let builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                        for(let i:number = 0 ;i<P.bieuThucCons.length;i++){
                            if(i!== a && i!== index){
                               builder.addBieuThucCon(P.bieuThucCons[i]);  
                            }
                        }
                        let n_builder:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.bieuThucCons[index].toanTu.tenToanTu);
                        for(let i:number= 0 ;i<P.bieuThucCons[index].bieuThucCons.length;i++){
                            let buil:BieuThucBuilder = new BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                            buil.addBieuThucCon(P.bieuThucCons[a])
                                .addBieuThucCon(P.bieuThucCons[index].bieuThucCons[i]);
                            n_builder.addBieuThucCon(buil.build());    
                        }
                        if(builder.sizeBuilder() === 0) {
                            return n_builder.build();
                        }
                        builder.addBieuThucCon( n_builder.build())
                        return builder.build();
                    }
                }()
            )
        );

      
    }
    

    duyetTapLuat(P:BieuThucMenhDe,luat:number[]):{bieuThuc:BieuThucMenhDe,bieuThucCon:BieuThucMenhDe,idLuat:number} {
        let num:number|undefined= luat.pop();
        
        for(let i:number=1;i<=this.tapLuat.length;i++){
            
            if (num !== undefined) {
                if ((num === 11 && i === 17) || (num === 16 && i === 11)) continue;
                if ((num === 12 && i === 15) || (num === 15 && i === 12)) continue;
                if ((num === 13 && i === 14) || (num === 14 && i === 13)) continue;
                if ((num === 8 && i === 16) || (num === 16 && i === 8)) continue;
            }
            let rs:{goc:BieuThucMenhDe,con:BieuThucMenhDe}|null= this.tapLuat[i-1].run(P);
            if(rs !== null){ 
              return {bieuThuc:rs.goc,bieuThucCon:rs.con,idLuat:i};   
            }
        }
        return {bieuThuc:P,bieuThucCon:P,idLuat:-1};    
    }

    apDungLuat(P:BieuThucMenhDe,id:number):BieuThucMenhDe|null{
      let mess =  this.tapLuat[id].boKiemTra(P);
      if(mess !== null)
         return mess.bieuThuc;
      return null;
    }

    getLuat(id:number):Luat{
        return this.tapLuat[id];
    }

}