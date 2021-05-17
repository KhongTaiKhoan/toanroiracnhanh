import { BieuThucMenhDe } from '../../ChuongLogic/ThanhPhanC/BieuThucMenhDe';
import { BaiTap } from '../BaiTap';
import { Helper } from '../../ChuongLogic/ThanhPhanFuncs/Helper';
import { BieuThucBuilder } from '../../ChuongLogic/ThanhPhanC/BieuThucBuilder';
import { ToanTu } from '../../ChuongLogic/ThanhPhanOpts/ToanTuLogic';
import { TapSuyDien } from '../../ChuongLogic/ThanhPhanRules/TapSuyDien';
import { RutGonBieuThuc } from './RutGonBieuThuc';
import { LoiGiaiChuyenDoi } from './LoiGiaiChuyenDoi';
import { SuyDienNotify } from "./SuyDienNotify";
import { MenhDeTuongDuong, LoiGiaiMenhDeTuongDuong } from './MenhDeTuongDuong';
import { ChuyenStringThanhBieuThuc } from '../../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
export namespace SuyDien {
    export class SuyDienLoGic extends BaiTap implements SuyDienNotify {
        private giaThiet: BieuThucMenhDe = new BieuThucMenhDe();
        private tapLuatSuyDien: TapSuyDien;
        private ghiNho:LoiGiaiSuyDien[] = [];
        private loiGiai:LoiGiaiSuyDien[] = [];
        
        
        public static GIA_THIET: number = 0;
        public static KET_LUAN: number = 1;


        public static TIEP_TUC = 0;
        public static CHUAN_BI_KET_THUC = 1;
        public static KET_THUC = 2;

        constructor() {
            super();
            this.tapLuatSuyDien = new TapSuyDien(this);

        }
        giai(): any {
            // console.log('GIA THIET: ')
            // for (let i = 0; i < this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET].bieuThucCons.length; i++) {
            //     console.log(Helper.IN(this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET].bieuThucCons[i]));
            // }

            // console.log(`----------------\nKET LUAN ${Helper.IN(this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN])}\n`)
            if(!this.lapGiaiQuyet())return null;

            // console.log(this.ghiNho);
            // console.log(`\n-----------------------------\n`)
            this.getLoiGiai(this.ghiNho[this.ghiNho.length-1],{index:0});

            // this.loiGiai.forEach(e=>{
            //     let str = `${e.index}. ${Helper.IN(e.bieuThucKetQua)}    Áp dụng ${e.luat} cho `;
            //     for(let i=0;i<e.target.length;i++){
            //        str+= `(${e.target[i]}), `
            //     }
            //     str = str.substr(0,str.length-2);
            //     console.log(str);
            // })

            return this.loiGiai;
        }

        lapGiaiQuyet() {
            let ketLuan: BieuThucMenhDe = this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN];
            let giaThiet: BieuThucMenhDe = this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET];
            /// CAC BUOC XAY GIAI QUYET BAI TOAN

            // /// BUOC 1. LOAI BO PHEP HOI CHO CAC THANH PHAN SU KIEN (NEU CO)
            // for (let i: number = 0; i < giaThiet.bieuThucCons.length; i++) {
            //     if (Helper.IS_BIEU_THUC_SO_CAP(giaThiet.bieuThucCons[i])) continue;
            //     if (giaThiet.bieuThucCons[i].toanTu.tenToanTu === ToanTu.HOI) {
            //         for (let j: number = 0; j < giaThiet.bieuThucCons[i].bieuThucCons.length; j++) {
            //             giaThiet.bieuThucCons.push(giaThiet.bieuThucCons[i].bieuThucCons[j]);
            //         }

            //         giaThiet.bieuThucCons.splice(i, 1);
            //         i--;
            //     }
            // }
            let count = 2; /// NEU LAP LAI TRONG 3 lan ma khong tim dc luat thi thoat
            while (true) {
                /// BUOC 2. SAP XEP CAC MENH DE THEO HUONG HOP LY
                this.buocSapXep();
                /// BUOC 3. DUYET VA AP DUNG MENH DE VAO CAC LUAT
                let length = giaThiet.bieuThucCons.length;
                for (let i: number = 0; i < length; i++) {
                    if (Helper.IS_BIEU_THUC_SO_CAP(giaThiet.bieuThucCons[i])) continue;

                    let rs:number =   this.tapLuatSuyDien.suyDien(this.giaThiet,giaThiet.bieuThucCons[i]);
                    if (rs !== SuyDienLoGic.CHUAN_BI_KET_THUC) {
                        count=2;
                        /// BUOC 4. SO SANH KET QUA VA THU DUOC BANG CAC MENH DE TUONG DUONG VOI KET LUAN BAI TOAN
                        if(rs === SuyDienLoGic.KET_THUC){return true}


                        // console.log('\n-----------\nGIA THIET: ')
                        // for (let i = 0; i < this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET].bieuThucCons.length; i++) {
                        //     console.log(Helper.IN(this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET].bieuThucCons[i]));
                        // }
            
                        // console.log(`----------------\nKET LUAN ${Helper.IN(this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN])}\n`)
                        break;
                    }
                }

                count--;
                /// BUOC 5. LAP LAI BUOC 2, NEU KHONG AP DUNG LUAT NAO NUA, TA TIEN HANH KET LUAN
                if (count === 0) {
                    return false;
                }
            }

        }

        buocSapXep() {
            let mang: { diem: number, viTri: number }[] = [];
            let ketLuan: BieuThucMenhDe = this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN];
            let giaThiet: BieuThucMenhDe = this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET];

            let MAX: number = 1000;
            for (let i: number = 0; i < giaThiet.bieuThucCons.length; i++) {
                //// CHUA MENH DE
                let menhDe: BieuThucMenhDe = giaThiet.bieuThucCons[i];
                let diem: number = 0;
                if (Helper.IS_BIEU_THUC_SO_CAP(giaThiet.bieuThucCons[i])) {
                    mang.push({ diem: -1, viTri: i });
                    continue;
                }

                if (menhDe.toanTu.tenToanTu === ToanTu.KEO_THEO) {

                    let index: number = giaThiet.bieuThucCons.findIndex(e => { return e.id === menhDe.bieuThucCons[0].id })
                    if (index !== -1) diem += MAX;

                    index = giaThiet.bieuThucCons.findIndex(e => { return e.id === menhDe.bieuThucCons[1].id })
                    if (index !== -1) diem += MAX;

                    let rg_1: LoiGiaiChuyenDoi = new RutGonBieuThuc(menhDe.bieuThucCons[0]).giai();
                    let rg_2: LoiGiaiChuyenDoi = new RutGonBieuThuc(menhDe.bieuThucCons[1]).giai();
                    for (let j: number = 0; j < giaThiet.bieuThucCons.length; j++) {
                        if (i == j) continue;
                        let rg: LoiGiaiChuyenDoi = new RutGonBieuThuc(giaThiet.bieuThucCons[j]).giai();
                        if (rg_1.ketQua.id === rg.ketQua?.id || rg_2.ketQua.id === rg.ketQua.id) {
                            diem += MAX;
                            break;
                        }
                    }

                }
                let count: number = 0;
                for (let j: number = 0; j < ketLuan.bieuThucCons.length; j++) {
                    if (menhDe.id.includes(ketLuan.bieuThucCons[j].id)) count++;
                }
                if (count !== 0) diem += count;
                mang.push({ diem: diem, viTri: i });
            }

            mang.sort((i, j) => {
                if (i.diem < j.diem) return 1;
                if (i.diem > j.diem) return -1;
                return 0;
            });

            //    console.log(mang)lll
            let duyetRoi: number[] = [];
            for (let i: number = 0; i < mang.length; i++) {
                if (i === mang[i].viTri) continue;
                if (duyetRoi.includes(i)) continue;
                let temp: BieuThucMenhDe = giaThiet.bieuThucCons[mang[i].viTri];
                giaThiet.bieuThucCons[mang[i].viTri] = giaThiet.bieuThucCons[i];
                giaThiet.bieuThucCons[i] = temp;
                duyetRoi.push(mang[i].viTri);
            }



        }

        xayDungDeBai(gt:BieuThucMenhDe,kl:BieuThucMenhDe) {
            this.giaThiet.bieuThucCons.push(gt);
            this.giaThiet.bieuThucCons.push(kl);
           
            let giaThiet:BieuThucMenhDe=this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET];
            for(let i=0;i<giaThiet.bieuThucCons.length;i++){
                this.ghiNho.push(new LoiGiaiSuyDien(giaThiet.bieuThucCons[i],i,[-1],''));
            }
        }

        /// HAM DUNG DE XAC DINH MOT BIEU THUC TRONG TAP LOI GIAI
        truyVet(bt:BieuThucMenhDe):number{
            let loiGiaiSuyDien:LoiGiaiSuyDien|undefined= this.ghiNho.find(e=>e.bieuThucKetQua.id === bt.id);
            if(loiGiaiSuyDien !== undefined)return loiGiaiSuyDien.index;
            return -1;
        }

        //// TARGET la tap cac chi so ma cac menh de trong tap loi giai nay tac dong den nhau(dua vao luat) de sinh ra mot ket qua nao do 
        public themLoiGiai(data: dataNotiFy, target?:number[]):boolean {
            let giaThiet:BieuThucMenhDe=this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET];
            let ketLuan:BieuThucMenhDe=this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN];
            let target_:number []=[];

            if(target === undefined)
               data.target.forEach(e=>target_.push(this.truyVet(e)));
            else 
               target_ = target;

            let MAX_INDEX = this.getChiSoLoiGiaiLonNhat()+1;
            
            this.ghiNho.push(new LoiGiaiSuyDien(data.bieuThuc,MAX_INDEX,target_,data.tenLuat));

           

            if(this.soSanhKetQua(data.bieuThuc))return true;
            return false;

        }
        
        public soSanhKetQua(P:BieuThucMenhDe):boolean{
            
            if(P.id === this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN].id) return true;
            let md:MenhDeTuongDuong = new MenhDeTuongDuong();
            md.VT = P;
            md.VP = this.giaThiet.bieuThucCons[SuyDienLoGic.KET_LUAN];

            let detail:LoiGiaiMenhDeTuongDuong[]|null = md.giai();
            if(detail!== null){
                detail.forEach(e=>{
                    this.themLoiGiai(new SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),e.luat))
                });
                return true;
            }
            return false;
        }

        ghiSuKien(P:BieuThucMenhDe,target:BieuThucMenhDe[]){
            let giaThiet:BieuThucMenhDe=this.giaThiet.bieuThucCons[SuyDienLoGic.GIA_THIET];

            giaThiet.bieuThucCons.push(P);
            if(target !== undefined && target.length !== 0) {
                for(let i:number = 0;i<target.length;i++){
                    let index = giaThiet.bieuThucCons.findIndex(e=>e.id === target[i].id) ;
                    if(index !== -1){
                        if(Helper.IS_BIEU_THUC_SO_CAP (giaThiet.bieuThucCons[index]))continue;
                        giaThiet.bieuThucCons.splice(index,1);
                    }
                }
            }
        }
     
        getChiSoLoiGiaiLonNhat():number{
            return this.ghiNho[this.ghiNho.length-1].index;
        }

        
        getLoiGiai(L: LoiGiaiSuyDien, index: { index: number }): { index: number } {
            let t: number[] = [];
            if (L.target[0] !== -1)
                for (let i = 0; i < L.target.length; i++) {
                    let chiSo = this.loiGiai.findIndex(e => e.bieuThucKetQua.id === this.ghiNho[L.target[i]].bieuThucKetQua.id);
                    if (chiSo === -1)
                        t.push(this.getLoiGiai(this.ghiNho[L.target[i]], index).index);
                    else
                        t.push(this.loiGiai[chiSo].index);
                }
            else t.push(-1);

            index.index++;
            this.loiGiai.push(new LoiGiaiSuyDien(L.bieuThucKetQua, index.index, t, L.luat));
            return index;
        }

    }

    export class dataNotiFy {
        public bieuThuc: BieuThucMenhDe = new BieuThucMenhDe;
        public tenLuat: string = "";
        public target:BieuThucMenhDe[] = []; 
        constructor(bieuThuc: BieuThucMenhDe, tenLuat: string,target?:BieuThucMenhDe[]) {
            this.bieuThuc = bieuThuc;
            this.tenLuat = tenLuat;
            if(target !== undefined)
            this.target=target;
        }
    }
}

export class LoiGiaiSuyDien{
    bieuThucKetQua: BieuThucMenhDe;
    index:number;
    target:number[];
    luat:string;
    constructor(bieuThucKetQua: BieuThucMenhDe,index:number,target:number[],luat:string){
        this.bieuThucKetQua = bieuThucKetQua;
        this.luat = luat;
        this.target = target;
        this.index = index;
    }
}