"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LopTuongDuong = exports.XacDinhLopTuongDuong = void 0;
const BieuThucDaiSo_1 = require("../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo");
const QuanHe_1 = require("../ThanhPhanC/QuanHe");
const QuanHeDaiSo_1 = require("../ThanhPhanC/QuanHeDaiSo");
const TapHop_1 = require("../ThanhPhanC/TapHop");
const PhanLoaiQuanHe_1 = require("./PhanLoaiQuanHe");
class XacDinhLopTuongDuong {
    constructor(R) {
        this.R = R;
        this.Parent = R.khongGianMau;
    }
    /// XET TUNG TRUONG HOP
    layLopTuongDuong() {
        let x = PhanLoaiQuanHe_1.PhanLoaiQuanHe.phanLoai(PhanLoaiQuanHe_1.PhanLoaiQuanHe.TUONG_DUONG, this.R);
        if (!x)
            throw new Error('Quan hệ không phải là quan hệ tương đương');
        if (this.R.khongGianMau.getKind() === TapHop_1.TapHop.TAP_HOP_LIET_KE && this.R.getKind() === TapHop_1.TapHop.TAP_HOP_LIET_KE) {
            return this.LietKe_LietKe();
        }
        else if (this.R.khongGianMau.getKind() === TapHop_1.TapHop.TAP_HOP_LIET_KE && this.R.getKind() === TapHop_1.TapHop.TAP_HOP_DIEU_KIEN) {
            return this.LietKe_DieuKien();
        }
        else {
            return this.DieuKien_DieuKien();
        }
    }
    //// Liet ke - liet ke
    LietKe_LietKe() {
        let maTran = this.khoiTaoMaTran();
        let lopTuongDuong = [];
        let tag = [];
        this.Parent.array.forEach(e => {
            tag.push(-1);
        });
        tag[0] = 0;
        for (let i = 0; i < maTran.length; i++) {
            if (tag[i] === -1)
                tag[i] = i;
            for (let j = 0; j < maTran.length; j++) {
                if (i === j)
                    continue;
                if (maTran[i][j] === 0)
                    continue;
                if (tag[j] === -1)
                    tag[j] = tag[i];
            }
        }
        for (let i = 0; i < tag.length; i++) {
            if (tag[i] === -1)
                continue;
            let m_tag = tag[i];
            tag[i] = -1;
            let arr = [];
            arr.push(this.Parent.array[i].element[0]);
            while (true) {
                let index = tag.findIndex(e => { return e === m_tag; });
                if (index === -1)
                    break;
                arr.push(this.Parent.array[index].element[0]);
                tag[index] = -1;
            }
            lopTuongDuong.push(new LopTuongDuong(`[${arr[0]}]`, new TapHop_1.TapHopBuilder().addArray(arr).build()));
        }
        return lopTuongDuong;
    }
    //// Liet ke - Dieu kien
    LietKe_DieuKien() {
        if (this.R.dieuKien) {
            let condition = this.R.dieuKien;
            let newArr = [];
            let parentArr = [];
            condition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.R.dieuKien);
            for (let i = 0; i < this.Parent.array.length; i++) {
                parentArr.push(this.Parent.array[i].element[0]);
                for (let j = 0; j < this.Parent.array.length; j++) {
                    if (i === j)
                        continue;
                    condition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.R.dieuKien);
                    condition.replaceVariale([{ var: 'a', value: this.Parent.array[i].element[0] + '' }, { var: 'b', value: this.Parent.array[j].element[0] + '' }]);
                    if (condition.check()) {
                        newArr.push([this.Parent.array[i].element[0], this.Parent.array[j].element[0]]);
                    }
                }
            }
            this.R = new QuanHe_1.QuanHeFactory().createQuanHeLietKe(this.Parent, newArr);
            return this.LietKe_LietKe();
        }
        return [new LopTuongDuong(`${this.Parent.array[0].element[0]}`, this.Parent)];
    }
    /// Dieu kien - Dieu kien
    DieuKien_DieuKien() {
        var _a, _b;
        if (((_a = this.R.dieuKien) === null || _a === void 0 ? void 0 : _a.kind) === QuanHeDaiSo_1.QuanHeDaiSo.CHIA_HET) {
            if (((_b = this.R.dieuKien) === null || _b === void 0 ? void 0 : _b.right.kind) === BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.HANG_SO) {
                let nameLTD = [];
                for (let i = 0; i < this.R.dieuKien.right.value; i++) {
                    nameLTD.push(i);
                }
                ////////
                let condition = null;
                let MAX_VALUE = this.R.dieuKien.right.value * 3;
                let rs = [];
                for (let i = 0; i < nameLTD.length; i++) {
                    let row = [];
                    for (let j = -MAX_VALUE; j < MAX_VALUE; j++) {
                        condition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.R.dieuKien);
                        condition.replaceVariale([{ var: 'a', value: nameLTD[i] + '' }, { var: 'b', value: j + '' }]);
                        if (condition.check()) {
                            row.push(j);
                        }
                    }
                    rs.push(new LopTuongDuong(`${nameLTD[i]}`, new TapHop_1.TapHopBuilder().addArray(row).build(), new class {
                        in(l) {
                            return `[${l.name}] = {...,${l.tapHop.toString()},...}`;
                        }
                    }()));
                }
                return rs;
            }
            // else if(this.R.dieuKien?.right.kind === KhonGianSoNguyen.BieuThuc.BIEN_SO){
            // }
            else {
                throw new Error('De bai khong duoc ho tro');
            }
        }
        throw new Error('De bai khong duoc ho tro');
    }
    khoiTaoMaTran() {
        let matrix = [];
        let A = this.R.khongGianMau.array;
        for (let i = 0; i < A.length; i++) {
            let row = [];
            for (let j = 0; j < A.length; j++) {
                row.push(0);
            }
            matrix.push(row);
        }
        for (let i = 0; i < this.R.array.length; i++) {
            let l = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[0]; });
            let r = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[1]; });
            matrix[l][r] = 1;
        }
        return matrix;
    }
}
exports.XacDinhLopTuongDuong = XacDinhLopTuongDuong;
class LopTuongDuong {
    constructor(name, tapHop, output) {
        this.name = name;
        this.tapHop = tapHop;
        if (output === undefined)
            this._output = new class {
                in(l) {
                    return l.name + ' = ' + '{' + l.tapHop.toString() + '}';
                }
            }();
        else
            this._output = output;
    }
    toString() {
        return this._output.in(this);
    }
}
exports.LopTuongDuong = LopTuongDuong;
