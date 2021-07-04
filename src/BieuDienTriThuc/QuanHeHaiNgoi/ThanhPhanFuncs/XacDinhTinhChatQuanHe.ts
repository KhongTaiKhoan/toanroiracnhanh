import { BaiTap } from '../../BaiTap/BaiTap';
import { KhonGianSoNguyen } from '../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo';
import { HelperBieuThucDaiSo } from '../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper';
import { QuanHe, QuanHeFactory } from '../ThanhPhanC/QuanHe';
import { QuanHeDaiSo, QuanHeDaiSoFactory } from '../ThanhPhanC/QuanHeDaiSo';
import { TapHopBuilder, TapHop } from '../ThanhPhanC/TapHop';
import { XacDinhLopTuongDuong } from './LopTuongDuong';
import { LoiGiaiMenhDeTuongDuong } from '../../BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { XacDinhBaiQuanHeThuTu } from './GiaiBaiQuanHeThuTu';
export class XacDinhTinhChatQuanHe extends BaiTap{
    giai(deBai?: string) {
        

        // let quanHeDaiSo:QuanHeDaiSo;
        let bienCoSo:KhonGianSoNguyen.BieuThuc[]=[];
        bienCoSo.push(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'));
        bienCoSo.push(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'));
        let left:KhonGianSoNguyen.BieuThuc = new KhonGianSoNguyen.BieuThucBuilder()
                                                 .addChild(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'))
                                                 .addChild(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'))
                                                 .addOperator('+')
                                                 .build();

        let right:KhonGianSoNguyen.BieuThuc = new KhonGianSoNguyen.BieuThucBuilder()
                                                 .addChild(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'))
                                                 .addChild(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('e'))
                                                 .addOperator('-')
                                                 .build();

        let A:TapHop = new TapHopBuilder().addArray([2,4,6,8,10,12,16,20]).build();
        let quanHeDaiSo = new QuanHeDaiSoFactory().create_UOC_SO(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('a'),HelperBieuThucDaiSo.Helper.TAO_BIEN_SO('b'),bienCoSo);
        
        let R:QuanHe = new QuanHeFactory().createQuanHeDieuKien(A,quanHeDaiSo);
        // R.cacTinhChat();

        // let A:TapHop = new TapHopBuilder().addArray([0,1,2,3,4,5,6,7,8,9]).build();
        // let quanHeDaiSo = new QuanHeDaiSoFactory().create_SO_CHAN(left,bienCoSo);
        // let R:QuanHe = new QuanHeFactory().createQuanHeDieuKien(A,quanHeDaiSo); 

        // let xdLTT:XacDinhLopTuongDuong = new XacDinhLopTuongDuong(R);    
        //  xdLTT.layLopTuongDuong()
        // .forEach(element => {
        //     console.log(element.toString());
        // });

        let gb:XacDinhBaiQuanHeThuTu = new XacDinhBaiQuanHeThuTu(R);
        gb.xacDinh();
    }
    
}