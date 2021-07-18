import { Expression, ExpressionBuilder } from '../ThanhPhanC/Expression';
import { ChuyenStringThanhBieuThuc } from '../ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { ExpressionHelper } from '../ThanhPhanFuncs/Helper';
import { SimilarExpression } from '../ThanhPhanFuncs/SimplarExpression';
import { Operts } from '../ThanhPhanOperators/Operator';
export namespace EquivalentRule{
   export class Rule{
      public iRule:IRule | null = null;    
      public name:string='';
      public id:number = 0;
      constructor(id:number,name:string,iRule:IRule){
           this.name=name;
           this.iRule=iRule;
           this.id = id;
      } 
   }
   export interface IRule{
      check(expr:Expression):Expression|null;
   }

   export class ManagerRule{
       private Rules:Rule[]=[];
       
       genarate(){
           /// LUAT 
           this.Rules.push(new Rule(0,'Luật đồng nhất',new class implements IRule{
               check(expr:Expression):Expression|null{
                   let left = new ExpressionBuilder().addChild(ExpressionHelper.Helper.createPrime('a'))
                                                     .addChild(ExpressionHelper.Helper.createConstant(Expression.TRUE)) 
                                                     .addOperator(Operts.Type.HOI)
                                                     .build();

                   let right= ExpressionHelper.Helper.createPrime('a');                                 
                   let rule:Expression = new ExpressionBuilder().addChild(left).addChild(right).addOperator(Operts.Type.TUONG_DUONG).build();
                   let arr:Expression[]= new SimilarExpression().genarate(expr,rule.childs[0]);
                   let index:number = 0;
                   for (let index = 0; index < arr.length; index++) {
                       if(ExpressionHelper.Helper.contain(arr[index],expr)){
                        break;
                       }
                   }
                   if(index !== arr.length){

                   }
                   return null;
               }
           }()));
       }
   }
}