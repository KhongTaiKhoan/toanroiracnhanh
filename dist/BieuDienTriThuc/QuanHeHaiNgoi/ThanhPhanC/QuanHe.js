"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuanHeFactory = exports.QuanHe = void 0;
const TapHop_1 = require("./TapHop");
const TinhChatQuanHe_1 = require("../ThanhPhanRules/TinhChatQuanHe");
class QuanHe extends TapHop_1.TapHop {
    constructor(khongGianMau) {
        super();
        this._khongGianMau = new TapHop_1.TapHop();
        this._tinhChat = [];
        this._khongGianMau = khongGianMau;
        this._boKiemTra = new TinhChatQuanHe_1.BoKiemTraTinhChatLietKe(this);
    }
    cacTinhChat() {
        this.boKiemTra.generate();
        this.tinhChat = this.boKiemTra.check();
        // for (let i = 0; i < this.tinhChat.length; i++) {
        //     if (this.tinhChat[i].active)
        //         console.log(`${i + 1}. Quan hệ có ${this.tinhChat[i].name}. Vì: `);
        //     else
        //         console.log(`${i + 1}. Quan hệ không có ${this.tinhChat[i].name}. Vì: \n`);
        //     this.tinhChat[i].describe.forEach(e=>{
        //         console.log(e);
        //     })
        //     console.log();
        // }
        return this.tinhChat;
    }
    //#region  GETTER AN SETTER
    get khongGianMau() {
        return this._khongGianMau;
    }
    set khongGianMau(value) {
        this._khongGianMau = value;
    }
    get tinhChat() {
        return this._tinhChat;
    }
    set tinhChat(value) {
        this._tinhChat = value;
    }
    get boKiemTra() {
        return this._boKiemTra;
    }
    set boKiemTra(value) {
        this._boKiemTra = value;
    }
}
exports.QuanHe = QuanHe;
class QuanHeFactory {
    createQuanHeLietKe(khongGianMau, quanHe) {
        //  let A:TapHop = new TapHopBuilder().addArray(khongGianMau).build();
        let R = new QuanHe(khongGianMau);
        let arr = [];
        for (let i = 0; i < quanHe.length; i++) {
            arr.push(new TapHop_1.PhanTuLietKe(quanHe[i]));
        }
        R.array = arr;
        return R;
    }
    createQuanHeDieuKien(khongGianMau, condition) {
        let R = new QuanHe(khongGianMau);
        R.dieuKien = condition;
        R.boKiemTra = new TinhChatQuanHe_1.BoKiemTraTinhChatDieuKien(R);
        return R;
    }
}
exports.QuanHeFactory = QuanHeFactory;
