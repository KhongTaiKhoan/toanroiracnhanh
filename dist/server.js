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
