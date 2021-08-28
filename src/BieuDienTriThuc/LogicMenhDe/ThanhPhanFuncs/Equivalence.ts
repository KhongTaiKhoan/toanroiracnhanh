import { BaiTap } from '../../BaiTap/BaiTap';
import { Transformation, Simplify, ResultSimplification, Package } from './Simplify';
import { Expression } from '../ThanhPhanC/Expression';
import { ExpressionToString } from './ExpressionToString';
export class Equivalence extends BaiTap{
    // let equivalence = new Equivalence().giai('x→(y→z)≡y→(x→z)')
// let equivalence = new Equivalence().giai('(x→y)∧(x→z)≡x→(y∧z)')
// let equivalence = new Equivalence().giai('¬(x∨y)∨(¬x∧y)∨¬y≡¬(x∧y)')
// let equivalence = new Equivalence().giai('(p→r)→((q→r)→((p∨q)→r))≡1')
// let equivalence = new Equivalence().giai('p→(p→q)≡p→q')
    giai(deBai?: string):Transformation[]|null {
        if (deBai) {
            // console.log(deBai);
            let chuoi: string[] = deBai.split('\u2261');
            let left:ResultSimplification = new Simplify().giai(chuoi[0]);
            let right:ResultSimplification = new Simplify().giai(chuoi[1]);

            // console.log('LEFT: ');
            // left.detail.forEach(e=>{console.log(`LUAT: ${e.rule.name} EXP: ${ExpressionToString(e.Exp())}`)});
    
            // console.log('RIGHT: ');
            // right.detail.forEach(e=>{console.log(`LUAT: ${e.rule.name} EXP: ${ExpressionToString(e.Exp())}`)});
            // console.log('---------');

            let result = this.getResult(left,right);
            // result.forEach(e=>{
            //     console.log(`LUAT: ${e.rule.name} - EXP: ${ExpressionToString(e.Exp())}`);
            // });
            // if(result.length === 0) console.log('KHONG THE CHUNG MINH');
            if(result.length ===0)return null;
            return result;
        }
        return null;
    }

    simplifyLeft(left:string):ResultSimplification{
        let transLeft:ResultSimplification = new Simplify().giai(left);
        return transLeft;
    }
    public getResult(left:ResultSimplification, right:ResultSimplification):Transformation[]{
        if(left.detail.length === 0 && right.detail.length ===0)return [];
        if(right.detail.length === 0){
            if( left.detail[left.detail.length-1].Exp().id === right.exp.id)
            return left.detail;
            else return [];
        }
        if(left.detail.length ===0){
            if(right.detail[right.detail.length-1].Exp().id === left.exp.id)
            return right.detail;
            else return [];
        }

        if(left.detail[left.detail.length-1].Exp().id === right.detail[right.detail.length-1].Exp().id  ){
           let result:Transformation[]=left.detail;
           for (let i = right.detail.length-1; i > 0; i--) {
               let t = right.detail[i-1].clone();
               t.rule = right.detail[i].rule;
               result.push(t);
           }
           let t = right.detail[0].clone();
           t.detail = [new Package(0,right.exp)];
           result.push(t);
           return result;
        }
        return [];
    }
}