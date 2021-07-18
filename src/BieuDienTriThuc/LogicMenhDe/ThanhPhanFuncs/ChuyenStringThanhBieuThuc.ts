import { Expression } from '../ThanhPhanC/Expression';
import { OperatorFactory,Operator, Operts } from '../ThanhPhanOperators/Operator';
import { ExpressionHelper } from './Helper';
export class ChuyenStringThanhBieuThuc{
    static chuyenDoi(chuoi:string):Expression{
       let parent:Expression|null = null;
       let hienTai:Expression = new Expression();
       let Operator:Operator = new OperatorFactory().create(Operts.Type.NONE);
       
       for(let i:number=0;i<chuoi.length;i++){
            if (chuoi[i] === ' ') continue;
            if (chuoi[i] === '\n' || chuoi[i] === '\r') continue;
            else if (chuoi[i] === '1') {
                let bt_con = ExpressionHelper.Helper.createConstant(Expression.TRUE);
                bt_con.parent = hienTai;
                hienTai.childs.push(bt_con);
            }
            else if (chuoi[i] === '0') {
                let bt_con = ExpressionHelper.Helper.createConstant(Expression.FALSE);
                bt_con.parent = hienTai;
                hienTai.childs.push(bt_con);
            }
            else if (chuoi[i] === ')') {
                while (true) {
                    if (hienTai.parent !== null)
                        hienTai = hienTai.parent;
                    parent = hienTai.parent;
                    if (hienTai.operator.id !== Operts.Type.PHU_DINH) break;
                }

            }

            else if (chuoi[i] === '(') {
                parent = hienTai;
                hienTai = new Expression();
                hienTai.parent = parent;
                parent.childs.push(hienTai);
            }

            else if (!Operts.TuongDuong.symbols.includes(chuoi[i])) {

                if (hienTai.operator.id !== Operts.Type.PHU_DINH) {
                    let bt_con = ExpressionHelper.Helper.createPrime(chuoi[i]);
                    bt_con.parent = hienTai;
                    hienTai.childs.push(bt_con);

                } else {

                    hienTai.id = chuoi[i];
                    while (true) {
                        if (hienTai.parent !== null)
                            hienTai = hienTai.parent;
                        parent = hienTai.parent;
                        //    console.log(hienTai);
                        if (hienTai.operator.id !== Operts.Type.PHU_DINH) break;
                    }
                }


            }

            else if (Operator.symbol.includes(chuoi[i])) {

                Operator = new OperatorFactory().create2(chuoi[i]);
                if (Operator.id !== Operts.Type.PHU_DINH) {
                    hienTai.operator = Operator;
                } else if (Operator.id === Operts.Type.PHU_DINH) {
                    parent = hienTai;
                    hienTai = new Expression();
                    hienTai.parent = parent;
                    hienTai.operator = Operator;
                    parent.childs.push(hienTai);
                }
            }
        }
        if(!ExpressionHelper.Helper.isPrimeOrConstant(hienTai)&& hienTai.childs.length === 1 && hienTai.operator.id === Operts.Type.NONE)
           return hienTai.childs[0];
           
        return hienTai;
    }
}