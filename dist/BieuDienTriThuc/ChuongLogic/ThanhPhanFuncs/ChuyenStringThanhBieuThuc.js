"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChuyenStringThanhBieuThuc = void 0;
const BieuThucMenhDe_1 = require("../ThanhPhanC/BieuThucMenhDe");
const ToanTuFactory_1 = require("../ThanhPhanOpts/ToanTuFactory");
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const Helper_1 = require("./Helper");
class ChuyenStringThanhBieuThuc {
    static chuyenDoi(chuoi) {
        let cha = null;
        let hienTai = new BieuThucMenhDe_1.BieuThucMenhDe();
        let toanTu = new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.NONE);
        for (let i = 0; i < chuoi.length; i++) {
            if (chuoi[i] === ' ')
                continue;
            if (chuoi[i] === '\n' || chuoi[i] === '\r')
                continue;
            else if (chuoi[i] === '1') {
                let bt_con = Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG);
                bt_con.cha = hienTai;
                hienTai.bieuThucCons.push(bt_con);
            }
            else if (chuoi[i] === '0') {
                let bt_con = Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI);
                bt_con.cha = hienTai;
                hienTai.bieuThucCons.push(bt_con);
            }
            else if (chuoi[i] === ')') {
                while (true) {
                    if (hienTai.cha !== null)
                        hienTai = hienTai.cha;
                    cha = hienTai.cha;
                    if (hienTai.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH)
                        break;
                }
            }
            else if (chuoi[i] === '(') {
                cha = hienTai;
                hienTai = new BieuThucMenhDe_1.BieuThucMenhDe();
                hienTai.cha = cha;
                cha.bieuThucCons.push(hienTai);
            }
            else if (!ToanTuLogic_1.ToanTu.kyHieus.includes(chuoi[i])) {
                if (hienTai.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH) {
                    let bt_con = Helper_1.Helper.BIEU_THUC_SO_CAP(chuoi[i]);
                    bt_con.cha = hienTai;
                    hienTai.bieuThucCons.push(bt_con);
                }
                else {
                    hienTai.id = chuoi[i];
                    while (true) {
                        if (hienTai.cha !== null)
                            hienTai = hienTai.cha;
                        cha = hienTai.cha;
                        //    console.log(hienTai);
                        if (hienTai.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH)
                            break;
                    }
                }
            }
            else if (ToanTuLogic_1.ToanTu.kyHieus.includes(chuoi[i])) {
                toanTu = new ToanTuFactory_1.ToanTuFactory().create2(chuoi[i]);
                if (toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH) {
                    hienTai.toanTu = toanTu;
                }
                else if (toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH) {
                    cha = hienTai;
                    hienTai = new BieuThucMenhDe_1.BieuThucMenhDe();
                    hienTai.cha = cha;
                    hienTai.toanTu = toanTu;
                    cha.bieuThucCons.push(hienTai);
                }
            }
        }
        if (!Helper_1.Helper.IS_BIEU_THUC_SO_CAP(hienTai) && hienTai.bieuThucCons.length === 1 && hienTai.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.NONE)
            return hienTai.bieuThucCons[0];
        return hienTai;
    }
}
exports.ChuyenStringThanhBieuThuc = ChuyenStringThanhBieuThuc;
