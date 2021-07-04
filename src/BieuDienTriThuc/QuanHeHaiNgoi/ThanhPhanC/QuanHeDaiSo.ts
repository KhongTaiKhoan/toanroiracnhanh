import { RutGonBieuThuc } from '../../BaiTap/BaiTap_Logic/RutGonBieuThuc';
import { KhonGianSoNguyen } from '../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo';
import { HelperBieuThucDaiSo } from '../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper';
import { QuyTacDaiSo } from '../../BieuThucDaiSoZ/ThanhPhanRules/QuyTacRutGonn';

export class QuanHeDaiSo{
    private _name: string = '';
    private _checker: CheckerQuanHeDaiSo[] = [];
   
    private _left: KhonGianSoNguyen.BieuThuc = new KhonGianSoNguyen.BieuThuc();
    private _right: KhonGianSoNguyen.BieuThuc = new KhonGianSoNguyen.BieuThuc();
    private _bienCoSo: KhonGianSoNguyen.BieuThuc[] = [];
    private _symbol: string = '';
    private _kind: number = 0;
   
    
    static Z = -1;
    static LON_HON = 0;
    static LON_HON_BANG = 1;
    static BE_HON = 2;
    static BE_HON_BANG = 3;
    static BANG = 4;
    static CHIA_HET = 5;
    static UOC_SO = 6;
    static BOI_SO = 7;
    static SO_CHAN =8;
    static SO_LE = 9;

    constructor(name:string,kind:number,symbol:string,left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,checker:CheckerQuanHeDaiSo[]=[],bienCoSo:KhonGianSoNguyen.BieuThuc[]){
        this.name = name;
        this.kind=kind;
        this.symbol =symbol;
        this.checker = checker;
        this.left = left;
        this.right = right;
        this.bienCoSo = bienCoSo;
    }

    public toString(){
        if(this.left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP && this.right.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP)
        return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
        if(this.left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP)
        return `${this.left.toString()} ${this.symbol} (${this.right.toString()})`;
        if(this.right.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP)
        return `(${this.left.toString()}) ${this.symbol} ${this.right.toString()}`;
        return `(${this.left.toString()}) ${this.symbol} (${this.right.toString()})`;
    
    }

    static copy(R:QuanHeDaiSo){
        let left:KhonGianSoNguyen.BieuThuc = KhonGianSoNguyen.BieuThuc.copy(R.left);   
        let right:KhonGianSoNguyen.BieuThuc = KhonGianSoNguyen.BieuThuc.copy(R.right);   
        let checker = R.checker;
        let name = R.name;
        let symbol = R.symbol;
        let bienCoSo:KhonGianSoNguyen.BieuThuc[]=[];
        for (let i = 0; i < R.bienCoSo.length; i++) 
           bienCoSo.push(KhonGianSoNguyen.BieuThuc.copy(R.bienCoSo[i]));
        let newR = new QuanHeDaiSo(name,R.kind,symbol,left,right,checker,bienCoSo);
        newR.left = left;   
        newR.right = right;
        for (let i = 0; i < checker.length; i++) {
           checker[i] = new CheckerQuanHeDaiSo(newR, checker[i].checker);
        }
        newR.checker = checker;
        return newR;   
                
    }
    
    check():boolean{
        for (let i = 0; i < this.checker.length; i++) {
            if(this.checker[i].duyet())return true;
        }
        return false;
    }

    replaceVariale(obj:{var:string, value:string}[]){
        this.left = this.left.replaceVariable(obj);
    //  console.log(this.left.toString());
       this.left = new QuyTacDaiSo.RutGon().simplify(this.left);
       this.right= this.right.replaceVariable(obj);
       this.right = new QuyTacDaiSo.RutGon().simplify(this.right);
    }
    
    //#region  GETTER AND SETTER
    public get symbol(): string {
        return this._symbol;
    }
    public set symbol(value: string) {
        this._symbol = value;
    }
    public get checker(): CheckerQuanHeDaiSo[] {
        return this._checker;
    }
    public set checker(value: CheckerQuanHeDaiSo[]) {
        this._checker = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get bienCoSo(): KhonGianSoNguyen.BieuThuc[] {
        return this._bienCoSo;
    }
    public set bienCoSo(value: KhonGianSoNguyen.BieuThuc[]) {
        this._bienCoSo = value;
    }
    public get left(): KhonGianSoNguyen.BieuThuc {
        return this._left;
    }
    public set left(value: KhonGianSoNguyen.BieuThuc) {
        this._left = value;
      
    }
    public get right(): KhonGianSoNguyen.BieuThuc {
        return this._right;
        
    }
    public set right(value: KhonGianSoNguyen.BieuThuc) {
        this._right = value;
    }
    public get kind(): number {
        return this._kind;
    }
    public set kind(value: number) {
        this._kind = value;
    }
    //#endregion 
} 



export interface  ICheckerQuanHeDaiSo{
    check (condition:QuanHeDaiSo):boolean;
}

export class CheckerQuanHeDaiSo {
    public checker :ICheckerQuanHeDaiSo;
    public condition:QuanHeDaiSo;
    constructor(condition:QuanHeDaiSo,checker:ICheckerQuanHeDaiSo){
        this.condition=condition;
        this.checker = checker;
    }
    public duyet():boolean{
        return this.checker.check(this.condition);
    }
}

export class QuanHeDaiSoFactory{
    create_LON_HON(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc ,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Lớn hơn';
        let condition:QuanHeDaiSo = new QuanHeDaiSo(name,QuanHeDaiSo.LON_HON,'>',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition,new class implements ICheckerQuanHeDaiSo{
                check(condition:QuanHeDaiSo): boolean {
                    let hl=true;
                    try {
                       hl= condition.left.value > condition.right.value;
                    } catch (error) {
                        hl=false;
                    }
                    return hl
                }
            })
        );
        condition.checker = checker;
        return condition;
    }

    //// LON HON BANG ">="
    create_LON_HON_BANG(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Lớn hơn bằng';
        let condition:QuanHeDaiSo = new QuanHeDaiSo(name,QuanHeDaiSo.LON_HON_BANG,'>=',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
      
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value >= condition.right.value;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id === condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        condition.checker = checker;
        return condition ;
    }

    //// NHO HON "<"
    create_NHO_HON(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Nhỏ hơn';
        let condition = new QuanHeDaiSo(name,QuanHeDaiSo.BE_HON,'<',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value < condition.right.value;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );
        condition.checker = checker;
        return condition;
    }

    /// NHO HƠN BANG "<="
    create_NHO_HON_BANG(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Nhỏ hơn bằng';
        let condition = new QuanHeDaiSo(name,QuanHeDaiSo.BE_HON_BANG,'<=',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value <= condition.right.value;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id === condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        condition.checker = checker;
        return condition;
    }

    /// BANG "="
    create_BANG(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Bằng';
        let condition = new QuanHeDaiSo(name,QuanHeDaiSo.BANG,'=',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value === condition.right.value;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id === condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        condition.checker = checker;
        return condition;
    }

    /// CHIA HET
    create_CHIA_HET(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'chia hết cho';
        // '\u2223'
        let condition  = new QuanHeDaiSo(name,QuanHeDaiSo.CHIA_HET,'chia hết cho',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value % condition.right.value === 0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value === 0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id ===  condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.operator === '*' && ( condition.left.childs[0].id === condition.right.id ||
                            condition.left.childs[1].id === condition.right.id )
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );



        condition.checker = checker;
        return condition;

    }

    /// UOC SO
    create_UOC_SO(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Ước số';
        let condition = new QuanHeDaiSo(name,QuanHeDaiSo.UOC_SO,'\u2223',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.right.value % condition.left.value===0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.right.value === 0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id ===  condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.right.operator === '*' && ( condition.right.childs[0].id === condition.left.id ||
                            condition.right.childs[1].id === condition.left.id )
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );


        condition.checker = checker;
        return condition;
    }

    /// BOI SO
    create_BOI_SO(left:KhonGianSoNguyen.BieuThuc,right:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'BỘi số';
        let condition = new QuanHeDaiSo(name,QuanHeDaiSo.BOI_SO,'\u2223',left,right,[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value % condition.right.value === 0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value === 0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.id ===  condition.right.id;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.operator === '*' && ( condition.left.childs[0].id === condition.right.id ||
                            condition.left.childs[1].id === condition.right.id )
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );

        condition.checker  = checker;
        return condition;
    }

    /// SO CHAN
    create_SO_CHAN(left:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        // let name:string = 'BỘi số';
        // let condition  = new QuanHeDaiSo(name,QuanHeDaiSo.SO_CHAN,'chia hết cho',left,HelperBieuThucDaiSo.Helper.TAO_HANG_SO(2),[],bienCoSo);
        // // let checker: CheckerQuanHeDaiSo[] = [];
        // checker.push(
        //     new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
        //         check(condition: QuanHeDaiSo): boolean {
        //             let hl = true;
        //             try {
        //                 hl = condition.left.value % 2===0
        //             } catch (error) {
        //                 hl = false;
        //             }
        //             return hl
        //         }
        //     })
        // );
        // condition.checker = checker;
        return this.create_CHIA_HET(left,HelperBieuThucDaiSo.Helper.TAO_HANG_SO(2),bienCoSo);
    }

    /// SO LE
    create_SO_LE(left:KhonGianSoNguyen.BieuThuc,bienCoSo:KhonGianSoNguyen.BieuThuc[]):QuanHeDaiSo{
        let name:string = 'Số lẻ';
        let condition  =  new QuanHeDaiSo(name,QuanHeDaiSo.SO_LE,'là số lẻ',left,HelperBieuThucDaiSo.Helper.TAO_HANG_SO(2),[],bienCoSo);
        let checker: CheckerQuanHeDaiSo[] = [];
        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                    let hl = true;
                    try {
                        hl = condition.left.value %2!==0;
                    } catch (error) {
                        hl = false;
                    }
                    return hl
                }
            })
        );
        condition.checker = checker;
        return condition;
    }

    create_Z():QuanHeDaiSo{
        let name:string = 'Số lẻ';
        let condition  =  new QuanHeDaiSo(name,QuanHeDaiSo.SO_LE,'số nguyên',new KhonGianSoNguyen.BieuThuc,new KhonGianSoNguyen.BieuThuc,[],[]);
        let checker: CheckerQuanHeDaiSo[] = [];

        checker.push(
            new CheckerQuanHeDaiSo(condition, new class implements ICheckerQuanHeDaiSo {
                check(condition: QuanHeDaiSo): boolean {
                   return true;
                }
            })
        );
        condition.checker =checker;
        return condition; 
    }


}
