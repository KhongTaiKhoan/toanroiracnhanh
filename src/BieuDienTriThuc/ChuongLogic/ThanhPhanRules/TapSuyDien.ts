import { Luat } from './Luat';
import { BieuThucMenhDe } from '../ThanhPhanC/BieuThucMenhDe';
import { LuatMessage } from './LuatMessage';
import { DieuKien } from './DieuKienLuat';
import { KetQua } from './KetQuaLuat';
import { BieuThucBuilder } from '../ThanhPhanC/BieuThucBuilder';
import { ToanTu } from '../ThanhPhanOpts/ToanTuLogic';
import { Helper } from '../ThanhPhanFuncs/Helper';

import { TapLuat } from './TapLuatTuongDuong';
import { SuyDienNotify } from '../../BaiTap/BaiTap_Logic/SuyDienNotify';
import { SuyDien } from '../../BaiTap/BaiTap_Logic/SuyLuanLogic';
import { LoiGiaiMenhDeTuongDuong, MenhDeTuongDuong } from '../../BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { ChuyenStringThanhBieuThuc } from '../ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
export class TapSuyDien{
    private tapLuat:Luat [] = [];
    private suyDienNotiFyObject : SuyDienNotify ; 


    public static LUAT_HOP = 0;
    public static LUAT_RUT_GON = 1;
    public static TAM_DOAN_LUAN_KHANG_DINH = 2;
    public static TAM_DOAN_LUAN_PHU_DINH = 3;


    public static BANG_LUAT:string [] = ['Luật hợp','Luật rút gọn','luật tam đoạn luận khẳng định',
    'luật tam đoạn luận phủ định','luật tam đoạn luận giả định','luật tam đoạn luận loại trừ','luật loại bỏ mâu thuẫn'] ;
    // public static LUAT_CONG = 0;
    constructor(suyDien :SuyDienNotify){
        this.tapLuat = [];
        this.suyDienNotiFyObject = suyDien;
        this.xayDungTapLuat();
    }


    xayDungTapLuat(): void {
        //#region RUT GON
        this.tapLuat.push(
            new Luat(
                0,
                'Luật rút gọn',
                new class implements DieuKien{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let luan:BieuThucMenhDe = P.bieuThucCons[0];
                        if( Helper.IS_BIEU_THUC_SO_CAP(luan))return null;
                        if(luan.toanTu.tenToanTu === ToanTu.KEO_THEO || luan.toanTu.tenToanTu === ToanTu.TUONG_DUONG)return null;
                        
                        
                        let datas:SuyDien.dataNotiFy []=[];
                        let back:BieuThucMenhDe = Helper.SAO_CHEP(luan);
                                                
                        if(luan.toanTu.tenToanTu === ToanTu.PHU_DINH && !Helper.IS_BIEU_THUC_SO_CAP(luan)){
                            let tapLuan:TapLuat = new TapLuat();
                            luan =  tapLuan.getLuat(TapLuat.LUAT_DE_MORGAN).nhanKetQua(luan);
                            datas.push(new SuyDien.dataNotiFy(luan,tapLuan.getLuat(TapLuat.LUAT_DE_MORGAN).tenLuat));
                        }
                        if(luan.toanTu.tenToanTu === ToanTu.HOI){
                            return new LuatMessage(luan,back,datas);
                        }
                        luan = back;
                        return null;
                    }
                }(),
                new class implements KetQua{
                    ketQua(P:BieuThucMenhDe,con :LuatMessage):BieuThucMenhDe{
                        return con.bieuThuc;
                    }
                }
            )
        )  
        //#endregion 
 
        //#region Luat tam doan luan khang dinh
        this.tapLuat.push(
            new Luat(
                1,
                'Tam đoạn luận khẳng định',
                new class implements DieuKien {
                    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
                        let giaThiet: BieuThucMenhDe = P.bieuThucCons[1].bieuThucCons[0];
                        let luan:BieuThucMenhDe = P.bieuThucCons[0]; 
                        let i:number = 0;   
                        let back = Helper.SAO_CHEP(luan);
                        if(luan.toanTu.tenToanTu !== ToanTu.KEO_THEO || Helper.IS_BIEU_THUC_SO_CAP(luan)) return null;
    
                        /// BIEU THUC VE PHAI KHONG CAN TACH RA
                        for(i=0;i<giaThiet.bieuThucCons.length;i++){
                            if(giaThiet.bieuThucCons[i].id === luan.id)continue;
                            if(luan.bieuThucCons[0].id === giaThiet.bieuThucCons[i].id)
                            return new LuatMessage(luan.bieuThucCons[1],giaThiet.bieuThucCons[i]); 
    
                            
                            let tuongDuong:MenhDeTuongDuong = new MenhDeTuongDuong();
                            tuongDuong.VT = giaThiet.bieuThucCons[i]//Helper.SAO_CHEP();    
                            tuongDuong.VP = luan.bieuThucCons[0]; ///Helper.SAO_CHEP();
                            let loiGiaiChuyenDoi :LoiGiaiMenhDeTuongDuong[]|null = tuongDuong.giai();       
    
                            if(loiGiaiChuyenDoi !== null ){
                               let datas: SuyDien.dataNotiFy[] = [];
                            //    let tapTuongDuong:TapLuat= new TapLuat();
                               loiGiaiChuyenDoi.forEach(
                                   e=>{
                                        datas.push(new SuyDien.dataNotiFy( ChuyenStringThanhBieuThuc.chuyenDoi(e.btGoc),
                                        e.luat));
                                   });
                                return new LuatMessage(
                                    luan.bieuThucCons[1],giaThiet.bieuThucCons[i],datas
                                );
                            }
                        }                          
                      
                        //#region  TIEN HANH TACH VE PHAI RA KHI CHUA DAU HOI
                        let VT  = luan.bieuThucCons[0];
                        if(Helper.IS_BIEU_THUC_SO_CAP(VT))return null;
                        let datas:SuyDien.dataNotiFy []=[];
                           //// TIM CAC MENH DE LIEN QUAN DEN MENH DE CON
                        let builder :BieuThucBuilder = new BieuThucBuilder().addToanTu(ToanTu.HOI);
                        let tv:number[] =[];
                        for(let j=0;j<VT.bieuThucCons.length;j++){
                            let index = giaThiet.bieuThucCons.findIndex(e=>{
                                return e.id == VT.bieuThucCons[j].id || e.id == Helper.PHU_DINH_MENH_DE(VT.bieuThucCons[j]).id;
                            })
                            if(index ===-1) return null
                            tv.push(index); 
                        }
                        let hop:BieuThucMenhDe[] = [];
                        for(i=0;i<tv.length;i++){
                            builder.addBieuThucCon2(giaThiet.bieuThucCons[tv[i]]);
                            hop.push(giaThiet.bieuThucCons[tv[i]]);
                        }
                        let medtd:MenhDeTuongDuong = new  MenhDeTuongDuong();
                        medtd.VT = builder.build();
                        medtd.VP = Helper.SAO_CHEP(VT);
                        let loiGiai:LoiGiaiMenhDeTuongDuong[]|null = medtd.giai(); 
                        // console.log(loiGiai);
                        if(loiGiai !== null){
                            // console.log("NULL");
                            datas.push(new SuyDien.dataNotiFy(builder.build(),TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_HOP],hop));
                            loiGiai.forEach(
                                e=>{
                                    datas.push(new SuyDien.dataNotiFy( ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),
                                    e.luat));
                            });
    
                            return new LuatMessage(luan.bieuThucCons[1],builder.build(),datas);
                        }   
    
    
                        //#endregion                      
                        luan = back; 
                        return null;
                    }
                }(),
                new class implements KetQua {
                    ketQua(P: BieuThucMenhDe,con:LuatMessage): BieuThucMenhDe {
                         
                         return con.bieuThuc;
                    }
                }()
            )
        );
        //#endregion    

        //#region Tam doan luan phu dinh
        this.tapLuat.push(
            new Luat(
            2,
            'Tam đoạn luận phủ định' ,
            new class implements DieuKien{
                boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                    let giaThiet: BieuThucMenhDe = P.bieuThucCons[1].bieuThucCons[0];
                    let luan:BieuThucMenhDe = P.bieuThucCons[0]; 
                    let i:number = 0;   

                    if(luan.toanTu.tenToanTu !== ToanTu.KEO_THEO || Helper.IS_BIEU_THUC_SO_CAP(luan)) return null;

                    /// BIEU THUC VE PHAI KHONG CAN TACH RA
                    for(i=0;i<giaThiet.bieuThucCons.length;i++){
                        if(giaThiet.bieuThucCons[i].id === luan.id)continue;
                        if(luan.bieuThucCons[1].id === Helper.PHU_DINH_MENH_DE(giaThiet.bieuThucCons[i]).id ||
                           luan.bieuThucCons[1].id === Helper.DOI_NGAU(giaThiet.bieuThucCons[i]).id)
                        return new LuatMessage(Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]),giaThiet.bieuThucCons[i]); 

                        let tuongDuong:MenhDeTuongDuong = new MenhDeTuongDuong();
                        tuongDuong.VP = Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[1]);
                        tuongDuong.VT = giaThiet.bieuThucCons[i];//Helper.SAO_CHEP();    
                            let loiGiaiChuyenDoi :LoiGiaiMenhDeTuongDuong[]|null = tuongDuong.giai();       

                        if(loiGiaiChuyenDoi !== null ){
                           let datas: SuyDien.dataNotiFy[] = [];
                           loiGiaiChuyenDoi.forEach(
                               e=>{
                                    datas.push(new SuyDien.dataNotiFy( ChuyenStringThanhBieuThuc.chuyenDoi(e.btGoc),
                                    e.luat));
                               });
                            return new LuatMessage(
                                Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]),giaThiet.bieuThucCons[i],datas
                            );
                        }
                    }                          
                  
                    //#region  TIEN HANH TACH VE PHAI RA KHI CHUA DAU HOI
                    let VP  = luan.bieuThucCons[1];
                    if(Helper.IS_BIEU_THUC_SO_CAP(VP))return null;
                    let datas:SuyDien.dataNotiFy []=[];
                       //// TIM CAC MENH DE LIEN QUAN DEN MENH DE CON
                    let builder :BieuThucBuilder = new BieuThucBuilder().addToanTu(ToanTu.HOI);
                    let tv:number[] =[];
                    for(let j=0;j<VP.bieuThucCons.length;j++){
                        let index = giaThiet.bieuThucCons.findIndex(e=>{
                            return e.id == VP.bieuThucCons[j].id || e.id == Helper.PHU_DINH_MENH_DE(VP.bieuThucCons[j]).id;
                        })
                        if(index ===-1) return null
                        tv.push(index); 
                    }
                    let hop:BieuThucMenhDe[] = [];
                    for(i=0;i<tv.length;i++){
                        builder.addBieuThucCon2(giaThiet.bieuThucCons[tv[i]]);
                        hop.push(giaThiet.bieuThucCons[tv[i]]);
                    }
                    let medtd:MenhDeTuongDuong = new  MenhDeTuongDuong();
                    medtd.VT = builder.build();
                    medtd.VP = Helper.PHU_DINH_MENH_DE(VP);
                    let loiGiai:LoiGiaiMenhDeTuongDuong[]|null = medtd.giai(); 

                    // console.log(loiGiai);
                    if(loiGiai !== null){
                        // console.log("NULL");
                        datas.push(new SuyDien.dataNotiFy(builder.build(),TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_HOP],hop));
                        loiGiai.forEach(
                            e=>{
                                datas.push(new SuyDien.dataNotiFy( ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),
                                e.luat));
                        });

                        return new LuatMessage(Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]),builder.build(),datas);
                    }   
                    //#endregion
                    return null;
                }
            }(),
            new class implements KetQua{
                ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                    return con.bieuThuc;
                }
            }()  
            )
        )
        //#endregion

        //#region  Tam doan luan gia dinh
        this.tapLuat.push(
            new Luat(
                2,
                'Tam đoạn luận giả định',
                new class implements DieuKien{
                    boKiemTra(P:BieuThucMenhDe):LuatMessage|null{
                        let luan:BieuThucMenhDe = P.bieuThucCons[0];
                        let giaThiet:BieuThucMenhDe = P.bieuThucCons[1].bieuThucCons[0]; 
                        if(luan.toanTu.tenToanTu !== ToanTu.KEO_THEO) return null;
                        let VT:BieuThucMenhDe = luan.bieuThucCons[0];
                        let datas:SuyDien.dataNotiFy[] = [];
                        /// KIEM TRA MA KHONG CA GOP LAI
                        for(let i:number = 0 ;i<giaThiet.bieuThucCons.length;i++){
                            if(giaThiet.bieuThucCons[i].toanTu.tenToanTu !== ToanTu.KEO_THEO)continue;
                            if(VT.id === giaThiet.bieuThucCons[i].bieuThucCons[1].id){
                                let bt:BieuThucMenhDe= new BieuThucBuilder().addBieuThucCon(giaThiet.bieuThucCons[i].bieuThucCons[0])
                                                    .addBieuThucCon(luan.bieuThucCons[1])
                                                    .addToanTu(ToanTu.KEO_THEO)
                                                    .build();
                                return new LuatMessage(bt,giaThiet.bieuThucCons[i]);
                            }
                            
                            // let md:MenhDeTuongDuong = new MenhDeTuongDuong();
                            // md.VT = giaThiet.bieuThucCons[i].bieuThucCons[1]// Helper.SAO_CHEP();
                            // md.VP =  VT;//Helper.SAO_CHEP(VT);
                            // let loiGiai:LoiGiaiMenhDeTuongDuong[]|null = md.giai();
                            // if(loiGiai !== null){
                            //     loiGiai.forEach(e=>{
                            //         datas.push(new SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),e.luat)) 
                            //     });
                            //     let bt:BieuThucMenhDe= new BieuThucBuilder().addBieuThucCon(giaThiet.bieuThucCons[i].bieuThucCons[0])
                            //                         .addBieuThucCon(luan.bieuThucCons[1])
                            //                         .addToanTu(ToanTu.KEO_THEO)
                            //                         .build();
                            //     return new LuatMessage(bt,i,datas);
                            // }
                        }
     
                        return null;
                    }
                }(),
                new class implements KetQua{
                    ketQua(P:BieuThucMenhDe,con:LuatMessage):BieuThucMenhDe{
                        // let giaThiet = P.bieuThucCons[1];
                        // let bt_1:BieuThucMenhDe = con.bieuThuc;
                        // let bt_2:BieuThucMenhDe = giaThiet.bieuThucCons[con.msg1];


                        return con.bieuThuc;
                    }
                }()
            )
        )
        //#endregion

        //#region Tam doan luan loai tru
        this.tapLuat.push(
            new Luat(
                4,
                'Tam đoạn luận loại trừ',
                new class implements DieuKien {
                    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
                        let luan: BieuThucMenhDe = P.bieuThucCons[0];
                        let giaThiet: BieuThucMenhDe = P.bieuThucCons[1].bieuThucCons[0];

                        let i: number = 0;
                        let j: number = 0;
                        let count = false;
                        let datas:SuyDien.dataNotiFy [] = [];
                        if (luan.toanTu.tenToanTu !== ToanTu.TUYEN) return null;
                        for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                            
                            for (j = 0; j < luan.bieuThucCons.length; j++) {
                                let md = new MenhDeTuongDuong();
                                md.VP = Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]);
                                md.VT = giaThiet.bieuThucCons[i];
                                let loiGiai:LoiGiaiMenhDeTuongDuong[]|null = md.giai();
                                if(loiGiai!== null){
                                    loiGiai.forEach(e=>{
                                        datas.push(new SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),e.luat))
                                    }) ;
                                    count = true;
                                    luan.bieuThucCons.splice(j, 1);
                                    if (luan.bieuThucCons.length === 1)
                                        luan = luan.bieuThucCons[0];
                                    break;
                                }
                            }
                            if(count)
                            return new LuatMessage(luan,giaThiet.bieuThucCons[i],datas);
                        }
                        // if(count)
                        return null;
                    }
                }(),
                new class implements KetQua {
                    ketQua(P: BieuThucMenhDe, con: LuatMessage) {
                        // let giaThiet: BieuThucMenhDe = P.bieuThucCons[1];
                        // let luan: BieuThucMenhDe = P.bieuThucCons[0];

                        // let i=con.msg1;
                        // for (let j:number = 0; j < luan.bieuThucCons.length; j++) {
                        //     let md = new MenhDeTuongDuong();
                        //     md.VP = Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]);
                        //     md.VT = giaThiet.bieuThucCons[i];
                        //     let loiGiai: LoiGiaiMenhDeTuongDuong[] | null = md.giai();
                        //     if (loiGiai !== null) {
                               
                        //     }
                        // }

                        return con.bieuThuc;
                    }
                }()
            )
        )
        //#endregion

        //#region Loai bo mau thuan
        this.tapLuat.push(
            new Luat(
                5,
                'Loại bỏ mâu thuẫn',
                new class implements DieuKien {
                    boKiemTra(P: BieuThucMenhDe): LuatMessage | null {
                        let luan: BieuThucMenhDe = P.bieuThucCons[0];
                        let giaThiet: BieuThucMenhDe = P.bieuThucCons[1].bieuThucCons[0];
 
                        let i: number = 0;
                        let j: number = 0;

                        if(luan.toanTu.tenToanTu === ToanTu.KEO_THEO){
                            let vt:BieuThucMenhDe = luan.bieuThucCons[0];
                            for(i=0;i<giaThiet.bieuThucCons.length;i++){
                                
                                if(giaThiet.bieuThucCons[i].id === luan.id ) continue;
                                if(giaThiet.bieuThucCons[i].toanTu.tenToanTu !== luan.toanTu.tenToanTu) continue;
                                if(giaThiet.bieuThucCons[i].bieuThucCons[0].id === Helper.PHU_DINH_MENH_DE(vt).id ||
                                giaThiet.bieuThucCons[i].bieuThucCons[0].id == Helper.DOI_NGAU(vt).id){
                                    return new LuatMessage(
                                        new BieuThucBuilder()
                                        .addBieuThucCon2(luan.bieuThucCons[1])
                                        .addBieuThucCon2(giaThiet.bieuThucCons[i].bieuThucCons[0])
                                        .addToanTu(ToanTu.TUYEN)
                                        .build(),
                                        giaThiet.bieuThucCons[i])
                                }
                                     
                            }
                        }

                        ////CHUYEN DOI THANH PHEP HOI
                        let datas:SuyDien.dataNotiFy[]=[];
                        if(luan.toanTu.tenToanTu === ToanTu.KEO_THEO){
                            let luatTuongDuong:TapLuat = new TapLuat();
                            luan = luatTuongDuong.getLuat(1).nhanKetQua(luan) ;
                            datas.push(new SuyDien.dataNotiFy(Helper.SAO_CHEP(luan),'Luật phép kéo theo'));
                        }

                        if (luan.toanTu.tenToanTu === ToanTu.TUYEN) {
                            for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                                if (giaThiet.bieuThucCons[i].id === luan.id) continue;
                                if(giaThiet.bieuThucCons[i].toanTu.tenToanTu !== luan.toanTu.tenToanTu) continue;

                                let kt:boolean = false; 
                                let builde:BieuThucBuilder = new BieuThucBuilder().addToanTu(ToanTu.TUYEN);
                                let m:number [] = [];
                                   
                                for(j=0;j<luan.bieuThucCons.length;j++){
                                    let index:number = giaThiet.bieuThucCons[i].bieuThucCons.findIndex(e=>{return e.id === Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]).id ||
                                       e.id == Helper.DOI_NGAU(luan.bieuThucCons[j]).id});
                                    
                                    if(index !== -1) {m.push(index); kt=true;}
                                    
                                    if(index === -1 && kt )   
                                    builde.addBieuThucCon2(luan.bieuThucCons[j])
                                }
                                if(kt){
                                    for(let z=0;z<giaThiet.bieuThucCons[i].bieuThucCons.length;z++){
                                        if(m.includes(z)) continue;
                                        builde.addBieuThucCon2(giaThiet.bieuThucCons[i].bieuThucCons[z]);

                                    }
                                    return new LuatMessage(
                                        builde.build(),
                                        giaThiet.bieuThucCons[i],
                                        datas
                                    );
                                }
                            }
                        }
                        

                        return null;
                    }
                }(),
                new class implements KetQua {
                    ketQua(P: BieuThucMenhDe, con: LuatMessage): BieuThucMenhDe {
                    
                        return con.bieuThuc;
                    }
                }()
            )
        )
        //#endregion Loai bo mau thuan

    }


    suyDien(P:BieuThucMenhDe,luan:BieuThucMenhDe):number{
        let luan_clone = Helper.SAO_CHEP(luan);
        let newP: BieuThucMenhDe = new BieuThucBuilder().addBieuThucCon2(luan).addBieuThucCon2(P).addToanTu(ToanTu.HOI).build();
        for (let i: number = 0; i < this.tapLuat.length; i++) {
            let mess: LuatMessage | null = this.tapLuat[i].boKiemTra(newP);
            if (mess !== null) {
                let rs = this.tapLuat[i].nhanKetQua(newP, mess);
                let kt: boolean = false;
                let chiSoTrongLoiGiai = -1;

                //// THEM CAC LUAT CHUYEN DOI TUONG DUONG
                if (mess.msg2 !== undefined && mess.msg2 != []) {
                   
                    let datas: SuyDien.dataNotiFy[] = mess.msg2;
                    for (let j: number = 0; j < datas.length; j++) {
                        if (datas[j].target.length === 0) {
                            ///// TRUONG HOP LUAT CHUYEN DOI
                            if (chiSoTrongLoiGiai === -1) 
                               chiSoTrongLoiGiai = this.suyDienNotiFyObject.truyVet(mess.msg1);
                            kt = this.suyDienNotiFyObject.themLoiGiai(datas[j], [chiSoTrongLoiGiai]);
                            chiSoTrongLoiGiai = this.suyDienNotiFyObject.getChiSoLoiGiaiLonNhat();
                        }
                        else
                            //// TRUONG HOP LUAT HOP
                            kt = this.suyDienNotiFyObject.themLoiGiai(datas[j]);

                            if (kt) return SuyDien.SuyDienLoGic.KET_THUC;
                        }

                }

                // console.log(luan.id);
                if (i === TapSuyDien.LUAT_RUT_GON -1) {
                    kt = this.rutGonKetQua(rs,mess.msg1,chiSoTrongLoiGiai);
                }
                else {
                    this.suyDienNotiFyObject.ghiSuKien(rs,[luan_clone,mess.msg1]);
                    // if(chiSoTrongLoiGiai===-1)
                       kt = this.suyDienNotiFyObject.themLoiGiai(new SuyDien.dataNotiFy(rs, TapSuyDien.BANG_LUAT[i + 1], [luan_clone,mess.msg1]));
                    // else kt = this.suyDienNotiFyObject.themLoiGiai(new SuyDien.dataNotiFy(rs, TapSuyDien.BANG_LUAT[i + 1], [luan_clone,mess.msg1]),[chiSoTrongLoiGiai]);
                }
                if (kt)
                    return SuyDien.SuyDienLoGic.KET_THUC;
                else
                    return SuyDien.SuyDienLoGic.TIEP_TUC;
            }
        }
        return SuyDien.SuyDienLoGic.CHUAN_BI_KET_THUC;
    }

    getLuatSuyDien(index: number): Luat {
        return this.tapLuat[index];
    }


    ///// XU LY LUAT
    private rutGonKetQua(P: BieuThucMenhDe,Back:BieuThucMenhDe,chiSo?:number): boolean {

        /// LOAI BO DAU HOI
        for (let j: number = 0; j < P.bieuThucCons.length; j++) {
            this.suyDienNotiFyObject.ghiSuKien(P.bieuThucCons[j], [Back]);
            if (chiSo && chiSo!==-1)
                this.suyDienNotiFyObject.themLoiGiai(new SuyDien.dataNotiFy(
                    P.bieuThucCons[j], TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_RUT_GON], [Back]
                ), [chiSo]);
            else
                this.suyDienNotiFyObject.themLoiGiai(new SuyDien.dataNotiFy(
                    P.bieuThucCons[j], TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_RUT_GON], [Back]
                ));
            if (this.suyDienNotiFyObject.soSanhKetQua(P.bieuThucCons[j])) return true;
        }
        return false;

    }

}