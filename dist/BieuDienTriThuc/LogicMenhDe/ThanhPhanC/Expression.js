"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionBuilder = exports.Expression = void 0;
const Helper_1 = require("../ThanhPhanFuncs/Helper");
const Operator_1 = require("../ThanhPhanOperators/Operator");
class Expression {
    constructor() {
        this._id = '';
        this._value = null;
        this._childs = [];
        this._parent = null;
        this._primes = [];
        this._operator = new Operator_1.OperatorFactory().create(Operator_1.Operts.Type.NONE);
        //#endregion
    }
    static replacePrimes(expr, prime) {
        if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(expr)) {
            if (expr.id === prime.id)
                return Helper_1.ExpressionHelper.Helper.createPrime(prime.id);
            else
                return expr;
        }
        for (let i = 0; i < expr.childs.length; i++) {
            expr.childs[i] = this.replacePrimes(expr.childs[i], prime);
        }
        return expr;
    }
    refeshPrime() {
        let prime_ids = [];
        let str_id = this.id;
        for (let i = 0; i < str_id.length; i++) {
            let n = str_id.charCodeAt(i);
            let strStartsWithALetter = (n >= 65 && n < 91) || (n >= 97 && n < 123);
            if (strStartsWithALetter) {
                if (!prime_ids.includes(str_id[i])) {
                    prime_ids.push(str_id[i]);
                }
            }
        }
        this._primes = [];
        for (let i = 0; i < prime_ids.length; i++) {
            this._primes.push(Helper_1.ExpressionHelper.Helper.createPrime(prime_ids[i]));
        }
    }
    refeshId() {
        if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this)) {
            return;
        }
        if (this.operator.id === Operator_1.Operts.Type.PHU_DINH) {
            if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this.childs[0])) {
                this._id = this.operator.toString() + this.childs[0]._id;
                return;
            }
            this._id = this.operator.toString() + "(" + this.childs[0].id + ")";
            return;
        }
        if (this.operator.id === Operator_1.Operts.Type.TUONG_DUONG || this.operator.id === Operator_1.Operts.Type.KEO_THEO) {
            let s = this.operator.toString();
            if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this.childs[0]))
                s += this.childs[0].id;
            else
                s += `(${this.childs[0].id})`;
            if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this.childs[1]))
                s += this.childs[1].id;
            else
                s += `(${this.childs[1].id})`;
            this._id = s;
        }
        /// SAP XEP THEO QUY TAC CAC BIEU THUC PHU DINH DUOC UU TIEN
        /// CHU CAI THEO THU TU APLHABET        
        let str = [];
        let str_2 = '';
        for (let i = 0; i < this.childs.length; i++) {
            if (!Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this.childs[i])
                && !(this.childs[i].operator.id === Operator_1.Operts.Type.PHU_DINH && Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(this.childs[i].childs[0]))) {
                str_2 += `(${this.childs[i].id})`;
            }
            else {
                /// DUYET CAC BIEU THUC MENH DE VA SAP XEP LAI CHUNG
                if (str.length === 0)
                    str.push(this.childs[i].id);
                else {
                    for (let j = str.length - 1; j >= 0; j--) {
                        let s1 = this.childs[i].id;
                        let s2 = str[j];
                        if (s1.includes(`${Operator_1.Operts.Type.PHU_DINH}`))
                            s1 = s1.split(`${Operator_1.Operts.Type.PHU_DINH}`)[1];
                        if (s2.includes(`${Operator_1.Operts.Type.PHU_DINH}`))
                            s2 = s2.split(`${Operator_1.Operts.Type.PHU_DINH}`)[1];
                        if (s2 < s1) {
                            if (j === str.length - 1)
                                str.push(this.childs[i].id);
                            else
                                str.splice(j + 1, 0, this.childs[i].id);
                            break;
                        }
                        else if (s2 === s1) {
                            if (this.childs[i].id.includes(`${Operator_1.Operts.Type.PHU_DINH}`)) {
                                str.splice(j, 0, this.childs[i].id);
                            }
                            else {
                                str.splice(j + 1, 0, this.childs[i].id);
                            }
                            break;
                        }
                        if (j === 0) {
                            str.splice(j, 0, this.childs[i].id);
                        }
                    }
                }
            }
        }
        let s = '';
        for (let i = 0; i < str.length; i++) {
            s += str[i];
        }
        this._id = this.operator.toString() + s + str_2;
    }
    type() {
        /// HANG
        if (this.childs.length === 0 && Helper_1.ExpressionHelper.Helper.isNumber(this.id)) {
            return Expression.CONSTANT;
        }
        /// BIEN
        else if (this.childs.length === 0) {
            return Expression.PRIME;
        }
        /// PHUC HOP
        return Expression.COMPLEX_EXPRESSION;
    }
    setChildAt(index, expr) {
        this.childs[index] = expr;
        this.childs[index].parent = this;
    }
    addChild(expr) {
        this.childs.push(expr);
        this.childs[this.childs.length - 1].parent = this;
    }
    removeAt(index) {
        this.childs.splice(index, 1);
        if (this.childs.length === 0)
            this.operator = new Operator_1.OperatorFactory().create(Operator_1.Operts.Type.NONE);
    }
    removeChild(exp) {
        let index = this.childs.findIndex(e => { return e.id === exp.id; });
        this.childs.splice(index, 1);
        if (this.childs.length === 0)
            this.operator = new Operator_1.OperatorFactory().create(Operator_1.Operts.Type.NONE);
    }
    //#region  GETTER AND SETTER
    get id() {
        this.refeshId();
        return this._id;
    }
    set id(value) {
        this._id = value;
        this.refeshId();
    }
    get value() {
        if (this._value === null)
            throw Error('CHUA DAT CHAN TRI');
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    get childs() {
        return this._childs;
    }
    set childs(value) {
        this._childs = value;
    }
    get primes() {
        this.refeshPrime();
        return this._primes;
    }
    set primes(value) {
        this._primes = value;
    }
    // public  getPrimeAt(index:number){
    //     return this.primes[index];
    // }
    // public  setPrimeAt(index:number,exp:Expression){
    //     this.primes[index] = exp;
    // }
    get operator() {
        return this._operator;
    }
    set operator(value) {
        this._operator = value;
    }
}
exports.Expression = Expression;
Expression.CONSTANT = 0;
Expression.PRIME = 1;
Expression.COMPLEX_EXPRESSION = 2;
Expression.TRUE = true;
Expression.FALSE = false;
class ExpressionBuilder {
    constructor() {
        this.expr = new Expression();
    }
    addChild(child) {
        this.expr.addChild(child);
        return this;
    }
    addChild2(child) {
        this.expr.childs.push(child);
        return this;
    }
    addValue(value) {
        this.expr.value = value;
        return this;
    }
    addId(id) {
        this.expr.id = id;
        return this;
    }
    addParent(parent) {
        this.expr.parent = parent;
        return this;
    }
    addPrime(prime) {
        this.expr.primes.push(prime);
        return this;
    }
    addOperator(o) {
        let operator = new Operator_1.OperatorFactory().create(o);
        this.expr.operator = operator;
        return this;
    }
    build() {
        let e = this.expr;
        this.expr = new Expression();
        return e;
    }
}
exports.ExpressionBuilder = ExpressionBuilder;
