"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoiGiaiBangChanTri = exports.BangChanTri = void 0;
const BieuThucMenhDe_1 = require("../../ChuongLogic/ThanhPhanC/BieuThucMenhDe");
const BaiTap_1 = require("../BaiTap");
const Helper_1 = require("../../ChuongLogic/ThanhPhanFuncs/Helper");
class BangChanTri extends BaiTap_1.BaiTap {
    constructor(bieuThuc) {
        super();
        this._bieuThuc = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.bieuThucSoCap = [];
        this.bieuThucs = [];
        this.loiGiai = new LoiGiaiBangChanTri();
        if (bieuThuc)
            this.bieuThuc = bieuThuc;
    }
    giai(deBai) {
        // let builder = new BieuThucBuilder().addBieuThucCon(Helper.BIEU_THUC_SO_CAP('p'))
        //                                    .addBieuThucCon(new BieuThucBuilder()
        //                                    .addBieuThucCon(Helper.BIEU_THUC_SO_CAP('p'))
        //                                    .addBieuThucCon(Helper.BIEU_THUC_SO_CAP('q'))
        //                                    .addToanTu(ToanTu.KEO_THEO)
        //                                    .build())
        //                                    .addToanTu(ToanTu.KEO_THEO)
        //                                    .build(); 
        // this.bieuThuc = builder;                                   
        this.themBieuThucSoCap(this.bieuThuc);
        /// N BIT STRING
        let head = [];
        this.bieuThucSoCap.forEach(e => head.push(Helper_1.Helper.IN(e)));
        this.bieuThucs.forEach(e => {
            head.push(Helper_1.Helper.IN(e));
        });
        this.loiGiai.head = head;
        //////
        let m = [];
        for (let i = 0; i < this.bieuThucSoCap.length; i++)
            m.push(0);
        this.getKETQUA(m);
        for (let i = m.length - 1; i >= 0; i--) {
            if (m[i] === 1)
                continue;
            m[i] = 1;
            for (let j = i + 1; j < m.length; j++)
                m[j] = 0;
            i = m.length;
            this.getKETQUA(m);
        }
        return this.loiGiai;
    }
    getKETQUA(m) {
        for (let i = 0; i < m.length; i++) {
            if (m[i])
                this.bieuThucSoCap[i].chanTri = true;
            else
                this.bieuThucSoCap[i].chanTri = false;
        }
        let info = ``;
        let row = [];
        this.bieuThucSoCap.forEach(e => row.push(e.chanTri));
        this.bieuThucs.forEach(e => {
            row.push(e.chanTri);
        });
        this.loiGiai.body.push(row);
    }
    ////////////// TIEN HANH XU LY
    themBieuThucSoCap(P) {
        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P)) {
            let index = this.bieuThucSoCap.findIndex(e => e.id === P.id);
            if (index === -1) {
                this.bieuThucSoCap.push(P);
                return this.bieuThucSoCap[this.bieuThucSoCap.length - 1];
            }
            else
                return this.bieuThucSoCap[index];
        }
        for (let i = 0; i < P.bieuThucCons.length; i++) {
            let index = this.bieuThucs.findIndex(e => e.id === P.bieuThucCons[i].id);
            if (index === -1) {
                P.bieuThucCons[i] = this.themBieuThucSoCap(P.bieuThucCons[i]);
            }
            else
                P.bieuThucCons[i] = this.bieuThucs[index];
        }
        let index = this.bieuThucs.findIndex(e => e.id === P.id);
        if (index === -1) {
            this.bieuThucs.push(P);
            return P;
        }
        return this.bieuThucs[index];
    }
    get bieuThuc() {
        return this._bieuThuc;
    }
    set bieuThuc(value) {
        this._bieuThuc = value;
    }
}
exports.BangChanTri = BangChanTri;
class LoiGiaiBangChanTri {
    constructor() {
        this._head = [];
        this._body = [];
    }
    get body() {
        return this._body;
    }
    set body(value) {
        this._body = value;
    }
    get head() {
        return this._head;
    }
    set head(value) {
        this._head = value;
    }
}
exports.LoiGiaiBangChanTri = LoiGiaiBangChanTri;
