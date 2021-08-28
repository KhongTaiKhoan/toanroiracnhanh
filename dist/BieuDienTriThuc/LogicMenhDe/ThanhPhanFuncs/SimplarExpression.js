"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PairPrimes = exports.SimilarExpression = void 0;
const Expression_1 = require("../ThanhPhanC/Expression");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
class SimilarExpression {
    constructor() {
        this.states = [];
    }
    //// MUC DICH HAM LA THAY CAC BIEN MENH DE VA BIEU THUC CON CUA EXPR2 BAO EXPR1
    //// TAO RA CAC BIEU THUC DONG DANG COI EXPR1
    genarate(expr1, expr2) {
        let pair = [];
        let exp1 = Helper_1.ExpressionHelper.Helper.copy(expr1);
        let exp2 = Helper_1.ExpressionHelper.Helper.copy(expr2);
        let labels = [];
        let ids = [];
        //#region  THAY THE CAC BIEN MENH DE
        if (exp1.primes.length <= exp2.primes.length) {
            for (let j = 0; j < exp2.primes.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < exp1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, exp2.primes.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let primes = [];
                this.states[i].forEach(element => {
                    primes.push(exp2.primes[element]);
                });
                let not_primes = [];
                primes.forEach(e => { not_primes.push(Helper_1.ExpressionHelper.Helper.not(e)); });
                let pa = new PairPrimes([], new Expression_1.Expression());
                let NOTpa = new PairPrimes([], new Expression_1.Expression());
                for (let j = 0; j < primes.length; j++) {
                    pa.pair.push([Helper_1.ExpressionHelper.Helper.copy(exp1.primes[j]), Helper_1.ExpressionHelper.Helper.copy(primes[j])]);
                }
                let newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(primes, exp1);
                let N_newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(not_primes, exp1);
                pa.exp = newExp;
                NOTpa.exp = N_newExp;
                pair.push(pa);
                pair.push(NOTpa);
            }
        }
        //#endregion
        //#region  THAY THE CAC BIEU THUC CON
        ids = [];
        labels = [];
        this.states = [];
        exp1 = Helper_1.ExpressionHelper.Helper.copy(expr1);
        exp2 = Helper_1.ExpressionHelper.Helper.copy(expr2);
        let btCon = this.getBieuThucCon(exp2);
        if (exp1.primes.length <= exp2.childs.length) {
            for (let j = 0; j < btCon.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < exp1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, btCon.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let childs = [];
                this.states[i].forEach(element => {
                    childs.push(btCon[element]);
                });
                let not_childs = [];
                childs.forEach(e => { not_childs.push(Helper_1.ExpressionHelper.Helper.not(e)); });
                let pa = new PairPrimes([], new Expression_1.Expression());
                let NOTpa = new PairPrimes([], new Expression_1.Expression());
                for (let j = 0; j < childs.length; j++) {
                    pa.pair.push([Helper_1.ExpressionHelper.Helper.copy(exp1.primes[j]), Helper_1.ExpressionHelper.Helper.copy(childs[j])]);
                }
                let newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(childs, exp1);
                let N_newExp = Helper_1.ExpressionHelper.Helper.replacePrimes(not_childs, exp1);
                pa.exp = newExp;
                NOTpa.exp = N_newExp;
                pair.push(pa);
                pair.push(NOTpa);
            }
        }
        //#endregion
        return pair;
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
    /// THAY THE TARGET BANG PAIR
    replace(pair, target) {
        for (let i = 0; i < pair.pair.length; i++) {
            target = Helper_1.ExpressionHelper.Helper.replacePrime(target, pair.pair[i][1], pair.pair[i][0]);
        }
        return target;
    }
    getBieuThucCon(expr) {
        let bt = [];
        for (let i = 0; i < expr.childs.length; i++) {
            if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i]))
                continue;
            if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[0])
                && bt.findIndex(e => { return e.id === expr.childs[i].id; }) === -1)
                bt.push(Helper_1.ExpressionHelper.Helper.copy(expr.childs[i]));
            else
                for (let j = 0; j < expr.childs[i].childs.length; j++) {
                    if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[j]))
                        continue;
                    if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[j].childs[0])
                        && bt.findIndex(e => { return e.id === expr.childs[i].childs[j].id; }) === -1)
                        bt.push(Helper_1.ExpressionHelper.Helper.copy(expr.childs[i].childs[j]));
                }
        }
        return bt;
    }
}
exports.SimilarExpression = SimilarExpression;
class PairPrimes {
    constructor(pair, exp) {
        //// BEN TRAI LA BIEN MENH DE CUA LUAT
        //// BEN PHAI LA BIEN MENH DE CUA BIEU THUC
        this.pair = [];
        this.exp = new Expression_1.Expression;
        this.pair = pair;
        this.exp = exp;
    }
}
exports.PairPrimes = PairPrimes;
