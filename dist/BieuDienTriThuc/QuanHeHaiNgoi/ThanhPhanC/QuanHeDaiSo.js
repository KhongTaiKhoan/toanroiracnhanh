"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuanHeDaiSoFactory = exports.CheckerQuanHeDaiSo = exports.QuanHeDaiSo = void 0;
const BieuThucDaiSo_1 = require("../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo");
const Helper_1 = require("../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper");
const QuyTacRutGonn_1 = require("../../BieuThucDaiSoZ/ThanhPhanRules/QuyTacRutGonn");
class QuanHeDaiSo {
    constructor(name, kind, symbol, left, right, checker = [], bienCoSo) {
        this._name = '';
        this._checker = [];
        this._left = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc();
        this._right = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc();
        this._bienCoSo = [];
        this._symbol = '';
        this._kind = 0;
        this.name = name;
        this.kind = kind;
        this.symbol = symbol;
        this.checker = checker;
        this.left = left;
        this.right = right;
        this.bienCoSo = bienCoSo;
    }
    toString() {
        if (this.left.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP && this.right.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
            return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
        if (this.left.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
            return `${this.left.toString()} ${this.symbol} (${this.right.toString()})`;
        if (this.right.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
            return `(${this.left.toString()}) ${this.symbol} ${this.right.toString()}`;
        return `(${this.left.toString()}) ${this.symbol} (${this.right.toString()})`;
    }
    static copy(R) {
        let left = BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(R.left);
        let right = BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(R.right);
        let checker = R.checker;
        let name = R.name;
        let symbol = R.symbol;
        let bienCoSo = [];
        for (let i = 0; i < R.bienCoSo.length; i++)
            bienCoSo.push(BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.copy(R.bienCoSo[i]));
        let newR = new QuanHeDaiSo(name, R.kind, symbol, left, right, checker, bienCoSo);
        newR.left = left;
        newR.right = right;
        for (let i = 0; i < checker.length; i++) {
            checker[i] = new CheckerQuanHeDaiSo(newR, checker[i].checker);
        }
        newR.checker = checker;
        return newR;
    }
    check() {
        for (let i = 0; i < this.checker.length; i++) {
            if (this.checker[i].duyet())
                return true;
        }
        return false;
    }
    replaceVariale(obj) {
        this.left = this.left.replaceVariable(obj);
        //  console.log(this.left.toString());
        this.left = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(this.left);
        this.right = this.right.replaceVariable(obj);
        this.right = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(this.right);
    }
    //#region  GETTER AND SETTER
    get symbol() {
        return this._symbol;
    }
    set symbol(value) {
        this._symbol = value;
    }
    get checker() {
        return this._checker;
    }
    set checker(value) {
        this._checker = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get bienCoSo() {
        return this._bienCoSo;
    }
    set bienCoSo(value) {
        this._bienCoSo = value;
    }
    get left() {
        return this._left;
    }
    set left(value) {
        this._left = value;
    }
    get right() {
        return this._right;
    }
    set right(value) {
        this._right = value;
    }
    get kind() {
        return this._kind;
    }
    set kind(value) {
        this._kind = value;
    }
}
exports.QuanHeDaiSo = QuanHeDaiSo;
QuanHeDaiSo.Z = -1;
QuanHeDaiSo.LON_HON = 0;
QuanHeDaiSo.LON_HON_BANG = 1;
QuanHeDaiSo.BE_HON = 2;
QuanHeDaiSo.BE_HON_BANG = 3;
QuanHeDaiSo.BANG = 4;
QuanHeDaiSo.CHIA_HET = 5;
QuanHeDaiSo.UOC_SO = 6;
QuanHeDaiSo.BOI_SO = 7;
QuanHeDaiSo.SO_CHAN = 8;
QuanHeDaiSo.SO_LE = 9;
class CheckerQuanHeDaiSo {
    constructor(condition, checker) {
        this.condition = condition;
        this.checker = checker;
    }
    duyet() {
        return this.checker.check(this.condition);
    }
}
exports.CheckerQuanHeDaiSo = CheckerQuanHeDaiSo;
class QuanHeDaiSoFactory {
    create_LON_HON(left, right, bienCoSo) {
        let name = 'Lớn hơn';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.LON_HON, '>', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value > condition.right.value;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    //// LON HON BANG ">="
    create_LON_HON_BANG(left, right, bienCoSo) {
        let name = 'Lớn hơn bằng';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.LON_HON_BANG, '>=', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value >= condition.right.value;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    //// NHO HON "<"
    create_NHO_HON(left, right, bienCoSo) {
        let name = 'Nhỏ hơn';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.BE_HON, '<', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value < condition.right.value;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// NHO HƠN BANG "<="
    create_NHO_HON_BANG(left, right, bienCoSo) {
        let name = 'Nhỏ hơn bằng';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.BE_HON_BANG, '<=', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value <= condition.right.value;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// BANG "="
    create_BANG(left, right, bienCoSo) {
        let name = 'Bằng';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.BANG, '=', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value === condition.right.value;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// CHIA HET
    create_CHIA_HET(left, right, bienCoSo) {
        let name = 'chia hết cho';
        // '\u2223'
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.CHIA_HET, 'chia hết cho', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value % condition.right.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.operator === '*' && (condition.left.childs[0].id === condition.right.id ||
                        condition.left.childs[1].id === condition.right.id);
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// UOC SO
    create_UOC_SO(left, right, bienCoSo) {
        let name = 'Ước số';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.UOC_SO, '\u2223', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.right.value % condition.left.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.right.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.right.operator === '*' && (condition.right.childs[0].id === condition.left.id ||
                        condition.right.childs[1].id === condition.left.id);
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// BOI SO
    create_BOI_SO(left, right, bienCoSo) {
        let name = 'BỘi số';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.BOI_SO, '\u2223', left, right, [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value % condition.right.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value === 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.id === condition.right.id;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.operator === '*' && (condition.left.childs[0].id === condition.right.id ||
                        condition.left.childs[1].id === condition.right.id);
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    /// SO CHAN
    create_SO_CHAN(left, bienCoSo) {
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
        return this.create_CHIA_HET(left, Helper_1.HelperBieuThucDaiSo.Helper.TAO_HANG_SO(2), bienCoSo);
    }
    /// SO LE
    create_SO_LE(left, bienCoSo) {
        let name = 'Số lẻ';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.SO_LE, 'là số lẻ', left, Helper_1.HelperBieuThucDaiSo.Helper.TAO_HANG_SO(2), [], bienCoSo);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                let hl = true;
                try {
                    hl = condition.left.value % 2 !== 0;
                }
                catch (error) {
                    hl = false;
                }
                return hl;
            }
        }));
        condition.checker = checker;
        return condition;
    }
    create_Z() {
        let name = 'Số lẻ';
        let condition = new QuanHeDaiSo(name, QuanHeDaiSo.SO_LE, 'số nguyên', new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc, new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc, [], []);
        let checker = [];
        checker.push(new CheckerQuanHeDaiSo(condition, new class {
            check(condition) {
                return true;
            }
        }));
        condition.checker = checker;
        return condition;
    }
}
exports.QuanHeDaiSoFactory = QuanHeDaiSoFactory;
