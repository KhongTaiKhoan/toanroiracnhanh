"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultSimplification = exports.Transformation = exports.Package = exports.Simplify = void 0;
const BaiTap_1 = require("../../BaiTap/BaiTap");
const ChuyenStringThanhBieuThuc_1 = require("./ChuyenStringThanhBieuThuc");
const Expression_1 = require("../ThanhPhanC/Expression");
const Helper_1 = require("./Helper");
const Operator_1 = require("../ThanhPhanOperators/Operator");
const ExpressionRule_1 = require("../ThanhPhanRules/ExpressionRule");
class Simplify extends BaiTap_1.BaiTap {
    constructor() {
        // sim.giai('((p\u2192q)\u2228r)\u2192(\u00ACq\u2192r)');
        // sim.giai('((x\u2192y)\u2227(y\u2192z))\u2192(y\u2192z)');
        // sim.giai('\u00AC(a\u2227b)\u2227(\u00ACa\u2228b)\u2227\u00ACb');
        // sim.giai('(x∧(x→y))→y');
        // sim.giai('x→(y→z)');
        // sim.giai('(x→y)∧(x→z)');
        // sim.giai('¬(x∨y)∨(¬x∧y)∨¬y');
        // sim.giai('(p→r)→((q→r)→((p∨q)→r))');
        // sim.giai('(¬x∧(x∨y))→y');
        // sim.giai('(p→(p∧r))∨¬((q∨r)→q)');
        // sim.giai('(p→q)∧(¬q∧(r∨¬q))');
        // sim.giai('((¬p∧p)∨(q∧¬p))→q');
        // sim.giai(' ((p∨q)∧(p∨¬q))∨q ');
        // sim.giai('p∨q∨(¬p∧¬q∧r)');
        super(...arguments);
        this.myPackage = new Package(-1);
        this.rules = new ExpressionRule_1.EquivalentRules.ManagerEquavilentRules();
        this.result = [];
        this.tradingList = [];
        this.startIndex = 0;
        this.org = new Expression_1.Expression;
    }
    giai(deBai) {
        if (deBai)
            this.myPackage = new Package(-1, ChuyenStringThanhBieuThuc_1.StringToExpression(deBai));
        this.org = Helper_1.ExpressionHelper.Helper.copy(this.myPackage.exp);
        // console.log(ExpressionToString(this.myPackage.exp));
        // let trans= this.rules.apply(this.myPackage.exp,9,10);
        // if(trans!==null)   
        // console.log('AP DUNG: '+trans.rule.name+' , KQ: '+ExpressionToString(trans.exp));
        this.run(this.myPackage);
        // console.log('\n===========\MENH DE: '+ExpressionToString(this.org));
        // this.result.forEach(e=>{
        //     console.log('LUAT: '+e.rule.name + ' , EXP: '+ExpressionToString(e.Exp()));
        // })
        return new ResultSimplification(this.org, this.result);
    }
    run(package_, deep) {
        //// BIEN MENH DE THI XUAT RA LUON
        if (Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(package_.exp) ||
            (package_.exp.operator.id === Operator_1.Operts.Type.PHU_DINH && Helper_1.ExpressionHelper.Helper.isPrimeOrConstant(package_.exp.childs[0])))
            return package_;
        /// THEM BIEU THUC HIEN TAI VAO DANH SACH TRUY VET
        this.tradingList.push(package_);
        /// QUA TRINH RUT GON DUNG LAI KHI BIEU THUC EXP KHONG THAY DOI 
        /// LUU GIU ID CU CUA EXP
        let rollBack = Helper_1.ExpressionHelper.Helper.copy(package_.exp);
        // console.log('EXP: '+ExpressionToString(package_.exp));
        let id_exp = '';
        let count = 1;
        /// VI TRI BAT DAU CHO CAC BUOC CHUYEN DOI TRUNG GIAN
        // let start:number= this.result.length-1<0?0:this.result.length-1;
        let start = this.result.length;
        this.startIndex = start;
        do {
            id_exp = this.tradingList[this.getSizeTradingList() - 1].exp.id;
            // AP DUNG CAC LUAT RUT GON DON GIAN
            this.tradingList[this.getSizeTradingList() - 1].exp = this.simplify();
            ///  LUU LAI KET QUA TOT NHAT
            if (Helper_1.ExpressionHelper.Helper.Length(rollBack) > Helper_1.ExpressionHelper.Helper.Length(package_.exp)) {
                rollBack = Helper_1.ExpressionHelper.Helper.copy(this.tradingList[this.tradingList.length - 1].exp);
                start = this.result.length;
            }
            // //// RUT GON CAC BIEU THUC CON
            // this.tradingList[this.tradingList.length-1].exp = this.simplifyChilds();
            // this.startIndex  = this.result.length-1<0?0:this.result.length-1;
            // //// RUT GON LAN CUOI
            // this.tradingList[this.tradingList.length-1].exp = this.simplify();
            // if(ExpressionHelper.Helper.Length(rollBack) > ExpressionHelper.Helper.Length(this.tradingList[this.tradingList.length-1].exp)){
            //     break;
            // }
            // else {
            //     count--;
            //     if(count<=0){
            //         this.tradingList[this.tradingList.length-1].exp = rollBack;
            //         if(this.result.length-start>0)
            //         this.result.splice(start,this.result.length-start);
            //         break;
            //     }
            // }
        } while (id_exp !== this.tradingList[this.tradingList.length - 1].exp.id && count > 0);
        let clone = this.tradingList[this.tradingList.length - 1].clone();
        this.tradingList.splice(this.tradingList.length - 1, 1);
        return clone;
    }
    simplify() {
        let helper = Helper_1.ExpressionHelper.Helper;
        let rollback = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        let start = this.result.length;
        let MAX_COUNT = 10;
        let count = MAX_COUNT;
        let m_length = 2;
        let length = helper.Length(rollback);
        while (true) {
            // console.log('\nSIMPLIFY: ' + ExpressionToString(this.tradingList[this.getSizeTradingList() - 1].exp));
            let child_length = 100;
            let rollback_length = 100;
            let local_length = 0;
            if (helper.laTuDon(this.tradingList[this.tradingList.length - 1].exp))
                break;
            /// DUYET BFS
            let bfs = this.BFS();
            /// DUYET DFS
            let child = this.visitChilds(4);
            if (bfs.pack.length > 0) {
                let r = new Transformation(bfs.pack[bfs.pack.length - 1].rule, bfs.rs);
                r.exp = bfs.rs;
                rollback_length = this.danhGiaTransfomation(r);
            }
            // console.log('END BFS 1: ' + ExpressionToString(bfs.rs));
            if (child.pack.length > 0) {
                let r = new Transformation(child.pack[child.pack.length - 1].rule, child.rs);
                r.exp = child.rs;
                child_length = this.danhGiaTransfomation(r);
            }
            // console.log('END VISIT CHILDS 1: '+ExpressionToString(child.rs));
            if (bfs.pack.length <= 0 && child.pack.length <= 0)
                break;
            // console.log('CHILDS LENGTH:' + child_length);
            // console.log('ROLLBACK LENGTH:' + rollback_length);
            if (rollback_length > child_length) {
                this.result = this.result.concat(child.pack);
                this.tradingList[this.getSizeTradingList() - 1].exp = child.rs;
                local_length = child_length;
            }
            else {
                this.result = this.result.concat(bfs.pack);
                this.tradingList[this.getSizeTradingList() - 1].exp = bfs.rs;
                local_length = rollback_length;
            }
            if (bfs.pack.length !== 0) {
                //  console.log(`LUAT: ${trans.rule.name}  EXP: ${ExpressionToString(trans.exp)} ACTIVE: ${trans.rule.active}`);
                // console.log('END VISIT: ' + ExpressionToString(child.rs) + ' LENGTH: ' + child_length);
                // console.log('END TRANS: ' + ExpressionToString(bfs.rs) + ' LENGTH: ' + rollback_length);
            }
            //if (helper.Length(rollback) > helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp)) {
            // console.log('THE LIST RUSULT: ');
            // this.result.forEach(e => {
            //     console.log('LUAT: ' + e.rule.name + ' , EXP: ' + ExpressionToString(e.Exp()));
            // });
            if (local_length < length) {
                // && this.transfomationIsValid(this.result,this.tradingList[this.getSizeTradingList() - 1].exp,this.startIndex)
                rollback = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
                start = this.result.length;
                count = MAX_COUNT;
                length = local_length;
                // console.log(' LENGTH: ' + length)
            }
            else {
                // console.log('VISIT CHILDS: ')
                let predict_Exp = this.predict_k_times(2);
                if (predict_Exp.pack.length === 0)
                    break;
                // console.log('\n======PREDICT: ' + ExpressionToString(predict_Exp.rs)
                //     + ` LENGTH PREDICT: ${this.danhGiaTransfomation(predict_Exp.pack[predict_Exp.pack.length - 1])} LENGTH ${length}`);
                if (predict_Exp.pack.length === 0 || this.danhGiaTransfomation(predict_Exp.pack[predict_Exp.pack.length - 1]) > length) {
                    rollback = helper.copy(predict_Exp.rs);
                    this.result = this.result.concat(predict_Exp.pack);
                    this.tradingList[this.getSizeTradingList() - 1].exp = predict_Exp.rs;
                    start = this.result.length;
                    length = this.danhGiaTransfomation(predict_Exp.pack[predict_Exp.pack.length - 1]);
                }
                let temp = this.tradingList[this.getSizeTradingList() - 1].exp;
                this.tradingList[this.getSizeTradingList() - 1].exp = predict_Exp.rs;
                let BFS_2 = this.BFS(2);
                this.tradingList[this.getSizeTradingList() - 1].exp = temp;
                if (BFS_2.pack.length === 0 || this.danhGiaTransfomation(BFS_2.pack[BFS_2.pack.length - 1]) > length)
                    break;
                rollback = helper.copy(BFS_2.rs);
                this.result = this.result.concat(BFS_2.pack);
                this.tradingList[this.getSizeTradingList() - 1].exp = BFS_2.rs;
                start = this.result.length;
                count--;
                if (count < 0)
                    break;
            }
        }
        if (helper.Length(rollback) < helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp)) {
            this.tradingList[this.getSizeTradingList() - 1].exp = rollback;
            if (this.result.length !== 0 && this.result.length - start > 0)
                this.result.splice(start, this.result.length - start);
        }
        // console.log('THE LIST RUSULT: ');
        // this.result.forEach(e=>{
        //     console.log('LUAT: '+e.rule.name + ' , EXP: '+ExpressionToString(e.Exp()));
        // })  ;
        // console.log('\n====>END SIMPFILY: ' + ExpressionToString(this.tradingList[this.getSizeTradingList() - 1].exp));
        return this.tradingList[this.getSizeTradingList() - 1].exp;
    }
    predict_k_times(deep, loopUntilNone) {
        let helper = Helper_1.ExpressionHelper.Helper;
        if (deep < 0 || helper.laTuDon(this.tradingList[this.getSizeTradingList() - 1].exp))
            return new InformationSimplify([], this.tradingList[this.getSizeTradingList() - 1].exp);
        let clone = this.tradingList[this.getSizeTradingList() - 1].clone();
        let result = new InformationSimplify([], new Expression_1.Expression());
        let MAX_COUNT = 3;
        let count = MAX_COUNT;
        let rollback = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        let start = 0;
        let length = helper.Length(rollback);
        let fa = 2;
        while (true) {
            if (helper.laTuDon(this.tradingList[this.getSizeTradingList() - 1].exp))
                break;
            let choice = new InformationSimplify([], new Expression_1.Expression());
            // console.log('========\nCHECK ' + ExpressionToString(this.tradingList[this.getSizeTradingList() - 1].exp) + ' DEEP' + deep);
            let rs = this.rules.apply(this.tradingList[this.tradingList.length - 1].exp);
            let e = [];
            let childs = this.visitChilds(deep - 1);
            // console.log(`SAU KHI CHILDS: ${ExpressionToString(this.tradingList[this.tradingList.length-1].exp)}`);
            let local_length = 0;
            if (rs !== null) {
                if (rs.rule.id !== 10 || (rs.rule.active !== 0 && rs.rule.id === 10) ||
                    (rs.rule.id === 10 && helper.Length(rs.exp) <= helper.Length(clone.exp) + fa)) {
                    // console.log(`RULE: ${rs.rule.name}  EXP: ${ExpressionToString(rs.exp)}`);
                    let temp = this.tradingList[this.tradingList.length - 1].exp;
                    this.tradingList[this.tradingList.length - 1].exp = rs.exp;
                    let trans = this.recordTransfomation(rs.rule);
                    // console.log(`LUAT: `+rs.rule.name +" : "+ ExpressionToString(rs.exp));
                    e.push(trans);
                    e[e.length - 1].exp = rs.exp;
                    this.tradingList[this.tradingList.length - 1].exp = temp;
                    // console.log(`SAU TRANS ${ExpressionToString(this.tradingList[this.tradingList.length-1].exp)}`);
                    // console.log(`TAP TRANS: ${e[0].rule.name}  EXP: ${ExpressionToString(e[0].Exp())}`);
                }
            }
            if (e.length !== 0 && childs.pack.length !== 0) {
                //choice = helper.Length(e[e.length-1].exp)<helper.Length(childs.rs)?{pack:e,rs:e[0].exp}:childs;
                // choice = this.compareBFS_DFS(e[e.length-1],childs)<0?{pack:e,rs:e[0].exp}:childs;
                choice = this.danhGiaTransfomation(e[e.length - 1]) < this.danhGiaTransfomation(childs.pack[childs.pack.length - 1]) ? { pack: e, rs: e[0].exp } : childs;
            }
            else if (e.length === 0 && childs.pack.length !== 0) {
                choice = childs;
            }
            else if (e.length !== 0 && childs.pack.length === 0) {
                choice = { pack: e, rs: e[0].exp };
            }
            // console.log('CHILD EXP:' + ExpressionToString(choice.rs))
            if (choice.pack.length === 0)
                break;
            // console.log(`CHOICE PRIDECATE: ${ExpressionToString(choice.rs)} COUNT ${count}`);
            local_length = this.danhGiaTransfomation(choice.pack[choice.pack.length - 1]);
            this.tradingList[this.tradingList.length - 1].exp = choice.rs;
            result.pack = result.pack.concat(choice.pack);
            // if(helper.Length(this.tradingList[this.tradingList.length-1].exp) < helper.Length(clone.exp)){
            if (local_length < length) {
                rollback = this.tradingList[this.tradingList.length - 1].exp;
                start = result.pack.length;
                length = local_length;
                if (!loopUntilNone)
                    break;
            }
            else {
                count--;
                if (count <= 0) {
                    this.tradingList[this.getSizeTradingList() - 1].exp = rollback;
                    result.pack = [];
                    result.rs = rollback;
                    break;
                }
            }
        }
        // if (result.pack.length !== 0) {
        //     if (helper.Length(rollback) < helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp)
        //         || !this.transfomationIsValid(this.result, this.tradingList[this.getSizeTradingList() - 1].exp, this.startIndex)) {
        //     }
        // }
        result.rs = this.tradingList[this.getSizeTradingList() - 1].exp;
        // console.log('LENGTH ' + result.pack.length + ' - RETURN CHECKER : ' + ExpressionToString(result.rs) + ' deep' + deep);
        this.tradingList[this.getSizeTradingList() - 1] = clone;
        return result;
    }
    visitChilds(deep) {
        let result = new InformationSimplify([], this.tradingList[this.getSizeTradingList() - 1].exp);
        if (deep < 0)
            return result;
        let clone = this.tradingList[this.getSizeTradingList() - 1].clone();
        // console.log('\nVISIT: ' + this.tradingList[this.getSizeTradingList() - 1].exp.id + " LENGTH: " + this.tradingList[this.getSizeTradingList() - 1].exp.childs.length);//ExpressionToString(this.tradingList[this.getSizeTradingList()-1].exp));
        let currentPackage = this.tradingList[this.getSizeTradingList() - 1];
        for (let i = 0; i < currentPackage.exp.childs.length; i++) {
            let child_clone = Helper_1.ExpressionHelper.Helper.copy(currentPackage.exp.childs[i]);
            // console.log('CHILDS: ' + ExpressionToString(child_clone));
            this.tradingList.push(new Package(i, currentPackage.exp.childs[i]));
            let k = this.predict_k_times(deep);
            // if(ExpressionToString(k.rs) === 'TRUE∧(z∨y)') 
            //   console.log(currentPackage.exp.childs[i].id);                    
            if (k.pack.length !== 0 && Helper_1.ExpressionHelper.Helper.Length(k.rs)
                < Helper_1.ExpressionHelper.Helper.Length(child_clone)) {
                if (this.transfomationIsValid(this.result, k.rs, k.pack[k.pack.length - 1].rule, this.startIndex)) {
                    result.pack = result.pack.concat(k.pack);
                    currentPackage.exp.setChildAt(i, k.rs);
                }
            }
            this.tradingList.splice(this.tradingList.length - 1, 1);
        }
        result.rs = Helper_1.ExpressionHelper.Helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        // console.log(`LENGTH ${result.pack.length} RETURN ${ExpressionToString(result.rs)} END VISIT`);
        this.tradingList[this.getSizeTradingList() - 1] = clone;
        return result;
    }
    simplifyChilds(deep) {
        // console.log('TRC SIMPL CHILD: '+ExpressionToString(package_.exp));
        let helper = Helper_1.ExpressionHelper.Helper;
        let currentPackage = this.tradingList[this.getSizeTradingList() - 1];
        for (let i = 0; i < currentPackage.exp.childs.length; i++) {
            let beginIndex = this.result.length;
            let child = this.run(new Package(i, currentPackage.exp.childs[i])).exp;
            // console.log(`child ${i}: ${ExpressionToString(child)}`);
            // if(!this.transfomationIsValid(this.result,child,this.startIndex))continue;
            if (helper.Length(child) < helper.Length(currentPackage.exp.childs[i])) {
                currentPackage.exp.setChildAt(i, child);
            }
            else {
                if (this.result.length - beginIndex !== 0)
                    this.result.splice(beginIndex, this.result.length - beginIndex);
            }
        }
        return currentPackage.exp;
    }
    BFS(max) {
        let helper = Helper_1.ExpressionHelper.Helper;
        if (helper.laTuDon(this.tradingList[this.getSizeTradingList() - 1].exp))
            return new InformationSimplify([], this.tradingList[this.getSizeTradingList() - 1].exp);
        let clone = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        let rollback = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        let result = new InformationSimplify([], this.tradingList[this.getSizeTradingList() - 1].exp);
        let MAX = max ? max : 5;
        let start = 0;
        let length = helper.Length(clone);
        while (MAX >= 0) {
            let trans = this.rules.apply(this.tradingList[this.getSizeTradingList() - 1].exp);
            if (trans === null)
                break;
            this.tradingList[this.getSizeTradingList() - 1].exp = trans.exp;
            result.pack.push(this.recordTransfomation(trans.rule));
            // console.log('BFS: LUAT-' + trans.rule.name + '  EXP: ' + ExpressionToString(trans.exp));
            /// KICH BAN DUYET CON CUA NO: DIEU NAY LA BAT BUOC
            if (trans.rule.runChilds) {
                let countRunChilds = 3;
                while (countRunChilds > 0) {
                    let pack_ = this.predict_k_times(2);
                    if (pack_.pack.length === 0)
                        break;
                    this.tradingList[this.getSizeTradingList() - 1].exp = pack_.rs;
                    result.pack = result.pack.concat(pack_.pack);
                    start = result.pack.length;
                    countRunChilds--;
                }
                // console.log('SAU KHI RUN CHILDS: ' + ExpressionToString(this.tradingList[this.getSizeTradingList() - 1].exp))
            }
            result.pack[result.pack.length - 1].exp = this.tradingList[this.getSizeTradingList() - 1].exp;
            if (length > this.danhGiaTransfomation(result.pack[result.pack.length - 1])) {
                start++;
                length = helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp);
                rollback = this.tradingList[this.getSizeTradingList() - 1].exp;
            }
            MAX--;
        }
        if (length < helper.Length(this.tradingList[this.tradingList.length - 1].exp) && start < result.pack.length) {
            result.pack.splice(start, result.pack.length - start);
        }
        this.tradingList[this.getSizeTradingList() - 1].exp = rollback;
        result.rs = helper.copy(this.tradingList[this.tradingList.length - 1].exp);
        // result.pack.forEach(e => {
        //     console.log(`LUAT BFS: ${e.rule.name} - EXP: ${ExpressionToString(e.Exp())}`);
        // })
        // console.log('RETURN BFS: ' + ExpressionToString(result.rs))
        this.tradingList[this.getSizeTradingList() - 1].exp = clone;
        return result;
    }
    /// THAY THE exp1 BANG exp2, DONG THOI CAP NHAT PARENT exp1 
    recordTransfomation(r) {
        let helper = Helper_1.ExpressionHelper.Helper;
        let result = new Transformation(r);
        result.oldEXP = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
        for (let i = 0; i < this.tradingList.length; i++) {
            result.detail.push(this.tradingList[i].clone());
        }
        // console.log('RESULT: '+ExpressionToString(result.Exp())); 
        return result;
    }
    /// CHECK TRANSFOMATION IS VALID
    transfomationIsValid(trans, currentStep, r, begin) {
        if (trans.length === 0)
            return true;
        if (r.id <= 7)
            return true;
        /// LIST RESULT
        // console.log("\n=====LIST RESULT:");
        // console.log("CURRENT:"+ExpressionToString(currentStep));
        if (r.id <= 6)
            return true;
        for (let i = begin; i < trans.length; i++) {
            let exp = trans[i].oldEXP;
            if (exp.id === currentStep.id || exp.id.includes(currentStep.id))
                return false;
        }
        // for (let i = 0; i < this.result.length; i++) {
        //     if(this.result[i].detail[this.result[i].detail.length-1].exp.id === currentStep.id)return false;
        // }
        // console.log('====>END CHECK VALID TRANSFOMATION');
        return true;
    }
    getSizeTradingList() {
        return this.tradingList.length;
    }
    danhGiaTransfomation(trans) {
        // console.log(`Expression ${ExpressionToString(trans.exp)} ${ExpressionHelper.Helper.Length(trans.exp)} - ${trans.rule.active}`)
        return Helper_1.ExpressionHelper.Helper.Length(trans.exp) - trans.rule.active;
        // return ExpressionHelper.Helper.Length(trans.Exp()) - trans.rule.active;
    }
}
exports.Simplify = Simplify;
//// Class nam giu cac thong tin cua mot qua trinh trinh rut gon
class InformationSimplify {
    constructor(pack, rs) {
        this.pack = [];
        this.rs = new Expression_1.Expression();
        this.pack = pack;
        this.rs = rs;
    }
}
class Package {
    constructor(indexInParent, exp) {
        this.exp = new Expression_1.Expression();
        this.indexInParent = 0;
        if (exp)
            this.exp = exp;
        this.indexInParent = indexInParent;
    }
    clone() {
        return new Package(this.indexInParent, Helper_1.ExpressionHelper.Helper.copy(this.exp));
    }
}
exports.Package = Package;
class Transformation {
    constructor(rule, exp) {
        //// BIEU THUC TRUOC DO DUOC CHUYEN DOI;
        this.detail = [];
        this.oldEXP = new Expression_1.Expression();
        this.rule = rule;
        if (exp)
            this.exp = exp;
        else
            this.exp = new Expression_1.Expression();
    }
    Exp() {
        if (this.detail.length === 1)
            return this.detail[0].exp;
        let exp = this.detail[this.detail.length - 1];
        for (let i = this.detail.length - 2; i >= 0; i--) {
            this.detail[i].exp.setChildAt(exp.indexInParent, exp.exp);
            exp = this.detail[i];
        }
        return exp.exp;
    }
    clone() {
        let helper = Helper_1.ExpressionHelper.Helper;
        let r = this.rule;
        let exp_ = helper.copy(this.exp);
        let oldEXP_ = helper.copy(this.oldEXP);
        let pack = [];
        this.detail.forEach(e => {
            pack.push(e.clone());
        });
        let trans = new Transformation(r, exp_);
        trans.oldEXP = oldEXP_;
        trans.detail = pack;
        return trans;
    }
}
exports.Transformation = Transformation;
class ResultSimplification {
    constructor(exp, detail) {
        this.exp = exp;
        this.detail = detail;
    }
}
exports.ResultSimplification = ResultSimplification;
