import { PhanTuLietKe, TapHop, TapHopBuilder } from './TapHop';
import { TinhChatQuanHe, BoKiemTraTinhChat, BoKiemTraTinhChatLietKe, BoKiemTraTinhChatDieuKien } from '../ThanhPhanRules/TinhChatQuanHe';
import { QuanHeDaiSo } from './QuanHeDaiSo';
export class QuanHe extends TapHop{
    private _khongGianMau: TapHop = new TapHop();
    private _tinhChat: TinhChatQuanHe[] = [];
    
    private _boKiemTra: BoKiemTraTinhChat;
    

    constructor(khongGianMau: TapHop) {
        super();
        this._khongGianMau = khongGianMau;
        
        this._boKiemTra = new BoKiemTraTinhChatLietKe(this);
    }

    public cacTinhChat(){
        this.boKiemTra.generate();
        this.tinhChat = this.boKiemTra.check();
        for (let i = 0; i < this.tinhChat.length; i++) {
            if (this.tinhChat[i].active)
                console.log(`${i + 1}. Quan hệ có ${this.tinhChat[i].name}. Vì: `);
            else
                console.log(`${i + 1}. Quan hệ không có ${this.tinhChat[i].name}. Vì: \n`);
                
            this.tinhChat[i].describe.forEach(e=>{
                console.log(e);
            })
            
            console.log();
        }
    }


    //#region  GETTER AN SETTER
    public get khongGianMau(): TapHop {
        return this._khongGianMau;
    }
    public set khongGianMau(value: TapHop) {
        this._khongGianMau = value;
    }
    public get tinhChat(): TinhChatQuanHe[] {
        return this._tinhChat;
    }
    public set tinhChat(value: TinhChatQuanHe[]) {
        this._tinhChat = value;
    }
    public get boKiemTra(): BoKiemTraTinhChat {
        return this._boKiemTra;
    }
    public set boKiemTra(value: BoKiemTraTinhChat) {
        this._boKiemTra = value;
    }
    //#endregion

}


export class QuanHeFactory{
    
    createQuanHeLietKe(khongGianMau:TapHop,quanHe:number[][]):QuanHe{
      //  let A:TapHop = new TapHopBuilder().addArray(khongGianMau).build();
        let R:QuanHe = new QuanHe(khongGianMau);
        let arr:PhanTuLietKe[]=[];
        for (let i = 0; i < quanHe.length; i++) {
           arr.push(new PhanTuLietKe(quanHe[i]));
        }
        R.array = arr;
        return R; 
    }
    createQuanHeDieuKien(khongGianMau:TapHop,condition:QuanHeDaiSo):QuanHe{
        let R:QuanHe = new QuanHe(khongGianMau);
        
        R.dieuKien = condition;
        R.boKiemTra = new BoKiemTraTinhChatDieuKien(R);
        return R; 
    }
}
