"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoiGiaiMenhDeTuongDuong = exports.MenhDeTuongDuong = void 0;
const BieuThucMenhDe_1 = require("../../ChuongLogic/ThanhPhanC/BieuThucMenhDe");
const BaiTap_1 = require("../BaiTap");
const Helper_1 = require("../../ChuongLogic/ThanhPhanFuncs/Helper");
const RutGonBieuThuc_1 = require("./RutGonBieuThuc");
const ChuyenStringThanhBieuThuc_1 = require("../../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
class MenhDeTuongDuong extends BaiTap_1.BaiTap {
    constructor() {
        super();
        this._VT = new BieuThucMenhDe_1.BieuThucMenhDe();
        this._VP = new BieuThucMenhDe_1.BieuThucMenhDe();
        this._vp_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
        this._vt_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.deBai = '';
        this.VT = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.VP = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.vp_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.vt_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
    }
    tao_VT_VP(deBai) {
        this.deBai = deBai;
        if (this.deBai === '')
            return;
        if (this.deBai.includes('\u2194')) {
            let str_deBai = this.deBai.split('\u2194');
            //    console.log(str_deBai[0]);
            this.VT = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
            this.VP = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vp_clone = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vt_clone = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
        }
        else if ('\u2261') {
            let str_deBai = this.deBai.split('\u2261');
            // console.log(str_deBai[0]);
            this.VT = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
            this.VP = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vp_clone = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[1]);
            this.vt_clone = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(str_deBai[0]);
        }
    }
    //////
    giai(deBai) {
        if (deBai !== undefined)
            this.tao_VT_VP(deBai);
        if (this.VP.id === '' || this.VT.id === '') {
            console.log('ID NULL');
            return null;
        }
        let loiGiai = this.chuyenDoi(this.VT, this.VP);
        // console.log(loiGiai?.loiGiai[0]);
        if (loiGiai === null) {
            return null;
            console.log('khong giai duoc');
        }
        else {
            let kq = [];
            loiGiai.loiGiai[loiGiai.loiGiai.length - 1].bieuThucGoc = Helper_1.Helper.IN(this.vp_clone);
            for (let i = 0; i < loiGiai.loiGiai.length; i++) {
                // console.log(loiGiai.loiGiai[i])
                let btGoc = loiGiai.loiGiai[i].bieuThucGoc;
                let btGoc_id = loiGiai.loiGiai[i].bieuThucGoc_id;
                let btApDung = loiGiai.loiGiai[i].bieuThucApDung;
                let btKetQua = loiGiai.loiGiai[i].bieuThucKetQua;
                let luat = this.tapLuat.getLuat(loiGiai.loiGiai[i].idLuat - 1).tenLuat;
                kq.push(new LoiGiaiMenhDeTuongDuong(btGoc, btApDung, btKetQua, luat));
            }
            return kq;
        }
    }
    chuyenDoi(VT, VP) {
        let rutGon = new RutGonBieuThuc_1.RutGonBieuThuc(VT);
        let vt_null = false;
        let vp_null = false;
        /// RUT GON VE TRAI
        let loiGiaiTrai = rutGon.giai() || null;
        if (loiGiaiTrai.loiGiai.length === 0) {
            vt_null = true;
            loiGiaiTrai.loiGiai.push({
                bieuThucGoc_id: VT.id,
                bieuThucGoc: Helper_1.Helper.IN(VT),
                bieuThucApDung: '',
                bieuThucKetQua: '',
                idLuat: -1
            });
        }
        // loiGiaiTrai.loiGiai.forEach(e=>{
        //     console.log(`- Ap dung ${this.tapLuat.getLuat(e.idLuat-1).tenLuat}: cho ${e.bieuThucApDung} ta duoc ${e.bieuThucKetQua}`)
        //     console.log(e.bieuThucGoc_id);
        //     }
        // );
        /// RUT GON VE PHAI
        rutGon = new RutGonBieuThuc_1.RutGonBieuThuc(VP);
        let loiGiaPhai = rutGon.giai() || null;
        if (loiGiaPhai.loiGiai.length === 0) {
            vp_null = true;
            loiGiaPhai.loiGiai.push({
                bieuThucGoc_id: VP.id,
                bieuThucGoc: Helper_1.Helper.IN(VP),
                bieuThucApDung: '',
                bieuThucKetQua: '',
                idLuat: -1
            });
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
        let i = 0;
        for (i = 0; i < loiGiaPhai.loiGiai.length; i++) {
            if (loiGiaiTrai.ketQua !== null && loiGiaPhai.loiGiai[i].bieuThucGoc_id === loiGiaiTrai.ketQua.id)
                break;
        }
        if (i === loiGiaPhai.loiGiai.length)
            return null;
        // console.log(i);
        let loiGiaiCuoiCung = loiGiaiTrai;
        if (vt_null)
            return loiGiaPhai;
        if (vp_null)
            return loiGiaiTrai;
        loiGiaiCuoiCung.ketQua = VP;
        for (let j = i; j >= 0; j--) {
            if (j > 0) {
                loiGiaiCuoiCung.loiGiai.push({
                    bieuThucGoc: loiGiaPhai.loiGiai[j - 1].bieuThucGoc,
                    bieuThucGoc_id: loiGiaPhai.loiGiai[j - 1].bieuThucGoc_id,
                    bieuThucKetQua: loiGiaPhai.loiGiai[j].bieuThucApDung,
                    bieuThucApDung: loiGiaPhai.loiGiai[j].bieuThucKetQua,
                    idLuat: loiGiaPhai.loiGiai[j].idLuat
                });
            }
            else {
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
    get VT() {
        return this._VT;
    }
    set VT(value) {
        this._VT = value;
    }
    get VP() {
        return this._VP;
    }
    set VP(value) {
        this._VP = value;
    }
    get vp_clone() {
        return this._vp_clone;
    }
    set vp_clone(value) {
        this._vp_clone = value;
    }
    get vt_clone() {
        return this._vt_clone;
    }
    set vt_clone(value) {
        this._vt_clone = value;
    }
}
exports.MenhDeTuongDuong = MenhDeTuongDuong;
class LoiGiaiMenhDeTuongDuong {
    constructor(btGoc, btApDung, btKetQua, luat) {
        this.btGoc = "";
        this.btApDung = "";
        this.btKetQua = "";
        this.luat = "";
        this.btApDung = btApDung;
        this.luat = luat;
        this.btGoc = btGoc;
        this.btKetQua = btKetQua;
    }
}
exports.LoiGiaiMenhDeTuongDuong = LoiGiaiMenhDeTuongDuong;
