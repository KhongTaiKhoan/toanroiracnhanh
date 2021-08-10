"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorFactory = exports.Operts = exports.Operator = void 0;
class Operator {
    constructor(symbol) {
        this.id_ = Operts.Type.NONE;
        this._symbol = '';
        this.symbol = symbol;
    }
    toString() {
        if (this.id !== Operts.Type.NONE)
            return this._symbol + "";
        return "";
    }
    get id() {
        return this.id_;
    }
    set id(value) {
        this.id_ = value;
    }
    get symbol() {
        return this._symbol;
    }
    set symbol(value) {
        this._symbol = value;
    }
}
exports.Operator = Operator;
Operator.symbols = ['\u00AC', '\u2194', '\u2192', '\u2227', '\u2228'];
var Operts;
(function (Operts) {
    let Type;
    (function (Type) {
        Type[Type["NONE"] = -1] = "NONE";
        Type[Type["PHU_DINH"] = 0] = "PHU_DINH";
        Type[Type["HOI"] = 1] = "HOI";
        Type[Type["TUYEN"] = 2] = "TUYEN";
        Type[Type["KEO_THEO"] = 3] = "KEO_THEO";
        Type[Type["TUONG_DUONG"] = 4] = "TUONG_DUONG";
    })(Type = Operts.Type || (Operts.Type = {}));
    class PhuDinh extends Operator {
        constructor() {
            super(Operator.symbols[0]);
            this.id = Operts.Type.PHU_DINH;
        }
        getResult(expr) {
            throw new Error("Method not implemented.");
        }
    }
    Operts.PhuDinh = PhuDinh;
    class PhepHoi extends Operator {
        constructor() {
            super(Operator.symbols[3]);
            this.id = Operts.Type.HOI;
        }
        getResult(expr) {
            throw new Error("Method not implemented.");
        }
    }
    Operts.PhepHoi = PhepHoi;
    class PhepTuyen extends Operator {
        constructor() {
            super(Operator.symbols[4]);
            this.id = Operts.Type.TUYEN;
        }
        getResult(expr) {
            throw new Error("Method not implemented.");
        }
    }
    Operts.PhepTuyen = PhepTuyen;
    class KeoTheo extends Operator {
        constructor() {
            super(Operator.symbols[2]);
            this.id = Operts.Type.KEO_THEO;
        }
        getResult(expr) {
            throw new Error("Method not implemented.");
        }
    }
    Operts.KeoTheo = KeoTheo;
    class TuongDuong extends Operator {
        constructor() {
            super(Operator.symbols[1]);
            this.id = Operts.Type.TUONG_DUONG;
        }
        getResult(expr) {
            throw new Error("Method not implemented.");
        }
    }
    Operts.TuongDuong = TuongDuong;
})(Operts = exports.Operts || (exports.Operts = {}));
class OperatorFactory {
    create(operatorId) {
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
                getResult(expr) {
                    throw new Error("Method not implemented.");
                }
            }();
        }
    }
    create2(loaiToanTu) {
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
                    getResult(_bieuThuc) {
                        return _bieuThuc.value !== null;
                    }
                }();
        }
    }
}
exports.OperatorFactory = OperatorFactory;
