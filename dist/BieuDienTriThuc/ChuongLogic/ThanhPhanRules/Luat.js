"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luat = void 0;
class Luat {
    constructor(id, _tenLuat, _Iluat) {
        this._id = 0;
        this._tenLuat = _tenLuat;
        this._Iluat = _Iluat;
        this.id = id;
    }
    boKiemTra(P) {
        return this.Iluat.boKiemTra(P);
    }
    ketQua(P, con) {
        if (con === undefined)
            return this.Iluat.ketQua(P);
        return this.Iluat.ketQua(P, con);
    }
    run(P) {
        let con = null;
        con = this.boKiemTra(P);
        if (con !== null) {
            // console.log(`- AP DUNG ${this.tenLuat} cho bieu thuc: ${con.bieuThuc.id}, DUOC KET QUA:`);
            return { goc: this.ketQua(P, con), con: con.bieuThuc };
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
    get Iluat() {
        return this._Iluat;
    }
    set Iluat(value) {
        this._Iluat = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
}
exports.Luat = Luat;
