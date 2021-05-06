"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BieuThucMenhDe = void 0;
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const ToanTuFactory_1 = require("../ThanhPhanOpts/ToanTuFactory");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
class BieuThucMenhDe {
    constructor() {
        this._id = "";
        this._toanTu = new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.NONE);
        this._chanTri = false;
        this._bieuThucCons = [];
        this._cha = null;
    }
    /// getter and setter
    get id() {
        if (this.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH) {
            if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this))
                return this.toanTu.toString() + this._id;
            return this.toanTu.toString() + "(" + this.bieuThucCons[0].id + ")";
        }
        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this)) {
            return this._id;
        }
        if (this.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUONG_DUONG || this.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO) {
            let s = this.toanTu.toString();
            if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[0]))
                s += this.bieuThucCons[0].id;
            else
                s += `(${this.bieuThucCons[0].id})`;
            if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[1]))
                s += this.bieuThucCons[1].id;
            else
                s += `(${this.bieuThucCons[1].id})`;
            return s;
        }
        let str = [];
        let str_2 = '';
        for (let i = 0; i < this.bieuThucCons.length; i++) {
            if (!Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[i]))
                str_2 += `(${this.bieuThucCons[i].id})`;
            else {
                if (str.length === 0)
                    str.push(this.bieuThucCons[i].id);
                else {
                    for (let j = str.length - 1; j >= 0; j--) {
                        let s1 = this.bieuThucCons[i].id;
                        let s2 = str[j];
                        if (s1.includes(`${ToanTuLogic_1.ToanTu.PHU_DINH}`))
                            s1 = s1.split(`${ToanTuLogic_1.ToanTu.PHU_DINH}`)[1];
                        if (s2.includes(`${ToanTuLogic_1.ToanTu.PHU_DINH}`))
                            s2 = s2.split(`${ToanTuLogic_1.ToanTu.PHU_DINH}`)[1];
                        if (s2 < s1) {
                            if (j === str.length - 1)
                                str.push(this.bieuThucCons[i].id);
                            else
                                str.splice(j + 1, 0, this.bieuThucCons[i].id);
                            break;
                        }
                        else if (s2 === s1) {
                            if (this.bieuThucCons[i].id.includes(`${ToanTuLogic_1.ToanTu.PHU_DINH}`)) {
                                str.splice(j, 0, this.bieuThucCons[i].id);
                            }
                            else {
                                str.splice(j + 1, 0, this.bieuThucCons[i].id);
                            }
                            break;
                        }
                        if (j === 0) {
                            str.splice(j, 0, this.bieuThucCons[i].id);
                        }
                    }
                }
            }
        }
        let s = '';
        for (let i = 0; i < str.length; i++) {
            s += str[i];
        }
        return this.toanTu.toString() + s + str_2;
    }
    set id(value) {
        this._id = value;
    }
    get chanTri() {
        return this._chanTri;
    }
    set chanTri(value) {
        this._chanTri = value;
    }
    get toanTu() {
        return this._toanTu;
    }
    set toanTu(value) {
        this._toanTu = value;
    }
    get bieuThucCons() {
        return this._bieuThucCons;
    }
    set bieuThucCons(value) {
        this._bieuThucCons = value;
    }
    getIndex(id) {
        let index = -1;
        for (let i = 0; i < this.bieuThucCons.length; i++) {
            if (this.bieuThucCons[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    get cha() {
        return this._cha;
    }
    set cha(value) {
        this._cha = value;
    }
}
exports.BieuThucMenhDe = BieuThucMenhDe;
BieuThucMenhDe.MA_HANG_DUNG = "TRUE";
BieuThucMenhDe.MA_HANG_SAI = "FALSE";
