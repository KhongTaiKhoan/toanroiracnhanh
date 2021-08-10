import { Expression } from '../ThanhPhanC/Expression';
import { OperatorFactory, Operator, Operts } from '../ThanhPhanOperators/Operator';
import { ExpressionHelper } from './Helper';
// export class StringToExpression{
//     static chuyenDoi(chuoi:string):Expression{
//        let parent:Expression|null = null;
//        let hienTai:Expression = new Expression();
//        let Operator:Operator = new OperatorFactory().create(Operts.Type.NONE);
       
//        for(let i:number=0;i<chuoi.length;i++){
//             if (chuoi[i] === ' ') continue;
//             if (chuoi[i] === '\n' || chuoi[i] === '\r') continue;
//             console.log(chuoi[i]);
//             if (chuoi[i] === '1') {
//                 let bt_con = ExpressionHelper.Helper.createConstant(Expression.TRUE);
//                 bt_con.parent = hienTai;
//                 hienTai.addChild(bt_con);
//             }
//             else if (chuoi[i] === '0') {
//                 let bt_con = ExpressionHelper.Helper.createConstant(Expression.FALSE);
//                 bt_con.parent = hienTai;
//                 hienTai.addChild(bt_con);
//             }
//             else if (chuoi[i] === ')') {
//                 while (true) {
//                     if (hienTai.parent !== null)
//                         hienTai = hienTai.parent;
//                     parent = hienTai.parent;
//                     if (hienTai.operator.id !== Operts.Type.PHU_DINH || hienTai.parent === null) break;
//                 }
               
//             }

//             else if (chuoi[i] === '(') {
//                 parent = hienTai;
//                 hienTai = new Expression();
//                 hienTai.parent = parent;
//                 parent.addChild(hienTai);
//             }
//             else if(chuoi[i]==='\u00AC'){
//                 while (i < chuoi.length && (chuoi[i] === '\u00AC' || ExpressionHelper.Helper.isLetter(chuoi[i]))) {
//                     if (chuoi[i] === '\u00AC') {
//                         parent = hienTai;
//                         hienTai = new Expression();
//                         hienTai.operator = new OperatorFactory().create(Operts.Type.PHU_DINH);
//                         hienTai.parent = parent;
//                         parent.addChild(hienTai);
//                     }else{
//                         hienTai.addChild(ExpressionHelper.Helper.createPrime(chuoi[i]));   
//                         while (true) {
//                             if (hienTai.parent !== null)
//                                 hienTai = hienTai.parent;
//                             parent = hienTai.parent;
//                             if (hienTai.operator.id !== Operts.Type.PHU_DINH || hienTai.parent === null) break;
//                         }
//                         break;
//                     }
//                     i++;
//                 }
//                 i--;
//             }
//             else if (!Operts.TuongDuong.symbols.includes(chuoi[i])) {
//                 let bt_con = ExpressionHelper.Helper.createPrime(chuoi[i]);
//                 bt_con.parent = hienTai;
//                 hienTai.addChild(bt_con);
//             }
//             else if (Operts.TuongDuong.symbols.includes(chuoi[i])) {
//                 Operator = new OperatorFactory().create2(chuoi[i]);
//                 hienTai.operator = Operator;
//             }
//         }
//         if (ExpressionHelper.Helper.isPrimeOrConstant(hienTai) || (hienTai.childs.length === 1 && hienTai.operator.id === Operts.Type.NONE))
//             return hienTai.childs[0];    
//         return hienTai;
//     }
// }

export function StringToExpression(chuoi:string):Expression{
       let cha:Expression|null = null;
       let hienTai:Expression = new Expression();
       let toanTu:Operator = new OperatorFactory().create(Operts.Type.NONE);
       
       for(let i:number=0;i<chuoi.length;i++){
            if (chuoi[i] === ' ') continue;
            if (chuoi[i] === '\n' || chuoi[i] === '\r') continue;
            else if (chuoi[i] === '1') {
                let bt_con = ExpressionHelper.Helper.createConstant(Expression.TRUE);
                bt_con.parent = hienTai;
                hienTai.addChild(bt_con);
            }
            else if (chuoi[i] === '0') {
                let bt_con = ExpressionHelper.Helper.createConstant(Expression.FALSE);
                bt_con.parent = hienTai;
                hienTai.addChild(bt_con);
            }
            else if (chuoi[i] === ')') {
                while (true) {
                    if (hienTai.parent !== null)
                        hienTai = hienTai.parent;
                    cha = hienTai.parent;
                    if (hienTai.operator.id !== Operts.Type.PHU_DINH) break;
                }

            }

            else if (chuoi[i] === '(') {
                cha = hienTai;
                hienTai = new Expression();
                hienTai.parent = cha;
                cha.addChild(hienTai);
            }

            else if (!Operator.symbols.includes(chuoi[i])) {

                if (hienTai.operator.id !== Operts.Type.PHU_DINH) {
                    let bt_con = ExpressionHelper.Helper.createPrime(chuoi[i]);
                    bt_con.parent = hienTai;
                    hienTai.addChild(bt_con);

                } else {

                    hienTai.addChild(ExpressionHelper.Helper.createPrime(chuoi[i]));
                    while (true) {
                        if (hienTai.parent !== null)
                            hienTai = hienTai.parent;
                        cha = hienTai.parent;
                        //    console.log(hienTai);
                        if (hienTai.operator.id !== Operts.Type.PHU_DINH) break;
                    }
                }


            }

            else if (Operator.symbols.includes(chuoi[i])) {

                toanTu = new OperatorFactory().create2(chuoi[i]);
                if (toanTu.id !== Operts.Type.PHU_DINH) {
                    hienTai.operator = toanTu;
                } else if (toanTu.id === Operts.Type.PHU_DINH) {
                    cha = hienTai;
                    hienTai = new Expression();
                    hienTai.parent = cha;
                    hienTai.operator = toanTu;
                    cha.addChild(hienTai);
                }
            }
        }
        if((hienTai.childs.length === 1 && hienTai.operator.id === Operts.Type.NONE))
           return hienTai.childs[0];
           
        return hienTai;
    }


// export function StringToExpression(string:string):Expression {
//     console.log(string);
//     if(string.length===1){
//     if(ExpressionHelper.Helper.isLetter(string)) return ExpressionHelper.Helper.createPrime(string);
//     return ExpressionHelper.Helper.createConstant(string==='1');
//     }
    
//     // if(string[0]==='(')string = string.substring(1,string.length-1);
   
//     let sub_string='';
//     let start=0;
//     let end = 0;
//     let exp:Expression = new Expression();
//     let not:Expression|null=null;
//     exp.parent = null;
//     for (end=0; end < string.length; end++) {
//         if(string[end]==='\u00AC'){
//             not = new Expression();
//             not.operator = new OperatorFactory().create(Operts.Type.PHU_DINH);
//         }
//         else if(string[end]==='('){
//             start = end;
//             while(string[end]!==')')end++;
//             let child = StringToExpression(string.substring(start,end+1));
//             if(not !==null){
//                 not.addChild(child);
//                 exp.addChild(not);
//                 not = null;
//             }else exp.addChild(child);
//             start=end+1;
//         }
//         else if( ExpressionHelper.Helper.isLetter(string[end])){
//             start=end;
//             sub_string = string.substring(start,end+1);
//             let child:Expression = StringToExpression(sub_string);
//             if(not !==null){
//                 not.addChild(child);
//                 exp.addChild(not);
//                 not = null;
//             }else exp.addChild(child);
//             start=end+1;
//         }
//         else if( Operator.symbols.includes (string[end])){
//             exp.operator = new OperatorFactory().create2(string[end]);
           
//         }
//     }

//     // if(!ExpressionHelper.Helper.isPrimeOrConstant(exp)||(exp.childs.length === 1 && exp.operator.id === Operts.Type.NONE))
//     //            return exp.childs[0];
//     return exp;
// }