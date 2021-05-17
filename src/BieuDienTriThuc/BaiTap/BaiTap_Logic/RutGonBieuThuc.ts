import { BieuThucMenhDe } from "../../ChuongLogic/ThanhPhanC/BieuThucMenhDe"
import { Helper } from '../../ChuongLogic/ThanhPhanFuncs/Helper';
import { TapLuat } from '../../ChuongLogic/ThanhPhanRules/TapLuatTuongDuong';
import { BaiTap } from '../BaiTap';
import { LoiGiaiChuyenDoi } from './LoiGiaiChuyenDoi';

export class RutGonBieuThuc extends BaiTap{
    
    private root:BieuThucMenhDe = new BieuThucMenhDe();
    private truyVet :number [] = [];
    private loiGia:LoiGiaiChuyenDoi  = new LoiGiaiChuyenDoi();
    constructor(root:BieuThucMenhDe){
        super();
        this.root=Helper.SAO_CHEP(root);
    }

    giai(): LoiGiaiChuyenDoi {

        // console.log(this.root.id);
        this.root= this.rutGon(this.root,null,-1);
        this.loiGia.ketQua = Helper.SAO_CHEP(this.root);
        return this.loiGia;
        
    }


    private rutGon(P: BieuThucMenhDe,cha:BieuThucMenhDe|null,id_con:number): BieuThucMenhDe {
        if (Helper.IS_BIEU_THUC_SO_CAP(P)) return P;

        let luatDuyetRoi: number[] = []
        let roll_back: BieuThucMenhDe[] = [];
        roll_back.push(P);
        this.truyVet.push(id_con);

        while (true) {
            for (let i: number = 0; i < P.bieuThucCons.length; i++) {
                if (Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])) continue;
                P.bieuThucCons[i] = this.rutGon(P.bieuThucCons[i],P, i);
                P.bieuThucCons[i].cha = P;

            }
            let rs = this.tapLuat.duyetTapLuat(P, luatDuyetRoi);
            if (rs.idLuat !== -1) {
                let p_id:string = P.id;
                luatDuyetRoi.push(rs.idLuat);
                P = rs.bieuThuc;
                P.cha = cha;
                // console.log(`${P.id}`);
                // console.log(P.cha);
                if (P.id !== p_id) {
                    let BieuThucChuyenDoi: BieuThucMenhDe | null = this.capNhat(P);
                    if (BieuThucChuyenDoi !== null){
                        this.loiGia.loiGiai.push({
                            idLuat: rs.idLuat,
                            bieuThucGoc: Helper.IN(BieuThucChuyenDoi),
                            bieuThucGoc_id: BieuThucChuyenDoi.id,
                            bieuThucApDung:Helper.IN( rs.bieuThucCon),
                            bieuThucKetQua: Helper.IN(P)
                        });
                    // console.log(`- Ap dung ${this.tapLuat.getLuat(rs.idLuat-1).tenLuat} cho ${rs.bieuThucCon.id}:\nDuoc ${P.id} \nNEN TA CO ${BieuThucChuyenDoi.id}\n`)    
                    
                 }
                }

                let doUT: BieuThucMenhDe | undefined = roll_back.pop();
                if (doUT !== undefined) {
                    if (Helper.DO_UU_TIEN(P) >= Helper.DO_UU_TIEN(doUT)) {
                        if (roll_back.length == 3) return roll_back[0];
                        roll_back.push(doUT);
                        roll_back.push(P);
                    }
                    else {
                        roll_back = [];
                        roll_back.push(P);
                    }
                }
            }else {
                ///console.log(`${P.id}`);
                break;
            }
          
        }
        this.truyVet.pop();
        return P;
    }

    capNhat(P:BieuThucMenhDe):BieuThucMenhDe|null{
        let node:BieuThucMenhDe = Helper.SAO_CHEP(P);
        node.cha = P.cha;
        for(let i:number=this.truyVet.length-1;i>=0;i--){
           if(node.cha === null || this.truyVet[i] ==-1) {
            //    console.log(this.root.id)
               return node;
            }
           else{             
            //    console.log(`${this.truyVet} --- ${this.truyVet[i]} -----${i}`); 
               let cha_clone = Helper.SAO_CHEP(node.cha);
               cha_clone.cha  = node.cha.cha;
               cha_clone.bieuThucCons[this.truyVet[i]] = node;  
               node = cha_clone;
            //    console.log(node.id);
           }
        } 
        return null
    }
}