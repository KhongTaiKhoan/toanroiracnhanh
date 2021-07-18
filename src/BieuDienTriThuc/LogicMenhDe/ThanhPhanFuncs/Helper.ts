import { Expression } from '../ThanhPhanC/Expression';
import { OperatorFactory } from '../ThanhPhanOperators/Operator';

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
            for (let i = 0; i < expr.primes.length; i++) {
                rs.primes.push(this.copy(expr.primes[i])); 
            }
            rs.operator = new OperatorFactory().create(expr.operator.id);
            return rs;
        }
        static replacePrimes(primes:Expression[],expr:Expression){
            expr = this.copy(expr);
            for (let i = 0; i < primes.length; i++) {
                expr.primes[i] = primes[i];
                expr= this.replacePrime(expr,primes[i]);
            }
            return expr;
        }
        static replacePrime(expr:Expression,prime:Expression):Expression{
            if(ExpressionHelper.Helper.isPrimeOrConstant(expr)){
                if(expr.id === prime.id) return ExpressionHelper.Helper.createPrime(prime.id);
                else return expr;
            }   
     
            for (let i = 0; i < expr.childs.length; i++) {
                expr.childs[i] = this.replacePrime(expr.childs[i],prime);
            }
            return expr;
        }
        static contain(expr:Expression,parent:Expression):boolean{
            
            for (let i = 0; i < parent.childs.length; i++) {
               if(parent.childs[i].id === expr.id) return true;
            }

            //// TH GOP LAI
            if(parent.operator.id !== expr.operator.id )return false;
            for (let i = 0; i < expr.childs.length; i++) {
                if(!parent.id.includes(expr.childs[i].id)) return false;
            }
            return true;
        }
    }
}