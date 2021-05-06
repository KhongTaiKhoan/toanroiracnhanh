import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { ToanTuFactory } from "../ThanhPhanOpts/ToanTuFactory";
import { ToanTu } from "../ThanhPhanOpts/ToanTuLogic";
import { Helper } from './Helper';

export class ChuyenStringThanhBieuThuc{
    static chuyenDoi(chuoi:string):BieuThucMenhDe{
       let cha:BieuThucMenhDe|null = null;
       let hienTai:BieuThucMenhDe = new BieuThucMenhDe();
       let toanTu:ToanTu = new ToanTuFactory().create(ToanTu.NONE);
       
       for(let i:number=0;i<chuoi.length;i++){
            if (chuoi[i] === ' ') continue;
            else if (chuoi[i] === '1') {
                let bt_con = Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_DUNG);
                bt_con.cha = hienTai;
                hienTai.bieuThucCons.push(bt_con);
            }
            else if (chuoi[i] === '0') {
                let bt_con = Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe.MA_HANG_SAI);
                bt_con.cha = hienTai;
                hienTai.bieuThucCons.push(bt_con);
            }
            else if (chuoi[i] === ')') {
                while (true) {
                    if (hienTai.cha !== null)
                        hienTai = hienTai.cha;
                    cha = hienTai.cha;
                    if (hienTai.toanTu.tenToanTu !== ToanTu.PHU_DINH) break;
                }

            }

            else if (chuoi[i] === '(') {
                cha = hienTai;
                hienTai = new BieuThucMenhDe();
                hienTai.cha = cha;
                cha.bieuThucCons.push(hienTai);
            }

            else if (!ToanTu.kyHieus.includes(chuoi[i])) {

                if (hienTai.toanTu.tenToanTu !== ToanTu.PHU_DINH) {
                    let bt_con = Helper.BIEU_THUC_SO_CAP(chuoi[i]);
                    bt_con.cha = hienTai;
                    hienTai.bieuThucCons.push(bt_con);

                } else {

                    hienTai.id = chuoi[i];
                    while (true) {
                        if (hienTai.cha !== null)
                            hienTai = hienTai.cha;
                        cha = hienTai.cha;
                        //    console.log(hienTai);
                        if (hienTai.toanTu.tenToanTu !== ToanTu.PHU_DINH) break;
                    }
                }


            }

            else if (ToanTu.kyHieus.includes(chuoi[i])) {

                toanTu = new ToanTuFactory().create2(chuoi[i]);
                if (toanTu.tenToanTu !== ToanTu.PHU_DINH) {
                    hienTai.toanTu = toanTu;
                } else if (toanTu.tenToanTu === ToanTu.PHU_DINH) {
                    cha = hienTai;
                    hienTai = new BieuThucMenhDe();
                    hienTai.cha = cha;
                    hienTai.toanTu = toanTu;
                    cha.bieuThucCons.push(hienTai);
                }
            }
        }
        return hienTai;
    }
}