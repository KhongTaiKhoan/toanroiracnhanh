"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoKiemTraTinhChatDieuKien = exports.BoKiemTraTinhChatLietKe = exports.BoKiemTraTinhChat = exports.TinhChatQuanHe = void 0;
const TapHop_1 = require("../ThanhPhanC/TapHop");
const QuanHeDaiSo_1 = require("../ThanhPhanC/QuanHeDaiSo");
const SuyDienQuanHeDaiSo_1 = require("../ThanhPhanFuncs/SuyDienQuanHeDaiSo");
const BieuThucDaiSo_1 = require("../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo");
const QuyTacRutGonn_1 = require("../../BieuThucDaiSoZ/ThanhPhanRules/QuyTacRutGonn");
class TinhChatQuanHe {
    constructor(name, id) {
        this._active = false;
        this._describe = [];
        this._name = name;
        this._id = id;
    }
    //#region  GETTER AND SETTER
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
    }
    get describe() {
        return this._describe;
    }
    set describe(value) {
        this._describe = value;
    }
}
exports.TinhChatQuanHe = TinhChatQuanHe;
class BoKiemTraTinhChat {
    constructor() {
        this.tapTinhChat = null;
    }
}
exports.BoKiemTraTinhChat = BoKiemTraTinhChat;
class BoKiemTraTinhChatLietKe extends BoKiemTraTinhChat {
    constructor(quanHe) {
        super();
        this.quanHe = null;
        this.matrix = [];
        this.quanHe = quanHe;
    }
    generate() {
        var _a, _b;
        this.tapTinhChat = [];
        this.tapTinhChat.push(new TinhChatQuanHe('Tính phản xạ', 0));
        this.tapTinhChat.push(new TinhChatQuanHe('Tính đối xứng', 1));
        this.tapTinhChat.push(new TinhChatQuanHe('Tính phản xứng', 2));
        this.tapTinhChat.push(new TinhChatQuanHe('Tính bắc cầu', 3));
        //// MAKE MATRIX
        if (((_a = this.quanHe) === null || _a === void 0 ? void 0 : _a.khongGianMau.getKind()) !== TapHop_1.TapHop.TAP_HOP_LIET_KE)
            throw Error('Khong gian mau khong phai la mot tap hop huu han');
        if (((_b = this.quanHe) === null || _b === void 0 ? void 0 : _b.getKind()) !== TapHop_1.TapHop.TAP_HOP_LIET_KE)
            throw Error('Quan He khong phai la mot tap hop huu han');
        let A = this.quanHe.khongGianMau.array;
        for (let i = 0; i < A.length; i++) {
            let row = [];
            for (let j = 0; j < A.length; j++) {
                row.push(0);
            }
            this.matrix.push(row);
        }
        for (let i = 0; i < this.quanHe.array.length; i++) {
            let l = this.quanHe.khongGianMau.array.findIndex(e => { return this.quanHe !== null && e.element[0] === this.quanHe.array[i].element[0]; });
            let r = this.quanHe.khongGianMau.array.findIndex(e => { return this.quanHe !== null && e.element[0] === this.quanHe.array[i].element[1]; });
            this.matrix[l][r] = 1;
        }
    }
    check() {
        this.luatPhanXa(0);
        this.luatDoiXung(1);
        this.luatPhanXung(2);
        this.luatBacCau(3);
        if (this.tapTinhChat === null)
            throw Error('Chua khoi tao tap luat');
        return this.tapTinhChat;
    }
    luatPhanXa(id) {
        var _a, _b, _c, _d;
        let descr = '';
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i][i] === 0) {
                if (this.tapTinhChat !== null) {
                    this.tapTinhChat[id].active = false;
                    this.tapTinhChat[id].describe.push(`R không chứa {${(_a = this.quanHe) === null || _a === void 0 ? void 0 : _a.khongGianMau.array[i]},${(_b = this.quanHe) === null || _b === void 0 ? void 0 : _b.khongGianMau.array[i]}}}`);
                }
                return;
            }
            descr += `{${(_c = this.quanHe) === null || _c === void 0 ? void 0 : _c.khongGianMau.array[i]},${(_d = this.quanHe) === null || _d === void 0 ? void 0 : _d.khongGianMau.array[i]}}`;
            if (i !== this.matrix.length - 1)
                descr += ', ';
        }
        descr += "} ∈ R";
        if (this.tapTinhChat !== null) {
            this.tapTinhChat[id].active = true;
            this.tapTinhChat[id].describe.push(descr);
        }
    }
    luatDoiXung(id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let descr = ['R chứa: '];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = i + 1; j < this.matrix[i].length; j++) {
                if ((this.matrix[i][j] !== 0 && this.matrix[j][i] === 0) ||
                    (this.matrix[j][i] !== 0 && this.matrix[i][j] === 0)) {
                    if (this.tapTinhChat !== null) {
                        if (this.matrix[i][j] !== 0 && this.matrix[j][i] === 0)
                            this.tapTinhChat[id].describe.push(`R chứa {${(_a = this.quanHe) === null || _a === void 0 ? void 0 : _a.khongGianMau.array[i].element[0]},${(_b = this.quanHe) === null || _b === void 0 ? void 0 : _b.khongGianMau.array[j].element[0]}} nhưng không chứa {${(_c = this.quanHe) === null || _c === void 0 ? void 0 : _c.khongGianMau.array[j].element[0]},${(_d = this.quanHe) === null || _d === void 0 ? void 0 : _d.khongGianMau.array[i].element[0]}}`);
                        else
                            this.tapTinhChat[id].describe.push(`R chứa {${(_e = this.quanHe) === null || _e === void 0 ? void 0 : _e.khongGianMau.array[j].element[0]},${(_f = this.quanHe) === null || _f === void 0 ? void 0 : _f.khongGianMau.array[i].element[0]}} nhưng không chứa {${(_g = this.quanHe) === null || _g === void 0 ? void 0 : _g.khongGianMau.array[i].element[0]},${(_h = this.quanHe) === null || _h === void 0 ? void 0 : _h.khongGianMau.array[j].element[0]}}`);
                        this.tapTinhChat[id].active = false;
                    }
                    return;
                }
                descr.push(`- {${(_j = this.quanHe) === null || _j === void 0 ? void 0 : _j.khongGianMau.array[j].element[0]},${(_k = this.quanHe) === null || _k === void 0 ? void 0 : _k.khongGianMau.array[i].element[0]}} và {${(_l = this.quanHe) === null || _l === void 0 ? void 0 : _l.khongGianMau.array[i].element[0]},${(_m = this.quanHe) === null || _m === void 0 ? void 0 : _m.khongGianMau.array[j].element[0]}}`);
            }
        }
        if (this.tapTinhChat !== null) {
            this.tapTinhChat[id].active = true;
            this.tapTinhChat[id].describe = descr;
        }
    }
    luatPhanXung(id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let descr = ['R : '];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = i + 1; j < this.matrix[i].length; j++) {
                if ((this.matrix[i][j] !== 0 && this.matrix[j][i] === 0) ||
                    (this.matrix[j][i] !== 0 && this.matrix[i][j] === 0)) {
                    if (this.matrix[i][j] !== 0 && this.matrix[j][i] === 0)
                        descr.push(`-Chứa {${(_a = this.quanHe) === null || _a === void 0 ? void 0 : _a.khongGianMau.array[i].element[0]},${(_b = this.quanHe) === null || _b === void 0 ? void 0 : _b.khongGianMau.array[j].element[0]}} nhưng không chứa {${(_c = this.quanHe) === null || _c === void 0 ? void 0 : _c.khongGianMau.array[j].element[0]},${(_d = this.quanHe) === null || _d === void 0 ? void 0 : _d.khongGianMau.array[i].element[0]}}`);
                    else
                        descr.push(`-Chứa {${(_e = this.quanHe) === null || _e === void 0 ? void 0 : _e.khongGianMau.array[j].element[0]},${(_f = this.quanHe) === null || _f === void 0 ? void 0 : _f.khongGianMau.array[i].element[0]}} nhưng không chứa {${(_g = this.quanHe) === null || _g === void 0 ? void 0 : _g.khongGianMau.array[i].element[0]},${(_h = this.quanHe) === null || _h === void 0 ? void 0 : _h.khongGianMau.array[j].element[0]}}`);
                    continue;
                }
                if (this.tapTinhChat !== null) {
                    this.tapTinhChat[id].active = false;
                    this.tapTinhChat[id].describe.push(`R chứa cả {${(_j = this.quanHe) === null || _j === void 0 ? void 0 : _j.khongGianMau.array[j].element[0]},${(_k = this.quanHe) === null || _k === void 0 ? void 0 : _k.khongGianMau.array[i].element[0]}} và {${(_l = this.quanHe) === null || _l === void 0 ? void 0 : _l.khongGianMau.array[i].element[0]},${(_m = this.quanHe) === null || _m === void 0 ? void 0 : _m.khongGianMau.array[j].element[0]}}`);
                    return;
                }
            }
        }
        if (this.tapTinhChat !== null) {
            this.tapTinhChat[id].active = true;
            this.tapTinhChat[id].describe = descr;
        }
    }
    luatBacCau(id) {
        let descr = ['R chứa: '];
        if (this.quanHe) {
            for (let i = 0; i < this.quanHe.array.length; i++) {
                let element = this.quanHe.array[i];
                for (let j = 0; j < this.quanHe.array.length; j++) {
                    if (i === j)
                        continue;
                    if (this.quanHe.array[j].element[0] !== element.element[1])
                        continue;
                    let newEle = [element.element[0], this.quanHe.array[j].element[1]];
                    let index = this.quanHe.array.findIndex(e => { return e.element[0] === newEle[0] && e.element[1] === newEle[1]; });
                    if (index === -1) {
                        if (this.tapTinhChat !== null) {
                            this.tapTinhChat[id].active = false;
                            this.tapTinhChat[id].describe.push(`R Chứa {$${element.element[0]},${element.element[1]}} , {${this.quanHe.array[j].element[0]},${this.quanHe.array[j].element[1]}}` +
                                ` nhưng không chứa {${newEle[0]},${newEle[1]}} `);
                            return;
                        }
                    }
                    else {
                        descr.push(`- Chứa {${element.element[0]},${element.element[1]}} , {${this.quanHe.array[j].element[0]},${this.quanHe.array[j].element[1]}}` +
                            ` và {${newEle[0]},${newEle[1]}} `);
                        break;
                    }
                }
            }
            if (this.tapTinhChat !== null) {
                this.tapTinhChat[id].active = true;
                this.tapTinhChat[id].describe = descr;
            }
        }
    }
}
exports.BoKiemTraTinhChatLietKe = BoKiemTraTinhChatLietKe;
class BoKiemTraTinhChatDieuKien extends BoKiemTraTinhChat {
    constructor(quanHe) {
        super();
        this.tinhChat = [];
        this.quanHe = null;
        this.condition = null;
        this.khongGianMau = null;
        this.quanHe = quanHe;
        if (quanHe !== null) {
            this.condition = quanHe.dieuKien;
            this.khongGianMau = quanHe.khongGianMau;
        }
    }
    generate() {
        this.tinhChat.push(new TinhChatQuanHe('Tính phản xạ', 0));
        this.tinhChat.push(new TinhChatQuanHe('Tính đối xứng', 1));
        this.tinhChat.push(new TinhChatQuanHe('Tính phản xứng', 2));
        this.tinhChat.push(new TinhChatQuanHe('Tính bắc cầu', 3));
    }
    check() {
        this.tinhPhanXa(0);
        this.tinhDoiXung(1);
        this.tinhPhanXung(2);
        this.tinhBacCau(3);
        return this.tinhChat;
    }
    tinhPhanXa(id) {
        if (this.condition !== null && this.tinhChat !== null) {
            let bt = ['a', 'b'];
            let l = [];
            l.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.left));
            l.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.right));
            l[0] = l[0].replaceVariable([{ var: bt[1], value: bt[0] }, { var: bt[0], value: bt[0] }]);
            l[0] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(l[0]);
            l[1] = l[1].replaceVariable([{ var: bt[1], value: bt[0] }, { var: bt[0], value: bt[0] }]);
            l[1] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(l[1]);
            let newCondition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.condition);
            newCondition.left = l[0];
            newCondition.right = l[1];
            // console.log(newCondition.toString());
            this.tinhChat[id].describe.push(`Ta có: ${this.condition.toString()}`);
            this.tinhChat[id].describe.push(`Xét đối tượng ${bt[0]}, thế vào quan hệ ta được:`);
            this.tinhChat[id].describe.push(`  ${this.condition.toString()}`);
            let str = `= ${newCondition.toString()}`;
            if (newCondition.check()) {
                str += ' (Thõa)';
                this.tinhChat[id].describe.push(str);
                this.tinhChat[id].active = true;
                return;
            }
            str += ' (Không thõa)';
            this.tinhChat[id].describe.push(str);
            this.tinhChat[id].active = false;
        }
    }
    tinhDoiXung(id) {
        if (this.condition !== null && this.tinhChat !== null) {
            let bt = ['a', 'b'];
            let l = [];
            l.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.left));
            l.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.right));
            l[0] = l[0].replaceVariable([{ var: bt[1], value: bt[0] }, { var: bt[0], value: bt[1] }]);
            l[1] = l[1].replaceVariable([{ var: bt[1], value: bt[0] }, { var: bt[0], value: bt[1] }]);
            let newCondition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.condition);
            newCondition.left = l[0];
            newCondition.right = l[1];
            this.tinhChat[id].describe.push(`Giả sử ${this.condition.toString()} là đúng, xét ${newCondition.toString()}:`);
            if (newCondition.left.id === this.condition.left.id) {
                this.tinhChat[id].describe.push(`  ${this.condition.left.toString()} =  ${newCondition.left.toString()}`);
                this.tinhChat[id].describe.push(`Do đó quan hệ có tính đối xứng`);
                this.tinhChat[id].active = true;
                return;
            }
            l[0] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(l[0]);
            l[1] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(l[1]);
            newCondition.left = l[0];
            newCondition.right = l[1];
            if (newCondition.check()) {
                this.tinhChat[id].describe.push(`${newCondition.toString()}   (Thoã)`);
                this.tinhChat[id].describe.push(`Quan hệ có tính đối xứng`);
                this.tinhChat[id].active = true;
            }
            else {
                // console.log(newCondition.left.toString());
                let suyDien = new SuyDienQuanHeDaiSo_1.SuyDienQuanHeDaiSo_Factory().create(this.condition.kind, [QuanHeDaiSo_1.QuanHeDaiSo.copy(this.condition)], newCondition);
                let chiTiet = suyDien.suyDien();
                if (chiTiet.length !== 0) {
                    for (let i = 0; i < chiTiet.length; i++) {
                        if (chiTiet[i].parent[0] === -1)
                            this.tinhChat[id].describe.push(`${chiTiet[i].id}. ${chiTiet[i].R.toString()}  (GT)`);
                        else {
                            let str_par = '';
                            chiTiet[i].parent.forEach(e => {
                                str_par += e + ' ';
                            });
                            this.tinhChat[id].describe.push(`${chiTiet[i].id}. ${chiTiet[i].R.toString()}  (từ ${str_par})`);
                        }
                    }
                    this.tinhChat[id].active = true;
                    this.tinhChat[id].describe.push('Suy luận là đúng nên quan hệ có tính đối xứng');
                }
                else
                    this.tinhChat[id].describe.push('=> Xãy ra mâu thuẫn');
            }
        }
    }
    tinhPhanXung(id) {
        var _a;
        if (this.tinhChat[id - 1].active) {
            this.tinhChat[id].active = false;
            this.tinhChat[id].describe.push('Do quan hệ có tính đối xứng. Nên xãy ra mâu thuẫn ');
            this.tinhChat[id].describe.push('=> Quan hệ ko có tính phản xứng');
        }
        else if (this.tinhChat[0].active === true) {
            this.tinhChat[id].active = true;
            this.tinhChat[id].describe.push(`Do quan hệ ko có tính đối xứng. Đồng thời có tính phản xạ. Nên  ${(_a = this.condition) === null || _a === void 0 ? void 0 : _a.toString()} khi và chỉ khi a=b`);
            this.tinhChat[id].describe.push('=> Quan hệ có tính phản xứng');
        }
        else {
            this.tinhChat[id].active = false;
            this.tinhChat[id].describe.push('=> Quan hệ ko có tính phản xứng');
        }
    }
    tinhBacCau(id) {
        if (this.condition !== null && this.tinhChat !== null) {
            let variable = ['a', 'b', 'c'];
            let bt = [
                { id1: 0, value1: 0, id2: 1, value2: 1 },
                { id1: 0, value1: 1, id2: 1, value2: 2 },
                { id1: 0, value1: 0, id2: 1, value2: 2 },
            ];
            let l = [];
            let c = [];
            for (let i = 0; i < 3; i++) {
                let row = [];
                row.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.left));
                row.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(this.condition.right));
                row[0] = row[0].replaceVariable([{ var: variable[bt[i].id1], value: variable[bt[i].value1] }, { var: variable[bt[i].id2], value: variable[bt[i].value2] }]);
                row[0] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(row[0]);
                row[1] = row[1].replaceVariable([{ var: variable[bt[i].id1], value: variable[bt[i].value1] }, { var: variable[bt[i].id2], value: variable[bt[i].value2] }]);
                row[1] = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(row[1]);
                let newCondition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.condition);
                newCondition.left = row[0];
                newCondition.right = row[1];
                c.push(newCondition);
            }
            this.tinhChat[id].describe.push(`Giả sử ${c[0].toString()} , ${c[1].toString()} là đúng, xét ${c[2].toString()}:`);
            if (c[2].check()) {
                this.tinhChat[id].describe.push(`${c[2].toString()}   (Thoã)`);
                this.tinhChat[id].describe.push(`Quan hệ có tính đối xứng`);
                this.tinhChat[id].active = true;
            }
            else {
                // console.log(newCondition.left.toString());
                let suyDien = new SuyDienQuanHeDaiSo_1.SuyDienQuanHeDaiSo_Factory().create(c[0].kind, [c[0], c[1]], c[2]);
                let chiTiet = suyDien.suyDien();
                if (chiTiet.length !== 0) {
                    for (let i = 0; i < chiTiet.length; i++) {
                        if (chiTiet[i].parent[0] === -1)
                            this.tinhChat[id].describe.push(`${chiTiet[i].id}. ${chiTiet[i].R.toString()}  (GT)`);
                        else {
                            let str_par = '';
                            chiTiet[i].parent.forEach(e => {
                                str_par += e + ' ';
                            });
                            this.tinhChat[id].describe.push(`${chiTiet[i].id}. ${chiTiet[i].R.toString()}  (từ ${str_par})`);
                        }
                    }
                    this.tinhChat[id].active = true;
                    this.tinhChat[id].describe.push('Suy luận là đúng nên quan hệ có tính đối xứng');
                }
                else
                    this.tinhChat[id].describe.push('=> Xãy ra mâu thuẫn');
            }
        }
    }
}
exports.BoKiemTraTinhChatDieuKien = BoKiemTraTinhChatDieuKien;
