import { Expression } from '../ThanhPhanC/Expression';
import { Operts } from '../ThanhPhanOperators/Operator';
import { ExpressionHelper } from './Helper';
export function ExpressionToString(P: Expression):string {


    if (ExpressionHelper.Helper.isPrimeOrConstant(P)) {
        if(P.id === '0')return'FALSE';
        if(P.id==='1')return'TRUE';
        return P.id;
    }

    if (P.operator.id === Operts.Type.PHU_DINH) {
        if (ExpressionHelper.Helper.isPrimeOrConstant(P.childs[0]))
            return P.operator.symbol + ExpressionToString(P.childs[0]);

        return P.operator.symbol + `(${ExpressionToString(P.childs[0])})`;
    }

    let str:string = '';
    for (let i = 0; i < P.childs.length; i++) {
        if (ExpressionHelper.Helper.isPrimeOrConstant(P.childs[i]))
           str+=P.childs[i].id;
        else if ( (P.childs[i].operator.id === Operts.Type.PHU_DINH )) 
           str+= `${ExpressionToString(P.childs[i])}`;  
        else
           str+= `(${ExpressionToString(P.childs[i])})`;
        if(i !== P.childs.length-1)str+=P.operator.symbol;   
    }
    return str;

}