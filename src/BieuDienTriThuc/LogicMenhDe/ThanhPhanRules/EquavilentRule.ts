import { Expression, ExpressionBuilder } from '../ThanhPhanC/Expression';
import { StringToExpression } from '../ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
import { SimilarExpression } from '../ThanhPhanFuncs/SimplarExpression';
import { Operts, OperatorFactory } from '../ThanhPhanOperators/Operator';
import { ExpressionToString } from '../ThanhPhanFuncs/ExpressionToString';
import { Transformation } from '../ThanhPhanFuncs/Simplify';
export namespace EquivalentRule {
    export class Rule {
        public iRule: IRule | null = null;
        public result: Expression = new Expression;
        public name: string = '';
        public id: number = 0;
        constructor(id: number, name: string, iRule: IRule) {
            this.name = name;
            this.iRule = iRule;
            this.id = id;
        }
        public check(epxr: Expression): Expression | null {
            if (this.iRule === null) return null;
            return this.iRule.check(epxr);
        }
        public clone():Rule|null{
            if(this.iRule)
               return new Rule(this.id,this.name,this.iRule);
            return null;
        }
    }
    export interface IRule {
        check(expr: Expression): Expression | null;
    }
    export class ManagerRulesForSimlify {
        public COUNT_GOOD_RULES = 8;
         
        private Rules: Rule[] = [];

        constructor() {
            this.genarate();
        }
        private genarate() {
            let helper = ExpressionHelper.Helper;
            /// LUAT TUONG DUONG
            this.Rules.push(new Rule(0, 'Luật tương đương', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id === Operts.Type.TUONG_DUONG) {
                        return new ExpressionBuilder()
                            .addChild(new ExpressionBuilder().addChild(expr.childs[0])
                                .addOperator(Operts.Type.KEO_THEO)
                                .addChild(expr.childs[1]).build())
                            .addOperator(Operts.Type.HOI)
                            .addChild(new ExpressionBuilder().addChild(expr.childs[1])
                                .addOperator(Operts.Type.KEO_THEO)
                                .addChild(expr.childs[0]).build())
                            .build();
                    }
                    return null;
                }
            }()));

            /// LUAT KEO THEO
            this.Rules.push(new Rule(1, 'Luật kéo theo', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id === Operts.Type.KEO_THEO) {
                        let result: ExpressionBuilder = new ExpressionBuilder();
                        return result.addChild(helper.not(expr.childs[0])).addOperator(Operts.Type.TUYEN)
                            .addChild(expr.childs[1]).build();
                    }
                    return null;
                }
            }()));

            /// LUAT DONG NHAT
            this.Rules.push(new Rule(2, 'Luật đồng nhất', new class implements IRule {
                check(expr: Expression): Expression | null {
                    let TRUE: Expression = helper.createConstant(true);
                    let FALSE: Expression = helper.createConstant(false);
                    if (expr.childs.length > 1) {
                        for (let i = 0; i < expr.childs.length; i++) {
                            if ((expr.childs[i].id === TRUE.id && expr.operator.id === Operts.Type.HOI)
                                || (expr.childs[i].id === FALSE.id && expr.operator.id === Operts.Type.TUYEN)) {
                                expr.removeAt(i);
                                if (expr.childs.length === 1) expr = expr.childs[0];

                                return helper.checkAndChangeToPrime(expr);
                            }
                        }
                    }
                    return null;
                }
            }()));

            /// LUAT NUOT
            this.Rules.push(new Rule(3, 'Luật nuốt', new class implements IRule {
                check(expr: Expression): Expression | null {
                    let TRUE: Expression = helper.createConstant(true);
                    let FALSE: Expression = helper.createConstant(false);

                    if (expr.operator.id === Operts.Type.TUYEN && expr.id.includes(TRUE.id))
                        return TRUE;
                    else if (expr.operator.id === Operts.Type.HOI && expr.id.includes(FALSE.id))
                        return FALSE;


                    return null;
                }
            }()));

            /// LUAT LUY DANG
            this.Rules.push(new Rule(4, 'Luật lũy đẳng', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id !== Operts.Type.HOI &&
                        expr.operator.id !== Operts.Type.TUYEN) return null;

                    for (let i = 0; i < expr.childs.length; i++) {
                        let p: Expression = expr.childs[i];
                        for (let j = 0; j < expr.childs.length; j++) {
                            if (i === j) continue;
                            if (p.id !== expr.childs[j].id) continue;
                            expr.removeAt(i);
                            return helper.checkAndChangeToPrime(expr);
                        }
                    }
                    return null;
                }
            }()));

            /// LUAT PHAN TU BU
            this.Rules.push(new Rule(5, 'Luật phần tử bù', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id !== Operts.Type.HOI &&
                        expr.operator.id !== Operts.Type.TUYEN) return null;

                    for (let i = 0; i < expr.childs.length; i++) {
                        let notP = helper.not(expr.childs[i]);
                        for (let j = 0; j < expr.childs.length; j++) {
                            if (i === j) continue;
                            if (notP.id !== expr.childs[j].id) continue;
                            if (expr.operator.id === Operts.Type.HOI)
                                expr.addChild(helper.createConstant(false));
                            else
                                expr.addChild(helper.createConstant(true));
                            expr.removeAt(i);
                            expr.removeChild(notP);
                            return helper.checkAndChangeToPrime(expr);
                        }
                    }
                    return null;
                }
            }()));

            /// LUAT PHU DINH 
            this.Rules.push(new Rule(6, 'Luật phủ định kép', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id === Operts.Type.PHU_DINH &&
                        expr.childs[0].operator.id === Operts.Type.PHU_DINH) return expr.childs[0].childs[0];

                    return null;
                }
            }()));

            /// LUAT HAP THU
            this.Rules.push(new Rule(7, 'Luật hấp thụ', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if (expr.operator.id !== Operts.Type.HOI &&
                        expr.operator.id !== Operts.Type.TUYEN) return null;

                    let exp1: Expression = StringToExpression('p\u2228(p\u2227q)');
                    let exp2: Expression = StringToExpression('p\u2227(p\u2228q)');
                    //#region  BIEU THUC EXPR1
                    let rs: Expression[] = new SimilarExpression().genarate(exp1, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id)
                            return rs[i].childs[0];
                        if (helper.contain(rs[i], expr)) {
                            for (let j = 0; j < rs[i].childs.length; j++) {
                                let index: number = expr.childs.findIndex(e => {
                                    return e.id === rs[i].childs[j].id;
                                });
                                if (index !== -1)

                                    expr.removeAt(index);
                            }

                            expr.addChild(rs[i].childs[0]);
                            return expr;
                        }
                    }
                    //#endregion
                    //#region  BIEU THUC EXPR2
                    rs = new SimilarExpression().genarate(exp2, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id)
                            return rs[i].childs[0];
                        if (helper.contain(rs[i], expr)) {
                            for (let j = 0; j < rs[i].childs.length; j++) {
                                let index: number = expr.childs.findIndex(e => { return e.id === rs[i].childs[j].id; });
                                if (index !== -1)
                                    expr.removeAt(index);
                            }
                            expr.addChild(rs[i].childs[0]);
                            return expr;
                        }
                    }
                    //#endregion

                    return null;
                }
            }()));

            /// LUAT DE MORGAN
            this.Rules.push(new Rule(8, 'Luật Đe Morgan', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if(expr.operator.id !== Operts.Type.HOI && expr.operator.id !== Operts.Type.TUYEN)return null;

                    //#region  TACH RA
                    let builder = new ExpressionBuilder();
                    for (let i = 0; i < expr.childs.length; i++) {
                        if (expr.childs[i].operator.id === Operts.Type.PHU_DINH) {
                            if (helper.isPrimeOrConstant(expr.childs[i].childs[0])) continue;
                            if (expr.childs[i].childs[0].operator.id !== Operts.Type.HOI
                                && expr.childs[i].childs[0].operator.id !== Operts.Type.TUYEN) continue;
                            let not: Expression = expr.childs[i];
                            builder.addOperator(not.childs[0].operator.id === Operts.Type.HOI ?
                                Operts.Type.TUYEN : Operts.Type.HOI);
                            for (let j = 0; j < not.childs[0].childs.length; j++) {
                                builder.addChild(helper.not(not.childs[0].childs[j]));
                            }
                            expr.removeAt(i);
                            expr.addChild(builder.build());
                            return expr;
                        }
                    }

                    //#endregion

                    //#region  GOM LAI
                    if (helper.isPrimeOrConstant(expr)) return null;
                    builder = new ExpressionBuilder()
                        .addOperator(expr.operator.id === Operts.Type.HOI ? Operts.Type.TUYEN : Operts.Type.HOI);
                    let valid = true;
                    for (let i = 0; i < expr.childs.length; i++) {
                        if (expr.childs.length < 2) valid = false;
                        if (expr.childs[i].operator.id !== Operts.Type.PHU_DINH) valid = false;
                    }
                    if (valid) {
                        for (let i = 0; i < expr.childs.length; i++) {
                            builder.addChild(expr.childs[i].childs[0]);
                        }
                        let b = builder.build();
                        if (b.childs.length === 1) b = b.childs[0];
                        return helper.not(b);
                    }

                    // for (let i = 0; i < expr.childs.length; i++) {
                    //     if (expr.childs[i].operator.id === Operts.Type.PHU_DINH) {
                    //         if (helper.isPrimeOrConstant(expr.childs[i].childs[0])) continue;
                    //         if (expr.childs[i].childs[0].operator.id !== Operts.Type.HOI
                    //             && expr.childs[i].childs[0].operator.id !== Operts.Type.TUYEN) continue;

                    //         let doiNgau = helper.DOI_NGAU(expr.childs[i]);
                    //         let ex = helper.copy(expr);
                    //         ex.removeAt(i);
                    //         if (ex.id === doiNgau.id) {
                    //             for (let j = 0; j < doiNgau.childs.length; j++)
                    //                 expr.removeChild(doiNgau.childs[i]);

                    //             expr.addChild(helper.copy(expr.childs[i]));
                    //             return expr;
                    //         }

                    //     }
                    // }

                    //#endregion
                    return null;

                }
            }()));

            /// LUAT KET HOP 
            this.Rules.push(new Rule(9, 'Luật kết hợp', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if(expr.operator.id !== Operts.Type.HOI && expr.operator.id !== Operts.Type.TUYEN)return null;

                    let operator = expr.operator.id;
                    if (helper.isPrimeOrConstant(expr)) return null;
                    //#region BO DAU NGOAC
                    for (let i = 0; i < expr.childs.length; i++) {
                        if (helper.isPrimeOrConstant(expr.childs[i])) continue;
                        if (operator === expr.childs[i].operator.id) {
                            for (let j = 0; j < expr.childs[i].childs.length; j++) {
                                expr.addChild(expr.childs[i].childs[j]);
                            }
                            expr.removeAt(i);
                            return expr;
                        }
                    }
                    //#endregion


                    //#region GOM NHOM

                let template_1 = StringToExpression('a∨b∨((a∨b)∧b)');
                let template_2 = StringToExpression('a∧b∧((a∧b)∨b)');
                let result:Expression[]=new SimilarExpression().genarate(template_1,expr);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===expr.id||helper.contain(result[i],expr)){
                        let index = expr.childs.findIndex(e=>{return e.id === result[i].childs[0].id;});
                        let a = expr.childs[index];
                        expr.removeAt(index);
                        index = expr.childs.findIndex(e=>{return e.id === result[i].childs[1].id;});
                        let b = expr.childs[index];
                        expr.removeAt(index);
                        
                        expr.addChild(new ExpressionBuilder().addOperator(expr.operator.id).addChild(a).addChild(b).build());
                        return expr;
                    }
                }

                result=new SimilarExpression().genarate(template_2,expr);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===expr.id||helper.contain(result[i],expr)){
                        let index = expr.childs.findIndex(e=>{return e.id === result[i].childs[0].id;});
                        let a = expr.childs[index];
                        expr.removeAt(index);
                        index = expr.childs.findIndex(e=>{return e.id === result[i].childs[1].id;});
                        let b = expr.childs[index];
                        expr.removeAt(index);
                        
                        expr.addChild(new ExpressionBuilder().addOperator(expr.operator.id).addChild(a).addChild(b).build());
                        return expr;
                    }
                    
                }

                    for (let i = 0; i < expr.childs.length; i++) {
                        let p: Expression = expr.childs[i];
                        if (!helper.isPrimeOrConstant(p)) continue;
                        for (let j = 0; j < expr.childs.length; j++) {
                            let q: Expression = expr.childs[j];
                            if (!helper.isPrimeOrConstant(q)) continue;

                            let exp = new ExpressionBuilder().addChild2(q)
                                .addChild2(p).addOperator(expr.operator.id).build();

                            let index: number = expr.childs.findIndex(e => { e.id.includes(exp.id) });
                            if (index !== -1) {
                                expr.removeAt(i);
                                expr.removeAt(j);
                                exp = new ExpressionBuilder().addChild(p).
                                    addChild(p).addOperator(expr.operator.id).build();
                                expr.addChild(exp);
                                return exp;
                            }
                        }
                    }
                    //#endregion
                    return null;
                }
            }()));

            /// LUAT PHAN PHOI 
            this.Rules.push(new Rule(10, 'Luật phân phối', new class implements IRule {
                check(expr: Expression): Expression | null {
                    if(expr.operator.id !== Operts.Type.HOI && expr.operator.id !== Operts.Type.TUYEN)return null;
                    //#region  GOM LAI

                    let exp1: Expression = StringToExpression('(p\u2227r)\u2228(p\u2227q)');
                    let exp2: Expression = StringToExpression('(p\u2228r)\u2227(p\u2228q)');
                    let rs: Expression[] = new SimilarExpression().genarate(exp1, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id) {
                            return rs[i].childs[1];
                        }
                        else if (helper.contain(rs[i], expr)) {
                            let index: number = expr.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                            expr.removeAt(index);
                            index = expr.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                            expr.removeAt(index);

                            let e: Expression = StringToExpression('p\u2227(q\u2228r)');
                            e = helper.replacePrimes(exp1.primes, e);
                            expr.addChild(e);
                            return expr;
                        }
                    }

                    rs = new SimilarExpression().genarate(exp2, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id) {
                            return rs[i].childs[1];
                        }
                        else if (helper.contain(rs[i], expr)) {
                            let index: number = expr.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                            expr.removeAt(index);
                            index = expr.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                            expr.removeAt(index);

                            let e: Expression = StringToExpression('p\u2228(q\u2227r)');
                            e = helper.replacePrimes(exp1.primes, e);
                            expr.addChild(e);
                            return expr;
                        }
                    }
                    //#endregion

                    //#region  TACH RA

                    for (let i = 0; i < expr.childs.length; i++) {
                        let p=expr.childs[i];
                        let notP = ExpressionHelper.Helper.not(expr.childs[i]);
                        for (let j = 0; j < expr.childs.length; j++) {
                            if (i === j) continue;
                            if (ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[j]) ||
                             (expr.childs[j].operator.id !== Operts.Type.HOI && expr.childs[j].operator.id !== Operts.Type.TUYEN)) continue;
                            let index = expr.childs[j].childs.findIndex(e => { return e.id === notP.id });
                            if (index !== -1) {
                                let q: Expression = expr.childs[j];
                                let builder: ExpressionBuilder = new ExpressionBuilder().addOperator(q.operator.id);
                                for (let z = 0; z < q.childs.length; z++) {
                                    let child: ExpressionBuilder = new ExpressionBuilder().addOperator(expr.operator.id);
                                    child.addChild(p).addChild(q.childs[z]);
                                    builder.addChild(child.build());
                                }
                                expr.removeChild(p);
                                expr.removeChild(q);
                                expr.addChild(builder.build());
                                return helper.checkAndChangeToPrime(expr);
                            }
                        }
                    } 

                    if (expr.childs.length > 1) {
                        for (let i = 0; i < expr.childs.length; i++) {
                            let p: Expression = expr.childs[i];
                            if (p.operator.id === Operts.Type.HOI || p.operator.id === Operts.Type.TUYEN) {
                                
                                let j = 0;
                                if (i === 0) j = 1;
                                let q: Expression = expr.childs[j];
                                let builder: ExpressionBuilder = new ExpressionBuilder().addOperator(p.operator.id);
                                for (let z = 0; z < p.childs.length; z++) {
                                    let child: ExpressionBuilder = new ExpressionBuilder().addOperator(expr.operator.id);
                                    child.addChild(q).addChild(p.childs[z]);
                                    builder.addChild(child.build());
                                }
                                expr.removeChild(p);
                                expr.removeChild(q);
                                expr.addChild(builder.build());
                                return helper.checkAndChangeToPrime(expr);
                            }
                        }
                    }
                    //#endregion

                    return null;
                }
            }()));


        }

        public run(expr: Expression, start?: number, end?: number): Transformation | null {
            if (!start) start = 0;
            if (!end) end = this.Rules.length;

            let r = this.sortRule(expr);
            for (let i = start; i < end; i++) {
                // console.log(r[i].name);
                let result: Expression | null = r[i].check(ExpressionHelper.Helper.copy(expr));
                if (result !== null) {
                    return new Transformation(r[i], result);
                }
            }
            return null;
        }

        /// UU TIEN CAC LUAT
        private sortRule(exp:Expression):Rule[]{
            this.COUNT_GOOD_RULES = 8;
            let r:Rule []=[];
            let helper = ExpressionHelper.Helper;
            if(helper.isPrimeOrConstant(exp)||exp.operator.id===Operts.Type.KEO_THEO||exp.operator.id === Operts.Type.TUONG_DUONG)return this.Rules;
            exp = helper.copy(exp);
            //#region PHEP UU TIEN DE MORGAN 
            let stopDeMorgan = false;
            for (let i = 0; i < exp.childs.length && !stopDeMorgan; i++) {
                if((exp.operator.id === Operts.Type.PHU_DINH && !helper.isPrimeOrConstant(exp.childs[i].childs[0]))){
                        let clone = helper.copy(exp);
                        let ex = clone.childs[i];
                        clone.removeChild(ex);
                        ex = ex.childs[0];
                        for (let j = 0; j < ex.childs.length && !stopDeMorgan; j++) {
                            if(clone.id.includes(ex.childs[i].id) || clone.id.includes(helper.not(ex.childs[i]).id)){
                                r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 8})]);
                                stopDeMorgan=true;
                            }
                        } 
                    }
            }

            if(!stopDeMorgan){
                let template_1 = StringToExpression('a∨¬(a∨b)');
                let template_2 = StringToExpression('a∧¬(a∧b)');
                let template_3 = StringToExpression('a∨¬(¬a∨b)');
                let template_4 = StringToExpression('a∧¬(¬a∧b)');

                let result:Expression[]=new SimilarExpression().genarate(template_1,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 8})]);
                        stopDeMorgan=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_2,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 8})]);
                        stopDeMorgan=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_3,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 8})]);
                        stopDeMorgan=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_4,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 8})]);
                        stopDeMorgan=true;
                        break;
                    }
                    
                }
                
            }
            //#endregion
            
           //#region  PHAN PHOI
           let stop_PHANPHOI= false;
           for (let i = 0; i < exp.childs.length; i++) {
               let notP = ExpressionHelper.Helper.not(exp.childs[i]);
               for (let j = 0; j < exp.childs.length; j++) {
                    if (i === j) continue;
                    if (ExpressionHelper.Helper.isPrimeOrConstant(exp.childs[j]) || exp.childs[j].operator.id === Operts.Type.PHU_DINH) continue;
                    let index = exp.childs[j].childs.findIndex(e => { return e.id === notP.id });
                    if (index !== -1) {
                       r.push(this.Rules[this.Rules.findIndex(e => { return e.id === 10 })]);
                       stop_PHANPHOI = true;
                       break;
                   }
               }
           } 
           //#endregion

            //#region  PHEP KET HOP
            let stopKET_HOP = false;
            for (let i = 0; i < exp.childs.length; i++) {
                if(helper.isPrimeOrConstant(exp.childs[i]))continue;
                let ex:Expression = helper.copy(exp);
                let child = exp.childs[i];
                ex.removeAt(i);
                if(ex.id.includes(child.id)){
                    r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 9})]);
                    stopKET_HOP=true;
                    break;
                }

            }
            if(!stopKET_HOP){
                let template_1 = StringToExpression('a∨b∨((a∨b)∧b)');
                let template_2 = StringToExpression('a∧b∧((a∧b)∨b)');
                let template_3 = StringToExpression('a∨b∨(¬(a∨b)∧b)');
                let template_4 = StringToExpression('a∧b∧(¬(a∧b)∨b)');
                let result:Expression[]=new SimilarExpression().genarate(template_1,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 9})]);
                        stopKET_HOP=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_2,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 9})]);
                        stopKET_HOP=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_3,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 9})]);
                        stopKET_HOP=true;
                        break;
                    }
                    
                }

                result=new SimilarExpression().genarate(template_4,exp);
                for (let i = 0; i < result.length; i++) {
                    if(result[i].id===exp.id||helper.contain(result[i],exp)){
                        r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 9})]);
                        stopKET_HOP=true;
                        break;
                    }
                    
                }
                
            }
            //#endregion

            //#region  PHAN TU BU
            for (let i = 0; i < exp.childs.length; i++) {
                if(helper.isPrimeOrConstant(exp.childs[i]))continue;
                let ex:Expression = helper.copy(exp);
                let child = exp.childs[i];
                ex.removeAt(i);
                if(ex.id.includes(helper.not(child).id)){
                    r.push(this.Rules[this.Rules.findIndex(e=>{return e.id === 5})]);
                    break;
                }

            }
            //#endregion

            //#region  
            //#endregion
            this.COUNT_GOOD_RULES+=r.length; 
            for (let i = 0; i < this.Rules.length; i++) {
                if(r.findIndex(e=>e.id === i) !==-1)continue;
                r.push(this.Rules[i]);
            }
            
            return r;
        }

    }


}