import { KhonGianSoNguyen } from "../../BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo";
import { QuanHeDaiSo } from './QuanHeDaiSo';

export class TapHop{
    private _array:PhanTuLietKe[] = [];  
    private _dieuKien: QuanHeDaiSo | null = null;
    

    static INVALID = -1;
    static TAP_HOP_LIET_KE:number = 0;
    static TAP_HOP_DIEU_KIEN:number = 1;
    
    constructor(){
        this.array = [];
        this.dieuKien=null;
    }

    public getKind():number{
        if(this.array.length === 0 && this.dieuKien === null)return -1;
        if(this.array.length === 0)return TapHop.TAP_HOP_DIEU_KIEN;
        if(this.dieuKien === null)return TapHop.TAP_HOP_LIET_KE;
        return -1;
    }

    toString(){
       if(this.getKind() === TapHop.TAP_HOP_LIET_KE)
       return `${this.array}`;
       return `Với mọi a,b thuộc Z | ${this.dieuKien?.toString()}`; 
    }
    //#region  GETTER AND SETTER
    public get array() {
        return this._array;
    }
    public set array(value) {
        this._array = value;
    }
    public get dieuKien(): QuanHeDaiSo | null {
        return this._dieuKien;
    }
    public set dieuKien(value: QuanHeDaiSo | null) {
        this._dieuKien = value;
    }
    //#endregion
}

export class PhanTuLietKe{
    private _element: number[] = [];
    public get element(): number[] {
        return this._element;
    }
    public set element(value: number[]) {
        this._element = value;
    }
    constructor(element:number[]){
        this.element = element;
    }
    toString():string{
        if(this.element.length===1)return this.element[0]+'';
        return this.element+'';
    }
}

export class TapHopBuilder {
    private builder:TapHop;
    constructor() {
        this.builder=new TapHop();
    }

    public addCondition(R:QuanHeDaiSo):TapHopBuilder{
        this.builder.dieuKien = R;
        return this;
    }
    public addArray(array:number[]):TapHopBuilder{
        let arr:PhanTuLietKe[]=[];
        for (let i = 0; i < array.length; i++) {
           arr.push(new PhanTuLietKe([array[i]]));
        }
        this.builder.array=arr;
        return this;
    }

    public addArray2D(array:number[][]):TapHopBuilder{
        let arr:PhanTuLietKe[]=[];
        for (let i = 0; i < array.length; i++) {
           arr.push(new PhanTuLietKe(array[i]));
        }
        this.builder.array=arr;
        return this;
    }

    public build():TapHop{
        if(this.builder.getKind() === TapHop.INVALID){
            throw new Error('Chua khoi tao thuoc tinh cho tap hop');
        }
        let T:TapHop = this.builder;
        this.builder = new TapHop();
        return T;
    }

}


