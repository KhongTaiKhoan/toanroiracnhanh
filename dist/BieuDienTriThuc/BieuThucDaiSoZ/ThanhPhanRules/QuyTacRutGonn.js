"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuyTacDaiSo = void 0;
const BieuThucDaiSo_1 = require("../ThanhPhanC/BieuThucDaiSo");
const HauTo_1 = require("../ThanhPhanFuncs/HauTo");
var QuyTacDaiSo;
(function (QuyTacDaiSo) {
    class RutGon {
        simplify(expr) {
            if (expr.kind === BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.HANG_SO || expr.kind === BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.BIEN_SO)
                return BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(expr);
            let rs = this.duyetRutGon(expr);
            // console.log(`DANG HAU TO: ${rs.id}`);
            return rs;
        }
        duyetRutGon(expr) {
            let id = expr.id.split(' ');
            let coefficients = [];
            /// THIET LAP HE SO CHO CAC BIEN
            let duyetRoi = '';
            for (let i = 0; i < id.length; i++) {
                if (duyetRoi.includes(id[i]))
                    continue;
                if (HauTo_1.HauTo.isNumber(id[i]) && duyetRoi.includes('-'))
                    continue;
                if (HauTo_1.HauTo.isNumber(id[i]) && !duyetRoi.includes('-')) {
                    coefficients.push({ id: '-', value: 0 });
                    duyetRoi += '-';
                }
                else if (!HauTo_1.HauTo.isOperator(id[i])) {
                    coefficients.push({ id: id[i], value: 0 });
                    duyetRoi += id[i];
                }
            }
            let heSoBuilder = new HeSoBuilder(coefficients);
            /// STACK DE DANH DAU CAC PHEP TINH
            /// DUYET HAU TO 
            let stackNum = [];
            for (let i = 0; i < id.length; i++) {
                if (!HauTo_1.HauTo.isOperator(id[i])) {
                    let hs = heSoBuilder.builder();
                    let key = HauTo_1.HauTo.isNumber(id[i]) ? '-' : id[i];
                    let index = hs.coefficients.findIndex(e => { return e.id === key; });
                    hs.coefficients[index].value = HauTo_1.HauTo.isNumber(id[i]) ? parseInt(id[i]) : 1;
                    stackNum.push(hs);
                }
                else {
                    let right = stackNum.pop();
                    let left = stackNum.pop();
                    // console.log(left);
                    // console.log(right);
                    if (left !== undefined && right !== undefined) {
                        switch (id[i]) {
                            case '+': {
                                for (let j = 0; j < right.coefficients.length; j++) {
                                    left.coefficients[j].value += right.coefficients[j].value;
                                }
                                break;
                            }
                            case '-': {
                                /// DOI DAU CAC PHAN TU 
                                ///TIEP THEO LA CONG 
                                for (let j = 0; j < right.coefficients.length; j++) {
                                    left.coefficients[j].value -= right.coefficients[j].value;
                                }
                                break;
                            }
                            case '*': {
                                /// KIEM TRA THANH PHAN NAO LA HANG SO
                                let kt_left = false;
                                let newHeSo;
                                let fixHeSo;
                                for (let j = 0; j < left.coefficients.length; j++) {
                                    if (left.coefficients[j].id !== '-' && left.coefficients[j].value !== 0) {
                                        kt_left = true;
                                        break;
                                    }
                                }
                                if (!kt_left) {
                                    newHeSo = right;
                                    fixHeSo = left;
                                }
                                else {
                                    newHeSo = left;
                                    fixHeSo = right;
                                }
                                /// NHAN PHAN PHOI
                                for (let j = 0; j < newHeSo.coefficients.length; j++) {
                                    for (let z = 0; z < fixHeSo.coefficients.length; z++) {
                                        if (fixHeSo.coefficients[z].value === 0)
                                            continue;
                                        newHeSo.coefficients[j].value *= fixHeSo.coefficients[z].value;
                                    }
                                }
                                left = newHeSo;
                                break;
                            }
                            case '/': {
                                let kt_left = false;
                                let newHeSo;
                                let fixHeSo;
                                let mode = 0;
                                for (let j = 0; j < left.coefficients.length; j++) {
                                    if (left.coefficients[j].id !== '-' && left.coefficients[j].value !== 0) {
                                        kt_left = true;
                                        break;
                                    }
                                }
                                if (!kt_left) {
                                    newHeSo = right;
                                    fixHeSo = left;
                                    mode = 0;
                                }
                                else {
                                    newHeSo = left;
                                    fixHeSo = right;
                                    mode = 1;
                                }
                                /// NHAN PHAN PHOI
                                for (let j = 0; j < newHeSo.coefficients.length; j++) {
                                    for (let z = 0; z < fixHeSo.coefficients.length; z++) {
                                        if (fixHeSo.coefficients[z].value === 0)
                                            continue;
                                        newHeSo.coefficients[j].value = mode === 1 ? newHeSo.coefficients[j].value / fixHeSo.coefficients[z].value :
                                            fixHeSo.coefficients[z].value / newHeSo.coefficients[j].value;
                                    }
                                }
                                left = newHeSo;
                            }
                        }
                        // console.log(left);
                        // console.log(`---------------\n`)
                        stackNum.push(left);
                    }
                }
            }
            /// CHUYEN SANG DANG CHUOI BIEU THUC
            // console.log(stackNum[0]);
            let str = '';
            for (let i = 0; i < stackNum[0].coefficients.length; i++) {
                if (stackNum[0].coefficients[i].value === 0)
                    continue;
                if (stackNum[0].coefficients[i].id === '-') {
                    str += stackNum[0].coefficients[i].value;
                }
                else {
                    if (stackNum[0].coefficients[i].value === 1)
                        str += `${stackNum[0].coefficients[i].id}`;
                    else
                        str += `${stackNum[0].coefficients[i].value}*${stackNum[0].coefficients[i].id}`;
                }
                str += "+";
            }
            if (str !== '')
                str = str.substring(0, str.length - 1);
            else
                str = '0';
            // console.log(`BIEU THUC:  ${str}`);
            return HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str));
        }
    }
    QuyTacDaiSo.RutGon = RutGon;
    class HeSo {
        constructor(id) {
            this.coefficients = [];
            id.forEach(e => {
                this.coefficients.push({ id: e, value: 0 });
            });
        }
    }
    class HeSoBuilder {
        constructor(coefficients) {
            this.coefficients = [];
            this.coefficients = coefficients;
        }
        builder() {
            let str = [];
            this.coefficients.forEach(e => {
                str.push(e.id);
            });
            return new HeSo(str);
        }
    }
})(QuyTacDaiSo = exports.QuyTacDaiSo || (exports.QuyTacDaiSo = {}));
