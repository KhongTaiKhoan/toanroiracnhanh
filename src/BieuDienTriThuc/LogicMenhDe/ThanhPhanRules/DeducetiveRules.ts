import { EquivalentRules, ExpressionRule } from './ExpressionRule';
import { Expression, ExpressionBuilder } from '../ThanhPhanC/Expression';
import { Reasoning } from '../ThanhPhanFuncs/Deduction';
import { Operts, OperatorFactory } from '../ThanhPhanOperators/Operator';
import { Equivalence } from '../ThanhPhanFuncs/Equivalence';
import { ExpressionToString } from '../ThanhPhanFuncs/ExpressionToString';
import { Transformation, Simplify } from '../ThanhPhanFuncs/Simplify';

export namespace DeducetiveRules {
    export abstract class DeducetiveRule extends ExpressionRule.Rule {
        static LUAT_RUT_GON:number = 6;
        protected manager: EquivalentRules.ManagerEquavilentRules = new EquivalentRules.ManagerEquavilentRules();
        abstract apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[];
    }
    export class TAM_DOAN_LUAN_KHANG_DINH extends DeducetiveRule {
        constructor() {
            super(2, 'Tam đoạn luân khẳng định');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {
            if (exp.operator.id !== Operts.Type.KEO_THEO && exp.operator.id !== Operts.Type.TUYEN) return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning: Reasoning[] = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right: Expression = this.helper.copy(exp)
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Reasoning(id, [org], this.manager.rules[1], exp));
                id++;
            }

            /// TRUONG HOP VE PHAI LA TAP HOP CAC BIEU THUC CON CUA GT
            let kh = new LUAT_KET_HOP().apply(exp.childs[0],GT,visited);
            if(kh.length!==0) {
                reasoning = reasoning.concat(kh);
                reasoning.push(new Reasoning(id,[exp,exp.childs[0]],this,exp.childs[1]));
                return reasoning;
            }

            //// TIM BIEU THUC GIONG BIEU THUC VE TRAI HOAC TUONG DUONG VOI VE TRAI
            for (let i = 0; i < GT.length; i++) {
                if(GT[i].id === exp.id) continue;
                if(visited.findIndex(e=>{return e.id === GT[i].id})!==-1)continue;
                //// BIEU THUC GIONG VE TRAI;
                if(GT[i].id === exp.childs[0].id) {
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,exp.childs[1]));
                    return reasoning;
                }

                //// BIEU THUC TUONG DONG VE TRAI;
                let equivalence:Transformation[]|null =  new Equivalence().
                giai(`${ExpressionToString(exp.childs[0])}\u2261${ExpressionToString(GT[i])}`);

                if(equivalence !== null){
                    for (let i = 0; i < equivalence.length; i++) {
                      if(i===0)
                      reasoning.push(new Reasoning(id,[exp],equivalence[i].rule,equivalence[i].Exp()));
                      else
                      reasoning.push(new Reasoning(id,[equivalence[i-1].Exp()],equivalence[i].rule,equivalence[i].Exp()));
                      id++; 
                    }
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,exp.childs[1]));
                    return reasoning;
                }
            }

            return [];
        }

    }
    export class TAM_DOAN_LUAN_PHU_DINH extends DeducetiveRule {
        constructor() {
            super(2, 'Tam đoạn luân phủ định');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {
            if (exp.operator.id !== Operts.Type.KEO_THEO && exp.operator.id !== Operts.Type.TUYEN) return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning: Reasoning[] = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right: Expression = this.helper.copy(exp)
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Reasoning(id, [org], this.manager.rules[1], this.helper.copy(exp)));
                id++;
            }

             ///TRUONG HOP VE PHAI LA TAP HOP CAC BIEU THUC CON CUA GT
             let dn = this.helper.DOI_NGAU(exp.childs[1]);
            let kh: Reasoning[] = []
            if (dn !== null) {
                kh = new LUAT_KET_HOP().apply(dn, GT, visited);
                if (kh.length !== 0) {
                    reasoning = reasoning.concat(kh);
                    reasoning.push(new Reasoning(id, [exp, dn], this, this.helper.not(exp.childs[0])));
                    return reasoning;
                }
            }

            //// TIM BIEU THUC GIONG BIEU THUC VE TRAI HOAC TUONG DUONG VOI PHU DINH BT VE PHAI
            for (let i = 0; i < GT.length; i++) {
                if(GT[i].id === exp.id) continue;
                if(visited.findIndex(e=>{return e.id === GT[i].id})!==-1)continue;

                //// BIEU THUC GIONG VE TRAI;
                if(GT[i].id === this.helper.not(exp.childs[1]).id) {
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,this.helper.not(exp.childs[0]) ));
                    return reasoning;
                }

                //// BIEU THUC TUONG DONG VE TRAI;
                let equivalence:Transformation[]|null =  new Equivalence().
                giai(`${ExpressionToString(this.helper.not(exp.childs[1]))}\u2261${ExpressionToString(GT[i])}`);

                if(equivalence !== null){
                    for (let i = 0; i < equivalence.length; i++) {
                      if(i===0)
                      reasoning.push(new Reasoning(id,[exp],equivalence[i].rule,equivalence[i].Exp()));
                      else
                      reasoning.push(new Reasoning(id,[equivalence[i-1].Exp()],equivalence[i].rule,equivalence[i].Exp()));
                      id++; 
                    }
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,this.helper.not(exp.childs[0])  ));
                    return reasoning;
                }
            }

            return [];
        }

    }
    export class TAM_DOAN_LUAN_GIA_DINH extends DeducetiveRule{

        constructor() {
            super(3, 'Tam đoạn luận giả định');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {
            if (exp.operator.id !== Operts.Type.KEO_THEO && exp.operator.id !== Operts.Type.TUYEN) return [];
            let org = exp;
            exp = this.helper.copy(exp);
            let reasoning: Reasoning[] = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            if (exp.operator.id === Operts.Type.TUYEN) {
                let left = this.helper.not(exp.childs[0]);
                let right: Expression = this.helper.copy(exp)
                right.removeAt(0);
                right = this.helper.checkAndChangeToPrime(right);
                exp = new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                    .addChild(left)
                    .addChild(right).build();
                reasoning.push(new Reasoning(id, [org], this.manager.rules[1], this.helper.copy(exp)));
                id++;
            }

            /// DUYET TAP GIA THIET
            //// TIM BIEU THUC GIONG BIEU THUC KEO THEO CO VE PHAI EXP GIONG VE TRAI CUA NO
            for (let i = 0; i < GT.length; i++) {
                if(GT[i].id === org.id) continue;
                if(GT[i].operator.id !== Operts.Type.KEO_THEO) continue;
                if(visited.findIndex(e=>{return e.id === GT[i].id})!==-1)continue;

                //// BIEU THUC GTi CO VE TRAI GIONG VE PHAI EXP;
                if(GT[i].childs[0].id === exp.childs[1].id) {
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,
                        new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                                               .addChild(exp.childs[0])
                                               .addChild(GT[i].childs[1])
                                               .build()
                        ));
                    return reasoning;
                }

                //// BIEU THUC GTi CO VE PHAI GIONG VE TRAI EXP;
                if(GT[i].childs[1].id === exp.childs[0].id) {
                    reasoning.push(new Reasoning(id,[exp,GT[i]],this,
                        new ExpressionBuilder().addOperator(Operts.Type.KEO_THEO)
                                               .addChild(GT[i].childs[0])
                                               .addChild(exp.childs[1])
                                               .build()
                        ));
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
    export class TAM_DOAN_LUAN_LOAI_TRU extends DeducetiveRule{

        constructor() {
            super(4, 'Tam đoạn luận loại trừ');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {
            if (exp.operator.id !== Operts.Type.KEO_THEO && exp.operator.id !== Operts.Type.TUYEN
                && !(exp.operator.id === Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operts.Type.HOI)) return [];
            let org = this.helper.copy(exp);
            exp = this.helper.copy(exp);
            
            let reasoning: Reasoning[] = [];
            let id = 0;
            //// CHUYEN BIEU THUC VE DANG KEO THEO
            reasoning = this.transformKEOTHEOExpression(exp,id);
            exp = reasoning.length===0?exp:reasoning[reasoning.length-1].exp;
            if(reasoning.length!==0) id++;
            
            /// DUYET TAP GIA THIET
            //// TIM BIEU THUC GIONG BIEU THUC KEO THEO CO VE PHAI EXP GIONG VE TRAI CUA NO
            for (let i = 0; i < GT.length; i++) {
                if(GT[i].id === org.id) continue;
                if (exp.operator.id !== Operts.Type.KEO_THEO && exp.operator.id !== Operts.Type.TUYEN
                    && !(exp.operator.id === Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operts.Type.HOI)) continue;
                if(visited.findIndex(e=>{return e.id === GT[i].id})!==-1)continue;

                let trans = this.transformKEOTHEOExpression(GT[i],id);
                if(trans.length ===0 && GT[i].operator.id !== Operts.Type.TUYEN)continue;
                let GT_clone = trans.length === 0?this.helper.copy(GT[i]) : this.helper.copy( trans[trans.length-1].exp);
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
                if(valid){
                    let rs = new Expression();
                    c.childs.forEach(e=>{rs.addChild(e)});
                    exp_clone.childs.forEach(e=>{
                        if(rs.childs.findIndex(ele=>{return ele.id === e.id}) === -1)
                          rs.addChild(e)}
                    );
                    if(rs.childs.length>1)rs.operator = new OperatorFactory().create(Operts.Type.TUYEN);
                    else rs = this.helper.checkAndChangeToPrime(rs);
                    reasoning = reasoning.concat(trans);
                    if(trans.length!==0)id++;
                    reasoning.push(new Reasoning(id,[exp,GT_clone],this,rs));
                    return reasoning;
                }

            } 

            return [];
        }
        private transformKEOTHEOExpression(exp:Expression,id:number):Reasoning[]{
            let reasoning:Reasoning[] = [];
           if(exp.operator.id === Operts.Type.KEO_THEO){
               let kt = this.manager.rules[1].apply(exp);
               if(kt!==null)
               reasoning.push(new Reasoning(id++,[exp],this.manager.rules[1],kt));  
           }
           else if(exp.operator.id === Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operts.Type.HOI){
               let dn = this.helper.DOI_NGAU(exp);
               if(dn!==null) reasoning.push(new Reasoning(++id,[exp],this.manager.rules[8],dn));
           }
           return reasoning;
        }   
    }
    export class LUAT_KET_HOP extends DeducetiveRule{
        constructor(){
            super(5,'Luật kết hợp');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {

            /// MO TA KIEM TRA exp co the duoc tao ra bang cach ket hop 
            /// cac bieu thuc trong GT hay khong

            if(exp.operator.id !== Operts.Type.HOI) return [];
            let parent:Expression[] = [];
            for (let i = 0; i < exp.childs.length; i++) {
                if(GT.findIndex(e=>{return e.id === exp.childs[i].id}) ===-1)return [];
                parent.push(exp.childs[i]);
            }

            return [new Reasoning(0,parent,this,exp)];

        }

    }

    export class LUAT_RUT_GON extends DeducetiveRule {
        constructor() {
            super(6, 'Luật rút gọn');
        }
        apply(exp: Expression, GT: Expression[],visited:Expression[]): Reasoning[] {
            let rea: Reasoning[] = [];
            /// NEU LA PHEP PHU DINH CAN TOI GIAN BIEU THUC CON
            if(exp.operator.id === Operts.Type.PHU_DINH){
                let trans = new Simplify().giai(ExpressionToString(this.helper.copy(exp.childs[0])));
                if(trans.detail.length !== 0){
                    let list_trans:Reasoning[] = [];
                    for (let i = 0; i < trans.detail.length; i++) {
                        if (i === 0)
                            list_trans.push(new Reasoning(0, [exp], trans.detail[i].rule, this.helper.not(trans.detail[i].Exp())));
                        else
                            list_trans.push(new Reasoning(0, [this.helper.not(trans.detail[i - 1].Exp())], trans.detail[i].rule,
                                this.helper.not(trans.detail[i].Exp())));
                    }
                    exp = this.helper.not(trans.detail[trans.detail.length-1].Exp());
                    rea = rea.concat(list_trans);
                }
            }

            /// PHEP HOI
            if (exp.operator.id === Operts.Type.HOI) {
                for (let i = 0; i < exp.childs.length; i++) {
                    rea.push(new Reasoning(0, [exp], this, exp.childs[i]));
                }
                return rea;
            }

            /// BO DAU PHU DINH
            if (exp.operator.id === Operts.Type.PHU_DINH && exp.childs[0].operator.id === Operts.Type.TUYEN){
                let dn = this.helper.DOI_NGAU(exp);
                if (dn !== null) {      
                    rea.push(new Reasoning(0,[exp],this.manager.rules[8],dn));
                    exp = dn;
                    for (let i = 0; i < exp.childs.length; i++) {
                        rea.push(new Reasoning(0, [exp], this, exp.childs[i]));
                    }
                    return rea;
                }
                return [];
            } 
            return [];
        }

    }

    export class ManagerRules{
        public rules:DeducetiveRule[]=[];

        constructor(){
            this.genarate();
        }
        private genarate(){
            this.rules.push(new LUAT_RUT_GON ());
            this.rules.push(new TAM_DOAN_LUAN_KHANG_DINH());
            this.rules.push(new TAM_DOAN_LUAN_PHU_DINH());
            this.rules.push(new TAM_DOAN_LUAN_GIA_DINH ());
            this.rules.push(new TAM_DOAN_LUAN_LOAI_TRU ());
            // this.rules.push(new LUAT_KET_HOP());
        }

        public apply(exp:Expression,GT:Expression[],visited:Expression[]):Reasoning[]{
            let r = this.rules;
            let result :Reasoning[]=[]
            for (let i = 0; i < r.length; i++) {
                let re = r[i].apply(exp,GT,visited);
                if(re.length!==0){
                    result = result.concat(re);
                }
            } 
            return result;
        }
    }
}