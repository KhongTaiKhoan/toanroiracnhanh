import { Expression, ExpressionBuilder } from '../ThanhPhanC/Expression';
import { OperatorFactory, Operts } from '../ThanhPhanOperators/Operator';
import { ExpressionToString } from './ExpressionToString';

export namespace ExpressionHelper {
    export class Helper {

        static isNumber(num: string): boolean {
            return num.match(/^-?\d+$/) !== null;
        }
        static isPrimeOrConstant(expr:Expression):boolean{
            return expr.childs.length===0;
        }
        static createConstant(val:boolean):Expression{
            let exp = new Expression();
            exp.value = val;
            exp.id= val?'1':'0';
            return exp;
        }   
        static isROOT(expr:Expression){
            return expr.parent === null;
        }
        static createPrime(id:string):Expression{
            let exp = new Expression();
            exp.id=id;
            return exp;
        }   
        static copy(expr:Expression):Expression{
            if(this.isPrimeOrConstant(expr)){
                if(this.isNumber(expr.id) && expr.value !== null) return this.createConstant(expr.value);
                return this.createPrime(expr.id);
            }
            let rs = new Expression();

            rs.parent = expr.parent;
            for (let i = 0; i < expr.childs.length; i++) {
               rs.childs.push(this.copy(expr.childs[i])); 
            }
            rs.operator = new OperatorFactory().create(expr.operator.id);
            return rs;
        }
        static replacePrimes(primes:Expression[],expr:Expression){
            expr = this.copy(expr);
            // console.log();
            // primes.forEach(e=>{console.log(e.id)});
            let exp_clone = this.copy(expr);
            for (let i = 0; i < primes.length; i++) {
                expr= this.replacePrime(expr,primes[i],exp_clone.primes[i]);
            }
            return expr;
        }
        static replacePrime(expr:Expression,prime:Expression,or_prime:Expression):Expression{
            if(ExpressionHelper.Helper.isPrimeOrConstant(expr)){
                // console.log(`${expr.id} and ${or_prime.id}  and ${prime.id}`);
                if(expr.id === or_prime.id) return ExpressionHelper.Helper.copy(prime);
                else return expr;
            }   
     
            for (let i = 0; i < expr.childs.length; i++) {
                expr.setChildAt(i,this.replacePrime(expr.childs[i],prime,or_prime));
            }
            return expr;
        }
        static contain(expr:Expression,parent:Expression):boolean{
            if(expr.operator.id !== parent.operator.id)return false;
            expr = this.copy(expr);
            parent = this.copy(parent);
            let sizeChilds:number = expr.childs.length;
            for (let i = 0; i < sizeChilds; i++) {
                // console.log(expr.childs[i].id);
                let index:number=parent.childs.findIndex(e=>{return e.id === expr.childs[i].id;});
                if(index===-1){
                    return false; 
                }
                parent.removeAt(index);         
            }
            return true;
        }
        static contain2(expr:Expression,parent:Expression):number[]{
            if(expr.operator.id !== parent.operator.id)return [];
            if(this.Length(expr) > this.Length(parent)) return [];
            expr = this.copy(expr);
            parent = this.copy(parent);
            let result=[];
            let sizeChilds:number = expr.childs.length;
            for (let i = 0; i < sizeChilds; i++) {
                let index:number=parent.childs.findIndex(e=>{return e.id === expr.childs[i].id;});
                if(index===-1){
                    if(ExpressionHelper.Helper.laTuDon( expr.childs[i]))return [];
                    let flag=false;
                    for (let j = 0; j < parent.childs.length && !flag; j++) {
                        if(ExpressionHelper.Helper.laTuDon( parent.childs[i]))continue;
                        for (let z = 0; z < parent.childs[j].childs.length; z++) {
                            if(expr.childs[i].id === parent.childs[j].childs[z].id){
                                flag = true;
                                result.push(j);
                                break;
                            }
                        }
                    } 
                    if(!flag){
                        flag = true;                       
                        for (let j = 0; j < parent.childs.length; j++) {
                            let s = parent.childs[i];
                            if (this.isPrimeOrConstant(s)) continue;
                            for (let z = 0; z < s.childs.length; z++){
                                if (!ExpressionHelper.Helper.laTuDon(s.childs[z])) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (!flag) break;
                            if (s.id.includes(expr.childs[i].id)) {
                                result.push(j);
                                flag =true;
                                break;
                            }
                            flag = false;
                        }
                        if(!flag)
                        return [];
                    }
                }else
                result.push(index);
            }
            return result;
        }
        static not(expr:Expression){
            if(expr.operator.id === Operts.Type.PHU_DINH)
                return expr.childs[0];    
            return new ExpressionBuilder().addChild(expr).addOperator(Operts.Type.PHU_DINH).build();
        }
        static Length(P:Expression):number{
            if(Helper.isPrimeOrConstant(P)){
                if(P.operator.id !== Operts.Type.PHU_DINH){
                    return 0;
                }
                else return 0.5;
            }
            let rs:number = 0;
            for(let i:number=0;i<P.childs.length;i++){
                if(!Helper.isPrimeOrConstant(P.childs[i]))
                 rs+=this.Length(P.childs[i])+0.1;
            }
      
            if(P.operator.id === Operts.Type.HOI || P.operator.id === Operts.Type.TUYEN)
              rs += (P.childs.length-1); 
    
            if(P.operator.id === Operts.Type.TUONG_DUONG)
              rs += 4;
    
            if(P.operator.id === Operts.Type.KEO_THEO)
              rs+=2;
            // if(P.id.includes('1')||P.id.includes('0'))rs-=0.5;  
            for (let i = 0; i < P.childs.length; i++) {
                if(P.childs[i].id === '1' || P.childs[i].id === '0')rs-=0.5;
            }
            return rs;
        }
         
        static DOI_NGAU(exp:Expression):Expression|null{
            if(this.laTuDon(exp))return null;
            let builder = new ExpressionBuilder();
            if(exp.operator.id !== Operts.Type.PHU_DINH){
                for (let i = 0; i < exp.childs.length; i++) {
                    builder.addChild(this.not(exp.childs[i]));
                }  
                builder.addOperator(exp.operator.id === Operts.Type.HOI ?
                    Operts.Type.TUYEN : Operts.Type.HOI);
                return this.checkAndChangeToPrime(builder.build());
            }
            for (let i = 0; i < exp.childs[0].childs.length; i++) {
                builder.addChild(this.not(exp.childs[0].childs[i]));
            }  
            builder.addOperator(exp.childs[0].operator.id === Operts.Type.HOI ?
                Operts.Type.TUYEN : Operts.Type.HOI);
            return this.checkAndChangeToPrime(builder.build());
        }
        static isLetter(str:string):boolean{
            let n = str.charCodeAt(0);
            return (n >= 65 && n < 91) || (n >= 97 && n < 123);
        }
        static checkAndChangeToPrime(exp:Expression):Expression{
            if(exp.childs.length===1&& exp.operator.id !== Operts.Type.PHU_DINH){
                let parent = exp.parent;
                exp=exp.childs[0];
                exp.parent = parent;
                return exp;
            }
            return exp;
        }
        static laTuDon(exp:Expression){
            return ExpressionHelper.Helper.isPrimeOrConstant(exp) ||
            (exp.operator.id === Operts.Type.PHU_DINH 
            && ExpressionHelper.Helper.isPrimeOrConstant(exp.childs[0]));
        }

    }
}