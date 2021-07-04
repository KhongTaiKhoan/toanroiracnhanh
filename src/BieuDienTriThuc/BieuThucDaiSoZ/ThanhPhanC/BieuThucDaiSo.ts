import { HelperBieuThucDaiSo } from "../ThanhPhanFuncs/Helper";
import { HauTo } from '../ThanhPhanFuncs/HauTo';

export namespace KhonGianSoNguyen {
    export class BieuThuc {
        private _id: string = '';       
        private _operator: string = '';
        private _childs: BieuThuc[] = [];
        private _value: number|null = null;
        private _kind: number = 2;
        private _parent: BieuThuc | null = null;
       
       
        static HANG_SO:number = 0;
        static BIEN_SO:number = 1;
        static PHUC_HOP:number = 2;


        public addChild(child:BieuThuc){
            this.childs.push(child);
            
        }
        public insertChildAt(index:number,child:BieuThuc){
           this.childs[index] = child;
           this.id = this.refeshID();
        }

        public refeshID() {
            //// ID duoc quy dinh nhu sau
            /// 1. NEU LA PHEP TRU HAY CHIA THI KHONG THAY DOI VI TRI
            /// 2. NEU LA PHEP CONG HAY NHAN SE SAP XEP LAI
            ////// + UU TIEN CAC HANG -> BIEN -> BIEU THUC PHUC HOP
            ////// + VOI HANG SE SAP XEP THEM THEO CHIEU TANG DAN
            ////// + VOI BIEN SE SAP XEP THEO CHIEU A->Z
            if (this.operator === '-' || this.operator === '/')
                return this.childs[0].id + ' ' + this.childs[1].id + ' ' + this.operator;

            let hangSo: number[] = [];
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i].kind === BieuThuc.HANG_SO) hangSo.push(this.childs[i].value);
            }
            hangSo.sort((a, b) => {
                if (a > b) return 1;
                if (a < b) return -1;
                return 0;
            });

            let bienSo: string[] = [];
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i].kind === BieuThuc.BIEN_SO) bienSo.push(this.childs[i].id);
            }
            bienSo.sort();

            let normal: BieuThuc[] = [];
            for (let i = 0; i < this.childs.length; i++) {
                if (this.childs[i].kind === BieuThuc.BIEN_SO || this.childs[i].kind === BieuThuc.HANG_SO) continue;
                normal.push(this.childs[i]);

            }
            let str_id = '';

            hangSo.forEach(e => {
                str_id += e + ' ';
            });

            bienSo.forEach(e => {
                str_id += e + ' ';
            });

            normal.forEach(e => {
                str_id += e.id + ' ';
            });
            
            str_id+=this.operator;
            
            return str_id;
        }
       
        public toString(): string {
            if (this.kind === BieuThuc.HANG_SO || this.kind === BieuThuc.BIEN_SO)
                return this.id;

            let left: BieuThuc = this.childs[0];
            let right: BieuThuc = this.childs[1];
            
            if(this.parent === null && this.operator ==='*' && left.id === '-1' && right.kind === KhonGianSoNguyen.BieuThuc.BIEN_SO)
            return '-'+right.toString();
            
            if(this.operator ==='*' && left.id === '-1')
            return right.toString();

            if(right.operator ==='*' && right.childs[0].id==='-1' && this.operator==='+')
            return `${left.toString()} - ${right.toString()}`;

            if(right.operator ==='*' && right.childs[0].id==='-1' && this.operator==='-')
            return `${left.toString()} + ${right.toString()}`;

            return `${left.toString()} ${this.operator} ${right.toString()}`;

        }
        public replaceVariable(obj:{var:string,value:string}[]):BieuThuc{
            if(this.kind === BieuThuc.HANG_SO||this.kind === BieuThuc.BIEN_SO){
                if (this.kind === BieuThuc.BIEN_SO) {
                    let index = obj.findIndex(e => { return e.var === this.id });
                    if (index !== -1) {
                        if (HauTo.isNumber(obj[index].value))
                            return HelperBieuThucDaiSo.Helper.TAO_HANG_SO(parseInt(obj[index].value));
                        else
                            return HelperBieuThucDaiSo.Helper.TAO_BIEN_SO(obj[index].value);
                    }
                    else return BieuThuc.copy(this);
                }
                else return BieuThuc.copy(this);
            }
            else{

               let newExpr:BieuThuc = BieuThuc.copy(this);
               for (let i = 0; i < this.childs.length; i++) {
                  newExpr.childs[i]= this.childs[i].replaceVariable(obj);
               }
               newExpr.refeshID();
               return newExpr;
            }
            return new BieuThuc();
        }

        static copy (B:BieuThuc):BieuThuc{
            if(B.kind === BieuThuc.HANG_SO)
            return HelperBieuThucDaiSo.Helper.TAO_HANG_SO(B.value);
            if(B.kind === BieuThuc.BIEN_SO)
            return HelperBieuThucDaiSo.Helper.TAO_BIEN_SO(B.id);

            let newB:BieuThuc = new BieuThuc();
            newB.operator = B.operator;
            newB.kind = B.kind;
            for (let i = 0; i < B.childs.length; i++) {
                newB.childs.push(BieuThuc.copy(B.childs[i]));
            }
            return newB;
        }

        //#region  GETTER AND SETTER
        public get parent(): BieuThuc | null {
            return this._parent;
        }
        public set parent(value: BieuThuc | null) {
            this._parent = value;
        }
        public get childs(): BieuThuc[] {
            return this._childs;
        }
        public set childs(value: BieuThuc[]) {
            this._childs = value;
        }
        
        public get operator(): string {
            return this._operator;
        }
        public set operator(value: string) {
            this._operator = value;
        }
        public get id(): string {
            if(this._id !== '')
                return this._id;
            else 
               this.id= this.refeshID();
            return this._id;
        }
        public set id(value: string) {
            this._id = value;
        }

        public get value(): number {
            if (this._value === null) throw new Error('Chua cai dat value cho bien');
            if (this.kind !== BieuThuc.PHUC_HOP)
                return this._value;
            let left: number = 0;
            let right: number = 0;
            try {
                left = this.childs[0].value;
                right = this.childs[1].value;
            } catch (error) {
                throw new Error('Can cai dat gia tri cho bien');
            }

            switch (this.operator) {
                case '+':
                    return left + right;
                case '-':
                    return left - right;
                case '*':
                    return left * right;
                case '/':
                    return left / right;

            }
            return 0;
        }
        public set value(value: number) {
            this._value = value;
        }
        public get kind(): number {
            return this._kind;
        }
        public set kind(value: number) {
            this._kind = value;
        }
        //#endregion
    }

    export class BieuThucBuilder{
        private expr:BieuThuc;
        constructor(){
            this.expr = new BieuThuc();
        }

        public addChild(child:BieuThuc):BieuThucBuilder{
            this.expr.childs.push(child);
            return this;
        }
        public addOperator(operator:string):BieuThucBuilder{
            this.expr.operator = operator;
            return this;
        }
        public addParent(parent:BieuThuc){
            this.expr.parent = parent;
        }

        public build():BieuThuc{
            let rs = this.expr;
            this.expr = new BieuThuc();
            return rs;
        }
   } 
}