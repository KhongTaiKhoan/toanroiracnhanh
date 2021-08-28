import {App} from "./core/App";
import * as config from "dotenv";
import { Expression } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanC/Expression';
import { StringToExpression } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { Simplify } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Simplify';
import { ExpressionHelper } from "./BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Helper";
import { ExpressionToString } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ExpressionToString';
import { OperatorFactory, Operts } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanOperators/Operator';
import { SimilarExpression } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/SimplarExpression';
import { Equivalence } from "./BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Equivalence";
import { Deduction } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Deduction';



config.config();
let port:Number  = Number( process.env.PORT) || 4300;


let app = new App(port);
app.run();

// let a = StringToExpression('q∨r∨(q∨r)');

// console.log(ExpressionHelper.Helper.contain2(a,p));
// let a = StringToExpression('¬(¬a)∨¬(¬b)∨(¬a∨¬b)');
// let simlar = new SimilarExpression().genarate(a,p);
// for (let i = 0; i < simlar.length; i++) {
//     console.log(ExpressionToString( simlar[i].exp));
//     console.log('--------------------');
// }



// let e1 = StringToExpression('q∨r');
// let e2 = StringToExpression('a∨¬a');
// let e3 = StringToExpression('a∨b∨b');

// let rs = new SimilarExpression().genarate(p, a);
// for (let i = 0; i < rs.length; i++) {
//     rs[i].pair.forEach(e =>
//         console.log(`${ExpressionToString(e[0])} == ${ExpressionToString(e[1])}`)
//     );
//     console.log(rs[i].exp.id)
//     console.log(a.id);
//     // console.log('RETURN: ' + ExpressionToString(new SimilarExpression().replace(rs[i], e3)));
//     console.log('-------∧--');
// }


