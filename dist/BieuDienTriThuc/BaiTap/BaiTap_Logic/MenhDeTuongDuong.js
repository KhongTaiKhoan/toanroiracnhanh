"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenhDeTuongDuong = void 0;
const BieuThucMenhDe_1 = require("../../ChuongLogic/ThanhPhanC/BieuThucMenhDe");
const BaiTap_1 = require("../BaiTap");
const Helper_1 = require("../../ChuongLogic/ThanhPhanFuncs/Helper");
const RutGonBieuThuc_1 = require("./RutGonBieuThuc");
const ChuyenStringThanhBieuThuc_1 = require("../../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
class MenhDeTuongDuong extends BaiTap_1.BaiTap {
    constructor(deBai) {
        super();
        this.deBai = deBai;
        this.VT = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.VP = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.vp_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.vt_clone = new BieuThucMenhDe_1.BieuThucMenhDe();
    }
    tao_VT_VP() {
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
    giai() {
        this.tao_VT_VP();
        let loiGiai = this.chuyenDoi(this.VT, this.VP);
        // console.log(loiGiai?.loiGiai[0]);
        if (loiGiai === null)
            console.log('khong giai duoc');
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
                kq.push({ btGoc: btGoc, btApDung: btApDung, btKetQua: btKetQua, luat });
            }
            return {
                kq: kq,
                VP: Helper_1.Helper.IN(this.vp_clone),
                VT: Helper_1.Helper.IN(this.vt_clone)
            };
        }
    }
    chuyenDoi(VT, VP) {
        let rutGon = new RutGonBieuThuc_1.RutGonBieuThuc(VT);
        /// RUT GON VE TRAI
        let loiGiaiTrai = rutGon.giai() || null;
        if (loiGiaiTrai === null) {
            return null;
        }
        /// RUT GON VE PHAI
        rutGon = new RutGonBieuThuc_1.RutGonBieuThuc(VP);
        let loiGiaPhai = rutGon.giai() || null;
        /// THUC HIEN QUA TRINH KET HOP SU KIEN
        if (loiGiaPhai === null || loiGiaPhai.loiGiai.length === 0) {
            // console.log(this.vp_clone.id);
            if (loiGiaiTrai.ketQua && loiGiaiTrai.ketQua.id === this.vp_clone.id)
                return loiGiaiTrai;
            return null;
        }
        let i = 0;
        for (i = 0; i < loiGiaPhai.loiGiai.length; i++) {
            if (loiGiaiTrai.ketQua !== null && loiGiaPhai.loiGiai[i].bieuThucGoc_id === loiGiaiTrai.ketQua.id)
                break;
        }
        if (i === loiGiaPhai.loiGiai.length)
            return null;
        let loiGiaiCuoiCung = loiGiaiTrai;
        loiGiaiCuoiCung.ketQua = VP;
        for (let j = i; j >= 0; j--) {
            if (j > 0) {
                // let goc = loiGiaPhai.loiGiai[i-1];
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
        return loiGiaiCuoiCung;
    }
}
exports.MenhDeTuongDuong = MenhDeTuongDuong;
