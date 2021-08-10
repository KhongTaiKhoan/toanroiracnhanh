import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
import { Operator, OperatorFactory, Operts } from '../ThanhPhanOperators/Operator';
export class Expression{
    private _id: string = '';
    private _value: boolean | null = null;
    private _childs: Expression[] = [];
    private _parent: Expression | null = null;
    private _primes: Expression[] = [];
    private _operator: Operator = new OperatorFactory().create(Operts.Type.NONE);
   
    static CONSTANT:number = 0;
    static PRIME   :number = 1;
    static COMPLEX_EXPRESSION:number = 2;
    static TRUE=true;
    static FALSE=false;
    
    static replacePrimes(expr:Expression,prime:Expression):Expression{
        if(ExpressionHelper.Helper.isPrimeOrConstant(expr)){
            if(expr.id === prime.id) return ExpressionHelper.Helper.createPrime(prime.id);
            else return expr;
        }   
 
        for (let i = 0; i < expr.childs.length; i++) {
            expr.childs[i] = this.replacePrimes(expr.childs[i],prime);
        }
        return expr;
    }
    

    public refeshPrime(){
        let prime_ids: string[] = [];
        let str_id = this.id;
        for (let i = 0; i < str_id.length; i++) {
            let n = str_id.charCodeAt(i);
            let strStartsWithALetter = (n >= 65 && n < 91) || (n >= 97 && n < 123);
            if (strStartsWithALetter) {
                if (!prime_ids.includes(str_id[i])) {
                    prime_ids.push(str_id[i]);
                }
            }
        }
        this._primes=[];
        for (let i = 0; i < prime_ids.length; i++) {
            this._primes.push(ExpressionHelper.Helper.createPrime(prime_ids[i]));
        }
    }
    public refeshId(){
        if(ExpressionHelper.Helper.isPrimeOrConstant(this)){
            return;       
        }
        if(this.operator.id === Operts.Type.PHU_DINH){
            if(ExpressionHelper.Helper.isPrimeOrConstant(this.childs[0])) {
                this._id = this.operator.toString()+this.childs[0]._id;    
                return;
            }
            this._id = this.operator.toString()+"("+this.childs[0].id+")";
            return;
        }

        if(this.operator.id === Operts.Type.TUONG_DUONG || this.operator.id === Operts.Type.KEO_THEO ){
            let s:string = this.operator.toString();
            if(ExpressionHelper.Helper.isPrimeOrConstant(this.childs[0]))
                s+= this.childs[0].id;
            else     s+= `(${this.childs[0].id})`;
            if(ExpressionHelper.Helper.isPrimeOrConstant(this.childs[1]))
                s+= this.childs[1].id;
            else     s+= `(${this.childs[1].id})`;
            this._id= s;
        }

        /// SAP XEP THEO QUY TAC CAC BIEU THUC PHU DINH DUOC UU TIEN
        /// CHU CAI THEO THU TU APLHABET        

        let str:string []=[];
        let str_2:string = '';
        for (let i: number = 0; i < this.childs.length; i++) {
            if (!ExpressionHelper.Helper.isPrimeOrConstant(this.childs[i])
            &&!(this.childs[i].operator.id === Operts.Type.PHU_DINH && ExpressionHelper.Helper.isPrimeOrConstant(this.childs[i].childs[0]))
            ) {
                    str_2 += `(${this.childs[i].id})`;
            }
            else{
                /// DUYET CAC BIEU THUC MENH DE VA SAP XEP LAI CHUNG
                if(str.length === 0)
                   str.push( this.childs[i].id); 
                else{
                    for(let j:number=str.length-1;j>=0;j--){
                    
                        let s1:string = this.childs[i].id;
                        let s2:string = str[j];
                      
                        if(s1.includes(`${Operts.Type.PHU_DINH}`))s1 = s1.split(`${Operts.Type.PHU_DINH}`)[1];
                        if(s2.includes(`${Operts.Type.PHU_DINH}`))s2 = s2.split(`${Operts.Type.PHU_DINH}`)[1];
                         
                        if(s2 < s1){
                            if(j===str.length-1) str.push( this.childs[i].id); 
                            else
                            str.splice(j+1,0,this.childs[i].id);
                            break;
                        } else if(s2===s1){
                            if(this.childs[i].id.includes(`${Operts.Type.PHU_DINH}`)){
                                str.splice(j,0,this.childs[i].id);
                            }else {
                                str.splice(j+1,0,this.childs[i].id);
                            }
                            break;
                        }

                        if(j===0){
                            str.splice(j,0,this.childs[i].id);
                        }

                            
                    }
                }    
            }  

        }
        let s:string ='';
        for(let i:number=0;i<str.length;i++){
            s+= str[i]; 
        }  

        this._id = this.operator.toString() +s + str_2;  
    }
    type():number{
        /// HANG
        if(this.childs.length === 0 && ExpressionHelper.Helper.isNumber(this.id)){
           return Expression.CONSTANT;
        } 
        /// BIEN
        else if(this.childs.length === 0){
           return Expression.PRIME;
        }
        /// PHUC HOP
        return Expression.COMPLEX_EXPRESSION;
    }
    setChildAt(index:number,expr:Expression){
        this.childs[index] = expr;
        this.childs[index].parent = this;
    }
    addChild(expr:Expression){
       this.childs.push(expr);
       this.childs[this.childs.length-1].parent=this;
    }
    removeAt(index:number){
       this.childs.splice(index,1);
       if(this.childs.length===0)this.operator = new OperatorFactory().create(Operts.Type.NONE);
    } 
    removeChild(exp:Expression){
        let index:number = this.childs.findIndex(e=>{return e.id === exp.id});
        this.childs.splice(index,1);
        if(this.childs.length===0)this.operator = new OperatorFactory().create(Operts.Type.NONE);

    }
    //#region  GETTER AND SETTER
    public get id(): string {
       
        this.refeshId();
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
        this.refeshId();
    }
    public get value(): boolean | null {
        if(this._value === null) 
        throw Error ('CHUA DAT CHAN TRI');
        return this._value;
    }
    public set value(value: boolean | null) {
        this._value = value;
    }
    public get parent(): Expression | null {
        return this._parent;
    }
    public set parent(value: Expression | null) {
        this._parent = value;
    }
    public get childs(): Expression[] {
        return this._childs;
    }
    public set childs(value: Expression[]) {
        this._childs = value;
    }
    public get primes(): Expression[] {
        
        this.refeshPrime();   
        
        return this._primes;
    }
    public set primes(value: Expression[]) {
        this._primes = value;

    }
    // public  getPrimeAt(index:number){
    //     return this.primes[index];
    // }
    // public  setPrimeAt(index:number,exp:Expression){
    //     this.primes[index] = exp;
    // }
    public get operator(): Operator {
        return this._operator;
    }
    public set operator(value: Operator) {
        this._operator = value;
    }
    //#endregion

}

export class ExpressionBuilder{
    private expr:Expression;
    constructor (){
        this.expr = new Expression();
    }
    addChild(child:Expression):ExpressionBuilder{
        this.expr.addChild(child);
        return this;
    }
    addChild2(child:Expression):ExpressionBuilder{
        this.expr.childs.push(child);
        return this;
    }
    addValue(value:boolean):ExpressionBuilder{
        this.expr.value = value;
        return this;
    }
    addId (id:string):ExpressionBuilder{
        this.expr.id = id;
        return this;
    }
    addParent(parent:Expression):ExpressionBuilder{
        this.expr.parent = parent;
        return this;
    }
    addPrime(prime:Expression):ExpressionBuilder{
        this.expr.primes.push(prime);
        return this;
    }
    addOperator(o:number):ExpressionBuilder{
        let operator = new OperatorFactory().create(o);
        this.expr.operator = operator;
        return this;
    }
    build():Expression{
        let e = this.expr;
        this.expr = new Expression();
        return e; 
    }
}