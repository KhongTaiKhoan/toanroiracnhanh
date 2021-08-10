"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoDoHasse = exports.ChiTietTinhChatQuanHeThuTu = exports.XacDinhBaiQuanHeThuTu = void 0;
const QuanHe_1 = require("../ThanhPhanC/QuanHe");
const QuanHeDaiSo_1 = require("../ThanhPhanC/QuanHeDaiSo");
const TapHop_1 = require("../ThanhPhanC/TapHop");
const PhanLoaiQuanHe_1 = require("./PhanLoaiQuanHe");
class XacDinhBaiQuanHeThuTu {
    constructor(R) {
        this.R = R;
        this.Parent = R.khongGianMau;
        this.Parent.array = this.Parent.array.sort((a, b) => {
            if (a.element[0] > b.element[0])
                return 1;
            if (a.element[0] < b.element[0])
                return -1;
            return 0;
        });
    }
    xacDinh() {
        let x = PhanLoaiQuanHe_1.PhanLoaiQuanHe.phanLoai(PhanLoaiQuanHe_1.PhanLoaiQuanHe.THU_TU, this.R);
        if (!x)
            throw new Error('Quan hệ không phải là quan hệ thứ tự');
        if (this.Parent.getKind() !== TapHop_1.TapHop.TAP_HOP_LIET_KE)
            throw new Error('Tap khong gian mau phai la tap liet ke');
        if (this.R.getKind() === TapHop_1.TapHop.TAP_HOP_LIET_KE)
            return this.LietKe();
        return this.DieuKien();
    }
    LietKe() {
        let maTran = this.khoiTaoMaTran();
        // maTran.forEach(e=>{
        //     let str='';
        //     e.forEach(el=>{
        //        str+=el+' ';
        //     });
        //     console.log(str);
        // });
        let seed = [];
        for (let i = 0; i < this.Parent.array.length; i++) {
            //// NEU RONG THI ADD VAO
            if (seed.length === 0) {
                seed.push([]);
                seed[0].push(new SoDoHasse.Node(i, [], []));
            }
            //// INSERT VAO TUNG SO
            else {
                let b = false;
                for (let j = seed.length - 1; j >= 0; j--) {
                    let parent = [];
                    for (let z = 0; z < seed[j].length; z++) {
                        if (maTran[seed[j][z].id][i] !== 0)
                            parent.push(z);
                    }
                    if (parent.length === 0)
                        continue;
                    let nodes = [];
                    let child = new SoDoHasse.Node(i);
                    if (j === seed.length - 1)
                        seed.push([]);
                    seed[j + 1].push(child);
                    for (let z = 0; z < parent.length; z++) {
                        nodes.push(seed[j][parent[z]]);
                        seed[j][parent[z]].childs.push(child);
                    }
                    child.parents = nodes;
                    b = true;
                    break;
                }
                if (!b) {
                    seed[0].push(new SoDoHasse.Node(i, [], []));
                }
            }
        }
        /// SAO CHEP
        let seed_value = [];
        for (let i = 0; i < seed.length; i++) {
            for (let j = 0; j < seed[i].length; j++) {
                seed[i][j].id = this.Parent.array[seed[i][j].id].element[0];
                //  row.push(this.Parent.array[seed[i][j].id].element[0]);
            }
            // seed_value.push(row);
        }
        //IN
        for (let i = 0; i < seed.length; i++) {
            // let str='';
            let row = [];
            for (let j = 0; j < seed[i].length; j++) {
                //    str+=seed[i][j].id+' ';
                row.push(seed[i][j].id);
            }
            // console.log(str);
            seed_value.push(row);
        }
        //IN
        let thanhPhanToiTieu = [];
        let thanhPhanToiDai = [];
        let giaTriLonNhat = [];
        let giaTriNhoNhat = [];
        let hasse = [];
        for (let i = 0; i < seed[0].length; i++)
            thanhPhanToiTieu.push(seed[0][i].id);
        if (thanhPhanToiTieu.length === 1) {
            giaTriNhoNhat.push(thanhPhanToiTieu[0]);
        }
        for (let i = 0; i < seed.length; i++) {
            for (let j = 0; j < seed[i].length; j++)
                if (seed[i][j].childs.length === 0) {
                    thanhPhanToiDai.push(seed[i][j].id);
                }
        }
        if (thanhPhanToiDai.length === 1) {
            giaTriLonNhat.push(thanhPhanToiDai[0]);
        }
        for (let i = 0; i < seed.length - 1; i++) {
            for (let j = 0; j < seed[i].length; j++) {
                seed[i][j].childs.forEach(e => {
                    hasse.push([seed[i][j].id, e.id]);
                });
            }
        }
        let rs = new ChiTietTinhChatQuanHeThuTu(thanhPhanToiTieu, thanhPhanToiDai, giaTriLonNhat, giaTriNhoNhat, hasse);
        rs.seed = seed_value;
        return rs;
    }
    DieuKien() {
        if (this.R.dieuKien) {
            let condition = this.R.dieuKien;
            let newArr = [];
            let parentArr = [];
            condition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.R.dieuKien);
            for (let i = 0; i < this.Parent.array.length; i++) {
                parentArr.push(this.Parent.array[i].element[0]);
                for (let j = 0; j < this.Parent.array.length; j++) {
                    if (i === j)
                        continue;
                    condition = QuanHeDaiSo_1.QuanHeDaiSo.copy(this.R.dieuKien);
                    condition.replaceVariale([{ var: 'a', value: this.Parent.array[i].element[0] + '' }, { var: 'b', value: this.Parent.array[j].element[0] + '' }]);
                    if (condition.check()) {
                        newArr.push([this.Parent.array[i].element[0], this.Parent.array[j].element[0]]);
                    }
                }
            }
            this.R = new QuanHe_1.QuanHeFactory().createQuanHeLietKe(this.Parent, newArr);
            return this.LietKe();
        }
        throw new Error('Day khong phai la dieu kien');
    }
    khoiTaoMaTran() {
        let matrix = [];
        let A = this.R.khongGianMau.array;
        for (let i = 0; i < A.length; i++) {
            let row = [];
            for (let j = 0; j < A.length; j++) {
                row.push(0);
            }
            matrix.push(row);
        }
        for (let i = 0; i < this.R.array.length; i++) {
            let l = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[0]; });
            let r = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[1]; });
            matrix[l][r] = 1;
        }
        return matrix;
    }
}
exports.XacDinhBaiQuanHeThuTu = XacDinhBaiQuanHeThuTu;
class ChiTietTinhChatQuanHeThuTu {
    constructor(thanhPhanToiTieu, thanhPhanToiDai, giaTriLonNhat, giaTriNhoNhat, soDo) {
        this.soDo = [];
        this.seed = [];
        this.giaTriLonNhat = giaTriLonNhat;
        this.giaTriNhoNhat = giaTriNhoNhat;
        this.thanhPhanToiDai = thanhPhanToiDai;
        this.thanhPhanToiTieu = thanhPhanToiTieu;
        this.soDo = soDo;
    }
}
exports.ChiTietTinhChatQuanHeThuTu = ChiTietTinhChatQuanHeThuTu;
// export namespace SoDoHasse {
//     export class Tree {
//        public seed:Node[]=[];
//        insert():void{
//        }
//        insertNode(node:Node){
//        }
//     }
//     export class Node{
//         public id:number = 0;
//         public parents:Node[] = [];
//         public childs:Node[]=[];
//         constructor(id:number,parents:Node[],childs:Node[]){
//             this.id = id;
//             this.parents = parents;
//             this.childs  =childs;
//         }
//     }
// }
var SoDoHasse;
(function (SoDoHasse) {
    class Tree {
        constructor() {
            this.tree = [];
            this.lienKet = [];
        }
    }
    SoDoHasse.Tree = Tree;
    class Node {
        constructor(id = 0, parents = [], childs = []) {
            this.id = 0;
            this.parents = [];
            this.childs = [];
            this.id = id;
            this.parents = parents;
            this.childs = childs;
        }
    }
    SoDoHasse.Node = Node;
})(SoDoHasse = exports.SoDoHasse || (exports.SoDoHasse = {}));
