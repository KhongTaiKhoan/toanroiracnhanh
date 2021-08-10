import {App} from "./core/App";
import * as config from "dotenv";
import { Expression } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanC/Expression';
import { StringToExpression } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { Simplify } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Simplify';
import { ExpressionHelper } from "./BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Helper";
import { ExpressionToString } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ExpressionToString';
import { OperatorFactory, Operts } from './BieuDienTriThuc/LogicMenhDe/ThanhPhanOperators/Operator';



config.config();
let port:Number  = Number( process.env.PORT) || 4300;


let app = new App(port);
app.run();

// // let parent:Expression = StringToExpression('\u00AC(a\u2227b)\u2227(\u00ACa\u2228b)\u2227\u00ACb');
// // let x = new OperatorFactory().create(Operts.Type.HOI);
// // console.log(x.symbol);
// // console.log('\u2228');
// // console.log(ExpressionHelper.Helper.Length(StringToExpression('¬((p→q)∨r)')))
// // console.log(ExpressionHelper.Helper.Length(StringToExpression('¬(¬p∨q)∧¬r')))
// let sim:Simplify=new Simplify();
// // sim.giai('((p\u2192q)\u2228r)\u2192(\u00ACq\u2192r)');
// // sim.giai('((x\u2192y)\u2227(y\u2192z))\u2192(y\u2192z)');
// // sim.giai('\u00AC(a\u2227b)\u2227(\u00ACa\u2228b)\u2227\u00ACb');
// sim.giai('x\u2192(y\u2192z)');
