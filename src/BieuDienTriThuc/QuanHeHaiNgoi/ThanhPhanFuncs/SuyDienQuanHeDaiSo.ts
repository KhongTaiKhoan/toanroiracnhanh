import { KhonGianSoNguyen } from "../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo";
import { HelperBieuThucDaiSo } from "../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper";
import { QuyTacDaiSo } from "../../BieuThucDaiSoZ/ThanhPhanRules/QuyTacRutGonn";
import { QuanHeDaiSo, QuanHeDaiSoFactory } from '../ThanhPhanC/QuanHeDaiSo';



export class SuyDienQuanHeDaiSo{
    private _GT: QuanHeDaiSo[] = [];
    private _KL: QuanHeDaiSo;
   
    private chiTietSuyDien:ChiTietSuyDien[]=[];
    private result:ChiTietSuyDien[]=[];
    private state:number = 2;

    static SUCCESS:number=0;
    static FAIL:number=1;
    static CONTINUE:number=2;

    private _luat: LuatSuyDien[] = [];
   

    constructor(GT:QuanHeDaiSo[],KL:QuanHeDaiSo){
        this._KL=KL;
        this._GT = GT;
        for (let i = 0; i < this.GT.length; i++) {
           this.chiTietSuyDien.push(new ChiTietSuyDien(i,[-1],GT[i]));
        };
        // this.luat = luat;
    }

    truyVet(R: ChiTietSuyDien) {
        if (R.parent[0] === -1) {
            this.result.push(new ChiTietSuyDien(this.result.length, [-1], R.R));
            return;
        }
        let parent: number[] = [];
        if (this.state === SuyDienQuanHeDaiSo.SUCCESS) {
            for (let i = 0; i < R.parent.length; i++) {
                let index = this.result.findIndex(e => { return e.R.left.id === this.chiTietSuyDien[R.parent[i]].R.left.id});
                if (index === -1) {
                    this.truyVet(this.chiTietSuyDien[R.parent[i]]);
                    let index_2 = this.result.findIndex(e => { return e.R.left.id === this.chiTietSuyDien[R.parent[i]].R.left.id});
                    parent.push(this.result[index_2].id);
                }
                else
                    parent.push(this.result[index].id);
            }
            let MAX_ID = 0;
            this.result.forEach(e => { if (MAX_ID < e.id) MAX_ID = e.id; });
            this.result.push(new ChiTietSuyDien(MAX_ID + 1, parent, R.R));
        }
        return R;
    }

    public suyDien(): ChiTietSuyDien[] {
        this.duyet();
        if (this.state !== SuyDienQuanHeDaiSo.SUCCESS) return [];

        this.truyVet(this.chiTietSuyDien[this.chiTietSuyDien.length - 1]);
        // this.chiTietSuyDien.forEach(e => {
        //     console.log(`${e.id} ${e.R.toString()} ${e.parent}`);
        // });
        // console.log('==============');
        

        // this.result.forEach(e => {
        //     console.log(`${e.id} ${e.R.toString()} ${e.parent}`);
        // });
        // console.log('==============');

        return this.result;
    }

    duyet():void{
        let i = 0;
        while (this.state === SuyDienQuanHeDaiSo.CONTINUE) {
            let length = this.GT.length;
            let back = false;
            for (i = 0; i < length; i++) {
                let hl:boolean=false;
                // if (this.GT[i].left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP) continue;
                for (let j = 0; j < this.luat.length; j++) {
                    this.state = this.isStop(i, this.GT.length)
                    if (this.state !== SuyDienQuanHeDaiSo.SUCCESS) {
                        let b = this.luat[j].apDung(this.GT[i]);;
                        hl = hl || b;
                        this.state = this.isStop(i, this.GT.length)
                    }
                    
                }
                // for (let j = 0; j < this.GT.length; j++) {
                //     console.log(this.GT[j].toString());
                // }
                // console.log('==============');

                if (hl) {
                    this.state = this.isStop(i, this.GT.length);   
                    this.GT.splice(i, 1);
                    back=true;
                    break;
                }
                
                
            }
            if(!back){
                console.log('CANCEL');
                this.state = SuyDienQuanHeDaiSo.FAIL;
                break;
            }
            

        }
    }

    insertGT(parent:QuanHeDaiSo[],child:QuanHeDaiSo):boolean{
        let index_child = this.chiTietSuyDien.findIndex(e=>{return e.R.toString() === child.toString()});
        if(index_child !==-1)return false;
        // console.log(child.toString());
        let idParent:number[] = [];
        for (let i = 0; i < parent.length; i++) {
            let index= this.chiTietSuyDien.findIndex(e=>{return e.R.toString() === parent[i].toString();});
            if(index!==-1)
            idParent.push(this.chiTietSuyDien[index].id);
        }
        
        let MAX_ID =0;
        this.chiTietSuyDien.forEach(e=>{if(MAX_ID < e.id)MAX_ID = e.id;});
        this.chiTietSuyDien.push(new ChiTietSuyDien(MAX_ID+1,idParent,child));
        this.GT.push(child);
        return true;
    }

    isStop(i:number,length:number):number{
        let index = this.chiTietSuyDien.findIndex(e=>{return e.R.toString() === this.KL.toString();});
        if(index !==-1)return SuyDienQuanHeDaiSo.SUCCESS;
        if(this.GT.length===0)return SuyDienQuanHeDaiSo.FAIL;
        if(i==length)return SuyDienQuanHeDaiSo.FAIL;
        return SuyDienQuanHeDaiSo.CONTINUE;
    }


    public get luat(): LuatSuyDien[] {
        return this._luat;
    }
    public set luat(value: LuatSuyDien[]) {
        this._luat = value;
    }
    public get GT(): QuanHeDaiSo[] {
        return this._GT;
    }
    public set GT(value: QuanHeDaiSo[]) {
        this._GT = value;
    }
    public get KL(): QuanHeDaiSo {
        return this._KL;
    }
    public set KL(value: QuanHeDaiSo) {
        this._KL = value;
    }
}

export abstract class LuatSuyDien{
    public suyDien:SuyDienQuanHeDaiSo;
    constructor(suyDien:SuyDienQuanHeDaiSo){
        this.suyDien = suyDien;
    }
    abstract apDung(R:QuanHeDaiSo):boolean;
}

export class ChiTietSuyDien {
    public id:number;
    public parent:number[];
    public R:QuanHeDaiSo;
    constructor(id:number,parent:number[],R:QuanHeDaiSo) {
        this.id  =id;
        this.parent=parent;
        this.R=R;

    }
}

export class SuyDienQuanHeDaiSo_Factory{    
    private create_BANG(GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }           
    
    private create_LON_HON(GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }

    private create_NHO_HON(GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }

    private create_LON_HON_BANG (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }

    private create_NHO_HON_BANG (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.toString() !== R.toString() && e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }

    private create_CHIA_HET (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                R = QuanHeDaiSo.copy(R);
                let left: KhonGianSoNguyen.BieuThuc = R.left;
                let right: KhonGianSoNguyen.BieuThuc = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_CHIA_HET(left.childs[0], right, R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_CHIA_HET(left.childs[1], right, R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));

        /// luat doi so
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                R = QuanHeDaiSo.copy(R);
                let left:KhonGianSoNguyen.BieuThuc = R.left;
                left = new KhonGianSoNguyen.BieuThucBuilder().addChild(HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                                                             .addChild(left)
                                                             .addOperator('*')
                                                             .build();
                
                left = new QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_CHIA_HET(left,right,R.bienCoSo));
            }
        }(suyDien));

         /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                if (this.suyDien.KL.left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP) return false;
                let left: KhonGianSoNguyen.BieuThuc = this.suyDien.KL.left;

                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }

                return false
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    
    private create_SO_CHAN (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                R = QuanHeDaiSo.copy(R);
                let left: KhonGianSoNguyen.BieuThuc = R.left;
                let right: KhonGianSoNguyen.BieuThuc = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_SO_CHAN(left.childs[0], R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_SO_CHAN(left.childs[1], R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));

        /// luat doi so
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                R = QuanHeDaiSo.copy(R);
                let left:KhonGianSoNguyen.BieuThuc = R.left;
                left = new KhonGianSoNguyen.BieuThucBuilder().addChild(HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                                                             .addChild(left)
                                                             .addOperator('*')
                                                             .build();
                
                left = new QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_SO_CHAN(left,R.bienCoSo));
            }
        }(suyDien));

         /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                if (this.suyDien.KL.left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP) return false;
                let left: KhonGianSoNguyen.BieuThuc = this.suyDien.KL.left;

                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }

                return false
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }

    private create_SO_LE (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                R = QuanHeDaiSo.copy(R);
                let left: KhonGianSoNguyen.BieuThuc = R.left;
                let right: KhonGianSoNguyen.BieuThuc = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_SO_LE(left.childs[0], R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSoFactory().create_SO_LE(left.childs[1], R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));

        /// luat doi so
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                R = QuanHeDaiSo.copy(R);
                let left:KhonGianSoNguyen.BieuThuc = R.left;
                left = new KhonGianSoNguyen.BieuThucBuilder().addChild(HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                                                             .addChild(left)
                                                             .addOperator('*')
                                                             .build();
                
                left = new QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_SO_LE(left,R.bienCoSo));
            }
        }(suyDien));

         /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                if (this.suyDien.KL.left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP) return false;
                let left: KhonGianSoNguyen.BieuThuc = this.suyDien.KL.left;

                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }

                return false
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }


    private create_UOC_SO (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

        /// QUAN HE BAN THAN
        luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                R = QuanHeDaiSo.copy(R);
                return this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_UOC_SO(R.left,R.left,R.bienCoSo)) 
                    || this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_UOC_SO(R.right,R.right,R.bienCoSo)) ;
            }
        }(suyDien));

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return  e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        suyDien.luat = luat;
        
        return suyDien;
    }

    private create_BOI_SO (GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        let suyDien:SuyDienQuanHeDaiSo = new SuyDienQuanHeDaiSo(GT,KL);
        let luat:LuatSuyDien[]=[];

         /// QUAN HE BAN THAN
         luat.push(new class extends LuatSuyDien {
            apDung(R: QuanHeDaiSo): boolean {
                R = QuanHeDaiSo.copy(R);
                return this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_UOC_SO(R.left,R.left,R.bienCoSo)) 
                    || this.suyDien.insertGT([R],new QuanHeDaiSoFactory().create_UOC_SO(R.right,R.right,R.bienCoSo)) ;
            }
        }(suyDien));

        /// luat bac cau
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return  e.left.id === R.right.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien{
            apDung(R:QuanHeDaiSo):boolean{
                let index = this.suyDien.GT.findIndex(e=>{return e.right.id === R.left.id;});
                if(index!==-1){
                    let newCon = QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R,this.suyDien.GT[index]],newCon);
                }  
                return false;
            }
        }(suyDien));

       
        suyDien.luat = luat;
        return suyDien;
    }

    public create(kind:number,GT:QuanHeDaiSo[],KL:QuanHeDaiSo):SuyDienQuanHeDaiSo{
        switch (kind) {
            case QuanHeDaiSo.BANG:
                return this.create_BANG(GT, KL);
            case QuanHeDaiSo.LON_HON:
                return this.create_LON_HON(GT, KL);
            case QuanHeDaiSo.BE_HON:
                return this.create_NHO_HON(GT, KL);
            case QuanHeDaiSo.LON_HON_BANG:
                return this.create_LON_HON_BANG(GT, KL);
            case QuanHeDaiSo.BE_HON_BANG:
                return this.create_NHO_HON_BANG(GT, KL);
            case QuanHeDaiSo.CHIA_HET:
                return this.create_CHIA_HET(GT, KL);
            case QuanHeDaiSo.UOC_SO:
                return this.create_UOC_SO(GT, KL);
            case QuanHeDaiSo.BOI_SO:
                return this.create_BOI_SO(GT, KL);
            case QuanHeDaiSo.SO_CHAN:
                return this.create_SO_CHAN(GT, KL);
            default:
                return this.create_SO_LE(GT, KL);
        }
    }

}


