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
 
      // let final:BieuThucMenhDe = ChuyenStringThanhBieuThuc
      // .chuyenDoi(`(¬a∧¬b∧¬c∧¬d)∨(¬a∧¬b∧¬c∧d)∨(¬a∧¬b∧c∧¬d)∨(¬a∧b∧¬c∧d)∨(a∧¬b∧¬c∧¬d)∨(a∧¬b∧ c∧¬d)`);


      let num:number[]=[0,4,6,8,12,13,14,15,16,17,18,21,24,25,26,28,29,31];

      let fac = new QuanLyKarnaugh_Factory();
      let taoKN:BoQuanLyBiaKarNaugh =  fac.createByArrayNumber(num,5);
      // console.log(final.id);
      taoKN.duyet();
      let n: KetQuaRutGonHamBoolean | null = taoKN.getKetQua();
      if (n !== null) {
         console.log(`\nDE BAI: \n${Helper.IN(n.deBai)}`);
         console.log('\nTE BAO LON: ')
         console.log(n.teBaoLon);
         for (let i = 0; i < n.bieuThucChuyenDoi.length; i++) {
            console.log('\nTE BAO THIET YEU:');
            console.log(Helper.IN(n.bieuThucChuyenDoi[i]));
         }
      } else {
         console.log('NULL');
      }
   }
  
   
}