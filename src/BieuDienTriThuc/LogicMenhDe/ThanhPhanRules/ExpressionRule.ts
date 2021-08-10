import { Expression, ExpressionBuilder } from '../ThanhPhanC/Expression';
import { StringToExpression } from '../ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
import { SimilarExpression } from '../ThanhPhanFuncs/SimplarExpression';
import { Operator, Operts } from '../ThanhPhanOperators/Operator';
export namespace ExpressionRule{
    export abstract class Rule{
        private _id: number = -1;
        private _name: string = '';
        protected helper = ExpressionHelper.Helper;
        
        public message_Checker:EquivalentRule.CheckerMessage = new EquivalentRule.CheckerMessage(); 
        public indexReturn=-1;
        constructor(id:number, name:string){
            this.id=id;
            this.name=name;
            this.reset();
        }
        public apply(exp:Expression):Expression|null{
            if(this.indexReturn===-1)
            this.indexReturn = this.run(exp);
            if(this.indexReturn!==-1)return this.result(this.indexReturn,exp);
            return null;
        }
        reset(){this.message_Checker = new EquivalentRule.CheckerMessage(); this.indexReturn=-1;}
        abstract run(exp:Expression):number;
        abstract result(index:number,exp:Expression):Expression;

        //#region  SETTER AND GETTER
        protected get name(): string {
            return this._name;
        }
        protected set name(value: string) {
            this._name = value;
        }
        protected get id(): number {
            return this._id;
        }
        protected set id(value: number) {
            this._id = value;
        }
        //#endregion
    }
}

export namespace EquivalentRule{
    export class CheckerMessage{
        public exp_1:Expression=new Expression();
        public exp_2:Expression = new Expression();
        public num_1:number=-1;
        public num_2:number=-1;
     
        public addNum_1(i:number):CheckerMessage{
            this.num_1 = i;
            return this;
        }
        public addNum_2(i:number):CheckerMessage{
            this.num_2 = i;
            return this;
        }
        public addExp_1(e:Expression):CheckerMessage{
            this.exp_1 = e;
            return this;
        }
        public addExp_2(e:Expression):CheckerMessage{
            this.exp_2 = e;
            return this;
        }
    }
    export class TUONG_DUONG extends ExpressionRule.Rule{
        static LA_MENH_DE = 1;
        static CHUA_MENH_DE = 2;

        constructor(id:number,name:string){
              super(id,name);
        }
        run(exp: Expression): number {
           let i = this.checker_1(exp);
           if(i!==-1)return i;
           i = this.checker_2(exp);
           if(i!==-1)return i;
           return -1;
        }
        //#region  BAN THAN LA MOT MENH DE TUONG DUONG 
        private checker_1(exp: Expression):number{
            if(exp.operator.id === Operts.Type.TUONG_DUONG)
                return TUONG_DUONG.LA_MENH_DE;
            return -1; 
        }
        //#endregion
        //#region CO CHUA MOT MENH DE TUONG DUONG
        private checker_2(exp:Expression):number{
            for (let i = 0; i < exp.childs.length; i++) {
               if(exp.childs[i].operator.id === Operts.Type.TUONG_DUONG){
                  this.message_Checker = new CheckerMessage().addNum_1(i);
                  return TUONG_DUONG.CHUA_MENH_DE;
               }
            }
            return -1;
        }
        //#endregion
        result(index: number,exp:Expression): Expression {
            if(index) return this.result_1(exp);
            return this.result_2(exp);
        }

        private result_1(expr:Expression):Expression{
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
        private result_2(expr:Expression):Expression{
            let r = this.result_1(expr.childs[this.message_Checker.num_1]);
            expr.setChildAt(this.message_Checker.num_1,r);
            return expr;
        }
        
    }
    export class KEO_THEO extends ExpressionRule.Rule{
        static LA_MENH_DE = 1;
        static CHUA_MENH_DE = 2;

        constructor(id: number, name: string) {
            super(id, name);
        }
        run(exp: Expression): number {
            let i = this.checker_1(exp);
            if (i !== -1) return i;
            i = this.checker_2(exp);
            if (i !== -1) return i;
            return -1;
        }
        //#region  BAN THAN LA MOT MENH DE KEO THEO 
        private checker_1(exp: Expression): number {
            if (exp.operator.id === Operts.Type.KEO_THEO)
                return TUONG_DUONG.LA_MENH_DE;
            return -1;
        }
        //#endregion
        //#region CO CHUA MOT MENH DE KEO THEO
        private checker_2(exp: Expression): number {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operts.Type.KEO_THEO) {
                    this.message_Checker = new CheckerMessage().addNum_1(i);
                    return TUONG_DUONG.CHUA_MENH_DE;
                }
            }
            return -1;
        }
        //#endregion
        result(index: number, exp: Expression): Expression {
            if (index) return this.result_1(exp);
            return this.result_2(exp);
        }

        private result_1(expr:Expression):Expression{
            let result: ExpressionBuilder = new ExpressionBuilder();
            return result.addChild(this.helper.not(expr.childs[0])).addOperator(Operts.Type.TUYEN)
                .addChild(expr.childs[1]).build();
        }
        private result_2(expr:Expression):Expression{
            let r = this.result_1(expr.childs[this.message_Checker.num_1]);
            expr.setChildAt(this.message_Checker.num_1,r);
            return expr;
        }
        
    }
    export class DONG_NHAT extends ExpressionRule.Rule{
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            let TRUE: Expression = this.helper.createConstant(true);
            let FALSE: Expression = this.helper.createConstant(false);
            if (expr.childs.length > 1)
            for (let i = 0; i < expr.childs.length; i++)
            if ((expr.childs[i].id === TRUE.id && expr.operator.id === Operts.Type.HOI)
                || (expr.childs[i].id === FALSE.id && expr.operator.id === Operts.Type.TUYEN)) {
                this.message_Checker.addNum_1(i);
                return 1;
            }
            return -1;             
        }

        result(index: number, expr: Expression): Expression {
            expr.removeAt(this.message_Checker.num_1);
            // if (expr.childs.length === 1) expr = expr.childs[0];
            return this.helper.checkAndChangeToPrime(expr);
        }

    }
    export class LUAT_NUOT extends ExpressionRule.Rule{
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            let TRUE: Expression = this.helper.createConstant(true);
            let FALSE: Expression = this.helper.createConstant(false);
            if (expr.operator.id === Operts.Type.TUYEN && expr.id.includes(TRUE.id)) return 1;
            else if (expr.operator.id === Operts.Type.HOI && expr.id.includes(FALSE.id)) return 2;
            return -1;             
        }

        result(index: number, expr: Expression): Expression {
            let TRUE: Expression = this.helper.createConstant(true);
            let FALSE: Expression = this.helper.createConstant(false);
            if(index===1) return TRUE;
            return FALSE;
        }

    }
    export class LUY_DANG extends ExpressionRule.Rule{
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            if (expr.operator.id !== Operts.Type.HOI &&
                expr.operator.id !== Operts.Type.TUYEN) return -1;

            for (let i = 0; i < expr.childs.length; i++) {
                let p: Expression = expr.childs[i];
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j) continue;
                    if (p.id !== expr.childs[j].id) continue;
                    this.message_Checker.addNum_1 (i);
                    return 1;
                }
            }
            return -1;             
        }

        result(index: number, expr: Expression): Expression {
            expr.removeAt(this.message_Checker.num_1);
            return this.helper.checkAndChangeToPrime(expr);
        }

    }
    export class PHAN_TU_BU extends ExpressionRule.Rule{
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            if (expr.operator.id !== Operts.Type.HOI &&
                expr.operator.id !== Operts.Type.TUYEN) return -1;

            for (let i = 0; i < expr.childs.length; i++) {
                let notP = this.helper.not(expr.childs[i]);
                for (let j = 0; j < expr.childs.length; j++) {
                    if (i === j) continue;
                    if (notP.id !== expr.childs[j].id) continue;
                    this.message_Checker.addNum_1(i).addExp_1(notP);
                    if (expr.operator.id === Operts.Type.HOI)
                        return 1;
                    else
                        return 2;
                   
                }
            }
            return -1;             
        }

        result(index: number, expr: Expression): Expression {
            if (index === 1) expr.addChild(this.helper.createConstant(false));
            else expr.addChild(this.helper.createConstant(true));
            expr.removeAt(this.message_Checker.num_1);
            expr.removeChild(this.message_Checker.exp_1);
            return this.helper.checkAndChangeToPrime(expr);
        }

    }
    export class PHU_DINH_KEP extends ExpressionRule.Rule{
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            if (expr.operator.id === Operts.Type.PHU_DINH &&
            expr.childs[0].operator.id === Operts.Type.PHU_DINH) return 1;
            return -1;             
        }

        result(index: number, expr: Expression): Expression {
            return expr.childs[0].childs[0];
        }

    }
    export class HAP_THU extends ExpressionRule.Rule{

        static DANG_1=1;
        static DANG_2=2;
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            if (expr.operator.id !== Operts.Type.HOI &&
                expr.operator.id !== Operts.Type.TUYEN) return -1;
            return this.checker_1(expr);    
            return -1;             
        }
        private checker_1(expr:Expression):number{
            let exp1: Expression = StringToExpression('p\u2228(p\u2227q)');
                    let exp2: Expression = StringToExpression('p\u2227(p\u2228q)');
                    //#region  BIEU THUC EXPR1
                    let rs: Expression[] = new SimilarExpression().genarate(exp1, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id){
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
                    rs = new SimilarExpression().genarate(exp2, expr);
                    for (let i = 0; i < rs.length; i++) {
                        if (rs[i].id === expr.id){
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

        result(index: number, expr: Expression): Expression {
            if(index===1) return this.message_Checker.exp_1.childs[0];
            for (let j = 0; j < this.message_Checker.exp_1.childs.length; j++) {
                let index: number = expr.childs.findIndex(e => { return e.id === this.message_Checker.exp_1.childs[j].id; });
                if (index !== -1)
                    expr.removeAt(index);
            }
            expr.addChild(this.message_Checker.exp_1.childs[0]);
            return expr;
        }

    }
    export class DE_MORGAN extends ExpressionRule.Rule{
        static BO_DAU_TOT = 1;
        static GOM_NHOM_DOI_NGAU = 2;
        static GOM_THUONG=3;
        static TACH_THUONG=4;
        constructor(id:number,name:string){
            super(id,name);
        }
        run(expr: Expression): number {
            if(expr.operator.id === Operts.Type.KEO_THEO || expr.operator.id === Operts.Type.TUONG_DUONG)return -1;
            let s = this.checker_1(expr);
            if(s!==-1)return s; 
            s = this.checker_2(expr);
            if(s!==-1)return s; 
            s = this.checker_3(expr);
            if(s!==-1)return s; 
            s = this.checker_4(expr);
            if(s!==-1)return s; 
            return -1;             
        }

        checker_1(exp:Expression):number{
            if(exp.operator.id !== Operts.Type.HOI && exp.operator.id !== Operts.Type.TUYEN)return -1;
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operts.Type.PHU_DINH) {
                    if (this.helper.isPrimeOrConstant(exp.childs[i].childs[0])) continue;
                    if (exp.childs[i].childs[0].operator.id !== Operts.Type.HOI
                        && exp.childs[i].childs[0].operator.id !== Operts.Type.TUYEN) continue;
                        let ex = this.helper.copy(exp);
                        let p =  exp.childs[i].childs[0];
                        ex.removeAt(i);
                        for (let j = 0; j < p.childs.length; j++) {
                            let notP = this.helper.not(p.childs[j]);
                            let doiNgau = this.helper.DOI_NGAU(p.childs[j]);
                            if(ex.id.includes(notP.id) || ex.id.includes(doiNgau.id)){
                                this.message_Checker.addNum_1(i);
                                return DE_MORGAN.BO_DAU_TOT;
                            }                          
                        }

                    }
                }
            return -1;
        }
        
        checker_2(exp: Expression): number {
            let template_1 = StringToExpression('¬a∨¬b∨¬(a∧b)');
            let template_2 = StringToExpression('¬a∧¬b∧¬(a∨b)');
            let template_3 = StringToExpression('¬a∨¬b∨(¬(a∧b)∧c)');
            let template_4 = StringToExpression('¬a∧¬b∧(¬(a∨b)∨c)');

            let result: Expression[] = new SimilarExpression().genarate(template_1, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result= new SimilarExpression().genarate(template_2, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result= new SimilarExpression().genarate(template_3, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            result= new SimilarExpression().genarate(template_4, exp);
            for (let i = 0; i < result.length; i++) {
                if (result[i].id === exp.id || this.helper.contain(result[i], exp)) {
                    this.message_Checker.addExp_1(result[i]);
                    return DE_MORGAN.GOM_NHOM_DOI_NGAU;
                }
            }
            return -1;

        }
        checker_3(exp: Expression): number {
            if (this.helper.isPrimeOrConstant(exp)) return -1;
            let valid = true;
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs.length < 2) valid = false;
                if (exp.childs[i].operator.id !== Operts.Type.PHU_DINH) valid = false;
            }
            if (valid) {
                return DE_MORGAN.GOM_THUONG;
            }
            return -1;
        }
        checker_4(exp:Expression):number{
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].operator.id === Operts.Type.PHU_DINH) {
                    if (this.helper.isPrimeOrConstant(exp.childs[i].childs[0])) continue;
                    if (exp.childs[i].childs[0].operator.id !== Operts.Type.HOI
                        && exp.childs[i].childs[0].operator.id !== Operts.Type.TUYEN) continue;
                    this.message_Checker.addNum_1(i);    
                    return DE_MORGAN.TACH_THUONG;
                }
            }
            return -1;
        }

        result(index: number, exp: Expression): Expression {
            let builder = new ExpressionBuilder();

            if (index === DE_MORGAN.BO_DAU_TOT) {
                let not: Expression = exp.childs[this.message_Checker.num_1];
                builder.addOperator(not.childs[0].operator.id === Operts.Type.HOI ?
                    Operts.Type.TUYEN : Operts.Type.HOI);
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
                let build: Expression = new ExpressionBuilder().addChild(a).addChild(b).addOperator(exp.operator.id).build();
                exp.addChild(this.helper.not(build));
            }
            else if (index === DE_MORGAN.GOM_THUONG) {
                builder = new ExpressionBuilder()
                    .addOperator(exp.operator.id === Operts.Type.HOI ? Operts.Type.TUYEN : Operts.Type.HOI);
                for (let i = 0; i < exp.childs.length; i++) {
                    builder.addChild(exp.childs[i].childs[0]);
                }
                let b = builder.build();
                if (b.childs.length === 1) b = b.childs[0];
                return this.helper.not(b);
            }
            let not: Expression = exp.childs[this.message_Checker.num_1];
            builder.addOperator(not.childs[0].operator.id === Operts.Type.HOI ?
                Operts.Type.TUYEN : Operts.Type.HOI);
            for (let j = 0; j < not.childs[0].childs.length; j++) {
                builder.addChild(this.helper.not(not.childs[0].childs[j]));
            }
            exp.removeAt(this.message_Checker.num_1);
            exp.addChild(builder.build());
            return exp;
        }

    }
    export class KET_HOP extends ExpressionRule.Rule{
        static GOM = 1;
        static BO_DAU = 2;

        constructor(id:number,name:string){
            super(9,'Luật kết hợp');
        }
        run(expr: Expression): number {
            if(expr.operator.id !== Operts.Type.HOI && expr.operator.id !== Operts.Type.TUYEN)return -1;
            if (this.helper.isPrimeOrConstant(expr)) return -1;
            let s = this.checker_1(expr);
            if(s!==-1)return s;
            
            s = this.checker_2(expr);
            if(s!==-1)return s;
            return -1;             
        }
        checker_1(exp:Expression):number{
            let template_1 = StringToExpression('a∨b∨((a∨b)∧b)');
            let template_2 = StringToExpression('a∧b∧((a∧b)∨b)');
            let template_3 = StringToExpression('a∨b∨(¬(a∨b)∧b)');
            let template_4 = StringToExpression('a∧b∧(¬(a∧b)∨b)');
            let template_5 = StringToExpression('a∨b∨¬(a∨b)');
            let template_6 = StringToExpression('a∧b∧¬(a∧b)');
            let template_7 = StringToExpression('a∨b∨(a∨b)');
            let template_8 = StringToExpression('a∧b∧(a∧b)');
            let result:Expression[]=new SimilarExpression().genarate(template_1,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }

            result=new SimilarExpression().genarate(template_2,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }

            result=new SimilarExpression().genarate(template_3,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }

            result=new SimilarExpression().genarate(template_4,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }
            result=new SimilarExpression().genarate(template_5,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }
            result=new SimilarExpression().genarate(template_6,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }
            result=new SimilarExpression().genarate(template_7,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }
            result=new SimilarExpression().genarate(template_8,exp);
            for (let i = 0; i < result.length; i++) {
                if(result[i].id===exp.id||this.helper.contain(result[i],exp)){
                    this.message_Checker.addExp_1(result[i]);
                    return KET_HOP.GOM;
                }
                
            }
 
            return -1;
        }
        checker_2(exp:Expression):number{
            let operator = exp.operator.id;
            for (let i = 0; i < exp.childs.length; i++) {
                if (this.helper.isPrimeOrConstant(exp.childs[i])) continue;
                if (operator === exp.childs[i].operator.id) {
                    this.message_Checker.addNum_1(i);
                   return KET_HOP.BO_DAU
                }
            }
            return -1;
        } 
        result(index: number, exp: Expression): Expression {
            if(index===KET_HOP.GOM){
                let a = this.message_Checker.exp_1.childs[0];
                let b = this.message_Checker.exp_1.childs[1];
                exp.removeChild(a);
                exp.removeChild(b);
                let build: Expression = new ExpressionBuilder().addChild(a).addChild(b).addOperator(exp.operator.id).build();
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
    export class PHAN_PHOI extends ExpressionRule.Rule{
        static PHAN_PHOI_PHU_DINH = 1;
        static GOMLAI=2
        constructor(id:number,name:string){
            super(10,'Luật phân phối');
        }
        run(expr: Expression): number {
            if(expr.operator.id !== Operts.Type.HOI && expr.operator.id !== Operts.Type.TUYEN)return -1;
            let i = this.checker_1(expr);
            if(i!==-1)return i;
            i = this.check_2(expr);
            if(i!==-1)return i;
            i = this.checker_3(expr);
            if(i!==-1)return i;
            return -1;             
        }
        checker_1(exp:Expression):number{
            let exp1: Expression = StringToExpression('(a∧(¬a∨b))∧((a∧¬a)∨(a∧b))');
            let exp2: Expression = StringToExpression('(a∨(¬a∧b))∧((a∨¬a)∧(a∨b))');
            let rs: Expression[] = new SimilarExpression().genarate(exp1, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index: number = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                    exp.removeAt(index);

                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }

            rs = new SimilarExpression().genarate(exp2, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index: number = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                    exp.removeAt(index);

                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }
            return -1;
        }
        check_2(exp:Expression):number{
            let exp1: Expression = StringToExpression('((a∧b)∨(a∧c))∧(a∧(a∨c))');
            let exp2: Expression = StringToExpression('((a∨b)∧(a∨c))∧(a∨(a∧c))');
            let rs: Expression[] = new SimilarExpression().genarate(exp1, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.GOMLAI;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index: number = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                    exp.removeAt(index);

                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.GOMLAI;
                }
            }

            rs = new SimilarExpression().genarate(exp2, exp);
            for (let i = 0; i < rs.length; i++) {
                if (rs[i].childs[0].id === exp.id) {
                    this.message_Checker.addExp_1(rs[i].childs[1]);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
                else if (this.helper.contain(rs[i].childs[0], exp)) {
                    let index: number = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[0].id });
                    exp.removeAt(index);
                    index = exp.childs.findIndex(e => { return e.id === rs[i].childs[0].childs[1].id });
                    exp.removeAt(index);

                    let e = this.helper.replacePrimes(exp1.primes, rs[i].childs[1]);
                    exp.addChild(e);
                    this.message_Checker.addExp_1(exp);
                    return PHAN_PHOI.PHAN_PHOI_PHU_DINH;
                }
            }
            return -1;
        }
        checker_3(exp:Expression):number{
            for (let i = 0; i < exp.childs.length; i++) {
                let p: Expression = exp.childs[i];
                if (p.operator.id === Operts.Type.HOI || p.operator.id === Operts.Type.TUYEN) {
                    
                    let j = 0;
                    if (i === 0) j = 1;
                    let q: Expression = exp.childs[j];
                    let builder: ExpressionBuilder = new ExpressionBuilder().addOperator(p.operator.id);
                    for (let z = 0; z < p.childs.length; z++) {
                        let child: ExpressionBuilder = new ExpressionBuilder().addOperator(exp.operator.id);
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

        result(index: number, expr: Expression): Expression {
            return this.message_Checker.exp_1;
        }

    }
}