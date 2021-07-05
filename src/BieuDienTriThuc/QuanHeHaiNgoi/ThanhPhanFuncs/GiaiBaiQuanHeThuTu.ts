import { QuanHe, QuanHeFactory } from '../ThanhPhanC/QuanHe';
import { QuanHeDaiSo } from '../ThanhPhanC/QuanHeDaiSo';
import { TapHop } from '../ThanhPhanC/TapHop';
import { BaiTap } from '../../BaiTap/BaiTap';
import { PhanLoaiQuanHe } from './PhanLoaiQuanHe';
export class XacDinhBaiQuanHeThuTu {
   
    private R:QuanHe;
    private Parent:TapHop;
    constructor(R:QuanHe){
        
        this.R = R;
        this.Parent = R.khongGianMau;
        this.Parent.array = this.Parent.array.sort((a,b)=>{
            if(a.element[0]>b.element[0]) return 1;
            if(a.element[0]<b.element[0]) return -1;
            return 0;
        }) ; 
    }

    xacDinh():ChiTietTinhChatQuanHeThuTu {
        let x = PhanLoaiQuanHe.phanLoai(PhanLoaiQuanHe.THU_TU,this.R);
        if(!x)throw new Error('Quan hệ không phải là quan hệ thứ tự');
       if(this.Parent.getKind() !== TapHop.TAP_HOP_LIET_KE) throw new Error('Tap khong gian mau phai la tap liet ke');
       if(this.R.getKind() === TapHop.TAP_HOP_LIET_KE)return this.LietKe();
       return this.DieuKien();
    }
    private LietKe():ChiTietTinhChatQuanHeThuTu{
        let maTran:number[][]= this.khoiTaoMaTran();
        // maTran.forEach(e=>{
        //     let str='';
        //     e.forEach(el=>{
        //        str+=el+' ';
        //     });
        //     console.log(str);
        // });
        let seed: SoDoHasse.Node[][] = [];
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
                    let parent: number[] = [];
                    for (let z = 0; z < seed[j].length; z++) {
                        if (maTran[seed[j][z].id][i] !== 0)
                            parent.push(z);
                    }
                    if (parent.length === 0) continue;
                    let nodes:SoDoHasse.Node[]=[];
                    let child:SoDoHasse.Node = new SoDoHasse.Node(i);
                    if (j === seed.length-1) seed.push([]);
                    seed[j+1].push(child);
                    for (let z = 0; z < parent.length; z++) {
                        nodes.push(seed[j][parent[z]]);
                        seed[j][parent[z]].childs.push(child);    
                    }
                    child.parents = nodes;
                    b=true;
                    break;
                }
                if(!b){
                    seed[0].push(new SoDoHasse.Node(i, [], []));
                }
                
            }
        }

       

        /// SAO CHEP
        let seed_value:number[][]=[];
        
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
            let row=[];
            for (let j = 0; j < seed[i].length; j++) {
            //    str+=seed[i][j].id+' ';
                row.push(seed[i][j].id);
            }
            // console.log(str);
            seed_value.push(row);
        }
        //IN

        let thanhPhanToiTieu: number[]=[];
        let thanhPhanToiDai: number[]=[];
        let giaTriLonNhat: number[]=[];
        let giaTriNhoNhat: number[]=[];
        let hasse:number[][]=[];
        for (let i = 0; i < seed[0].length; i++) 
            thanhPhanToiTieu.push(seed[0][i].id);

        if(thanhPhanToiTieu.length===1){
            giaTriNhoNhat.push(thanhPhanToiTieu[0]); 
            }    
        
        for (let i = 0; i < seed.length; i++){ 
           for (let j = 0; j < seed[i].length; j++) 
               if(seed[i][j].childs.length === 0){
                   thanhPhanToiDai.push(seed[i][j].id);
               }
        }

        if(thanhPhanToiDai.length===1){
            giaTriLonNhat.push(thanhPhanToiDai[0]);
        }

        for (let i = 0; i < seed.length-1; i++) {
            for (let j = 0; j < seed[i].length; j++) {
                seed[i][j].childs.forEach(e=>{
                    hasse.push([seed[i][j].id,e.id]);
                })
            }
        }

        let rs = new ChiTietTinhChatQuanHeThuTu(thanhPhanToiTieu,thanhPhanToiDai,giaTriLonNhat,giaTriNhoNhat,hasse);
        rs.seed=seed_value;
        return rs;
    }
    
    private DieuKien():ChiTietTinhChatQuanHeThuTu{
        if (this.R.dieuKien) {
            let condition: QuanHeDaiSo | null = this.R.dieuKien
            let newArr: number[][] = [];
            let parentArr:number[]=[];
            condition = QuanHeDaiSo.copy(this.R.dieuKien);
            for (let i = 0; i < this.Parent.array.length; i++) {
                parentArr.push(this.Parent.array[i].element[0]);
                for (let j = 0; j < this.Parent.array.length; j++) {
                    if(i===j)continue;
                    condition = QuanHeDaiSo.copy(this.R.dieuKien);
                    condition.replaceVariale([{var:'a',value:this.Parent.array[i].element[0]+''},{var:'b',value:this.Parent.array[j].element[0]+''}]);
                    if(condition.check()){
                        newArr.push([this.Parent.array[i].element[0],this.Parent.array[j].element[0]]) ;
                    }
                }
            }
            this.R = new QuanHeFactory().createQuanHeLietKe(this.Parent,newArr);
            return this.LietKe();
        }
        throw new Error('Day khong phai la dieu kien');
    }

    private khoiTaoMaTran():number[][]{
        let matrix:number[][]=[];
        let A = this.R.khongGianMau.array;
        for (let i = 0; i < A.length; i++) {
            let row = [];
            for (let j = 0; j < A.length; j++) {
                row.push(0);
            }
            matrix.push(row);
        }

        for (let i = 0; i < this.R.array.length; i++) {

            let l = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[0] });
            let r = this.R.khongGianMau.array.findIndex(e => { return this.R !== null && e.element[0] === this.R.array[i].element[1] });
            matrix[l][r] = 1;

        }
        return matrix;
    }
}

export class ChiTietTinhChatQuanHeThuTu {
    public thanhPhanToiTieu: number[];
    public thanhPhanToiDai: number[];
    public giaTriLonNhat: number[];
    public giaTriNhoNhat: number[];
    public soDo:number[][]=[];
    public seed:number[][]=[];
 
    constructor(thanhPhanToiTieu: number[], thanhPhanToiDai: number[], giaTriLonNhat: number[], giaTriNhoNhat: number[],soDo:number[][]) {
        this.giaTriLonNhat = giaTriLonNhat;
        this.giaTriNhoNhat = giaTriNhoNhat;
        this.thanhPhanToiDai = thanhPhanToiDai;
        this.thanhPhanToiTieu = thanhPhanToiTieu;
        this.soDo =soDo;
    }
}

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

export namespace SoDoHasse {
    export class Tree {
        public tree: number[][] = [];
        public lienKet: number[][] = [];
        
    }

    export class Node{
        public id:number= 0 ;
        public parents:Node[]=[];
        public childs:Node[]=[];

        constructor(id:number= 0,parents:Node[]=[],childs:Node[]=[]){
           this.id =id;
           this.parents=parents;
           this.childs=childs;
        }
    }
}