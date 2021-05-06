import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe"

export class LuatMessage{
    public bieuThuc:BieuThucMenhDe = new BieuThucMenhDe();
    public msg1?:any ;
    public msg2?:any;
   
    constructor (bt:BieuThucMenhDe,msg1?:any,msg2?:any){
        this.bieuThuc = bt;
        if(msg1!== undefined)
        this.msg1 = msg1;
        if(msg1!== undefined)
        this.msg2 = msg2;
    }

}