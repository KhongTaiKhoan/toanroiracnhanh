import { Expression } from '../ThanhPhanC/Expression';

export abstract class Operator{
    public static  symbols:string[] = ['\u00AC','\u2194','\u2192','\u2227','\u2228'] ;
    
    protected id_:number=Operts.Type.NONE;
    protected _symbol: string = '';
    
    abstract getResult(expr:Expression ):boolean;
    constructor(symbol:string){
        this.symbol= symbol;
    }
    toString(){
        if(this.id !== Operts.Type.NONE)
        return this._symbol+"";
        return "";
    }

    public get id(): number {
        return this.id_;
    }
    public set id(value: number) {
        this.id_ = value;
    }

    public get symbol(): string {
        return this._symbol;
    }
    public set symbol(value: string) {
        this._symbol = value;
    }
}
export namespace Operts {
    export enum Type{
        NONE        = -1,
        PHU_DINH    = 0,
        HOI         = 1,
        TUYEN       = 2,
        KEO_THEO    = 3,
        TUONG_DUONG = 4,
    }

    export class PhuDinh extends Operator {
        constructor() {
            super(Operator.symbols[0]);
            this.id = Operts.Type.PHU_DINH
        }
        getResult(expr: Expression): boolean {
            throw new Error("Method not implemented.");
        }

    }
    export class PhepHoi extends Operator {
        constructor() {
            super(Operator.symbols[3]);
            this.id = Operts.Type.HOI
        }
        getResult(expr: Expression): boolean {
            throw new Error("Method not implemented.");
        }

    }
    export class PhepTuyen extends Operator {
        constructor() {
            super(Operator.symbols[4]);
            this.id = Operts.Type.TUYEN
        }
        getResult(expr: Expression): boolean {
            throw new Error("Method not implemented.");
        }

    }
    export class KeoTheo extends Operator {
        constructor() {
            super(Operator.symbols[2]);
            this.id = Operts.Type.KEO_THEO
        }
        getResult(expr: Expression): boolean {
            throw new Error("Method not implemented.");
        }
    }
    export class TuongDuong extends Operator {
        constructor() {
            super(Operator.symbols[1]);
            this.id = Operts.Type.TUONG_DUONG
        }
        getResult(expr: Expression): boolean {
            throw new Error("Method not implemented.");
        }
    }
}
export class OperatorFactory{
    create(operatorId: number): Operator {
        switch (operatorId) {
            case Operts.Type.PHU_DINH:
                return new Operts.PhuDinh();
            case Operts.Type.HOI:
                return new Operts.PhepHoi();
            case Operts.Type.TUYEN:
                return new Operts.PhepTuyen();
            case Operts.Type.TUONG_DUONG:
                return new Operts.TuongDuong();
            case Operts.Type.KEO_THEO:
                return new Operts.KeoTheo();
            default: return new class extends Operator {
                constructor() {
                    super('');
                    this.id = Operts.Type.NONE;
                }
                getResult(expr: Expression): boolean {
                    throw new Error("Method not implemented.");
                }

            }();
        }
    }
    create2(loaiToanTu: string) {
        switch (loaiToanTu) {
            case '\u00AC':
                return new Operts.PhuDinh();
                break;

            case '\u2194':
                return new Operts.TuongDuong();
                break;

            case '\u2192':
                return new Operts.KeoTheo();
                break;

            case '\u2227':
                return new Operts.PhepHoi();
                break;

            case '\u2228':
                return new Operts.PhepTuyen();
                break;
                
            default:
                return new class extends Operator {
                    constructor() {
                        super("");
                    }
                    getResult(_bieuThuc: Expression): boolean {
                        return _bieuThuc.value !== null;
                    }
                }();
        }
    }
}