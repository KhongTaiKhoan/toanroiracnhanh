"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToiUuHoa = void 0;
const BaiTap_1 = require("../BaiTap/BaiTap");
const BoQuanLyBiaKarNaugh_1 = require("./BoQuanLyBiaKarNaugh");
const ChuyenStringThanhBieuThuc_1 = require("../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
class ToiUuHoa extends BaiTap_1.BaiTap {
    giai(deBai) {
        if (!deBai)
            return null;
        let quanLyKarnaugh_Factory = new BoQuanLyBiaKarNaugh_1.QuanLyKarnaugh_Factory();
        let quanLyBiaKarnaugh = null;
        if (deBai.includes(',')) {
            let num = [];
            let split = deBai.split(',');
            for (let i = 0; i < split.length - 1; i++) {
                num.push(parseInt(split[i]));
            }
            // console.log(num);
            // console.log(parseInt(split[split.length-1]));
            quanLyBiaKarnaugh = quanLyKarnaugh_Factory.createByArrayNumber(num, parseInt(split[split.length - 1]));
        }
        else {
            let bt = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(deBai);
            quanLyBiaKarnaugh = quanLyKarnaugh_Factory.createByBieuThuc(bt);
        }
        quanLyBiaKarnaugh.duyet();
        return quanLyBiaKarnaugh.getKetQua();
    }
}
exports.ToiUuHoa = ToiUuHoa;
