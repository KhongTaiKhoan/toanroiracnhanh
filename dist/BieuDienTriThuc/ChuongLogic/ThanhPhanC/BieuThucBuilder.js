"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BieuThucBuilder = void 0;
const ToanTuFactory_1 = require("../ThanhPhanOpts/ToanTuFactory");
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const BieuThucMenhDe_1 = require("./BieuThucMenhDe");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
class BieuThucBuilder {
    constructor() {
        this.bieuThuc = new BieuThucMenhDe_1.BieuThucMenhDe();
    }
    addBieuThucCon(bieuThuc) {
        this.bieuThuc.bieuThucCons.push(bieuThuc);
        bieuThuc.cha = this.bieuThuc;
        return this;
    }
    //// HAM KHONG TIEN HANH SET CHA
    addBieuThucCon2(bieuThuc) {
        this.bieuThuc.bieuThucCons.push(bieuThuc);
        return this;
    }
    addID(id) {
        this.bieuThuc.id = id;
        return this;
    }
    addToanTu(toanTu) {
        this.bieuThuc.toanTu = new ToanTuFactory_1.ToanTuFactory().create(toanTu);
        return this;
    }
    addCha(bt) {
        this.bieuThuc.cha = bt;
        return this;
    }
    addBieuThucSoCap(id) {
        this.bieuThuc.bieuThucCons.push(Helper_1.Helper.BIEU_THUC_SO_CAP(id));
        return this;
    }
    build() {
        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(this.bieuThuc)) {
            let bt = Helper_1.Helper.BIEU_THUC_SO_CAP(this.bieuThuc.id);
            // bt.toanTu = this.bieuThuc.toanTu;
            bt.cha = this.bieuThuc.cha;
            return bt;
        }
        if (this.bieuThuc.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH && this.bieuThuc.bieuThucCons.length === 1) {
            let bt = Helper_1.Helper.BIEU_THUC_SO_CAP(this.bieuThuc.bieuThucCons[0].id);
            bt.cha = this.bieuThuc.cha;
            return bt;
        }
        return this.bieuThuc;
    }
    sizeBuilder() {
        return this.bieuThuc.bieuThucCons.length;
    }
}
exports.BieuThucBuilder = BieuThucBuilder;
