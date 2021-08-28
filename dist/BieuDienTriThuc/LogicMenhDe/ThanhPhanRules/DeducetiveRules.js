"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeducetiveRules = void 0;
const ExpressionRule_1 = require("./ExpressionRule");
const Expression_1 = require("../ThanhPhanC/Expression");
const Deduction_1 = require("../ThanhPhanFuncs/Deduction");
const Operator_1 = require("../ThanhPhanOperators/Operator");
const Equivalence_1 = require("../ThanhPhanFuncs/Equivalence");
const ExpressionToString_1 = require("../ThanhPhanFuncs/ExpressionToString");
const Simplify_1 = require("../ThanhPhanFuncs/Simplify");
var DeducetiveRules;
(function (DeducetiveRules) {
    class DeducetiveRule extends ExpressionRule_1.ExpressionRule.Rule {
        constructor() {
            super(...arguments);
            this.manager = new ExpressionRule_1.EquivalentRules.ManagerEquavilentRules();
        }
    }
    DeducetiveRule.LUAT_RUT_GON = 6;
    DeducetiveRules.DeducetiveRule = DeducetiveRule;
    class TAM_DOAN_LUAN_KHANG_DINH extends DeducetiveRule {
        constructor() {
            super(2, 'Tam đoạn luân khẳng định');
        }
        apply(exp, GT, visited) {
            if (exp.operator.id !== Operator_1.Operts.Type.KEO_THEO && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operator_1.Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right = this.helper.copy(exp);
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new Expression_1.ExpressionBuilder().addOperator(Operator_1.Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Deduction_1.Reasoning(id, [org], this.manager.rules[1], exp));
                id++;
            }
            /// TRUONG HOP VE PHAI LA TAP HOP CAC BIEU THUC CON CUA GT
            let kh = new LUAT_KET_HOP().apply(exp.childs[0], GT, visited);
            if (kh.length !== 0) {
                reasoning = reasoning.concat(kh);
                reasoning.push(new Deduction_1.Reasoning(id, [exp, exp.childs[0]], this, exp.childs[1]));
                return reasoning;
            }
            //// TIM BIEU THUC GIONG BIEU THUC VE TRAI HOAC TUONG DUONG VOI VE TRAI
            for (let i = 0; i < GT.length; i++) {
                if (GT[i].id === exp.id)
                    continue;
                if (visited.findIndex(e => { return e.id === GT[i].id; }) !== -1)
                    continue;
                //// BIEU THUC GIONG VE TRAI;
                if (GT[i].id === exp.childs[0].id) {
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, exp.childs[1]));
                    return reasoning;
                }
                //// BIEU THUC TUONG DONG VE TRAI;
                let equivalence = new Equivalence_1.Equivalence().
                    giai(`${ExpressionToString_1.ExpressionToString(exp.childs[0])}\u2261${ExpressionToString_1.ExpressionToString(GT[i])}`);
                if (equivalence !== null) {
                    for (let i = 0; i < equivalence.length; i++) {
                        if (i === 0)
                            reasoning.push(new Deduction_1.Reasoning(id, [exp], equivalence[i].rule, equivalence[i].Exp()));
                        else
                            reasoning.push(new Deduction_1.Reasoning(id, [equivalence[i - 1].Exp()], equivalence[i].rule, equivalence[i].Exp()));
                        id++;
                    }
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, exp.childs[1]));
                    return reasoning;
                }
            }
            return [];
        }
    }
    DeducetiveRules.TAM_DOAN_LUAN_KHANG_DINH = TAM_DOAN_LUAN_KHANG_DINH;
    class TAM_DOAN_LUAN_PHU_DINH extends DeducetiveRule {
        constructor() {
            super(2, 'Tam đoạn luân phủ định');
        }
        apply(exp, GT, visited) {
            if (exp.operator.id !== Operator_1.Operts.Type.KEO_THEO && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operator_1.Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right = this.helper.copy(exp);
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new Expression_1.ExpressionBuilder().addOperator(Operator_1.Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Deduction_1.Reasoning(id, [org], this.manager.rules[1], this.helper.copy(exp)));
                id++;
            }
            ///TRUONG HOP VE PHAI LA TAP HOP CAC BIEU THUC CON CUA GT
            let dn = this.helper.DOI_NGAU(exp.childs[1]);
            let kh = [];
            if (dn !== null) {
                kh = new LUAT_KET_HOP().apply(dn, GT, visited);
                if (kh.length !== 0) {
                    reasoning = reasoning.concat(kh);
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, dn], this, this.helper.not(exp.childs[0])));
                    return reasoning;
                }
            }
            //// TIM BIEU THUC GIONG BIEU THUC VE TRAI HOAC TUONG DUONG VOI PHU DINH BT VE PHAI
            for (let i = 0; i < GT.length; i++) {
                if (GT[i].id === exp.id)
                    continue;
                if (visited.findIndex(e => { return e.id === GT[i].id; }) !== -1)
                    continue;
                //// BIEU THUC GIONG VE TRAI;
                if (GT[i].id === this.helper.not(exp.childs[1]).id) {
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, this.helper.not(exp.childs[0])));
                    return reasoning;
                }
                //// BIEU THUC TUONG DONG VE TRAI;
                let equivalence = new Equivalence_1.Equivalence().
                    giai(`${ExpressionToString_1.ExpressionToString(this.helper.not(exp.childs[1]))}\u2261${ExpressionToString_1.ExpressionToString(GT[i])}`);
                if (equivalence !== null) {
                    for (let i = 0; i < equivalence.length; i++) {
                        if (i === 0)
                            reasoning.push(new Deduction_1.Reasoning(id, [exp], equivalence[i].rule, equivalence[i].Exp()));
                        else
                            reasoning.push(new Deduction_1.Reasoning(id, [equivalence[i - 1].Exp()], equivalence[i].rule, equivalence[i].Exp()));
                        id++;
                    }
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, this.helper.not(exp.childs[0])));
                    return reasoning;
                }
            }
            return [];
        }
    }
    DeducetiveRules.TAM_DOAN_LUAN_PHU_DINH = TAM_DOAN_LUAN_PHU_DINH;
    class TAM_DOAN_LUAN_GIA_DINH extends DeducetiveRule {
        constructor() {
            super(3, 'Tam đoạn luận giả định');
        }
        apply(exp, GT, visited) {
            if (exp.operator.id !== Operator_1.Operts.Type.KEO_THEO && exp.operator.id !== Operator_1.Operts.Type.TUYEN)
                return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operator_1.Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right = this.helper.copy(exp);
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new Expression_1.ExpressionBuilder().addOperator(Operator_1.Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Deduction_1.Reasoning(id, [org], this.manager.rules[1], this.helper.copy(exp)));
                id++;
            }
            /// DUYET TAP GIA THIET
            //// TIM BIEU THUC GIONG BIEU THUC KEO THEO CO VE PHAI EXP GIONG VE TRAI CUA NO
            for (let i = 0; i < GT.length; i++) {
                if (GT[i].id === org.id)
                    continue;
                if (GT[i].operator.id !== Operator_1.Operts.Type.KEO_THEO)
                    continue;
                if (visited.findIndex(e => { return e.id === GT[i].id; }) !== -1)
                    continue;
                //// BIEU THUC GTi CO VE TRAI GIONG VE PHAI EXP;
                if (GT[i].childs[0].id === exp.childs[1].id) {
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, new Expression_1.ExpressionBuilder().addOperator(Operator_1.Operts.Type.KEO_THEO)
                        .addChild(exp.childs[0])
                        .addChild(GT[i].childs[1])
                        .build()));
                    return reasoning;
                }
                //// BIEU THUC GTi CO VE PHAI GIONG VE TRAI EXP;
                if (GT[i].childs[1].id === exp.childs[0].id) {
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT[i]], this, new Expression_1.ExpressionBuilder().addOperator(Operator_1.Operts.Type.KEO_THEO)
                        .addChild(GT[i].childs[0])
                        .addChild(exp.childs[1])
                        .build()));
                    return reasoning;
                }
                // //// BIEU THUC GTi CO VE TRAI TUONG DUONG VE PHAI EXP;
                // let equivalence:Transformation[]|null =  new Equivalence().
                // giai(`${ExpressionToString(exp.childs[1])}\u2261${ExpressionToString(GT[i].childs[0])}`);
                // if(equivalence !== null){
                //     for (let i = 0; i < equivalence.length; i++) {
                //       if(i===0)
                //       reasoning.push(new Reasoning(id,[exp],equivalence[i].rule,equivalence[i].Exp()));
                //       else
                //       reasoning.push(new Reasoning(id,[equivalence[i-1].Exp()],equivalence[i].rule,equivalence[i].Exp()));
                //       id++; 
                //     }
                //     reasoning.push(new Reasoning(id,[org,GT[i]],this,
                //         new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                //                                .addChild(exp.childs[0])
                //                                .addChild(GT[i].childs[1])
                //                                .build()
                //     ));
                //     return reasoning;
                // }
            }
            return [];
        }
    }
    DeducetiveRules.TAM_DOAN_LUAN_GIA_DINH = TAM_DOAN_LUAN_GIA_DINH;
    class TAM_DOAN_LUAN_LOAI_TRU extends DeducetiveRule {
        constructor() {
            super(4, 'Tam đoạn luận loại trừ');
        }
        apply(exp, GT, visited) {
            if (exp.operator.id !== Operator_1.Operts.Type.KEO_THEO && exp.operator.id !== Operator_1.Operts.Type.TUYEN
                && !(exp.operator.id === Operator_1.Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operator_1.Operts.Type.HOI))
                return [];
            let org = this.helper.copy(exp);
            exp = this.helper.copy(exp);
            let reasoning = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            reasoning = this.transformKEOTHEOExpression(exp, id);
            exp = reasoning.length === 0 ? exp : reasoning[reasoning.length - 1].exp;
            if (reasoning.length !== 0)
                id++;
            /// DUYET TAP GIA THIET
            //// TIM BIEU THUC GIONG BIEU THUC KEO THEO CO VE PHAI EXP GIONG VE TRAI CUA NO
            for (let i = 0; i < GT.length; i++) {
                if (GT[i].id === org.id)
                    continue;
                if (exp.operator.id !== Operator_1.Operts.Type.KEO_THEO && exp.operator.id !== Operator_1.Operts.Type.TUYEN
                    && !(exp.operator.id === Operator_1.Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operator_1.Operts.Type.HOI))
                    continue;
                if (visited.findIndex(e => { return e.id === GT[i].id; }) !== -1)
                    continue;
                let trans = this.transformKEOTHEOExpression(GT[i], id);
                if (trans.length === 0 && GT[i].operator.id !== Operator_1.Operts.Type.TUYEN)
                    continue;
                let GT_clone = trans.length === 0 ? this.helper.copy(GT[i]) : this.helper.copy(trans[trans.length - 1].exp);
                let c = this.helper.copy(GT_clone);
                let exp_clone = this.helper.copy(exp);
                let valid = false;
                // TIEN HANH LOAI TRU CAC BIEN MENH DE DOI NGAU VOI NHAU
                for (let j = 0; j < exp_clone.childs.length; j++) {
                    let notP = this.helper.not(exp.childs[j]);
                    let index = c.childs.findIndex(e => { return e.id === notP.id; });
                    if (index !== -1) {
                        c.removeAt(index);
                        exp_clone.removeAt(j);
                        valid = true;
                    }
                }
                if (valid) {
                    let rs = new Expression_1.Expression();
                    c.childs.forEach(e => { rs.addChild(e); });
                    exp_clone.childs.forEach(e => {
                        if (rs.childs.findIndex(ele => { return ele.id === e.id; }) === -1)
                            rs.addChild(e);
                    });
                    if (rs.childs.length > 1)
                        rs.operator = new Operator_1.OperatorFactory().create(Operator_1.Operts.Type.TUYEN);
                    else
                        rs = this.helper.checkAndChangeToPrime(rs);
                    reasoning = reasoning.concat(trans);
                    if (trans.length !== 0)
                        id++;
                    reasoning.push(new Deduction_1.Reasoning(id, [exp, GT_clone], this, rs));
                    return reasoning;
                }
            }
            return [];
        }
        transformKEOTHEOExpression(exp, id) {
            let reasoning = [];
            if (exp.operator.id === Operator_1.Operts.Type.KEO_THEO) {
                let kt = this.manager.rules[1].apply(exp);
                if (kt !== null)
                    reasoning.push(new Deduction_1.Reasoning(id++, [exp], this.manager.rules[1], kt));
            }
            else if (exp.operator.id === Operator_1.Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operator_1.Operts.Type.HOI) {
                let dn = this.helper.DOI_NGAU(exp);
                if (dn !== null)
                    reasoning.push(new Deduction_1.Reasoning(++id, [exp], this.manager.rules[8], dn));
            }
            return reasoning;
        }
    }
    DeducetiveRules.TAM_DOAN_LUAN_LOAI_TRU = TAM_DOAN_LUAN_LOAI_TRU;
    class LUAT_KET_HOP extends DeducetiveRule {
        constructor() {
            super(5, 'Luật kết hợp');
        }
        apply(exp, GT, visited) {
            /// MO TA KIEM TRA exp co the duoc tao ra bang cach ket hop 
            /// cac bieu thuc trong GT hay khong
            if (exp.operator.id !== Operator_1.Operts.Type.HOI)
                return [];
            let parent = [];
            for (let i = 0; i < exp.childs.length; i++) {
                if (GT.findIndex(e => { return e.id === exp.childs[i].id; }) === -1)
                    return [];
                parent.push(exp.childs[i]);
            }
            return [new Deduction_1.Reasoning(0, parent, this, exp)];
        }
    }
    DeducetiveRules.LUAT_KET_HOP = LUAT_KET_HOP;
    class LUAT_RUT_GON extends DeducetiveRule {
        constructor() {
            super(6, 'Luật rút gọn');
        }
        apply(exp, GT, visited) {
            let rea = [];
            /// NEU LA PHEP PHU DINH CAN TOI GIAN BIEU THUC CON
            if (exp.operator.id === Operator_1.Operts.Type.PHU_DINH) {
                let trans = new Simplify_1.Simplify().giai(ExpressionToString_1.ExpressionToString(this.helper.copy(exp.childs[0])));
                if (trans.detail.length !== 0) {
                    let list_trans = [];
                    for (let i = 0; i < trans.detail.length; i++) {
                        if (i === 0)
                            list_trans.push(new Deduction_1.Reasoning(0, [exp], trans.detail[i].rule, this.helper.not(trans.detail[i].Exp())));
                        else
                            list_trans.push(new Deduction_1.Reasoning(0, [this.helper.not(trans.detail[i - 1].Exp())], trans.detail[i].rule, this.helper.not(trans.detail[i].Exp())));
                    }
                    exp = this.helper.not(trans.detail[trans.detail.length - 1].Exp());
                    rea = rea.concat(list_trans);
                }
            }
            /// PHEP HOI
            if (exp.operator.id === Operator_1.Operts.Type.HOI) {
                for (let i = 0; i < exp.childs.length; i++) {
                    rea.push(new Deduction_1.Reasoning(0, [exp], this, exp.childs[i]));
                }
                return rea;
            }
            /// BO DAU PHU DINH
            if (exp.operator.id === Operator_1.Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operator_1.Operts.Type.TUYEN) {
                let dn = this.helper.DOI_NGAU(exp);
                if (dn !== null) {
                    rea.push(new Deduction_1.Reasoning(0, [exp], this.manager.rules[8], dn));
                    exp = dn;
                    for (let i = 0; i < exp.childs.length; i++) {
                        rea.push(new Deduction_1.Reasoning(0, [exp], this, exp.childs[i]));
                    }
                    rea.forEach(e => {
                        console.log(ExpressionToString_1.ExpressionToString(e.exp));
                    });
                    return rea;
                }
                return [];
            }
            return [];
        }
    }
    DeducetiveRules.LUAT_RUT_GON = LUAT_RUT_GON;
    class ManagerRules {
        constructor() {
            this.rules = [];
            this.genarate();
        }
        genarate() {
            this.rules.push(new LUAT_RUT_GON());
            this.rules.push(new TAM_DOAN_LUAN_KHANG_DINH());
            this.rules.push(new TAM_DOAN_LUAN_PHU_DINH());
            this.rules.push(new TAM_DOAN_LUAN_GIA_DINH());
            this.rules.push(new TAM_DOAN_LUAN_LOAI_TRU());
            // this.rules.push(new LUAT_KET_HOP());
        }
        apply(exp, GT, visited) {
            let r = this.rules;
            let result = [];
            for (let i = 0; i < r.length; i++) {
                let re = r[i].apply(exp, GT, visited);
                if (re.length !== 0) {
                    result = result.concat(re);
                }
            }
            return result;
        }
    }
    DeducetiveRules.ManagerRules = ManagerRules;
})(DeducetiveRules = exports.DeducetiveRules || (exports.DeducetiveRules = {}));
