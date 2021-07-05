import { QuanHe } from "../ThanhPhanC/QuanHe";
import { TinhChatQuanHe } from '../ThanhPhanRules/TinhChatQuanHe';

export class PhanLoaiQuanHe{
    static TUONG_DUONG = 0;
    static THU_TU      = 1;
    static NONE        =-1;
    static phanLoai(loai:number,R:QuanHe):boolean{
        let tc:TinhChatQuanHe[] = R.cacTinhChat();
        let k =-1;
        if(tc[0].active && tc[1].active && tc[3].active){
            k=this.TUONG_DUONG;
        } else if(tc[0].active && tc[2].active && tc[3].active){
            k=this.THU_TU;
        }
        else k = this.NONE;
        return k===loai;
    }
}