"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reasoning = exports.Deduction = void 0;
const BaiTap_1 = require("../../BaiTap/BaiTap");
const ChuyenStringThanhBieuThuc_1 = require("./ChuyenStringThanhBieuThuc");
const DeducetiveRules_1 = require("../ThanhPhanRules/DeducetiveRules");
const ExpressionToString_1 = require("./ExpressionToString");
const Helper_1 = require("./Helper");
const Operator_1 = require("../ThanhPhanOperators/Operator");
const Equivalence_1 = require("./Equivalence");
class Deduction extends BaiTap_1.BaiTap {
    constructor(GT, KL) {
        super();
        // let str= ['t→u','r→(s∨t)','(¬p∨q)→r','¬(s∨u)']; 
        // KL p
        //let str= ['p→q','r→(p∨s)','(t→p)→r','¬(q∨s)'];  
        // KL t
        this.GT = [];
        this.manager = new DeducetiveRules_1.DeducetiveRules.ManagerRules();
        this.reasoning = [];
        this.visited = []; /// MANG DANH DAU GT NAO DA DUOC DUYET;
        this.helper = Helper_1.ExpressionHelper.Helper;
        this.result = [];
        GT.forEach(e => { this.GT.push(ChuyenStringThanhBieuThuc_1.StringToExpression(e)); });
        this.KL = ChuyenStringThanhBieuThuc_1.StringToExpression(KL);
    }
    giai(deBai) {
        this.setDafaultGT();
        let valid = this.deduce();
        // let str = this.stringReasoning(this.reasoning);
        // str.forEach(e=>{console.log(e)});
        // console.log('\n==================\n');
        if (valid) {
            let index = this.reasoning.findIndex(e => { return e.exp.id === this.KL.id; });
            this.tradingResult(this.reasoning[index]);
            return this.result;
        }
        // str = this.stringReasoning(this.result);
        // str.forEach(e=>{console.log(e)});
        ///this.testing();
        return [];
    }
    /// DAT CAC  GIA THIET
    /// LUU Y CAC GIA THIET CO  PARENT = []
    setDafaultGT() {
        for (let i = 0; i < this.GT.length; i++) {
            this.reasoning.push(new Reasoning(i + 1, [], this.manager.rules[0], this.GT[i]));
        }
    }
    /// HAM HO TRO IN 1 REASONING GIUP VIEC DEBUG
    stringReasoning(re) {
        let s = [];
        re.forEach(e => {
            let str = `${e.id}. ${ExpressionToString_1.ExpressionToString(e.exp)} `;
            if (e.parent.length !== 0)
                str += `( ${e.rule.name} ${e.parent})`;
            else
                str += '(GIA THIET)';
            s.push(str);
        });
        return s;
    }
    deduce() {
        while (true) {
            /// DAU TIEN PHAI SAP XEP TAP GT
            this.sortGT();
            let listReasnoning = [];
            //    console.log('\n===GT:')
            //    this.GT.forEach(e=>{
            //     if(this.visited.findIndex(ele=>{return ele.id === e.id})===-1)
            //     console.log(ExpressionToString(e));
            //    });
            //    console.log('====END GT\n')
            for (let i = 0; i < this.GT.length; i++) {
                if (this.visited.findIndex(e => { return e.id === this.GT[i].id; }) !== -1)
                    continue;
                listReasnoning = this.manager.apply(this.GT[i], this.GT, this.visited);
                if (listReasnoning.length === 0)
                    continue;
                for (let i = 0; i < listReasnoning.length; i++) {
                    this.addReasoning(listReasnoning[i]);
                    /// NEU LA LUAT RUT GON THI THEM VAO
                    if (i < listReasnoning.length - 1 && listReasnoning[i].rule.id === DeducetiveRules_1.DeducetiveRules.DeducetiveRule.LUAT_RUT_GON) {
                        this.addGT(listReasnoning[i].exp);
                    }
                }
                /// CAP NHAT THEM GIA THIET; 
                this.addGT(listReasnoning[listReasnoning.length - 1].exp);
                /// DANH DAU GT[i] VUA DUOC DUYET
                this.visited.push(this.GT[i]);
                break;
            }
            if (this.isStop())
                return true;
            if (listReasnoning.length === 0)
                return false;
        }
        return false;
    }
    /// HAM ADD VAO GT
    addGT(exp) {
        if (this.GT.findIndex(e => { return e.id === exp.id; }) === -1)
            this.GT.push(exp);
    }
    /// HAM ADD CAC REASONING VAO TAP GT
    addReasoning(r) {
        if (this.reasoning.findIndex(e => { return e.exp.id === r.exp.id; }) === -1)
            this.reasoning.push(this.indentyReasoning(r));
    }
    ///   KIEM TRA DIEU KIEN DUNG KHI:
    /// - TIM THAY KL TRONG TAP GT;
    /// - KHONG THE SUY DIEN TIEP DUOC NUA
    isStop() {
        for (let i = 0; i < this.GT.length; i++) {
            /// NEU GT GIONG LUON VOI KL
            if (this.GT[i].id === this.KL.id)
                return true;
            /// NEU GT TUONG DUONG KL
            let equivalence = new Equivalence_1.Equivalence()
                .giai(`${ExpressionToString_1.ExpressionToString(this.GT[i])}\u2261${ExpressionToString_1.ExpressionToString(this.KL)}`);
            if (equivalence !== null) {
                let arr = [];
                for (let j = 0; j < equivalence.length; j++) {
                    let r;
                    if (j === 0)
                        r = new Reasoning(0, [this.GT[i]], equivalence[j].rule, equivalence[j].Exp());
                    else
                        r = new Reasoning(0, [equivalence[j - 1].Exp()], equivalence[j].rule, equivalence[j].Exp());
                    r = this.indentyReasoning(r);
                    arr.push(r);
                }
                this.reasoning = this.reasoning.concat(arr);
                return true;
            }
        }
        ///  
        if (!this.helper.laTuDon(this.KL)) {
            let parent = [];
            for (let i = 0; i < this.KL.childs.length; i++) {
                let child = this.KL.childs[i];
                let index = this.GT.findIndex(e => { return e.id === child.id; });
                if (index === -1)
                    return false;
                parent.push(child);
            }
            let reas = new Reasoning(0, parent, new DeducetiveRules_1.DeducetiveRules.LUAT_KET_HOP(), this.KL);
            this.reasoning.push(this.indentyReasoning(reas));
        }
        return false;
    }
    /// HAM XAC DINH CAC ID CUA REASONING HIEN TAI VA CAC PARNT ID CUA NO NAM TRONG TAP REASONING
    indentyReasoning(rs) {
        for (let i = 0; i < rs.expParent.length; i++) {
            let index = this.reasoning.findIndex(e => { return e.exp.id === rs.expParent[i].id; });
            if (index !== -1) {
                rs.parent.push(this.reasoning[index].id);
            }
        }
        //    rs.id = this.reasoning.reduce((acc,crrValue)=>{
        //        if(crrValue.id > acc) acc=crrValue.id;
        //        return acc;
        //    },-1) +1;
        rs.id = this.reasoning.length + 1;
        return rs;
    }
    testing() {
        console.log('GT: ');
        this.GT.forEach(e => { console.log(ExpressionToString_1.ExpressionToString(e)); });
        console.log('KL: ' + ExpressionToString_1.ExpressionToString(this.KL));
        console.log('-------------------');
        for (let i = 0; i < this.GT.length; i++) {
            let reasoning = this.manager.rules[0].apply(this.GT[i], this.GT, this.visited);
            if (reasoning.length !== 0) {
                reasoning.forEach(e => {
                    console.log(`LUAT: ${e.rule.name} EXP: ${ExpressionToString_1.ExpressionToString(e.exp)} [${e.id}]`);
                });
                break;
            }
        }
    }
    sortGT() {
        ///   TA RA MOT CAU TRUC BAO GOM:
        /// - INDEX: la vi tri ban dau cua bieu thuc
        /// - SCORE: diem cua expression, duoc tinh theo tieu chi cang giong ket luan cang diem cao
        /// - EXP: expression hien tai;
        let arr = [];
        /// khoi tao mang cau truc
        for (let i = 0; i < this.GT.length; i++) {
            let score = this.scoreGT(this.GT[i]);
            arr.push({ index: i, score: score, exp: this.GT[i] });
        }
        /// TIEN HANH SORT
        arr.sort((a, b) => {
            if (a.score > b.score)
                return -1;
            if (a.score < b.score)
                return 1;
            return 0;
        });
        /// GANG LAI TAP GT VUA SAP XEP CHO GT GOC;
        this.GT = [];
        for (let i = 0; i < arr.length; i++) {
            this.GT.push(arr[i].exp);
        }
    }
    /// GIA THIET CANG GIONG KL SE DUOC DAT LEN DAU
    scoreGT(exp) {
        /// TAI DAY DINH NGHIA RA CAC TRONG SO:
        //  - TRONG SO VOI TOAN TU
        //  - TRONG SO VOI BIEU THUC CON
        let OPERATOR_SCORE = 0.5;
        let SUB_EXPRESSION_SCORE = 1;
        let S_SCORE = .2;
        if (this.helper.laTuDon(exp))
            return -1;
        let score = 0;
        score += exp.operator.id !== Operator_1.Operts.Type.KEO_THEO ? S_SCORE : 0;
        if (exp.operator.id === Operator_1.Operts.Type.PHU_DINH)
            exp = exp.childs[0];
        if (this.helper.laTuDon(this.KL)) {
            for (let i = 0; i < exp.childs.length; i++) {
                if (exp.childs[i].id === this.KL.id)
                    score += SUB_EXPRESSION_SCORE;
            }
        }
        else
            for (let i = 0; i < this.KL.childs.length; i++) {
                let index = exp.childs.findIndex(e => { return e.id === this.KL.childs[i].id; });
                if (index !== -1)
                    score += SUB_EXPRESSION_SCORE;
            }
        return score;
    }
    /// TRUY VET LOI GIAI TU TAP REASONING
    tradingResult(crrReasoning) {
        let crrRea_Id = 0;
        let crrRea_IdParents = [];
        for (let i = 0; i < crrReasoning.expParent.length; i++) {
            /// NEU parent hien tai co trong tap result thi chi can lay id no ra
            if (this.result.findIndex(e => { return e.exp.id === crrReasoning.expParent[i].id; }) !== -1) {
                crrRea_IdParents.push(crrReasoning.parent[i]);
            }
            /// con khong thi truy vet tiep
            else {
                let index = this.reasoning.findIndex(e => { return e.exp.id === crrReasoning.expParent[i].id; });
                let par = this.tradingResult(this.reasoning[index]);
                crrRea_IdParents.push(par.id);
            }
        }
        crrRea_Id = this.result.length + 1;
        crrReasoning.parent = crrRea_IdParents;
        crrReasoning.id = crrRea_Id;
        this.result.push(crrReasoning);
        return crrReasoning;
    }
}
exports.Deduction = Deduction;
class Reasoning {
    constructor(id, expParent, rule, exp) {
        this._idParent = [];
        this._id = id;
        this._expParent = expParent;
        this._rule = rule;
        this._exp = exp;
    }
    //#region  GETTER AND SETTER
    get exp() {
        return this._exp;
    }
    set exp(value) {
        this._exp = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get parent() {
        return this._idParent;
    }
    set parent(value) {
        this._idParent = value;
    }
    get rule() {
        return this._rule;
    }
    set rule(value) {
        this._rule = value;
    }
    get expParent() {
        return this._expParent;
    }
    set expParent(value) {
        this._expParent = value;
    }
}
exports.Reasoning = Reasoning;
