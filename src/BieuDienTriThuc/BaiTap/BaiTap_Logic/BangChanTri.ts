import { BieuThucMenhDe } from "../../ChuongLogic/ThanhPhanC/BieuThucMenhDe";
import { BaiTap } from "../BaiTap";
import { Helper } from '../../ChuongLogic/ThanhPhanFuncs/Helper';
import { BieuThucBuilder } from '../../ChuongLogic/ThanhPhanC/BieuThucBuilder';
import { ToanTu } from "../../ChuongLogic/ThanhPhanOpts/ToanTuLogic";

export class BangChanTri extends BaiTap {
    private _bieuThuc: BieuThucMenhDe = new BieuThucMenhDe();
    bieuThucSoCap: BieuThucMenhDe[] = [];
    bieuThucs: BieuThucMenhDe[] = [];
    loiGiai:LoiGiaiBangChanTri=new LoiGiaiBangChanTri();


    constructor(bieuThuc?: BieuThucMenhDe) {
        super();
        if (bieuThuc)
            this.bieuThuc = bieuThuc;
    }

    giai(deBai?: string) {

        // let builder = new BieuThucBuilder().addBieuThucCon(Helper.BIEU_THUC_SO_CAP('p'))
        //                                    .addBieuThucCon(new BieuThucBuilder()
        //                                    .addBieuThucCon(Helper.BIEU_THUC_SO_CAP('p'))
        //                                    .addBieuThucCon(Helper.BIEU_THUC_SO_CAP('q'))
        //                                    .addToanTu(ToanTu.KEO_THEO)
        //                                    .build())
        //                                    .addToanTu(ToanTu.KEO_THEO)
        //                                    .build(); 

        // this.bieuThuc = builder;                                   
        this.themBieuThucSoCap(this.bieuThuc);
        
        /// N BIT STRING
        let head:string []=[];
        this.bieuThucSoCap.forEach(e=>
            head.push(Helper.IN(e))
        );
        this.bieuThucs.forEach(e => {
            head.push(Helper.IN(e)); 
        }); 
        this.loiGiai.head = head;
        //////
        let m:number[]=[];
        for (let i = 0; i < this.bieuThucSoCap.length; i++) m.push(0);
        this.getKETQUA(m);
        for (let i = m.length-1; i >=0 ; i--) {
            if(m[i]===1)continue;
            m[i] = 1;
            for(let j = i+1;j<m.length;j++ ) m [j] = 0;
            i = m.length;

            this.getKETQUA(m);  
        }

        return this.loiGiai;
    }

    getKETQUA(m:number[]){
        for(let i = 0 ;i<m.length;i++){
            if(m[i])this.bieuThucSoCap[i].chanTri = true;
            else this.bieuThucSoCap[i].chanTri = false;
        }

        let info:string  =``;
        let row:boolean [] =[]; 
        this.bieuThucSoCap.forEach(e=>
            row.push(e.chanTri)    
        );
        
        this.bieuThucs.forEach(e => {
            row.push(e.chanTri)    
        });    

        this.loiGiai.body.push(row);
    }
    ////////////// TIEN HANH XU LY
    themBieuThucSoCap(P: BieuThucMenhDe) {
        if (Helper.IS_BIEU_THUC_SO_CAP(P)) {
            let index = this.bieuThucSoCap.findIndex(e => e.id === P.id)
            if (index === -1) {this.bieuThucSoCap.push(P);
            return this.bieuThucSoCap[this.bieuThucSoCap.length-1];}
            else return this.bieuThucSoCap[index];
        }
        for (let i = 0; i < P.bieuThucCons.length; i++) {
            let index = this.bieuThucs.findIndex(e => e.id === P.bieuThucCons[i].id);
            if (index === -1) {
                P.bieuThucCons[i] = this.themBieuThucSoCap(P.bieuThucCons[i]);
            } else
                P.bieuThucCons[i] = this.bieuThucs[index];    
        }
        let index = this.bieuThucs.findIndex(e => e.id === P.id);
        if (index === -1) {
            this.bieuThucs.push(P);
            return P;
        } 
        return this.bieuThucs[index];
    }


    public get bieuThuc(): BieuThucMenhDe {
        return this._bieuThuc;
    }
    public set bieuThuc(value: BieuThucMenhDe) {
        this._bieuThuc = value;
    }
}

export class LoiGiaiBangChanTri {
    private _head: string[] = [];
    private _body: boolean[][] = [];

    


    public get body(): boolean[][] {
        return this._body;
    }
    public set body(value: boolean[][]) {
        this._body = value;
    }

    public get head(): string[] {
        return this._head;
    }
    public set head(value: string[]) {
        this._head = value;
    }

}