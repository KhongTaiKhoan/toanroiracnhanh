import { Expression } from '../ThanhPhanC/Expression';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
import { ExpressionToString } from './ExpressionToString';
export class SimilarExpression{
   private states:number[][]=[];

   //// MUC DICH HAM LA THAY CAC BIEN MENH DE VA BIEU THUC CON CUA EXPR2 BAO EXPR1
   //// TAO RA CAC BIEU THUC DONG DANG COI EXPR1
    genarate(expr1:Expression,expr2:Expression):PairPrimes[]{
        let pair:PairPrimes[] = [];
        let exp1 = ExpressionHelper.Helper.copy(expr1);
        let exp2 = ExpressionHelper.Helper.copy(expr2);
        let labels:boolean[]=[];
        let ids:number[]=[];
        //#region  THAY THE CAC BIEN MENH DE
        if (exp1.primes.length <= exp2.primes.length) {
            for (let j = 0; j < exp2.primes.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < exp1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, exp2.primes.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let primes: Expression[] = [];
                
                this.states[i].forEach(element => {
                    primes.push(exp2.primes[element]);
                });
                let not_primes:Expression[]=[];
                primes.forEach(e=>{not_primes.push(ExpressionHelper.Helper.not(e))});
                
                let pa = new PairPrimes([],new Expression());
                let NOTpa = new PairPrimes([],new Expression());
                for (let j = 0; j < primes.length; j++) {
                    pa.pair.push([ExpressionHelper.Helper.copy(exp1.primes[j]),ExpressionHelper.Helper.copy(primes[j])]);
                }
                let newExp: Expression = ExpressionHelper.Helper.replacePrimes(primes, exp1);
                let N_newExp: Expression = ExpressionHelper.Helper.replacePrimes(not_primes, exp1);
                
                pa.exp = newExp;
                NOTpa.exp = N_newExp;
                pair.push(pa);
                pair.push(NOTpa);
                
            }


        }
        //#endregion

        //#region  THAY THE CAC BIEU THUC CON
        ids = [];
        labels=[];
        this.states=[];
        exp1 = ExpressionHelper.Helper.copy(expr1);
        exp2 = ExpressionHelper.Helper.copy(expr2);
        let btCon = this.getBieuThucCon(exp2);
        if (exp1.primes.length <= exp2.childs.length) {
            for (let j = 0; j < btCon.length; j++) {
                labels.push(false);
            }
            for (let i = 0; i < exp1.primes.length; i++) {
                ids.push(0);
            }
            //// CONG DOAN NAY SE TAO RA MOT MANG CAC CAU HINH K PHAN TU PRIME TRONG EXPR2 DE THAY VAO EXPR1
            this.arrangement(0, btCon.length, ids, labels);
            /// DUYET CAU HINH
            for (let i = 0; i < this.states.length; i++) {
                let childs: Expression[] = [];
                this.states[i].forEach(element => {
                    childs.push(btCon[element]);
                });
                let not_childs:Expression[]=[];
                childs.forEach(e=>{not_childs.push(ExpressionHelper.Helper.not(e))});
                
                let pa = new PairPrimes([],new Expression());
                let NOTpa = new PairPrimes([],new Expression());
                for (let j = 0; j < childs.length; j++) {
                    pa.pair.push([ExpressionHelper.Helper.copy(exp1.primes[j]),ExpressionHelper.Helper.copy(childs[j])]);
                }
                
                let newExp: Expression = ExpressionHelper.Helper.replacePrimes(childs, exp1);
                let N_newExp: Expression = ExpressionHelper.Helper.replacePrimes(not_childs, exp1);
                pa.exp = newExp;
                NOTpa.exp = N_newExp;
                pair.push(pa);
                pair.push(NOTpa);
            }
        }
        //#endregion
        return pair;
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

    /// THAY THE TARGET BANG PAIR
    public replace(pair:PairPrimes,target:Expression):Expression{

        for (let i = 0; i < pair.pair.length; i++) {
            target = ExpressionHelper.Helper.replacePrime(target,pair.pair[i][1],pair.pair[i][0]);
        }
        return target;
    }

    getBieuThucCon(expr:Expression):Expression[]{
        let bt:Expression[] = [];
        for(let i = 0;i<expr.childs.length;i++){
           if(ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i]))continue;
           if(ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[0]) 
           && bt.findIndex(e=>{return e.id === expr.childs[i].id})===-1  )
           bt.push(ExpressionHelper.Helper.copy(expr.childs[i]));
           else
               for (let j = 0; j < expr.childs[i].childs.length; j++) {
                   if (ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[j])) continue;
                   if (ExpressionHelper.Helper.isPrimeOrConstant(expr.childs[i].childs[j].childs[0])
                       && bt.findIndex(e => { return e.id === expr.childs[i].childs[j].id }) === -1)
                       bt.push(ExpressionHelper.Helper.copy(expr.childs[i].childs[j]));
               }
           
        }
        return bt;
    }
}

export class PairPrimes{

    //// BEN TRAI LA BIEN MENH DE CUA LUAT
    //// BEN PHAI LA BIEN MENH DE CUA BIEU THUC
    public pair:Expression[][] =[];
    public exp:Expression = new Expression;
    constructor(pair:Expression[][],exp:Expression){
        this.pair = pair;
        this.exp = exp;
    }
}