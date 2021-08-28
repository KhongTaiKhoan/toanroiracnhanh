"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equivalence = void 0;
const BaiTap_1 = require("../../BaiTap/BaiTap");
const Simplify_1 = require("./Simplify");
class Equivalence extends BaiTap_1.BaiTap {
    // let equivalence = new Equivalence().giai('x→(y→z)≡y→(x→z)')
    // let equivalence = new Equivalence().giai('(x→y)∧(x→z)≡x→(y∧z)')
    // let equivalence = new Equivalence().giai('¬(x∨y)∨(¬x∧y)∨¬y≡¬(x∧y)')
    // let equivalence = new Equivalence().giai('(p→r)→((q→r)→((p∨q)→r))≡1')
    // let equivalence = new Equivalence().giai('p→(p→q)≡p→q')
    giai(deBai) {
        if (deBai) {
            // console.log(deBai);
            let chuoi = deBai.split('\u2261');
            let left = new Simplify_1.Simplify().giai(chuoi[0]);
            let right = new Simplify_1.Simplify().giai(chuoi[1]);
            // console.log('LEFT: ');
            // left.detail.forEach(e=>{console.log(`LUAT: ${e.rule.name} EXP: ${ExpressionToString(e.Exp())}`)});
            // console.log('RIGHT: ');
            // right.detail.forEach(e=>{console.log(`LUAT: ${e.rule.name} EXP: ${ExpressionToString(e.Exp())}`)});
            // console.log('---------');
            let result = this.getResult(left, right);
            // result.forEach(e=>{
            //     console.log(`LUAT: ${e.rule.name} - EXP: ${ExpressionToString(e.Exp())}`);
            // });
            // if(result.length === 0) console.log('KHONG THE CHUNG MINH');
            if (result.length === 0)
                return null;
            return result;
        }
        return null;
    }
    simplifyLeft(left) {
        let transLeft = new Simplify_1.Simplify().giai(left);
        return transLeft;
    }
    getResult(left, right) {
        if (left.detail.length === 0 && right.detail.length === 0)
            return [];
        if (left.detail.length !== 0) {
            if (left.detail[left.detail.length - 1].Exp().id === right.exp.id)
                return left.detail;
            else
                return [];
        }
        if (right.detail.length !== 0) {
            if (right.detail[right.detail.length - 1].Exp().id === left.exp.id)
                return right.detail;
            else
                return [];
        }
        if (left.detail[left.detail.length - 1].Exp().id === right.detail[right.detail.length - 1].Exp().id) {
            let result = left.detail;
            for (let i = right.detail.length - 1; i > 0; i--) {
                let t = right.detail[i - 1].clone();
                t.rule = right.detail[i].rule;
                result.push(t);
            }
            let t = right.detail[0].clone();
            t.detail = [new Simplify_1.Package(0, right.exp)];
            result.push(t);
            return result;
        }
        return [];
    }
}
exports.Equivalence = Equivalence;
