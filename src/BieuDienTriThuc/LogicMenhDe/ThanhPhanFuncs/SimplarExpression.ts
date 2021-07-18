import { Expression } from '../ThanhPhanC/Expression';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
export class SimilarExpression{
   private states:number[][]=[];

    genarate(expr1:Expression,expr2:Expression):Expression[]{
        let rs:Expression[]=[];
        /// THAY THE CAC BIEN MENH DE
        for (let i = 0; i < this.states.length; i++) {
           let primes:Expression[]=[];
           this.states[i].forEach(element => { 
               primes.push(expr1.primes[element]);
           });
           let newExp:Expression = ExpressionHelper.Helper.replacePrimes(primes,expr2);
           rs.push(newExp);
        }
        return rs;
    }

    private arrangement(index:number,n:number, id:number[],label:boolean[]){
        for (let i = 0; i < n; i++) 
            if (label[i] === false) {
                id[index] = i;
                if (index === n - 1) {
                    //// GHI NHAN KET QUA
                    let row:number[] =[];
                    id.forEach(e=>row.push(e));
                    this.states.push(row);
                } else {
                    label[i] = true;
                    this.arrangement(index + 1, n, id, label);
                    label[i] = false;
                }
            }
        
    }
}