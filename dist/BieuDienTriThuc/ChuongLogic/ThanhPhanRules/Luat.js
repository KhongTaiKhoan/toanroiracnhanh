"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luat = void 0;
class Luat {
    constructor(id, _tenLuat, dieuKien, ketQua) {
        this._id = 0;
        this._tenLuat = _tenLuat;
        this.id = id;
        this._dieuKien = dieuKien;
        this._ketQua = ketQua;
    }
    boKiemTra(P) {
        return this.dieuKien.boKiemTra(P);
    }
    nhanKetQua(P, con) {
        if (con === undefined)
            return this.ketQua.ketQua(P);
        return this.ketQua.ketQua(P, con);
    }
    run(P) {
        let con = null;
        con = this.boKiemTra(P);
        if (con !== null) {
            // console.log(`- AP DUNG ${this.tenLuat} cho bieu thuc: ${con.bieuThuc.id}, DUOC KET QUA:`);
            return { goc: this.ketQua.ketQua(P, con), con: con.bieuThuc };
        }
        return null;
    }
    /// GETTER AND SETTER
    get tenLuat() {
        return this._tenLuat;
    }
    set tenLuat(value) {
        this._tenLuat = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get dieuKien() {
        return this._dieuKien;
    }
    set dieuKien(value) {
        this._dieuKien = value;
    }
    get ketQua() {
        return this._ketQua;
    }
    set ketQua(value) {
        this._ketQua = value;
    }
}
exports.Luat = Luat;
