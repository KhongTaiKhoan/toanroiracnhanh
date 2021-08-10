"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionToString = void 0;
const Operator_1 = require("../ThanhPhanOperators/Operator");
const Helper_1 = require("./Helper");
function ExpressionToString(P) {
    if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(P)) {
        if (P.id === '0')
            return 'FALSE';
        if (P.id === '1')
            return 'TRUE';
        return P.id;
    }
    if (P.operator.id === Operator_1.Operts.Type.PHU_DINH) {
        if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(P.childs[0]))
            return P.operator.symbol + ExpressionToString(P.childs[0]);
        return P.operator.symbol + `(${ExpressionToString(P.childs[0])})`;
    }
    let str = '';
    for (let i = 0; i < P.childs.length; i++) {
        if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(P.childs[i]))
            str += P.childs[i].id;
        else if ((P.childs[i].operator.id === Operator_1.Operts.Type.PHU_DINH))
            str += `${ExpressionToString(P.childs[i])}`;
        else
            str += `(${ExpressionToString(P.childs[i])})`;
        if (i !== P.childs.length - 1)
            str += P.operator.symbol;
    }
    return str;
}
exports.ExpressionToString = ExpressionToString;
