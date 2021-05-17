import { BieuThucMenhDe } from "../../ChuongLogic/ThanhPhanC/BieuThucMenhDe";
import {BaiTap} from "../BaiTap"
import { BieuThucBuilder } from '../../ChuongLogic/ThanhPhanC/BieuThucBuilder';
import { ToanTu } from "../../ChuongLogic/ThanhPhanOpts/ToanTuLogic";
import { Helper } from '../../ChuongLogic/ThanhPhanFuncs/Helper';
import { RutGonBieuThuc } from './RutGonBieuThuc';
import { LoiGiaiChuyenDoi } from './LoiGiaiChuyenDoi';
import { ChuyenStringThanhBieuThuc } from '../../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
export class MenhDeTuongDuong extends BaiTap{
    private _VT: BieuThucMenhDe = new BieuThucMenhDe();
   
    private _VP: BieuThucMenhDe = new BieuThucMenhDe();
    
    private _vp_clone: BieuThucMenhDe = new BieuThucMenhDe();
    
    private _vt_clone: BieuThucMenhDe = new BieuThucMenhDe();




   
    private deBai:String = '';
    constructor(){
        super();
     
        this.VT = new BieuThucMenhDe();
        this.VP = new BieuThucMenhDe();
        this.vp_clone = new BieuThucMenhDe();
        this.vt_clone = new BieuThucMenhDe();
    }

    tao_VT_VP(deBai: string ){
        this.deBai  = deBai;
        if(this.deBai === '')return ;
        if(this.deBai.includes('\u2194')){
           let str_deBai:string[] = this.deBai.split('\u2194');
        //    console.log(str_deBai[0]);
           this.VT = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
           this.VP = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
           this.vp_clone = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vt_clone = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
        }else if('\u2261'){
            let str_deBai:string[] = this.deBai.split('\u2261');
            // console.log(str_deBai[0]);
            this.VT = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
            this.VP = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vp_clone = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vt_clone = ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
        }
        
    }
    


    //////
    giai(deBai?:string): LoiGiaiMenhDeTuongDuong[]|null {
        if(deBai !== undefined) 
            this.tao_VT_VP(deBai);   
        if(this.VP.id === '' || this.VT.id === '') {
            console.log('ID NULL');
            return null;
        }
        let loiGiai:LoiGiaiChuyenDoi|null =  this.chuyenDoi(this.VT,this.VP);
        
        // console.log(loiGiai?.loiGiai[0]);
        if(loiGiai===null){
            return null;
            console.log('khong giai duoc');
        }
        else{
            let kq:LoiGiaiMenhDeTuongDuong [] = [];
            loiGiai.loiGiai[loiGiai.loiGiai.length-1].bieuThucGoc = Helper.IN( this.vp_clone);
            for(let i:number=0;i<loiGiai.loiGiai.length;i++){
                // console.log(loiGiai.loiGiai[i])
                let btGoc:string = loiGiai.loiGiai[i].bieuThucGoc;
                let btGoc_id:string = loiGiai.loiGiai[i].bieuThucGoc_id;
                let btApDung:string = loiGiai.loiGiai[i].bieuThucApDung;
                let btKetQua:string = loiGiai.loiGiai[i].bieuThucKetQua;
                let luat:string = this.tapLuat.getLuat(loiGiai.loiGiai[i].idLuat-1).tenLuat;
                kq.push(new LoiGiaiMenhDeTuongDuong(btGoc,btApDung,btKetQua,luat));
               
            }
            return kq;
        }
    }  

    chuyenDoi(VT: BieuThucMenhDe, VP: BieuThucMenhDe): LoiGiaiChuyenDoi | null {
        let rutGon: RutGonBieuThuc = new RutGonBieuThuc(VT);
        let vt_null:boolean = false;
        let vp_null:boolean = false;
        /// RUT GON VE TRAI
        let loiGiaiTrai: LoiGiaiChuyenDoi | null = rutGon.giai() || null;
        if(loiGiaiTrai.loiGiai.length === 0){
            vt_null =true;
            loiGiaiTrai.loiGiai.push({
                bieuThucGoc_id: VT.id,
                bieuThucGoc:Helper.IN(VT),
                bieuThucApDung:'',
                bieuThucKetQua:'',
                idLuat: -1
            })
        }
        // loiGiaiTrai.loiGiai.forEach(e=>{
        //     console.log(`- Ap dung ${this.tapLuat.getLuat(e.idLuat-1).tenLuat}: cho ${e.bieuThucApDung} ta duoc ${e.bieuThucKetQua}`)
        //     console.log(e.bieuThucGoc_id);
        //     }
        // );
       
        /// RUT GON VE PHAI
        rutGon = new RutGonBieuThuc(VP);
        let loiGiaPhai: LoiGiaiChuyenDoi | null = rutGon.giai() || null;   
        if(loiGiaPhai.loiGiai.length === 0){
            vp_null = true
            loiGiaPhai.loiGiai.push({
                bieuThucGoc_id: VP.id,
                bieuThucGoc:Helper.IN(VP),
                bieuThucApDung:'',
                bieuThucKetQua:'',
                idLuat: -1
            })
        }
        // loiGiaPhai.loiGiai.forEach(e=>{
        //     console.log(`- Ap dung ${this.tapLuat.getLuat(e.idLuat-1).tenLuat}: cho ${e.bieuThucApDung} ta duoc ${e.bieuThucKetQua}`)
        //     console.log(e.bieuThucGoc_id);
        //     }
        // );
        
        // /// THUC HIEN QUA TRINH KET HOP SU KIEN
        // if(loiGiaPhai === null || loiGiaPhai.loiGiai.length === 0){
        //     // console.log(this.vp_clone.id);
        //     if(loiGiaiTrai.ketQua && loiGiaiTrai.ketQua.id === this.vp_clone.id)return loiGiaiTrai;
        //     return null;
        // }
        
        let i: number = 0;
        for (i = 0; i < loiGiaPhai.loiGiai.length; i++) {
            if (loiGiaiTrai.ketQua !== null && loiGiaPhai.loiGiai[i].bieuThucGoc_id=== loiGiaiTrai.ketQua.id) break;
        }
        if(i === loiGiaPhai.loiGiai.length)return null;
        // console.log(i);
    
        let loiGiaiCuoiCung = loiGiaiTrai;
        if(vt_null) return loiGiaPhai;
        if(vp_null) return loiGiaiTrai
        loiGiaiCuoiCung.ketQua = VP;
        for (let j: number = i ; j >= 0 ; j--) {
            if(j > 0){
               loiGiaiCuoiCung.loiGiai.push({
                   bieuThucGoc: loiGiaPhai.loiGiai[j-1].bieuThucGoc,
                   bieuThucGoc_id: loiGiaPhai.loiGiai[j-1].bieuThucGoc_id,
                   bieuThucKetQua: loiGiaPhai.loiGiai[j].bieuThucApDung,
                   bieuThucApDung: loiGiaPhai.loiGiai[j].bieuThucKetQua,
                   idLuat: loiGiaPhai.loiGiai[j].idLuat
               });
            }
            else{
                loiGiaiCuoiCung.loiGiai.push({
                    bieuThucGoc: '',
                    bieuThucGoc_id: VP.id,
                    bieuThucKetQua: loiGiaPhai.loiGiai[j].bieuThucApDung,
                    bieuThucApDung: loiGiaPhai.loiGiai[j].bieuThucKetQua,
                    idLuat: loiGiaPhai.loiGiai[j].idLuat
                });
            }
        }

        // console.log(loiGiaiCuoiCung.loiGiai.length);
        // loiGiaiCuoiCung.loiGiai.forEach(e=>{
        //     console.log(`- Ap dung ${this.tapLuat.getLuat(e.idLuat-1).tenLuat}: cho ${e.bieuThucApDung} ta duoc ${e.bieuThucKetQua}`)
        //     console.log(e.bieuThucGoc_id);
        //     }
        // );
        
        return loiGiaiCuoiCung;

    }

    public get VT(): BieuThucMenhDe {
        return this._VT;
    }
    public set VT(value: BieuThucMenhDe) {
        this._VT = value;
    }

    public get VP(): BieuThucMenhDe {
        return this._VP;
    }
    public set VP(value: BieuThucMenhDe) {
        this._VP = value;
    }



    public get vp_clone(): BieuThucMenhDe {
        return this._vp_clone;
    }
    public set vp_clone(value: BieuThucMenhDe) {
        this._vp_clone = value;
    }

    public get vt_clone(): BieuThucMenhDe {
        return this._vt_clone;
    }
    public set vt_clone(value: BieuThucMenhDe) {
        this._vt_clone = value;
    }
}

export class LoiGiaiMenhDeTuongDuong{
    btGoc:string = "";
    btApDung:string ="";
    btKetQua:string ="";
    luat:string="";

    constructor( btGoc:string,btApDung:string,btKetQua:string,luat:string){
        this.btApDung = btApDung;
        this.luat= luat;
        this.btGoc=btGoc;
        this.btKetQua = btKetQua;
    }
}