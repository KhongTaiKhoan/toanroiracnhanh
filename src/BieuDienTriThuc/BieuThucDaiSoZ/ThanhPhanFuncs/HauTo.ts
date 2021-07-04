import { KhonGianSoNguyen } from "../ThanhPhanC/BieuThucDaiSo";
import { HelperBieuThucDaiSo } from "./Helper";

export class  HauTo {
    static ChuoiHauTo(P:string):string[]{
        P = P.replace(new RegExp('\\-\d+\\(','g'),'+-1*(');
        // console.log(`DE BAI: ${P}`);
        let operator:string [] = [];
        let num:string[]=[];
        let numbe :string='';
        for (let i = 0; i < P.length; i++) {
           
            if(P.charAt(i) === ' ' || P.charAt(i) === '\r' || P.charAt(i) === '\t')continue;
            
            /// Ky tu la mot so
            if(this.isNumber(P.charAt(i))){
                numbe+=P.charAt(i);

                if(i===P.length-1)num.push(numbe);
            }
            /// Ky tu la mot dau am hoac duong cho mot so
            else if(this.isSign(P.charAt(i)) && (i===0 || (i>0 && this.isOperator(P.charAt(i-1)) ) )){
                numbe+=P.charAt(i);
            }
            //// Ky tu la cac phep tinh
            else {
                if(numbe !== '')
                num.push(numbe);
                numbe = '';
                if (this.isOperator(P.charAt(i))) {
                    while(operator.length !== 0){
                        let comp: number = this.compareOperators(P.charAt(i), operator[operator.length - 1]);
                        if (comp === -1 || (comp === 0 && P.charAt(i) !== '(')) {
                            let ops: string | undefined = operator.pop();
                            if (ops !== undefined)
                                num.push(ops);
                        }else {break;}
                    } 
                    
                    operator.push(P.charAt(i));

                } else if (P.charAt(i) === '(') {
                   operator.push('(');
                }else if(P.charAt(i) === ')'){
                    while(true){
                      
                        let ops:string|undefined  = operator.pop();
                        if(ops === undefined || ops === '(')break;
                        num.push(ops); 
                    }
                }
                //// Ky tu la bien
                else {
                    num.push(P.charAt(i));
                }
            }
             
        }

        while (operator.length !== 0){
            let ops:string|undefined  = operator.pop();
            if(ops === undefined || ops === ')')break;
            num.push(ops); 
        }
        // console.log(num);
        return num;
    }

    static BieuThucTuChuoi(chuoi:string[]){
        let bieuThucs: KhonGianSoNguyen.BieuThuc[] = [];
        let parent:KhonGianSoNguyen.BieuThuc|null=null;
        for (let i = 0; i < chuoi.length; i++) {
            if (!this.isOperator(chuoi[i])) {
                if (this.isNumber(chuoi[i])) {
                    bieuThucs.push(HelperBieuThucDaiSo.Helper.TAO_HANG_SO(parseInt(chuoi[i])))
                }else{
                    bieuThucs.push(HelperBieuThucDaiSo.Helper.TAO_BIEN_SO(chuoi[i]));
                }
            }
            else {
                let right:KhonGianSoNguyen.BieuThuc|undefined = bieuThucs.pop();
                let left:KhonGianSoNguyen.BieuThuc|undefined = bieuThucs.pop();
                if(left && right){
                    let newBieuThuc  =  new KhonGianSoNguyen.BieuThuc();
                    left.parent = newBieuThuc;
                    right.parent = newBieuThuc;
                    newBieuThuc.childs.push(left);
                    newBieuThuc.childs.push(right);
                    newBieuThuc.operator = chuoi[i];
                    bieuThucs.push(newBieuThuc);
                }
            }
        }
        return bieuThucs[0];
    }

    static isNumber(num: string) :boolean{
        return num.match(/^-?\d+$/)!==null;
    }
    static isOperator(char: string) {
        return char === '+' || char === '-' || char === '/' || char === '*';
    }
    static isSign(char: string) {
        return char === '+' || char === '-';
    }
    static compareOperators(ops1: string, ops2: string) {
        let arr: { ops: string, level: number }[] = [];
        arr.push({ ops: '-', level: 1 });
        arr.push({ ops: '+', level: 1 });
        arr.push({ ops: '*', level: 2 });
        arr.push({ ops: '/', level: 2 });
        arr.push({ ops: '(', level: 0 });
        arr.push({ ops: ')', level: 0 });

        let ops1_l: number = 0;
        let ops2_l: number = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].ops === ops2) ops2_l = arr[i].level;
            if (arr[i].ops === ops1) ops1_l = arr[i].level;
        }
        if (ops1_l > ops2_l) return 1;
        if (ops1_l < ops2_l) return -1;
        return 0;
    }

}