"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XacDinhTinhChatQuanHe = void 0;
const BaiTap_1 = require("../../BaiTap/BaiTap");
const BieuThucDaiSo_1 = require("../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo");
const Helper_1 = require("../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper");
const QuanHe_1 = require("../ThanhPhanC/QuanHe");
const QuanHeDaiSo_1 = require("../ThanhPhanC/QuanHeDaiSo");
const TapHop_1 = require("../ThanhPhanC/TapHop");
const GiaiBaiQuanHeThuTu_1 = require("./GiaiBaiQuanHeThuTu");
class XacDinhTinhChatQuanHe extends BaiTap_1.BaiTap {
    giai(deBai) {
        // let quanHeDaiSo:QuanHeDaiSo;
        let bienCoSo = [];
        bienCoSo.push(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'));
        bienCoSo.push(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'));
        let left = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThucBuilder()
            .addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'))
            .addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'))
            .addOperator('+')
            .build();
        let right = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThucBuilder()
            .addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'))
            .addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('e'))
            .addOperator('-')
            .build();
        let A = new TapHop_1.TapHopBuilder().addArray([2, 4, 6, 8, 10, 12, 16, 20]).build();
        let quanHeDaiSo = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'), Helper_1.HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'), bienCoSo);
        let R = new QuanHe_1.QuanHeFactory().createQuanHeDieuKien(A, quanHeDaiSo);
        // R.cacTinhChat();
        // let A:TapHop = new TapHopBuilder().addArray([0,1,2,3,4,5,6,7,8,9]).build();
        // let quanHeDaiSo = new QuanHeDaiSoFactory().create_SO_CHAN(left,bienCoSo);
        // let R:QuanHe = new QuanHeFactory().createQuanHeDieuKien(A,quanHeDaiSo); 
        // let xdLTT:XacDinhLopTuongDuong = new XacDinhLopTuongDuong(R);    
        //  xdLTT.layLopTuongDuong()
        // .forEach(element => {
        //     console.log(element.toString());
        // });
        let gb = new GiaiBaiQuanHeThuTu_1.XacDinhBaiQuanHeThuTu(R);
        gb.xacDinh();
    }
}
exports.XacDinhTinhChatQuanHe = XacDinhTinhChatQuanHe;
