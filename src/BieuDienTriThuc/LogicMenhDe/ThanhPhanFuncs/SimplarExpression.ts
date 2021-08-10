import { Expression } from '../ThanhPhanC/Expression';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
export class SimilarExpression{
   private states:number[][]=[];

   //// MUC DICH HAM LA THAY CAC BIEN MENH DE VA BIEU THUC CON CUA EXPR2 BAO EXPR1
   //// TAO RA CAC BIEU THUC DONG DANG COI EXPR1
    genarate(expr1:Expression,expr2:Expression):Expression[]{
        let rs:Expression[]=[];
        expr1 = ExpressionHelper.Helper.copy(expr1);
        expr2 = ExpressionHelper.Helper.copy(expr2);
        let labels:boolean[]=[];
        let ids:number[]=[];
        //#region  THAY THE CAC BIEN MENH DE
        if (expr1.primes.length <= expr2.primes.length) {
            for (let j = 0; j < expr2.primes.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < expr1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, expr2.primes.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let primes: Expression[] = [];
                this.states[i].forEach(element => {
                    primes.push(expr2.primes[element]);
                });
                let not_primes:Expression[]=[];
                primes.forEach(e=>{not_primes.push(ExpressionHelper.Helper.not(e))});
                let newExp: Expression = ExpressionHelper.Helper.replacePrimes(primes, expr1);
                let N_newExp: Expression = ExpressionHelper.Helper.replacePrimes(not_primes, expr1);
                rs.push(newExp);
                rs.push(N_newExp);
            }
        }
        //#endregion

        //#region  THAY THE CAC BIEU THUC CON
        ids = [];
        labels=[];
        this.states=[];
        if (expr1.primes.length <= expr2.childs.length) {
            for (let j = 0; j < expr2.childs.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < expr1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, expr2.childs.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let childs: Expression[] = [];
                this.states[i].forEach(element => {
                    childs.push(expr2.childs[element]);
                });
                
                let newExp: Expression = ExpressionHelper.Helper.replacePrimes(childs, expr1);
                rs.push(newExp);
            }
        }
        //#endregion
        return rs;
    }

    private arrangement(index:number,n:number, id:number[],label:boolean[]){
        for (let i = 0; i < n; i++) {
            if (label[i] === false) {
                id[index] = i;
                if (index === id.length-1) {
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
}