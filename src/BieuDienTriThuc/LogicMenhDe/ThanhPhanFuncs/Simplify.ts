import { BaiTap } from '../../BaiTap/BaiTap';
import { StringToExpression } from './ChuyenStringThanhBieuThuc';
import { Expression } from '../ThanhPhanC/Expression';
import { EquivalentRule } from '../ThanhPhanRules/EquavilentRule';
import { ExpressionHelper } from './Helper';
import { ExpressionToString } from './ExpressionToString';
import { Operts } from '../ThanhPhanOperators/Operator';
export class Simplify extends BaiTap{
    private myPackage:Package=new Package(-1);
    private rules:EquivalentRule.ManagerRulesForSimlify=new EquivalentRule.ManagerRulesForSimlify(); 
    private result:Transformation[]=[];
    private tradingList :Package[]=[];
    private startIndex = 0;
    giai(deBai?: string) {
        if(deBai)  
        this.myPackage = new Package(-1,StringToExpression(deBai));
        console.log(ExpressionToString(this.myPackage.exp));

        // let trans= this.rules.run(this.myPackage.exp,10,11);
        // if(trans!==null)   
        // console.log('AP DUNG: '+trans.rule.name+' , KQ: '+ExpressionToString(trans.exp));

        this.run(this.myPackage);
        console.log('\n===========\nFINAL:')
        this.result.forEach(e=>{
            console.log('LUAT: '+e.rule.name + ' , EXP: '+ExpressionToString(e.Exp()));
        })
        

    }

    private run(package_:Package,deep?:number): Package {
        //// BIEN MENH DE THI XUAT RA LUON
        if (ExpressionHelper.Helper.isPrimeOrConstant(package_.exp) ||
            (package_.exp.operator.id === Operts.Type.PHU_DINH && ExpressionHelper.Helper.isPrimeOrConstant(package_.exp.childs[0])))
            return package_;
        /// THEM BIEU THUC HIEN TAI VAO DANH SACH TRUY VET
        this.tradingList.push(package_);

        /// QUA TRINH RUT GON DUNG LAI KHI BIEU THUC EXP KHONG THAY DOI 
        /// LUU GIU ID CU CUA EXP
        let rollBack = ExpressionHelper.Helper.copy(package_.exp);
        console.log('EXP: '+ExpressionToString(package_.exp));
        let id_exp: string = '';
        let count = 1;        

        /// VI TRI BAT DAU CHO CAC BUOC CHUYEN DOI TRUNG GIAN
        // let start:number= this.result.length-1<0?0:this.result.length-1;
        let start:number = this.result.length;
        this.startIndex  = start; 
        do {
            id_exp = this.tradingList[this.getSizeTradingList()-1].exp.id;

            // //// AP DUNG CAC LUAT RUT GON DON GIAN
            // this.tradingList[this.getSizeTradingList()-1].exp = this.simplify();
           
            // ///  LUU LAI KET QUA TOT NHAT
            // if(ExpressionHelper.Helper.Length(rollBack) > ExpressionHelper.Helper.Length(package_.exp)){
            //     rollBack = ExpressionHelper.Helper.copy(this.tradingList[this.tradingList.length-1].exp);
            //     start = this.result.length;
            // }

            //// RUT GON CAC BIEU THUC CON
            this.tradingList[this.tradingList.length-1].exp = this.simplifyChilds();
            this.startIndex  = this.result.length-1<0?0:this.result.length-1;

            //// RUT GON LAN CUOI
            this.tradingList[this.tradingList.length-1].exp = this.simplify();
            if(ExpressionHelper.Helper.Length(rollBack) > ExpressionHelper.Helper.Length(this.tradingList[this.tradingList.length-1].exp)){
                break;
            }
            else {
                count--;
                if(count<=0){
                    this.tradingList[this.tradingList.length-1].exp = rollBack;
                    if(this.result.length-start>0)
                    this.result.splice(start,this.result.length-start);
                    break;
                }
            }
            
        }
        while (id_exp !== this.tradingList[this.tradingList.length-1].exp.id&& count>0);
        let clone = this.tradingList[this.tradingList.length-1].clone();
        this.tradingList.splice(this.tradingList.length-1,1);
        return clone;
    }
    private simplify():Expression{
        let trans: Transformation | null = null;
        let helper = ExpressionHelper.Helper;
        let rollback = helper.copy(this.tradingList[this.getSizeTradingList()-1].exp);
        let start = this.result.length;
        let MAX_COUNT = 3;
        let count     = MAX_COUNT;
        let count_PHANPHOI = 2;
        console.log('\nSIMPLIFY: '+ExpressionToString(this.tradingList[this.getSizeTradingList()-1].exp));
        while (count_PHANPHOI>0) {
            trans = this.rules.run(this.tradingList[this.tradingList.length-1].exp);
            if(trans === null)break;
            if(trans.rule.id === 10)count_PHANPHOI--;
            else count_PHANPHOI=2;
            
            let child = this.visitChilds(3);
            if (child.pack.length > 0 && helper.Length(trans.exp) > helper.Length(child.rs)) {
                this.result = this.result.concat(child.pack);
                this.tradingList[this.getSizeTradingList() - 1].exp = child.rs;
            } else {

                // console.log(`LUAT: ${trans.rule.name}  EXP: ${ExpressionToString(trans.exp)}`);
                this.tradingList[this.getSizeTradingList() - 1].exp = trans.exp;
                this.result.push(this.recordTransfomation(trans.rule));
            }

            if (helper.Length(rollback) > helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp)
            && this.transfomationIsValid(this.result,this.tradingList[this.getSizeTradingList() - 1].exp,this.startIndex)) {
                rollback = helper.copy(this.tradingList[this.getSizeTradingList() - 1].exp);
                start = this.result.length;
                count =MAX_COUNT;
            }else{
          
                let predict_Exp = this.predict_k_times(3);
                if (predict_Exp.pack.length ===0|| helper.Length(rollback) < helper.Length(predict_Exp.rs) 
                || !this.transfomationIsValid(this.result,predict_Exp.rs,this.startIndex)) break;
                // console.log('\n======PREDICT: '+ExpressionToString(predict_Exp.rs))

                rollback = helper.copy(predict_Exp.rs);
                this.result = this.result.concat(predict_Exp.pack);
                this.tradingList[this.getSizeTradingList()-1].exp = predict_Exp.rs;
                start = this.result.length;
                count = MAX_COUNT;
                count_PHANPHOI = 2;
            
            }
        }
        if(helper.Length(rollback) < helper.Length(this.tradingList[this.getSizeTradingList()-1].exp)){
            this.tradingList[this.getSizeTradingList()-1].exp = rollback;
            if(this.result.length!==0 && this.result.length-start>0)
            this.result.splice(start,this.result.length-start);
        }
        // console.log('THE LIST RUSULT: ');
        // this.result.forEach(e=>{
        //     console.log('LUAT: '+e.rule.name + ' , EXP: '+ExpressionToString(e.Exp()));
        // })  ;

        console.log('\n====>END SIMPFILY: '+ExpressionToString(this.tradingList[this.getSizeTradingList()-1].exp));
        return this.tradingList[this.getSizeTradingList()-1].exp;
    }
    private predict_k_times(deep:number):{pack:Transformation[],rs:Expression}{
        if (deep<0||ExpressionHelper.Helper.isPrimeOrConstant(this.tradingList[this.getSizeTradingList()-1].exp) ||
        (this.tradingList[this.getSizeTradingList()-1].exp.operator.id === Operts.Type.PHU_DINH 
        && ExpressionHelper.Helper.isPrimeOrConstant(this.tradingList[this.getSizeTradingList()-1].exp.childs[0])))
        return {pack:[],rs:new Expression};
        
        let helper=ExpressionHelper.Helper;
        let clone =this.tradingList[this.getSizeTradingList()-1].clone();
        let result:{pack:Transformation[],rs:Expression} = {pack:[],rs:new Expression};
        let MAX_COUNT = 3;
        let count     = MAX_COUNT;
        let rollback = helper.copy(this.tradingList[this.getSizeTradingList()-1].exp);
        let start = 0;
        let MAX_LENGHT = 2.5;
        // console.log('========\nCHECK '+ExpressionToString(this.tradingList[this.getSizeTradingList()-1].exp) );
        while(true){
            let trans:Transformation|null = this.rules.run(this.tradingList[this.getSizeTradingList()-1].exp);
            if(trans===null)break;
            let child = this.visitChilds(deep-1);
            if(child.pack.length>0&&helper.Length(trans.exp) > helper.Length(child.rs)){
                result.pack = result.pack.concat(child.pack);
                this.tradingList[this.getSizeTradingList() - 1].exp = child.rs;
            } else {
                // console.log(`LUAT: ${trans.rule.name}  EXP: ${ExpressionToString(trans.exp)}`);
                this.tradingList[this.getSizeTradingList() - 1].exp = trans.exp;
                result.pack.push(this.recordTransfomation(trans.rule));
            }
            if ( helper.Length(rollback) > helper.Length(trans.exp)
                && this.transfomationIsValid(this.result,this.tradingList[this.getSizeTradingList() - 1].exp,this.startIndex)){
                count = MAX_COUNT;
                rollback = helper.copy(this.tradingList[this.getSizeTradingList()-1].exp);
                start = result.pack.length;
            }else{
                if(helper.Length( this.tradingList[this.getSizeTradingList()-1].exp) >= 
                helper.Length(rollback)+MAX_LENGHT)break;
                count--;
                if(count<=0)break;
            }
        }
        if (result.pack.length !== 0) {
            if (helper.Length(rollback) < helper.Length(this.tradingList[this.getSizeTradingList() - 1].exp)
                || !this.transfomationIsValid(this.result, this.tradingList[this.getSizeTradingList() - 1].exp, this.startIndex)) {
                this.tradingList[this.getSizeTradingList() - 1].exp = rollback;
                result.pack.splice(start, result.pack.length - start);
            }
        }
        result.rs = this.tradingList[this.getSizeTradingList() - 1].exp;
        this.tradingList[this.getSizeTradingList() - 1] = clone;
        // console.log('RETURN CHECKER : '+ExpressionToString(result.rs));
        return result;
    } 
    private visitChilds(deep:number):{pack:Transformation[],rs:Expression}{
        let result:{pack:Transformation[],rs:Expression}={pack:[],rs:new Expression};
        if(deep<0)return result; 
        let clone = this.tradingList[this.getSizeTradingList()-1].clone();
        
        // console.log('\nCHILDS: '+ExpressionToString(this.tradingList[this.getSizeTradingList()-1].exp));
        let currentPackage = this.tradingList[this.getSizeTradingList()-1];
        for (let i = 0; i < currentPackage.exp.childs.length; i++) {
            this.tradingList.push(new Package(i,currentPackage.exp.childs[i]));
            let k:{pack:Transformation[],rs:Expression}=this.predict_k_times(deep);
            if(k.pack.length !== 0 && ExpressionHelper.Helper.Length(k.rs) 
                < ExpressionHelper.Helper.Length(currentPackage.exp.childs[i])) {
                if (this.transfomationIsValid(this.result, k.rs, this.startIndex)) {
                    result.pack = result.pack.concat(k.pack);
                    currentPackage.exp.setChildAt(i, k.rs);
                    
                }
            }
            this.tradingList.splice(this.tradingList.length-1,1);
        }

        result.rs = this.tradingList[this.getSizeTradingList()-1].exp;
        // console.log(`RETURN ${ExpressionToString(result.rs)} \nEND CHILD`);
        
        this.tradingList[this.getSizeTradingList()-1] = clone;
        return result;
    }


    private simplifyChilds(deep?:number):Expression{
        // console.log('TRC SIMPL CHILD: '+ExpressionToString(package_.exp));
        let helper = ExpressionHelper.Helper;
        let currentPackage = this.tradingList[this.getSizeTradingList()-1];
        for (let i = 0; i < currentPackage.exp.childs.length; i++) {
            let beginIndex = this.result.length;
            let child:Expression = this.run(new Package(i,currentPackage.exp.childs[i])).exp;
            // console.log(`child ${i}: ${ExpressionToString(child)}`);
            // if(!this.transfomationIsValid(this.result,child,this.startIndex))continue;
            if(helper.Length(child) < helper.Length(currentPackage.exp.childs[i])){
                currentPackage.exp.setChildAt(i,child);
            }else{
                if(this.result.length-beginIndex!==0)
                this.result.splice(beginIndex,this.result.length-beginIndex);
            }
        }
        return currentPackage.exp;
    }


   
    /// THAY THE exp1 BANG exp2, DONG THOI CAP NHAT PARENT exp1 
    private recordTransfomation(r:EquivalentRule.Rule):Transformation{
        let helper = ExpressionHelper.Helper;
        
        let result:Transformation =new Transformation(r);
        result.oldEXP = helper.copy(this.tradingList[this.getSizeTradingList()-1].exp);
        for (let i = 0; i < this.tradingList.length; i++) {
            result.detail.push(this.tradingList[i].clone());
        }

        // console.log('RESULT: '+ExpressionToString(result.Exp())); 
        return result;
    }

    /// CHECK TRANSFOMATION IS VALID
    private transfomationIsValid(trans:Transformation[],currentStep:Expression,begin:number):boolean{
        if(trans.length===0)return true;
          
        /// LIST RESULT
        
        // console.log("\n=====LIST RESULT:");
        // console.log("CURRENT:"+ExpressionToString(currentStep));
        
        for (let i = begin; i < trans.length; i++){
            let exp = trans[i].oldEXP;
            if(exp.id === currentStep.id || exp.id.includes(currentStep.id))return false;
        }

        // for (let i = 0; i < this.result.length; i++) {
        //     if(this.result[i].detail[this.result[i].detail.length-1].exp.id === currentStep.id)return false;
        // }

        
        // console.log('====>END CHECK VALID TRANSFOMATION');
        
        return true;
    }
    getSizeTradingList():number{
        return this.tradingList.length;
    }

}

 class Package{
    public exp:Expression=new Expression();
    public indexInParent:number = 0;
    constructor(indexInParent:number,exp?:Expression){
        if(exp)
       this.exp = exp;
       this.indexInParent = indexInParent;
    }
    clone():Package{
        return new Package(this.indexInParent,ExpressionHelper.Helper.copy(this.exp))
    }
}

export class Transformation {
    public rule: EquivalentRule.Rule;
    public exp:Expression;
    //// BIEU THUC TRUOC DO DUOC CHUYEN DOI;
    public detail:Package[]=[];
    public oldEXP :Expression=new Expression();
    constructor(rule: EquivalentRule.Rule,exp?:Expression) {
        this.rule = rule;
        if(exp)
        this.exp = exp;
        else  this.exp = new Expression();
    }

    Exp():Expression{
        if(this.detail.length===1)return this.detail[0].exp;
        let exp:Package = this.detail[this.detail.length-1];
        for (let i = this.detail.length-2; i >= 0; i--) {
            this.detail[i].exp.setChildAt(exp.indexInParent,exp.exp);
            exp = this.detail[i];
        }
        return exp.exp;
    }
}