"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RutGonBieuThuc = void 0;
const BieuThucMenhDe_1 = require("../../ChuongLogic/ThanhPhanC/BieuThucMenhDe");
const Helper_1 = require("../../ChuongLogic/ThanhPhanFuncs/Helper");
const BaiTap_1 = require("../BaiTap");
const LoiGiaiChuyenDoi_1 = require("./LoiGiaiChuyenDoi");
class RutGonBieuThuc extends BaiTap_1.BaiTap {
    constructor(root) {
        super();
        this.root = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.truyVet = [];
        this.loiGia = new LoiGiaiChuyenDoi_1.LoiGiaiChuyenDoi();
        this.root = root;
    }
    giai() {
        this.root = this.rutGon(this.root, null, -1);
        this.loiGia.ketQua = this.root;
        // console.log(this.loiGia.loiGiai[0]);
        return this.loiGia;
    }
    rutGon(P, cha, id_con) {
        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P))
            return P;
        let luatDuyetRoi = [];
        let roll_back = [];
        roll_back.push(P);
        this.truyVet.push(id_con);
        while (true) {
            for (let i = 0; i < P.bieuThucCons.length; i++) {
                if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                    continue;
                P.bieuThucCons[i] = this.rutGon(P.bieuThucCons[i], P, i);
                P.bieuThucCons[i].cha = P;
            }
            let rs = this.tapLuat.duyetTapLuat(P, luatDuyetRoi);
            if (rs.idLuat !== -1) {
                let p_id = P.id;
                luatDuyetRoi.push(rs.idLuat);
                P = rs.bieuThuc;
                P.cha = cha;
                // console.log(`${P.id}`);
                // console.log(P.cha);
                if (P.id !== p_id) {
                    let BieuThucChuyenDoi = this.capNhat(P);
                    if (BieuThucChuyenDoi !== null) {
                        this.loiGia.loiGiai.push({
                            idLuat: rs.idLuat,
                            bieuThucGoc: Helper_1.Helper.IN(BieuThucChuyenDoi),
                            bieuThucGoc_id: BieuThucChuyenDoi.id,
                            bieuThucApDung: Helper_1.Helper.IN(rs.bieuThucCon),
                            bieuThucKetQua: Helper_1.Helper.IN(P)
                        });
                        // console.log(`- Ap dung ${this.tapLuat.getLuat(rs.idLuat-1).tenLuat} cho ${rs.bieuThucCon.id}:\nDuoc ${P.id} \nNEN TA CO ${BieuThucChuyenDoi.id}\n`)    
                    }
                }
                let doUT = roll_back.pop();
                if (doUT !== undefined) {
                    if (Helper_1.Helper.DO_UU_TIEN(P) >= Helper_1.Helper.DO_UU_TIEN(doUT)) {
                        if (roll_back.length == 3)
                            return roll_back[0];
                        roll_back.push(doUT);
                        roll_back.push(P);
                    }
                    else {
                        roll_back = [];
                        roll_back.push(P);
                    }
                }
            }
            else {
                ///console.log(`${P.id}`);
                break;
            }
        }
        this.truyVet.pop();
        return P;
    }
    capNhat(P) {
        let node = Helper_1.Helper.SAO_CHEP(P);
        node.cha = P.cha;
        for (let i = this.truyVet.length - 1; i >= 0; i--) {
            if (node.cha === null || this.truyVet[i] == -1) {
                //    console.log(this.root.id)
                return node;
            }
            else {
                //    console.log(`${this.truyVet} --- ${this.truyVet[i]} -----${i}`); 
                let cha_clone = Helper_1.Helper.SAO_CHEP(node.cha);
                cha_clone.cha = node.cha.cha;
                cha_clone.bieuThucCons[this.truyVet[i]] = node;
                node = cha_clone;
                //    console.log(node.id);
            }
        }
        return null;
    }
}
exports.RutGonBieuThuc = RutGonBieuThuc;
