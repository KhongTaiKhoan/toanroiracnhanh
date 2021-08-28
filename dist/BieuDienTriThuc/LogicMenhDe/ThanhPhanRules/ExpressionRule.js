"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquivalentRules = exports.ExpressionRule = void 0;
const Expression_1 = require("../ThanhPhanC/Expression");
const ChuyenStringThanhBieuThuc_1 = require("../ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
const SimplarExpression_1 = require("../ThanhPhanFuncs/SimplarExpression");
const Simplify_1 = require("../ThanhPhanFuncs/Simplify");
const Operator_1 = require("../ThanhPhanOperators/Operator");
var ExpressionRule;
(function (ExpressionRule) {
    class Rule {
        constructor(id, name) {
            this._id = -1;
            this._name = '';
            this.helper = Helper_1.ExpressionHelper.Helper;
            this.id = id;
            this.name = name;
        }
        //#region  SETTER AND GETTER
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
    }
    ExpressionRule.Rule = Rule;
})(ExpressionRule = exports.ExpressionRule || (exports.ExpressionRule = {}));
var EquivalentRules;
(function (EquivalentRules) {
    class EquivalentRule extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
            this.message_Checker = new EquivalentRules.CheckerMessage();
            this.indexReturn = -1;
            this.active = 0;
            this.runChilds = false;
            this.id = id;
            this.name = name;
            this.reset();
        }
        apply(exp) {
            if (this.indexReturn === -1)
                this.indexReturn = this.run(exp);
            if (this.indexReturn !== -1)
                return this.result(this.indexReturn, exp);
            return null;
        }
        reset() { this.message_Checker = new EquivalentRules.CheckerMessage(); this.indexReturn = -1; this.active = 0; this.runChilds = false; }
    }
    EquivalentRules.EquivalentRule = EquivalentRule;
    class CheckerMessage {
        constructor() {
            this.exp_1 = new Expression_1.Expression();
            this.exp_2 = new Expression_1.Expression();
            this.num_1 = -1;
            this.num_2 = -1;
        }
        addNum_1(i) {
            this.num_1 = i;
            return this;
        }
        addNum_2(i) {
            this.num_2 = i;
            return this;
        }
        addExp_1(e) {
            this.exp_1 = e;
            return this;
        }
        addExp_2(e) {
            this.exp_2 = e;
            return this;
        }
    }
    EquivalentRules.CheckerMessage = CheckerMessage;
    class TUONG_DUONG extends EquivalentRule {
        constructor() {
            super(0, 'Luật tương đương');
        }
        run(exp) {
            let i = this.checker_1(exp);
            if (i !== -1)
                return i;
            i = this.checker_2(exp);
            if (i !== -1)
                return i;
            return -1;
        }
        //#region  BAN THAN LA MOT MENH DE TUONG DUONG 
        checker_1(exp) {
            if (exp.operator.id === Operator_1.Operts.Type.TUONG_DUONG)
                return TUONG_DUONG.LA_MENH_DE;
            return -1;
        }
        //#endregion
        //#region CO CHUA MOT MENH DE TUONG DUONG
        checker_2(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.TUONG_DUONG) {
                    this.message_Checker = new CheckerMessage().addNum_1(i);
                    return TUONG_DUONG.CHUA_MENH_DE;
                }
            }
            return -1;
        }
        //#endregion
        result(index, exp) {
            if (index)
                return this.result_1(exp);
            return this.result_2(exp);
        }
        result_1(expr) {
            return new Expression_1.ExpressionBuilder()
                .addChild(new Expression_1.ExpressionBuilder().addChild(expr.childs[0])
                .addOperator(Operator_1.Operts.Type.KEO_THEO)
                .addChild(expr.childs[1]).build())
                .addOperator(Operator_1.Operts.Type.HOI)
                .addChild(new Expression_1.ExpressionBuilder().addChild(expr.childs[1])
                .addOperator(Operator_1.Operts.Type.KEO_THEO)
                .addChild(expr.childs[0]).build())
                .build();
        }
        result_2(expr) {
            let r = this.result_1(expr.childs[this.message_Checker.num_1]);
            expr.setChildAt(this.message_Checker.num_1, r);
            return expr;
        }
    }
    TUONG_DUONG.LA_MENH_DE = 1;
    TUONG_DUONG.CHUA_MENH_DE = 2;
    EquivalentRules.TUONG_DUONG = TUONG_DUONG;
    class KEO_THEO extends EquivalentRule {
        constructor() {
            super(1, 'Luật kéo theo');
        }
        run(exp) {
            exp = this.helper.copy(exp);
            let i = this.checker_1(exp);
            if (i !== -1)
                return i;
            // i = this.checker_2(exp);
            // if (i !== -1) return i;
            return -1;
        }
        //#region  BAN THAN LA MOT MENH DE KEO THEO 
        checker_1(exp) {
            if (exp.operator.id === Operator_1.Operts.Type.KEO_THEO) {
                let index = exp.childs[0].childs.findIndex(e => { return e.id === '0' || e.id === '1'; });
                if (index !== -1)
                    return -1;
                return TUONG_DUONG.LA_MENH_DE;
            }
            return -1;
        }
        //#endregion
        //#region CO CHUA MOT MENH DE KEO THEO
        checker_2(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.KEO_THEO) {
                    let index = exp.childs[i].childs[0].childs.findIndex(e => { return e.id === '0' || e.id === '1'; });
                    if (index !== -1)
                        return -1;
                    this.message_Checker = new CheckerMessage().addNum_1(i);
                    return TUONG_DUONG.CHUA_MENH_DE;
                }
            }
            return -1;
        }
        //#endregion
        result(index, exp) {
            if (index)
                return this.result_1(exp);
            return this.result_2(exp);
        }
        result_1(expr) {
            let result = new Expression_1.ExpressionBuilder();
            return result.addChild(this.helper.not(expr.childs[0])).addOperator(Operator_1.Operts.Type.TUYEN)
                .addChild(expr.childs[1]).build();
        }
        result_2(expr) {
            let r = this.helper.copy(this.result_1(expr.childs[this.message_Checker.num_1]));
            expr.setChildAt(this.message_Checker.num_1, r);
            return expr;
        }
    }
    KEO_THEO.LA_MENH_DE = 1;
    KEO_THEO.CHUA_MENH_DE = 2;
    EquivalentRules.KEO_THEO = KEO_THEO;
    class DONG_NHAT extends EquivalentRule {
        constructor() {
            super(2, 'Luật đồng nhất');
        }
        run(expr) {
            expr = this.helper.copy(expr);
            let TRUE = this.helper.createConstant(true);
            let FALSE = this.helper.createConstant(false);
            if (expr.childs.length > 1)
                for (let i = 0; i < expr.childs.length; i++)
                    if ((expr.childs[i].id === TRUE.id && expr.operator.id === Operator_1.Operts.Type.HOI)
                        || (expr.childs[i].id === FALSE.id && expr.operator.id === Operator_1.Operts.Type.TUYEN)) {
                        this.message_Checker.addNum_1(i);
                        return 1;
                    }
            return -1;
        }
        result(index, expr) {
            expr.removeAt(this.message_Checker.num_1);
            // if (expr.childs.length === 1) expr = expr.childs[0];
            return this.helper.checkAndChangeToPrime(expr);
        }
    }
    EquivalentRules.DONG_NHAT = DONG_NHAT;
    class LUAT_NUOT extends EquivalentRule {
        constructor() {
            super(3, 'Luật nuốt');
        }
        run(expr) {
            let TRUE = this.helper.createConstant(true);
            let FALSE = this.helper.createConstant(false);
            for (let i = 0; i < expr.childs.length; i++)
                if (expr.childs[i].id === TRUE.id && expr.operator.id === Operator_1.Operts.Type.TUYEN)
                    return 1;
            for (let i = 0; i < expr.childs.length; i++)
                if (expr.childs[i].id === FALSE.id && expr.operator.id === Operator_1.Operts.Type.HOI)
                    return 2;
            return -1;
        }
        result(index, expr) {
            let TRUE = this.helper.createConstant(true);
            let FALSE = this.helper.createConstant(false);
            if (index === 1)
                return TRUE;
            return FALSE;
        }
    }
    EquivalentRules.LUAT_NUOT = LUAT_NUOT;
    class LUY_DANG extends EquivalentRule {
        constructor() {
            super(4, 'Luật lũy đẵng');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI &&
                expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < expr.childs.length; i++) {
                let p = expr.childs[i];
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (p.id !== expr.childs[j].id)
                        continue;
                    this.message_Checker.addNum_1(i);
                    return 1;
                }
            }
            return -1;
        }
        result(index, expr) {
            expr.removeAt(this.message_Checker.num_1);
            return this.helper.checkAndChangeToPrime(expr);
        }
    }
    EquivalentRules.LUY_DANG = LUY_DANG;
    class PHAN_TU_BU extends EquivalentRule {
        constructor() {
            super(5, 'Luật phần tử bù');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI &&
                expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < expr.childs.length; i++) {
                let p = expr.childs[i];
                let notP = this.helper.not(expr.childs[i]);
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (expr.childs[j].id === notP.id) {
                        if (expr.operator.id === Operator_1.Operts.Type.HOI) {
                            expr.addChild(this.helper.createConstant(false));
                            this.message_Checker.addExp_1(expr);
                        }
                        else {
                            expr.addChild(this.helper.createConstant(true));
                            this.message_Checker.addExp_1(expr);
                        }
                        expr.removeAt(j);
                        expr.removeChild(p);
                        this.active = .9;
                        return 1;
                    }
                }
            }
            return -1;
        }
        result(index, expr) {
            return this.helper.checkAndChangeToPrime(this.message_Checker.exp_1);
        }
    }
    EquivalentRules.PHAN_TU_BU = PHAN_TU_BU;
    class PHU_DINH_KEP extends EquivalentRule {
        constructor() {
            super(6, 'Luật phủ địng kép');
        }
        run(expr) {
            if (expr.operator.id === Operator_1.Operts.Type.PHU_DINH &&
                expr.childs[0].operator.id === Operator_1.Operts.Type.PHU_DINH)
                return 1;
            return -1;
        }
        result(index, expr) {
            return expr.childs[0].childs[0];
        }
    }
    EquivalentRules.PHU_DINH_KEP = PHU_DINH_KEP;
    class HAP_THU extends EquivalentRule {
        constructor() {
            super(7, 'Luật hấp thụ');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI &&
                expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            return this.checker_1(expr);
        }
        checker_1(expr) {
            for (let i = 0; i < expr.childs.length; i++) {
                let p = expr.childs[i];
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (expr.childs[j].operator.id === expr.operator.id)
                        continue;
                    if (expr.childs[j].operator.id !== Operator_1.Operts.Type.HOI &&
                        expr.childs[j].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    let index = expr.childs[j].childs.findIndex(e => { return e.id === p.id; });
                    if (index !== -1) {
                        expr.removeAt(j);
                        this.message_Checker.addExp_1(expr);
                        return 1;
                    }
                }
            }
            return -1;
        }
        result(index, expr) {
            return this.helper.checkAndChangeToPrime(this.message_Checker.exp_1);
        }
    }
    HAP_THU.DANG_1 = 1;
    HAP_THU.DANG_2 = 2;
    EquivalentRules.HAP_THU = HAP_THU;
    class DE_MORGAN extends EquivalentRule {
        constructor() {
            super(8, 'Luật DeMorgan');
        }
        run(expr) {
            if (expr.operator.id === Operator_1.Operts.Type.KEO_THEO || expr.operator.id === Operator_1.Operts.Type.TUONG_DUONG)
                return -1;
            let exp = this.helper.copy(expr);
            let s = this.checker_1(exp);
            if (s !== -1)
                return s;
            exp = this.helper.copy(exp);
            s = this.checker_2(exp);
            if (s !== -1)
                return s;
            exp = this.helper.copy(exp);
            s = this.checker_3(exp);
            if (s !== -1)
                return s;
            exp = this.helper.copy(exp);
            s = this.checker_4(exp);
            if (s !== -1)
                return s;
            exp = this.helper.copy(exp);
            s = this.checker_5(exp);
            if (s !== -1)
                return s;
            return -1;
        }
        checker_1(exp) {
            if (exp.operator.id !== Operator_1.Operts.Type.HOI && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.PHU_DINH) {
                    if (this.helper.isPrimeOrConstant(exp.childs[i].childs[0]))
                        continue;
                    if (exp.childs[i].childs[0].operator.id !== Operator_1.Operts.Type.HOI
                        && exp.childs[i].childs[0].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    let ex = this.helper.copy(exp);
                    let p = exp.childs[i].childs[0];
                    ex.removeAt(i);
                    for (let j = 0; j < p.childs.length; j++) {
                        let notP = this.helper.not(p.childs[j]);
                        if (ex.id.includes(notP.id)) {
                            this.message_Checker.addNum_1(i);
                            this.active = 1;
                            return DE_MORGAN.BO_DAU_TOT;
                        }
                    }
                }
            }
            return -1;
        }
        checker_2(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (this.helper.laTuDon(exp.childs[i]))
                    continue;
                let p = this.helper.copy(exp.childs[i]);
                let doiNgau = this.helper.DOI_NGAU(p);
                for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (this.helper.laTuDon(exp.childs[j]))
                        continue;
                    if (doiNgau === null)
                        break;
                    if (exp.childs[j].id.includes(doiNgau.id)) {
                        doiNgau.childs.forEach(e => {
                            exp.childs[j].removeChild(e);
                        });
                        exp.childs[j].addChild(this.helper.not(p));
                        exp.childs[j] = this.helper.checkAndChangeToPrime(exp.childs[j]);
                        this.message_Checker.addExp_1(exp);
                        this.active = 1;
                        return DE_MORGAN.DOI_NGAU;
                    }
                }
            }
            return -1;
        }
        checker_3(exp) {
            let templ = [];
            templ.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨¬b∨¬(a∧b)'));
            templ.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧¬b∧¬(a∨b)'));
            templ.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨¬b∨(¬(a∧b)∧c)'));
            templ.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧¬b∧(¬(a∨b)∨c)'));
            let right = [];
            right.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬(a∧b)'));
            right.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬(a∨b)'));
            right.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬(a∧b)'));
            right.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬(a∨b)'));
            for (let i = 0; i < templ.length; i++) {
                let rs = new SimplarExpression_1.SimilarExpression().genarate(templ[i], exp);
                for (let j = 0; j < rs.length; j++) {
                    // if(exp.id === rs[j].exp.id){
                    //     let e = new SimilarExpression().replace(rs[j],right[i]);
                    //     this.message_Checker.addExp_1(e);
                    //     return DE_MORGAN.GOM_TM;
                    // }
                    // else
                    if (exp.id === rs[j].exp.id) {
                        let index = exp.childs.findIndex(e => { return e.id === templ[i].childs[0].id; });
                        exp.removeAt(index);
                        index = exp.childs.findIndex(e => { return e.id === templ[i].childs[1].id; });
                        exp.removeAt(index);
                        exp.addChild(new SimplarExpression_1.SimilarExpression().replace(rs[j], right[i]));
                        this.message_Checker.addExp_1(exp);
                        this.active = 0.6;
                        return DE_MORGAN.GOM_TM;
                    }
                }
            }
            return -1;
        }
        checker_4(exp) {
            if (this.helper.isPrimeOrConstant(exp))
                return -1;
            let valid = true;
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs.length < 2)
                    valid = false;
                if (exp.childs[i].operator.id !== Operator_1.Operts.Type.PHU_DINH)
                    valid = false;
            }
            if (valid) {
                return DE_MORGAN.GOM_THUONG;
            }
            return -1;
        }
        checker_5(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.PHU_DINH) {
                    if (this.helper.laTuDon(exp.childs[i]))
                        continue;
                    if (exp.childs[i].childs[0].operator.id !== Operator_1.Operts.Type.HOI
                        && exp.childs[i].childs[0].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    this.message_Checker.addNum_1(i);
                    return DE_MORGAN.TACH_THUONG;
                }
            }
            return -1;
        }
        result(index, exp) {
            let builder = new Expression_1.ExpressionBuilder();
            if (index === DE_MORGAN.BO_DAU_TOT) {
                let not = exp.childs[this.message_Checker.num_1];
                builder.addOperator(not.childs[0].operator.id === Operator_1.Operts.Type.HOI ?
                    Operator_1.Operts.Type.TUYEN : Operator_1.Operts.Type.HOI);
                for (let j = 0; j < not.childs[0].childs.length; j++) {
                    builder.addChild(this.helper.not(not.childs[0].childs[j]));
                }
                exp.removeAt(this.message_Checker.num_1);
                exp.addChild(builder.build());
                return exp;
            }
            else if (index === DE_MORGAN.GOM_TM)
                return this.message_Checker.exp_1;
            else if (index === DE_MORGAN.GOM_NHOM_DOI_NGAU) {
                let a = this.message_Checker.exp_1.childs[0];
                let b = this.message_Checker.exp_1.childs[1];
                exp.removeChild(a);
                exp.removeChild(b);
                let build = new Expression_1.ExpressionBuilder().addChild(a).addChild(b).addOperator(exp.operator.id).build();
                exp.addChild(this.helper.not(build));
            }
            else if (index === DE_MORGAN.GOM_THUONG) {
                builder = new Expression_1.ExpressionBuilder()
                    .addOperator(exp.operator.id === Operator_1.Operts.Type.HOI ? Operator_1.Operts.Type.TUYEN : Operator_1.Operts.Type.HOI);
                for (let i = 0; i < exp.childs.length; i++) {
                    builder.addChild(exp.childs[i].childs[0]);
                }
                let b = builder.build();
                if (b.childs.length === 1)
                    b = b.childs[0];
                return this.helper.not(b);
            }
            else if (index === DE_MORGAN.DOI_NGAU)
                return this.message_Checker.exp_1;
            let not = exp.childs[this.message_Checker.num_1];
            builder.addOperator(not.childs[0].operator.id === Operator_1.Operts.Type.HOI ?
                Operator_1.Operts.Type.TUYEN : Operator_1.Operts.Type.HOI);
            for (let j = 0; j < not.childs[0].childs.length; j++) {
                builder.addChild(this.helper.not(not.childs[0].childs[j]));
            }
            exp.removeAt(this.message_Checker.num_1);
            exp.addChild(builder.build());
            return exp;
        }
    }
    DE_MORGAN.BO_DAU_TOT = 1;
    DE_MORGAN.GOM_NHOM_DOI_NGAU = 2;
    DE_MORGAN.GOM_THUONG = 3;
    DE_MORGAN.TACH_THUONG = 4;
    DE_MORGAN.DOI_NGAU = 5;
    DE_MORGAN.GOM_TM = 6;
    EquivalentRules.DE_MORGAN = DE_MORGAN;
    class KET_HOP extends EquivalentRule {
        constructor() {
            super(9, 'Luật kết hợp');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI && expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            if (this.helper.isPrimeOrConstant(expr))
                return -1;
            let exp = this.helper.copy(expr);
            let s = this.checker_1(exp);
            if (s !== -1)
                return s;
            s = this.checker_2(exp);
            if (s !== -1)
                return s;
            s = this.checker_3(exp);
            if (s !== -1)
                return s;
            return -1;
        }
        checker_1(exp) {
            if (exp.childs.length <= 2)
                return -1;
            let tienDe = [];
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨(a∨b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∧b∧(a∧b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨¬(a∨b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨(¬a∨¬b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨(¬a∧¬b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨¬b∨(a∨b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧¬b∧(a∧b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨b∨¬(¬a∨b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∨¬b∨¬(a∨¬b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧b∧¬(¬a∧b)'));
            tienDe.push(ChuyenStringThanhBieuThuc_1.StringToExpression('a∧¬b∧¬(a∧¬b)'));
            let ketQua = [];
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∧b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(¬a∨¬b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(¬a∧¬b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(¬a∨b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨¬b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(¬a∧b)'));
            ketQua.push(ChuyenStringThanhBieuThuc_1.StringToExpression('(a∧¬b)'));
            for (let i = 0; i < tienDe.length; i++) {
                let rs = new SimplarExpression_1.SimilarExpression().genarate(tienDe[i], exp);
                for (let j = 0; j < rs.length; j++) {
                    if (rs[j].exp.id === exp.id) {
                        let index = exp.childs.findIndex(e => { return e.id === rs[j].exp.childs[0].id; });
                        exp.removeAt(index);
                        index = exp.childs.findIndex(e => { return e.id === rs[j].exp.childs[1].id; });
                        exp.removeAt(index);
                        let b = new SimplarExpression_1.SimilarExpression().replace(rs[j], ketQua[i]);
                        exp.addChild(b);
                        this.active = 0.6;
                        this.message_Checker.addExp_1(exp);
                        return KET_HOP.TACH_TM;
                    }
                    // let con = this.helper.contain2(rs[j].exp,exp);
                    if (this.helper.contain(rs[j].exp, exp)) {
                        let index = exp.childs.findIndex(e => { return e.id === rs[j].exp.childs[0].id; });
                        exp.removeAt(index);
                        index = exp.childs.findIndex(e => { return e.id === rs[j].exp.childs[1].id; });
                        exp.removeAt(index);
                        // rs[j].pair.forEach(e=>{
                        //     console.log(`LEFT ${e[0].id}  LEFT ${e[0].id}`);
                        // })   
                        let e = new SimplarExpression_1.SimilarExpression().replace(rs[j], ketQua[i]);
                        exp.addChild(e);
                        this.message_Checker.addExp_1(this.helper.checkAndChangeToPrime(exp));
                        this.active = 0.6;
                        return 1;
                    }
                }
            }
            return -1;
        }
        checker_2(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                let p = exp.childs[i];
                let notP = this.helper.not(exp.childs[i]);
                for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (this.helper.laTuDon(exp.childs[j]) || exp.operator.id !== exp.childs[j].operator.id)
                        continue;
                    let index = exp.childs[j].childs.findIndex(e => { return e.id === p.id || e.id === notP.id; });
                    if (index !== -1) {
                        exp.childs[j].childs.forEach(e => {
                            exp.addChild(e);
                        });
                        exp.removeAt(j);
                        this.active = 0.6;
                        this.message_Checker.exp_1 = exp;
                        this.active = 0.6;
                        return KET_HOP.TACH_TM;
                    }
                }
            }
            return -1;
        }
        checker_3(exp) {
            let operator = exp.operator.id;
            for (let i = 0; i < exp.childs.length; i++) {
                if (this.helper.laTuDon(exp.childs[i]))
                    continue;
                if (operator === exp.childs[i].operator.id) {
                    exp.childs[i].childs.forEach(e => {
                        exp.addChild(e);
                    });
                    exp.removeAt(i);
                    this.message_Checker.exp_1 = exp;
                    return KET_HOP.BO_DAU;
                }
            }
            return -1;
        }
        result(index, exp) {
            return this.message_Checker.exp_1;
        }
    }
    KET_HOP.GOM = 1;
    KET_HOP.BO_DAU = 2;
    KET_HOP.TACH_TM = 3;
    EquivalentRules.KET_HOP = KET_HOP;
    class PHAN_PHOI extends EquivalentRule {
        constructor() {
            super(10, 'Luật phân phối');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI && expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            let exp = this.helper.copy(expr);
            let i = this.checker_1(exp);
            if (i !== -1)
                return i;
            exp = this.helper.copy(expr);
            i = this.check_2(exp);
            if (i !== -1)
                return i;
            exp = this.helper.copy(expr);
            i = this.checker_3(exp);
            if (i !== -1)
                return i;
            return -1;
        }
        /// DANG a∧(¬a∨b) hoac a∧(a∨b)
        checker_1(exp) {
            // let templ:Expression[]=[];
            // templ.push(StringToExpression('a∧(¬a∨b)'));
            // templ.push(StringToExpression('a∨(¬a∧b)'));
            // let ketQua:Expression[]=[];
            // ketQua.push(StringToExpression('(a∧¬a)∨(a∧b)'))
            // ketQua.push(StringToExpression('(a∨¬a)∧(a∨b)'))
            // for (let i = 0; i < templ.length; i++) {
            //     let rs: PairPrimes[] = new SimilarExpression().genarate(templ[i], exp);
            //     for (let j = 0; j < rs.length; j++) {
            //         if(rs[j].exp.id === exp.id){
            //            let p = new SimilarExpression().replace(rs[j],ketQua[i]);
            //            this.message_Checker.addExp_1(p);
            //            this.active =0.6;
            //            return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
            //         }
            //     }
            // }
            if (this.helper.laTuDon(exp))
                return -1;
            if (exp.operator.id !== Operator_1.Operts.Type.HOI && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < exp.childs.length; i++) {
                let p = this.helper.copy(exp.childs[i]);
                let notP = this.helper.not(exp.childs[i]);
                for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (this.helper.laTuDon(exp))
                        continue;
                    if (exp.childs[j].operator.id !== Operator_1.Operts.Type.HOI && exp.childs[j].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    if (p.operator.id === exp.childs[j].operator.id)
                        continue;
                    let q = exp.childs[j];
                    let index = exp.childs[j].childs.findIndex(e => { return e.id === p.id || e.id === notP.id; });
                    if (index !== -1) {
                        let builder = new Expression_1.ExpressionBuilder().addOperator(q.operator.id);
                        q.childs.forEach(e => {
                            let b = new Expression_1.ExpressionBuilder().addOperator(exp.operator.id);
                            b.addChild(this.helper.copy(p)).addChild(e);
                            builder.addChild(b.build());
                        });
                        exp.removeAt(i);
                        let a = exp.childs.findIndex(e => { return e.id === q.id; });
                        exp.removeAt(a);
                        exp.addChild(builder.build());
                        this.message_Checker.addExp_1(this.helper.checkAndChangeToPrime(exp));
                        this.active = 0.6;
                        this.runChilds = true;
                        return 1;
                    }
                }
            }
            return -1;
        }
        // DANG: a∧(a∨b) 
        check_2(exp) {
            if (exp.operator.id !== Operator_1.Operts.Type.HOI && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < exp.childs.length; i++) {
                if (this.helper.laTuDon(exp.childs[i]))
                    continue;
                let p = exp.childs[i];
                if (exp.operator.id !== Operator_1.Operts.Type.HOI && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                    continue;
                for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (this.helper.laTuDon(exp.childs[j]))
                        continue;
                    if (exp.childs[j].operator.id !== Operator_1.Operts.Type.HOI && exp.childs[j].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    let q = exp.childs[j];
                    if (p.operator.id !== q.operator.id)
                        continue;
                    if (exp.operator.id !== Operator_1.Operts.Type.HOI && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    let builder = new Expression_1.ExpressionBuilder();
                    for (let z = 0; z < q.childs.length; z++) {
                        let index = p.childs.findIndex(e => {
                            return e.id === q.childs[z].id;
                        });
                        if (index !== -1) {
                            let b = new Expression_1.ExpressionBuilder().addOperator(exp.operator.id);
                            q.childs.forEach(e => { if (e.id !== q.childs[z].id)
                                b.addChild(e); });
                            p.childs.forEach(e => { if (e.id !== q.childs[index].id)
                                b.addChild(e); });
                            builder.addOperator(p.operator.id).addChild(q.childs[z]).addChild(b.build());
                            this.message_Checker.addExp_1(builder.build());
                            this.active = 0.6;
                            return 1;
                        }
                    }
                }
            }
            return -1;
        }
        checker_3(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                let p = exp.childs[i];
                if (p.operator.id !== Operator_1.Operts.Type.HOI && p.operator.id !== Operator_1.Operts.Type.TUYEN)
                    continue;
                for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (exp.childs[j].operator.id !== Operator_1.Operts.Type.HOI && exp.childs[j].operator.id !== Operator_1.Operts.Type.TUYEN)
                        continue;
                    let q = exp.childs[j];
                    let builder = new Expression_1.ExpressionBuilder().addOperator(p.operator.id);
                    for (let z = 0; z < p.childs.length; z++) {
                        let child = new Expression_1.ExpressionBuilder().addOperator(exp.operator.id);
                        child.addChild(q).addChild(p.childs[z]);
                        builder.addChild(child.build());
                    }
                    exp.removeChild(p);
                    exp.removeChild(q);
                    exp.addChild(builder.build());
                    this.message_Checker.addExp_1(this.helper.checkAndChangeToPrime(exp));
                    return 3;
                }
            }
            return -1;
        }
        result(index, expr) {
            return this.helper.checkAndChangeToPrime(this.message_Checker.exp_1);
        }
    }
    PHAN_PHOI.PHAN_PHOI_PHU_DINH = 1;
    PHAN_PHOI.GOMLAI = 2;
    EquivalentRules.PHAN_PHOI = PHAN_PHOI;
    class ManagerEquavilentRules {
        constructor() {
            this.rules = [];
            this.helper = Helper_1.ExpressionHelper.Helper;
            this.generate();
        }
        generate() {
            this.rules.push(new TUONG_DUONG());
            this.rules.push(new KEO_THEO());
            this.rules.push(new DONG_NHAT());
            this.rules.push(new LUAT_NUOT());
            this.rules.push(new LUY_DANG());
            this.rules.push(new PHAN_TU_BU());
            this.rules.push(new PHU_DINH_KEP());
            this.rules.push(new HAP_THU());
            this.rules.push(new DE_MORGAN());
            this.rules.push(new KET_HOP());
            this.rules.push(new PHAN_PHOI());
        }
        apply(exp, start, end) {
            if (!start)
                start = 0;
            if (!end)
                end = this.rules.length;
            this.resetRule();
            let clone = this.helper.copy(exp);
            let r = this.sapXep(this.helper.copy(exp));
            //let r = this.rules;
            for (let i = start; i < end; i++) {
                clone = this.helper.copy(exp);
                let rs = r[i].apply(exp);
                if (rs === null)
                    continue;
                return new Simplify_1.Transformation(r[i], rs);
            }
            return null;
        }
        resetRule() {
            for (let i = 0; i < this.rules.length; i++) {
                this.rules[i].reset();
            }
        }
        sapXep(exp) {
            let r = [];
            for (let i = 0; i < 8; i++) {
                r.push(this.rules[i]);
            }
            /// KET HOP 
            let ketHop = new KET_HOP();
            if (ketHop.checker_1(exp) !== -1) {
                this.rules[9].message_Checker = ketHop.message_Checker;
                r.push(this.rules[9]);
            }
            else if (ketHop.checker_2(exp) !== -1) {
                this.rules[9].message_Checker = ketHop.message_Checker;
                r.push(this.rules[9]);
            }
            /// DE_MORAGAN 
            let demorgan = new DE_MORGAN();
            if (demorgan.checker_1(exp) !== -1) {
                this.rules[8].message_Checker = demorgan.message_Checker;
                r.push(this.rules[8]);
            }
            else if (demorgan.checker_2(exp) !== -1) {
                this.rules[8].message_Checker = demorgan.message_Checker;
                r.push(this.rules[8]);
            }
            else if (demorgan.checker_3(exp) !== -1) {
                this.rules[8].message_Checker = demorgan.message_Checker;
                r.push(this.rules[8]);
            }
            /// PHAN PHOI
            let phanPhoi = new PHAN_PHOI();
            if (phanPhoi.checker_1(exp) !== -1) {
                this.rules[10].message_Checker = phanPhoi.message_Checker;
                r.push(this.rules[10]);
            }
            this.rules.forEach(e => {
                if (r.findIndex(ele => { return ele.id === e.id; }) === -1)
                    r.push(e);
            });
            return r;
        }
    }
    EquivalentRules.ManagerEquavilentRules = ManagerEquavilentRules;
})(EquivalentRules = exports.EquivalentRules || (exports.EquivalentRules = {}));
