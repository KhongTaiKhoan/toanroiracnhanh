import { BaiTap } from '../BaiTap/BaiTap';
import { BieuThucMenhDe } from '../ChuongLogic/ThanhPhanC/BieuThucMenhDe';
import { BiaKarnaugh, NhomTeBao } from './BiaKarnaugh';
import { BiaKarNaugh4Bien } from './BiaKarnaugh4Bien';
import { BiaKarNaugh5Bien } from './BiaKarnaugh5Bien';
import { BieuThucBuilder } from '../ChuongLogic/ThanhPhanC/BieuThucBuilder';
import { Helper } from '../ChuongLogic/ThanhPhanFuncs/Helper';
import { ToanTu } from '../ChuongLogic/ThanhPhanOpts/ToanTuLogic';
import { BoQuanLyBiaKarNaugh, ChuyenDoiKarnaugh, KetQuaRutGonHamBoolean, QuanLyKarnaugh_Factory } from './BoQuanLyBiaKarNaugh';
import { ChuyenStringThanhBieuThuc } from '../ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
export class ToiUuHoa extends BaiTap{

   giai(deBai?: string) {
      if(!deBai)return null;

      let quanLyKarnaugh_Factory:QuanLyKarnaugh_Factory = new QuanLyKarnaugh_Factory(); 
      let quanLyBiaKarnaugh:BoQuanLyBiaKarNaugh|null=null;
      if(deBai.includes(',')){
         let num:number[]=[];
         let split=deBai.split(',');
         for (let i = 0; i < split.length-1; i++) {
            num.push(parseInt(split[i]));
         }
         // console.log(num);
         // console.log(parseInt(split[split.length-1]));
         quanLyBiaKarnaugh = quanLyKarnaugh_Factory.createByArrayNumber(num,parseInt(split[split.length-1]));

      }else {
         let bt:BieuThucMenhDe = ChuyenStringThanhBieuThuc.chuyenDoi(deBai);
         quanLyBiaKarnaugh = quanLyKarnaugh_Factory.createByBieuThuc(bt); 
      }

      quanLyBiaKarnaugh.duyet();
      return quanLyBiaKarnaugh.getKetQua();
   
   }
  
   
}