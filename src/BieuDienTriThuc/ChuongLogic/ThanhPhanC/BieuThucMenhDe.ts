import { ToanTu } from "../ThanhPhanOpts/ToanTuLogic";
import {ToanTuFactory} from "../ThanhPhanOpts/ToanTuFactory";
import { BieuThucBuilder } from './BieuThucBuilder';
import { Helper } from '../ThanhPhanFuncs/Helper';

class BieuThucMenhDe {
    static MA_HANG_DUNG  = "TRUE";
    static MA_HANG_SAI  = "FALSE";


    private _id: string;
    private _toanTu: ToanTu;
    private _chanTri: boolean;
   

    private _bieuThucCons: BieuThucMenhDe[];
    private _cha: BieuThucMenhDe | null;
    

    constructor() {
        this._id = "";
        this._toanTu = new ToanTuFactory().create(ToanTu.NONE);
        this._chanTri = false;
        this._bieuThucCons = [];
        this._cha = null; 
    }

    /// getter and setter

    public get id(): string {        
        if(this.toanTu.tenToanTu === ToanTu.PHU_DINH){
            if(Helper.IS_BIEU_THUC_SO_CAP(this)) return  this.toanTu.toString()+this._id;        
            return   this.toanTu.toString()+"("+this.bieuThucCons[0].id+")";
        }
        if(Helper.IS_BIEU_THUC_SO_CAP(this)){
            return  this.toanTu.toString()+this._id;        
        }

        if(this.toanTu.tenToanTu === ToanTu.TUONG_DUONG || this.toanTu.tenToanTu === ToanTu.KEO_THEO ){
            let s:string = this.toanTu.toString();
            if(Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[0]))
                s+= this.bieuThucCons[0].id;
            else     s+= `(${this.bieuThucCons[0].id})`;
            if(Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[1]))
                s+= this.bieuThucCons[1].id;
            else     s+= `(${this.bieuThucCons[1].id})`;
            return s;
        }

        

        let str:string []=[];
        let str_2:string = '';
        for(let i:number = 0;i<this.bieuThucCons.length;i++){
            if(!Helper.IS_BIEU_THUC_SO_CAP(this.bieuThucCons[i]))
              str_2+=`(${this.bieuThucCons[i].id})`
            else{
                if(str.length === 0)
                   str.push( this.bieuThucCons[i].id); 
                else{
                    for(let j:number=str.length-1;j>=0;j--){
                    
                        let s1:string = this.bieuThucCons[i].id;
                        let s2:string = str[j];
                      
                        if(s1.includes(`${ToanTu.PHU_DINH}`))s1 = s1.split(`${ToanTu.PHU_DINH}`)[1];
                        if(s2.includes(`${ToanTu.PHU_DINH}`))s2 = s2.split(`${ToanTu.PHU_DINH}`)[1];
                         
                        if(s2 < s1){
                            if(j===str.length-1) str.push( this.bieuThucCons[i].id); 
                            else
                            str.splice(j+1,0,this.bieuThucCons[i].id);
                            break;
                        } else if(s2===s1){
                            if(this.bieuThucCons[i].id.includes(`${ToanTu.PHU_DINH}`)){
                                str.splice(j,0,this.bieuThucCons[i].id);
                            }else {
                                str.splice(j+1,0,this.bieuThucCons[i].id);
                            }
                            break;
                        }

                        if(j===0){
                            str.splice(j,0,this.bieuThucCons[i].id);
                        }

                            
                    }
                }    
            }  

        }
        let s:string ='';
        for(let i:number=0;i<str.length;i++){
            s+= str[i]; 
        }  

        return this.toanTu.toString() +s + str_2;  
    }
    public set id(value: string) {
        this._id = value;
    }



    public get chanTri(): boolean {
        if(Helper.IS_BIEU_THUC_SO_CAP(this) ){
            if(this.toanTu.tenToanTu === ToanTu.PHU_DINH)return !this._chanTri; 
            return this._chanTri;
        }
        return this.toanTu.tinhToan(this);
    }
    public set chanTri(value: boolean) {
        this._chanTri = value;
    }


    public get toanTu(): ToanTu {
        return this._toanTu;
    }
    public set toanTu(value: ToanTu) {
        this._toanTu = value;
    }


    public get bieuThucCons():  BieuThucMenhDe[]{
        return this._bieuThucCons;
    }
    public set bieuThucCons(value: BieuThucMenhDe[]) {
        this._bieuThucCons = value;
    }

    public getIndex(id:string):number|undefined{
        let index :number = -1;
        for(let i:number = 0;i<this.bieuThucCons.length;i++){
            if(this.bieuThucCons[i].id === id){
                index=i;
                break;
            }
        }
       
        return index;   
    }

    public get cha(): BieuThucMenhDe | null {
        return this._cha;
    }
    public set cha(value: BieuThucMenhDe | null) {
        this._cha = value;
    }
}


export { BieuThucMenhDe };