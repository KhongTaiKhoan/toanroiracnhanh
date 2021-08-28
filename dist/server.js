"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./core/App");
const config = __importStar(require("dotenv"));
config.config();
let port = Number(process.env.PORT) || 4300;
let app = new App_1.App(port);
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
