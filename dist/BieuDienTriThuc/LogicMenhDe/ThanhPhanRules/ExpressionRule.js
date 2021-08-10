"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquivalentRule = exports.ExpressionRule = void 0;
const Expression_1 = require("../ThanhPhanC/Expression");
const ChuyenStringThanhBieuThuc_1 = require("../ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
const SimplarExpression_1 = require("../ThanhPhanFuncs/SimplarExpression");
const Operator_1 = require("../ThanhPhanOperators/Operator");
var ExpressionRule;
(function (ExpressionRule) {
    class Rule {
        constructor(id, name) {
            this._id = -1;
            this._name = '';
            this.helper = Helper_1.ExpressionHelper.Helper;
            this.message_Checker = new EquivalentRule.CheckerMessage();
            this.indexReturn = -1;
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
        reset() { this.message_Checker = new EquivalentRule.CheckerMessage(); this.indexReturn = -1; }
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
var EquivalentRule;
(function (EquivalentRule) {
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
    EquivalentRule.CheckerMessage = CheckerMessage;
    class TUONG_DUONG extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
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
    EquivalentRule.TUONG_DUONG = TUONG_DUONG;
    class KEO_THEO extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
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
        //#region  BAN THAN LA MOT MENH DE KEO THEO 
        checker_1(exp) {
            if (exp.operator.id === Operator_1.Operts.Type.KEO_THEO)
                return TUONG_DUONG.LA_MENH_DE;
            return -1;
        }
        //#endregion
        //#region CO CHUA MOT MENH DE KEO THEO
        checker_2(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.KEO_THEO) {
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
            let r = this.result_1(expr.childs[this.message_Checker.num_1]);
            expr.setChildAt(this.message_Checker.num_1, r);
            return expr;
        }
    }
    KEO_THEO.LA_MENH_DE = 1;
    KEO_THEO.CHUA_MENH_DE = 2;
    EquivalentRule.KEO_THEO = KEO_THEO;
    class DONG_NHAT extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
        }
        run(expr) {
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
    EquivalentRule.DONG_NHAT = DONG_NHAT;
    class LUAT_NUOT extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
        }
        run(expr) {
            let TRUE = this.helper.createConstant(true);
            let FALSE = this.helper.createConstant(false);
            if (expr.operator.id === Operator_1.Operts.Type.TUYEN && expr.id.includes(TRUE.id))
                return 1;
            else if (expr.operator.id === Operator_1.Operts.Type.HOI && expr.id.includes(FALSE.id))
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
    EquivalentRule.LUAT_NUOT = LUAT_NUOT;
    class LUY_DANG extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
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
    EquivalentRule.LUY_DANG = LUY_DANG;
    class PHAN_TU_BU extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI &&
                expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            for (let i = 0; i < expr.childs.length; i++) {
                let notP = this.helper.not(expr.childs[i]);
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j)
                        continue;
                    if (notP.id !== expr.childs[j].id)
                        continue;
                    this.message_Checker.addNum_1(i).addExp_1(notP);
                    if (expr.operator.id === Operator_1.Operts.Type.HOI)
                        return 1;
                    else
                        return 2;
                }
            }
            return -1;
        }
        result(index, expr) {
            if (index === 1)
                expr.addChild(this.helper.createConstant(false));
            else
                expr.addChild(this.helper.createConstant(true));
            expr.removeAt(this.message_Checker.num_1);
            expr.removeChild(this.message_Checker.exp_1);
            return this.helper.checkAndChangeToPrime(expr);
        }
    }
    EquivalentRule.PHAN_TU_BU = PHAN_TU_BU;
    class PHU_DINH_KEP extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
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
    EquivalentRule.PHU_DINH_KEP = PHU_DINH_KEP;
    class HAP_THU extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI &&
                expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            return this.checker_1(expr);
            return -1;
        }
        checker_1(expr) {
            let exp1 = ChuyenStringThanhBieuThuc_1.StringToExpression('p\u2228(p\u2227q)');
            let exp2 = ChuyenStringThanhBieuThuc_1.StringToExpression('p\u2227(p\u2228q)');
            //#region  BIEU THUC EXPR1
            let rs = new SimplarExpression_1.SimilarExpression().genarate(exp1, expr);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].id === expr.id) {
                    this.message_Checker.addExp_1(rs[i]);
                    return 1;
                }
                if (this.helper.contain(rs[i], expr)) {
                    this.message_Checker.addExp_1(rs[i]);
                    return 2;
                }
            }
            //#endregion
            //#region  BIEU THUC EXPR2
            rs = new SimplarExpression_1.SimilarExpression().genarate(exp2, expr);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].id === expr.id) {
                    this.message_Checker.addExp_1(rs[i]);
                    return 1;
                }
                if (this.helper.contain(rs[i], expr)) {
                    this.message_Checker.addExp_1(rs[i]);
                    return 2;
                }
            }
            //#endregion
            return -1;
        }
        result(index, expr) {
            if (index === 1)
                return this.message_Checker.exp_1.childs[0];
            for (let j = 0; j < this.message_Checker.exp_1.childs.length; j++) {
                let index = expr.childs.findIndex(e => { return e.id === this.message_Checker.exp_1.childs[j].id; });
                if (index !== -1)
                    expr.removeAt(index);
            }
            expr.addChild(this.message_Checker.exp_1.childs[0]);
            return expr;
        }
    }
    HAP_THU.DANG_1 = 1;
    HAP_THU.DANG_2 = 2;
    EquivalentRule.HAP_THU = HAP_THU;
    class DE_MORGAN extends ExpressionRule.Rule {
        constructor(id, name) {
            super(id, name);
        }
        run(expr) {
            if (expr.operator.id === Operator_1.Operts.Type.KEO_THEO || expr.operator.id === Operator_1.Operts.Type.TUONG_DUONG)
                return -1;
            let s = this.checker_1(expr);
            if (s !== -1)
                return s;
            s = this.checker_2(expr);
            if (s !== -1)
                return s;
            s = this.checker_3(expr);
            if (s !== -1)
                return s;
            s = this.checker_4(expr);
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
                        let doiNgau = this.helper.DOI_NGAU(p.childs[j]);
                        if (ex.id.includes(notP.id) || ex.id.includes(doiNgau.id)) {
                            this.message_Checker.addNum_1(i);
                            return DE_MORGAN.BO_DAU_TOT;
                        }
                    }
                }
            }
            return -1;
        }
        checker_2(exp) {
            let template_1 = ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨¬b∨¬(a∧b)');
            let template_2 = ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧¬b∧¬(a∨b)');
            let template_3 = ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∨¬b∨(¬(a∧b)∧c)');
            let template_4 = ChuyenStringThanhBieuThuc_1.StringToExpression('¬a∧¬b∧(¬(a∨b)∨c)');
            let result = new SimplarExpression_1.SimilarExpression().genarate(template_1, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_2, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_3, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_4, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            return -1;
        }
        checker_3(exp) {
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
        checker_4(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operator_1.Operts.Type.PHU_DINH) {
                    if (this.helper.isPrimeOrConstant(exp.childs[i].childs[0]))
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
    EquivalentRule.DE_MORGAN = DE_MORGAN;
    class KET_HOP extends ExpressionRule.Rule {
        constructor(id, name) {
            super(9, 'Luật kết hợp');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI && expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            if (this.helper.isPrimeOrConstant(expr))
                return -1;
            let s = this.checker_1(expr);
            if (s !== -1)
                return s;
            s = this.checker_2(expr);
            if (s !== -1)
                return s;
            return -1;
        }
        checker_1(exp) {
            let template_1 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨((a∨b)∧b)');
            let template_2 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∧b∧((a∧b)∨b)');
            let template_3 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨(¬(a∨b)∧b)');
            let template_4 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∧b∧(¬(a∧b)∨b)');
            let template_5 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨¬(a∨b)');
            let template_6 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∧b∧¬(a∧b)');
            let template_7 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∨b∨(a∨b)');
            let template_8 = ChuyenStringThanhBieuThuc_1.StringToExpression('a∧b∧(a∧b)');
            let result = new SimplarExpression_1.SimilarExpression().genarate(template_1, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_2, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_3, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_4, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_5, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_6, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_7, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            result = new SimplarExpression_1.SimilarExpression().genarate(template_8, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
            }
            return -1;
        }
        checker_2(exp) {
            let operator = exp.operator.id;
            for (let i = 0; i < exp.childs.length; i++) {
                if (this.helper.isPrimeOrConstant(exp.childs[i]))
                    continue;
                if (operator === exp.childs[i].operator.id) {
                    this.message_Checker.addNum_1(i);
                    return KET_HOP.BO_DAU;
                }
            }
            return -1;
        }
        result(index, exp) {
            if (index === KET_HOP.GOM) {
                let a = this.message_Checker.exp_1.childs[0];
                let b = this.message_Checker.exp_1.childs[1];
                exp.removeChild(a);
                exp.removeChild(b);
                let build = new Expression_1.ExpressionBuilder().addChild(a).addChild(b).addOperator(exp.operator.id).build();
                exp.addChild(build);
            }
            let i = this.message_Checker.num_1;
            for (let j = 0; j < exp.childs[i].childs.length; j++) {
                exp.addChild(exp.childs[i].childs[j]);
            }
            exp.removeAt(i);
            return exp;
        }
    }
    KET_HOP.GOM = 1;
    KET_HOP.BO_DAU = 2;
    EquivalentRule.KET_HOP = KET_HOP;
    class PHAN_PHOI extends ExpressionRule.Rule {
        constructor(id, name) {
            super(10, 'Luật phân phối');
        }
        run(expr) {
            if (expr.operator.id !== Operator_1.Operts.Type.HOI && expr.operator.id !== Operator_1.Operts.Type.TUYEN)
                return -1;
            let i = this.checker_1(expr);
            if (i !== -1)
                return i;
            i = this.check_2(expr);
            if (i !== -1)
                return i;
            i = this.checker_3(expr);
            if (i !== -1)
                return i;
            return -1;
        }
        checker_1(exp) {
            let exp1 = ChuyenStringThanhBieuThuc_1.StringToExpression('(a∧(¬a∨b))∧((a∧¬a)∨(a∧b))');
            let exp2 = ChuyenStringThanhBieuThuc_1.StringToExpression('(a∨(¬a∧b))∧((a∨¬a)∧(a∨b))');
            let rs = new SimplarExpression_1.SimilarExpression().genarate(exp1, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id; });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id; });
                    exp.removeAt(index);
                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }
            rs = new SimplarExpression_1.SimilarExpression().genarate(exp2, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id; });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id; });
                    exp.removeAt(index);
                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }
            return -1;
        }
        check_2(exp) {
            let exp1 = ChuyenStringThanhBieuThuc_1.StringToExpression('((a∧b)∨(a∧c))∧(a∧(a∨c))');
            let exp2 = ChuyenStringThanhBieuThuc_1.StringToExpression('((a∨b)∧(a∨c))∧(a∨(a∧c))');
            let rs = new SimplarExpression_1.SimilarExpression().genarate(exp1, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.GOMLAI;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id; });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id; });
                    exp.removeAt(index);
                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.GOMLAI;
                }
            }
            rs = new SimplarExpression_1.SimilarExpression().genarate(exp2, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id; });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id; });
                    exp.removeAt(index);
                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }
            return -1;
        }
        checker_3(exp) {
            for (let i = 0; i < exp.childs.length; i++) {
                let p = exp.childs[i];
                if (p.operator.id === Operator_1.Operts.Type.HOI || p.operator.id === Operator_1.Operts.Type.TUYEN) {
                    let j = 0;
                    if (i === 0)
                        j = 1;
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
            return this.message_Checker.exp_1;
        }
    }
    PHAN_PHOI.PHAN_PHOI_PHU_DINH = 1;
    PHAN_PHOI.GOMLAI = 2;
    EquivalentRule.PHAN_PHOI = PHAN_PHOI;
})(EquivalentRule = exports.EquivalentRule || (exports.EquivalentRule = {}));
