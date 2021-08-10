"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperBieuThucDaiSo = void 0;
const BieuThucDaiSo_1 = require("../ThanhPhanC/BieuThucDaiSo");
var HelperBieuThucDaiSo;
(function (HelperBieuThucDaiSo) {
    class Helper {
        static TAO_HANG_SO(value) {
            let bt = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc();
            bt.value = value;
            bt.id = value + '';
            bt.operator = '';
            bt.kind = BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.HANG_SO;
            return bt;
        }
        static TAO_BIEN_SO(id) {
            let bt = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc();
            bt.id = id;
            bt.kind = BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.BIEN_SO;
            return bt;
        }
    }
    HelperBieuThucDaiSo.Helper = Helper;
})(HelperBieuThucDaiSo = exports.HelperBieuThucDaiSo || (exports.HelperBieuThucDaiSo = {}));
