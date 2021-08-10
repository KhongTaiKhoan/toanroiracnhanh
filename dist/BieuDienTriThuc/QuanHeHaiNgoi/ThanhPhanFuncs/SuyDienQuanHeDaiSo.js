"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuyDienQuanHeDaiSo_Factory = exports.ChiTietSuyDien = exports.LuatSuyDien = exports.SuyDienQuanHeDaiSo = void 0;
const BieuThucDaiSo_1 = require("../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo");
const Helper_1 = require("../../BieuThucDaiSoZ/ThanhPhanFuncs/Helper");
const QuyTacRutGonn_1 = require("../../BieuThucDaiSoZ/ThanhPhanRules/QuyTacRutGonn");
const QuanHeDaiSo_1 = require("../ThanhPhanC/QuanHeDaiSo");
class SuyDienQuanHeDaiSo {
    constructor(GT, KL) {
        this._GT = [];
        this.chiTietSuyDien = [];
        this.result = [];
        this.state = 2;
        this._luat = [];
        this._KL = KL;
        this._GT = GT;
        for (let i = 0; i < this.GT.length; i++) {
            this.chiTietSuyDien.push(new ChiTietSuyDien(i, [-1], GT[i]));
        }
        ;
        // this.luat = luat;
    }
    truyVet(R) {
        if (R.parent[0] === -1) {
            this.result.push(new ChiTietSuyDien(this.result.length, [-1], R.R));
            return;
        }
        let parent = [];
        if (this.state === SuyDienQuanHeDaiSo.SUCCESS) {
            for (let i = 0; i < R.parent.length; i++) {
                let index = this.result.findIndex(e => { return e.R.left.id === this.chiTietSuyDien[R.parent[i]].R.left.id; });
                if (index === -1) {
                    this.truyVet(this.chiTietSuyDien[R.parent[i]]);
                    let index_2 = this.result.findIndex(e => { return e.R.left.id === this.chiTietSuyDien[R.parent[i]].R.left.id; });
                    parent.push(this.result[index_2].id);
                }
                else
                    parent.push(this.result[index].id);
            }
            let MAX_ID = 0;
            this.result.forEach(e => { if (MAX_ID < e.id)
                MAX_ID = e.id; });
            this.result.push(new ChiTietSuyDien(MAX_ID + 1, parent, R.R));
        }
        return R;
    }
    suyDien() {
        this.duyet();
        if (this.state !== SuyDienQuanHeDaiSo.SUCCESS)
            return [];
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
    duyet() {
        let i = 0;
        while (this.state === SuyDienQuanHeDaiSo.CONTINUE) {
            let length = this.GT.length;
            let back = false;
            for (i = 0; i < length; i++) {
                let hl = false;
                // if (this.GT[i].left.kind !== KhonGianSoNguyen.BieuThuc.PHUC_HOP) continue;
                for (let j = 0; j < this.luat.length; j++) {
                    this.state = this.isStop(i, this.GT.length);
                    if (this.state !== SuyDienQuanHeDaiSo.SUCCESS) {
                        let b = this.luat[j].apDung(this.GT[i]);
                        ;
                        hl = hl || b;
                        this.state = this.isStop(i, this.GT.length);
                    }
                }
                // for (let j = 0; j < this.GT.length; j++) {
                //     console.log(this.GT[j].toString());
                // }
                // console.log('==============');
                if (hl) {
                    this.state = this.isStop(i, this.GT.length);
                    this.GT.splice(i, 1);
                    back = true;
                    break;
                }
            }
            if (!back) {
                console.log('CANCEL');
                this.state = SuyDienQuanHeDaiSo.FAIL;
                break;
            }
        }
    }
    insertGT(parent, child) {
        let index_child = this.chiTietSuyDien.findIndex(e => { return e.R.toString() === child.toString(); });
        if (index_child !== -1)
            return false;
        // console.log(child.toString());
        let idParent = [];
        for (let i = 0; i < parent.length; i++) {
            let index = this.chiTietSuyDien.findIndex(e => { return e.R.toString() === parent[i].toString(); });
            if (index !== -1)
                idParent.push(this.chiTietSuyDien[index].id);
        }
        let MAX_ID = 0;
        this.chiTietSuyDien.forEach(e => { if (MAX_ID < e.id)
            MAX_ID = e.id; });
        this.chiTietSuyDien.push(new ChiTietSuyDien(MAX_ID + 1, idParent, child));
        this.GT.push(child);
        return true;
    }
    isStop(i, length) {
        let index = this.chiTietSuyDien.findIndex(e => { return e.R.toString() === this.KL.toString(); });
        if (index !== -1)
            return SuyDienQuanHeDaiSo.SUCCESS;
        if (this.GT.length === 0)
            return SuyDienQuanHeDaiSo.FAIL;
        if (i == length)
            return SuyDienQuanHeDaiSo.FAIL;
        return SuyDienQuanHeDaiSo.CONTINUE;
    }
    get luat() {
        return this._luat;
    }
    set luat(value) {
        this._luat = value;
    }
    get GT() {
        return this._GT;
    }
    set GT(value) {
        this._GT = value;
    }
    get KL() {
        return this._KL;
    }
    set KL(value) {
        this._KL = value;
    }
}
exports.SuyDienQuanHeDaiSo = SuyDienQuanHeDaiSo;
SuyDienQuanHeDaiSo.SUCCESS = 0;
SuyDienQuanHeDaiSo.FAIL = 1;
SuyDienQuanHeDaiSo.CONTINUE = 2;
class LuatSuyDien {
    constructor(suyDien) {
        this.suyDien = suyDien;
    }
}
exports.LuatSuyDien = LuatSuyDien;
class ChiTietSuyDien {
    constructor(id, parent, R) {
        this.id = id;
        this.parent = parent;
        this.R = R;
    }
}
exports.ChiTietSuyDien = ChiTietSuyDien;
class SuyDienQuanHeDaiSo_Factory {
    create_BANG(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// LUAT DOI VI TRI 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let bt = newCon.left;
                newCon.left = newCon.right;
                newCon.right = bt;
                return this.suyDien.insertGT([R], newCon);
            }
        }(suyDien));
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_LON_HON(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_NHO_HON(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_LON_HON_BANG(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// LUAT DOI VI TRI 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let bt = newCon.left;
                newCon.left = newCon.right;
                newCon.right = bt;
                return this.suyDien.insertGT([R], newCon);
            }
        }(suyDien));
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_NHO_HON_BANG(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// LUAT DOI VI TRI 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let bt = newCon.left;
                newCon.left = newCon.right;
                newCon.right = bt;
                return this.suyDien.insertGT([R], newCon);
            }
        }(suyDien));
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.toString() !== R.toString() && e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_CHIA_HET(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                let right = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left.childs[0], right, R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left.childs[1], right, R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));
        /// luat doi so
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                left = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThucBuilder().addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                    .addChild(left)
                    .addOperator('*')
                    .build();
                left = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left, right, R.bienCoSo));
            }
        }(suyDien));
        /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                if (this.suyDien.KL.left.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
                    return false;
                let left = this.suyDien.KL.left;
                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id; });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id; });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_SO_CHAN(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                let right = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left.childs[0], R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left.childs[1], R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));
        /// luat doi so
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                left = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThucBuilder().addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                    .addChild(left)
                    .addOperator('*')
                    .build();
                left = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left, R.bienCoSo));
            }
        }(suyDien));
        /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                if (this.suyDien.KL.left.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
                    return false;
                let left = this.suyDien.KL.left;
                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id; });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id; });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_SO_LE(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// PHA BO + - 
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                let right = R.right;
                if (left.operator === '+' || left.operator === '-') {
                    let b1 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left.childs[0], R.bienCoSo));
                    let b2 = this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left.childs[1], R.bienCoSo));
                    return b1 && b2;
                }
                return false;
            }
        }(suyDien));
        /// luat doi so
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                let left = R.left;
                left = new BieuThucDaiSo_1.KhonGianSoNguyen.BieuThucBuilder().addChild(Helper_1.HelperBieuThucDaiSo.Helper.TAO_HANG_SO(-1))
                    .addChild(left)
                    .addOperator('*')
                    .build();
                left = new QuyTacRutGonn_1.QuyTacDaiSo.RutGon().simplify(left);
                let right = R.right;
                return this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left, R.bienCoSo));
            }
        }(suyDien));
        /// luat gop
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                if (this.suyDien.KL.left.kind !== BieuThucDaiSo_1.KhonGianSoNguyen.BieuThuc.PHUC_HOP)
                    return false;
                let left = this.suyDien.KL.left;
                let index_left = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[0].id; });
                if (index_left !== -1) {
                    let index_right = this.suyDien.GT.findIndex(e => { return e.left.id === left.childs[1].id; });
                    if (index_right !== -1) {
                        return this.suyDien.insertGT([this.suyDien.GT[index_left], this.suyDien.GT[index_right]], this.suyDien.KL);
                    }
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_UOC_SO(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// QUAN HE BAN THAN
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                return this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(R.left, R.left, R.bienCoSo))
                    || this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(R.right, R.right, R.bienCoSo));
            }
        }(suyDien));
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.right = R.right;
                    newCon.left = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create_BOI_SO(GT, KL) {
        let suyDien = new SuyDienQuanHeDaiSo(GT, KL);
        let luat = [];
        /// QUAN HE BAN THAN
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                R = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                return this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(R.left, R.left, R.bienCoSo))
                    || this.suyDien.insertGT([R], new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(R.right, R.right, R.bienCoSo));
            }
        }(suyDien));
        /// luat bac cau
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.left.id === R.right.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.left;
                    newCon.right = this.suyDien.GT[index].right;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        /// luat bac cau 2
        luat.push(new class extends LuatSuyDien {
            apDung(R) {
                let index = this.suyDien.GT.findIndex(e => { return e.right.id === R.left.id; });
                if (index !== -1) {
                    let newCon = QuanHeDaiSo_1.QuanHeDaiSo.copy(R);
                    newCon.left = R.right;
                    newCon.right = this.suyDien.GT[index].left;
                    // console.log('\n'+newCon.toString()+'\n');
                    return this.suyDien.insertGT([R, this.suyDien.GT[index]], newCon);
                }
                return false;
            }
        }(suyDien));
        suyDien.luat = luat;
        return suyDien;
    }
    create(kind, GT, KL) {
        switch (kind) {
            case QuanHeDaiSo_1.QuanHeDaiSo.BANG:
                return this.create_BANG(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.LON_HON:
                return this.create_LON_HON(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.BE_HON:
                return this.create_NHO_HON(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.LON_HON_BANG:
                return this.create_LON_HON_BANG(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.BE_HON_BANG:
                return this.create_NHO_HON_BANG(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.CHIA_HET:
                return this.create_CHIA_HET(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.UOC_SO:
                return this.create_UOC_SO(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.BOI_SO:
                return this.create_BOI_SO(GT, KL);
            case QuanHeDaiSo_1.QuanHeDaiSo.SO_CHAN:
                return this.create_SO_CHAN(GT, KL);
            default:
                return this.create_SO_LE(GT, KL);
        }
    }
}
exports.SuyDienQuanHeDaiSo_Factory = SuyDienQuanHeDaiSo_Factory;
