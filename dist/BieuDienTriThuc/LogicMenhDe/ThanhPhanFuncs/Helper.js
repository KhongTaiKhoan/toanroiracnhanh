"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionHelper = void 0;
const Expression_1 = require("../ThanhPhanC/Expression");
const Operator_1 = require("../ThanhPhanOperators/Operator");
var ExpressionHelper;
(function (ExpressionHelper) {
    class Helper {
        static isNumber(num) {
            return num.match(/^-?\d+$/) !== null;
        }
        static isPrimeOrConstant(expr) {
            return expr.childs.length === 0;
        }
        static createConstant(val) {
            let exp = new Expression_1.Expression();
            exp.value = val;
            exp.id = val ? '1' : '0';
            return exp;
        }
        static isROOT(expr) {
            return expr.parent === null;
        }
        static createPrime(id) {
            let exp = new Expression_1.Expression();
            exp.id = id;
            return exp;
        }
        static copy(expr) {
            if (this.isPrimeOrConstant(expr)) {
                if (this.isNumber(expr.id) && expr.value !== null)
                    return this.createConstant(expr.value);
                return this.createPrime(expr.id);
            }
            let rs = new Expression_1.Expression();
            rs.parent = expr.parent;
            for (let i = 0; i < expr.childs.length; i++) {
                rs.childs.push(this.copy(expr.childs[i]));
            }
            rs.operator = new Operator_1.OperatorFactory().create(expr.operator.id);
            return rs;
        }
        static replacePrimes(primes, expr) {
            expr = this.copy(expr);
            // console.log();
            // primes.forEach(e=>{console.log(e.id)});
            let exp_clone = this.copy(expr);
            for (let i = 0; i < primes.length; i++) {
                expr = this.replacePrime(expr, primes[i], exp_clone.primes[i]);
            }
            return expr;
        }
        static replacePrime(expr, prime, or_prime) {
            if (ExpressionHelper.Helper.isPrimeOrConstant(expr)) {
                // console.log(`${expr.id} and ${or_prime.id}  and ${prime.id}`);
                if (expr.id === or_prime.id)
                    return ExpressionHelper.Helper.copy(prime);
                else
                    return expr;
            }
            for (let i = 0; i < expr.childs.length; i++) {
                expr.setChildAt(i, this.replacePrime(expr.childs[i], prime, or_prime));
            }
            return expr;
        }
        static contain(expr, parent) {
            if (expr.operator.id !== parent.operator.id)
                return false;
            expr = this.copy(expr);
            parent = this.copy(parent);
            let sizeChilds = expr.childs.length;
            for (let i = 0; i < sizeChilds; i++) {
                // console.log(expr.childs[i].id);
                let index = parent.childs.findIndex(e => { return e.id === expr.childs[i].id; });
                if (index === -1) {
                    return false;
                }
                parent.removeAt(index);
            }
            return true;
        }
        static contain2(expr, parent) {
            if (expr.operator.id !== parent.operator.id)
                return [];
            if (this.Length(expr) > this.Length(parent))
                return [];
            expr = this.copy(expr);
            parent = this.copy(parent);
            let result = [];
            let sizeChilds = expr.childs.length;
            for (let i = 0; i < sizeChilds; i++) {
                let index = parent.childs.findIndex(e => { return e.id === expr.childs[i].id; });
                if (index === -1) {
                    if (ExpressionHelper.Helper.laTuDon(expr.childs[i]))
                        return [];
                    let flag = false;
                    for (let j = 0; j < parent.childs.length && !flag; j++) {
                        if (ExpressionHelper.Helper.laTuDon(parent.childs[i]))
                            continue;
                        for (let z = 0; z < parent.childs[j].childs.length; z++) {
                            if (expr.childs[i].id === parent.childs[j].childs[z].id) {
                                flag = true;
                                result.push(j);
                                break;
                            }
                        }
                    }
                    if (!flag) {
                        flag = true;
                        for (let j = 0; j < parent.childs.length; j++) {
                            let s = parent.childs[i];
                            if (this.isPrimeOrConstant(s))
                                continue;
                            for (let z = 0; z < s.childs.length; z++) {
                                if (!ExpressionHelper.Helper.laTuDon(s.childs[z])) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (!flag)
                                break;
                            if (s.id.includes(expr.childs[i].id)) {
                                result.push(j);
                                flag = true;
                                break;
                            }
                            flag = false;
                        }
                        if (!flag)
                            return [];
                    }
                }
                else
                    result.push(index);
            }
            return result;
        }
        static not(expr) {
            if (expr.operator.id === Operator_1.Operts.Type.PHU_DINH)
                return expr.childs[0];
            return new Expression_1.ExpressionBuilder().addChild(expr).addOperator(Operator_1.Operts.Type.PHU_DINH).build();
        }
        static Length(P) {
            if (Helper.isPrimeOrConstant(P)) {
                if (P.operator.id !== Operator_1.Operts.Type.PHU_DINH) {
                    return 0;
                }
                else
                    return 0.5;
            }
            let rs = 0;
            for (let i = 0; i < P.childs.length; i++) {
                if (!Helper.isPrimeOrConstant(P.childs[i]))
                    rs += this.Length(P.childs[i]) + 0.1;
            }
            if (P.operator.id === Operator_1.Operts.Type.HOI || P.operator.id === Operator_1.Operts.Type.TUYEN)
                rs += (P.childs.length - 1);
            if (P.operator.id === Operator_1.Operts.Type.TUONG_DUONG)
                rs += 4;
            if (P.operator.id === Operator_1.Operts.Type.KEO_THEO)
                rs += 2;
            // if(P.id.includes('1')||P.id.includes('0'))rs-=0.5;  
            for (let i = 0; i < P.childs.length; i++) {
                if (P.childs[i].id === '1' || P.childs[i].id === '0')
                    rs -= 0.5;
            }
            return rs;
        }
        static DOI_NGAU(exp) {
            if (this.laTuDon(exp))
                return null;
            let builder = new Expression_1.ExpressionBuilder();
            if (exp.operator.id !== Operator_1.Operts.Type.PHU_DINH) {
                for (let i = 0; i < exp.childs.length; i++) {
                    builder.addChild(this.not(exp.childs[i]));
                }
                builder.addOperator(exp.operator.id === Operator_1.Operts.Type.HOI ?
                    Operator_1.Operts.Type.TUYEN : Operator_1.Operts.Type.HOI);
                return this.checkAndChangeToPrime(builder.build());
            }
            for (let i = 0; i < exp.childs[0].childs.length; i++) {
                builder.addChild(this.not(exp.childs[0].childs[i]));
            }
            builder.addOperator(exp.childs[0].operator.id === Operator_1.Operts.Type.HOI ?
                Operator_1.Operts.Type.TUYEN : Operator_1.Operts.Type.HOI);
            return this.checkAndChangeToPrime(builder.build());
        }
        static isLetter(str) {
            let n = str.charCodeAt(0);
            return (n >= 65 && n < 91) || (n >= 97 && n < 123);
        }
        static checkAndChangeToPrime(exp) {
            if (exp.childs.length === 1 && exp.operator.id !== Operator_1.Operts.Type.PHU_DINH) {
                let parent = exp.parent;
                exp = exp.childs[0];
                exp.parent = parent;
                return exp;
            }
            return exp;
        }
        static laTuDon(exp) {
            return ExpressionHelper.Helper.isPrimeOrConstant(exp) ||
                (exp.operator.id === Operator_1.Operts.Type.PHU_DINH
                    && ExpressionHelper.Helper.isPrimeOrConstant(exp.childs[0]));
        }
    }
    ExpressionHelper.Helper = Helper;
})(ExpressionHelper = exports.ExpressionHelper || (exports.ExpressionHelper = {}));
