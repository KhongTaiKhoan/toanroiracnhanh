"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimilarExpression = void 0;
const Helper_1 = require("../ThanhPhanFuncs/Helper");
class SimilarExpression {
    constructor() {
        this.states = [];
    }
    //// MUC DICH HAM LA THAY CAC BIEN MENH DE VA BIEU THUC CON CUA EXPR2 BAO EXPR1
    //// TAO RA CAC BIEU THUC DONG DANG COI EXPR1
    genarate(expr1, expr2) {
        let rs = [];
        expr1 = Helper_1.ExpressionHelper.Helper.copy(expr1);
        expr2 = Helper_1.ExpressionHelper.Helper.copy(expr2);
        let labels = [];
        let ids = [];
        //#region  THAY THE CAC BIEN MENH DE
        if (expr1.primes.length <= expr2.primes.length) {
            for (let j = 0; j < expr2.primes.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < expr1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, expr2.primes.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let primes = [];
                this.states[i].forEach(element => {
                    primes.push(expr2.primes[element]);
                });
                let not_primes = [];
                primes.forEach(e => { not_primes.push(Helper_1.ExpressionHelper.Helper.not(e)); });
                let newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(primes, expr1);
                let N_newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(not_primes, expr1);
                rs.push(newExp);
                rs.push(N_newExp);
            }
        }
        //#endregion
        //#region  THAY THE CAC BIEU THUC CON
        ids = [];
        labels = [];
        this.states = [];
        if (expr1.primes.length <= expr2.childs.length) {
            for (let j = 0; j < expr2.childs.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < expr1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, expr2.childs.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let childs = [];
                this.states[i].forEach(element => {
                    childs.push(expr2.childs[element]);
                });
                let newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(childs, expr1);
                rs.push(newExp);
            }
        }
        //#endregion
        return rs;
    }
    arrangement(index, n, id, label) {
        for (let i = 0; i < n; i++) {
            if (label[i] === false) {
                id[index] = i;
                if (index === id.length - 1) {
                    //// GHI NHAN KET QUA
                    let row = [];
                    id.forEach(e => row.push(e));
                    this.states.push(row);
                }
                else {
                    label[i] = true;
                    this.arrangement(index + 1, n, id, label);
                    label[i] = false;
                }
            }
        }
    }
}
exports.SimilarExpression = SimilarExpression;
