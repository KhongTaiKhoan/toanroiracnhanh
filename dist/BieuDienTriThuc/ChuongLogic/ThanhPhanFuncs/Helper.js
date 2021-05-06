"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const BieuThucMenhDe_1 = require("../ThanhPhanC/BieuThucMenhDe");
const ToanTuFactory_1 = require("../ThanhPhanOpts/ToanTuFactory");
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const BieuThucBuilder_1 = require("../ThanhPhanC/BieuThucBuilder");
class Helper {
    static PHU_DINH_MENH_DE(P) {
        let rs;
        if (this.IS_BIEU_THUC_SO_CAP(P)) {
            if (!P.id.includes('0')) {
                return new BieuThucBuilder_1.BieuThucBuilder().addToanTu(ToanTuLogic_1.ToanTu.PHU_DINH)
                    .addID(P.id)
                    .build();
            }
            else {
                // console.log(P.id)
                return new BieuThucBuilder_1.BieuThucBuilder().addID(P.id.split('0')[1]).build();
            }
        }
        else {
            rs = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(P)
                .addToanTu(ToanTuLogic_1.ToanTu.PHU_DINH)
                .build();
        }
        return rs;
    }
    static BIEU_THUC_SO_CAP(id, toanTu) {
        let rs = new BieuThucMenhDe_1.BieuThucMenhDe();
        rs.id = id;
        if (toanTu !== undefined)
            rs.toanTu = new ToanTuFactory_1.ToanTuFactory().create(toanTu);
        return rs;
    }
    static HANG_SAI() {
        return this.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI);
    }
    static HANG_DUNG() {
        return this.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG);
    }
    static BIEUTHUCSOCAP_TU_BIEUTHUC(id, P) {
        let rs = this.BIEU_THUC_SO_CAP(id);
        rs.cha = P.cha;
        return rs;
    }
    static IS_BIEU_THUC_SO_CAP(P) {
        return P.bieuThucCons.length == 0;
    }
    static IS_ROOT(P) {
        return P.cha == null;
    }
    static CHUYEN_CAP(P, cha) {
        P.cha = cha.cha;
        return P;
    }
    static SAO_CHEP(P) {
        if (this.IS_BIEU_THUC_SO_CAP(P))
            return new BieuThucBuilder_1.BieuThucBuilder().addID(P.id).addToanTu(P.toanTu.tenToanTu).build();
        let rs = new BieuThucMenhDe_1.BieuThucMenhDe();
        rs.bieuThucCons = P.bieuThucCons;
        for (let i = 0; i < rs.bieuThucCons.length; i++) {
            rs.bieuThucCons[i] = this.SAO_CHEP(P.bieuThucCons[i]);
        }
        rs.toanTu = P.toanTu;
        return rs;
    }
    static DO_UU_TIEN(P) {
        if (Helper.IS_BIEU_THUC_SO_CAP(P)) {
            if (P.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH)
                return 0;
            else
                return 0.5;
        }
        let rs = 0;
        for (let i = 0; i < P.bieuThucCons.length; i++) {
            if (!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                rs += this.DO_UU_TIEN(P.bieuThucCons[i]) + 0.1;
        }
        if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI || P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN)
            rs += (P.bieuThucCons.length - 1);
        if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUONG_DUONG)
            rs += 4;
        if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO)
            rs += 2;
        return rs;
    }
    static DOI_NGAU(P) {
        P = this.PHU_DINH_MENH_DE(P);
        if (Helper.IS_BIEU_THUC_SO_CAP(P))
            return P;
        let tt = P.bieuThucCons[0].toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.TUYEN) : new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.HOI);
        let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(tt.tenToanTu);
        for (let i = 0; i < P.bieuThucCons[0].bieuThucCons.length; i++) {
            // console.log(P.bieuThucCons[0].bieuThucCons[i].id)
            let bl = Helper.PHU_DINH_MENH_DE(P.bieuThucCons[0].bieuThucCons[i]);
            builder.addBieuThucCon(bl);
        }
        builder.addCha(P.cha);
        return builder.build();
    }
    static IN(P) {
        if (Helper.IS_BIEU_THUC_SO_CAP(P)) {
            if (P.toanTu.tenToanTu == ToanTuLogic_1.ToanTu.PHU_DINH) {
                return P.toanTu.kyHieu + `${P.id.split('0')[1]}`;
            }
            else {
                if (P.id.includes('0'))
                    return ToanTuLogic_1.ToanTu.kyHieus[0] + `${P.id.split('0')[1]}`;
                return P.id;
            }
        }
        if (P.toanTu.tenToanTu == ToanTuLogic_1.ToanTu.PHU_DINH) {
            return P.toanTu.kyHieu + `( ${this.IN(P.bieuThucCons[0])} )`;
        }
        let str = '';
        if (!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[0]))
            str += `(${this.IN(P.bieuThucCons[0])})`;
        else
            str += this.IN(P.bieuThucCons[0]);
        for (let i = 1; i < P.bieuThucCons.length; i++) {
            str += P.toanTu.kyHieu;
            if (!Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                str += `(${this.IN(P.bieuThucCons[i])})`;
            else
                str += this.IN(P.bieuThucCons[i]);
        }
        return str;
    }
}
exports.Helper = Helper;
