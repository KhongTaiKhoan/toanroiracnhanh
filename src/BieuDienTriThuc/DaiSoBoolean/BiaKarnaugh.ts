import { BiaKarNaugh4Bien } from './BiaKarnaugh4Bien';
export abstract class BiaKarnaugh{
    protected teBao:NhomTeBao []=[];

    protected khuongTeBao:number[][]=[];

    static INDEX_TE_BAO_16 :number = 0;
    static INDEX_TE_BAO_8 :number = 1;
    static INDEX_TE_BAO_4 :number = 2;
    static INDEX_TE_BAO_2 :number = 3;
    static INDEX_TE_BAO_1 :number = 4;
 
    
    
    abstract teBao16():NhomTeBao|null;
    abstract teBao8() :NhomTeBao|null;
    abstract teBao4() :NhomTeBao|null;
    abstract teBao2() :NhomTeBao|null;
    abstract teBao1():NhomTeBao|null;
    kiemTraChuaDung(mang:number[]):boolean{

        for (let i = 0; i < this.khuongTeBao.length; i++) {

             
            if (this.khuongTeBao.length === 0) return true;
            if (this.khuongTeBao[i].length === 0) continue;
            let count = 0;
            for (let j = 0; j < mang.length; j++) {
                if (this.khuongTeBao[i].includes(mang[j])) count++;
            }

            if (count === mang.length) return false;

        }
        return true;
    }

    duyetCacTeBao() {
        let teBao16 = this.teBao16();
        if (teBao16 !== null) {
            this.teBao.push(teBao16);
            this.insertKhuonTeBao(teBao16.teBao);
        } else this.insertKhuonTeBao([]);

        let teBao8 = this.teBao8();
        if (teBao8 !== null) {
            this.teBao.push(teBao8);
            this.insertKhuonTeBao(teBao8.teBao);
        } else this.insertKhuonTeBao([]);

        let teBao4 = this.teBao4();
        if (teBao4 !== null) {
            this.teBao.push(teBao4);
            this.insertKhuonTeBao(teBao4.teBao);
        } else this.insertKhuonTeBao([]);


        let teBao2 = this.teBao2();
        if (teBao2 !== null) {
            this.teBao.push(teBao2);
            this.insertKhuonTeBao(teBao2.teBao);
        } else this.insertKhuonTeBao([]);

        let teBao1 = this.teBao1();
        if (teBao1 !== null) {
            this.teBao.push(teBao1);
            this.insertKhuonTeBao(teBao1.teBao);
        } else this.insertKhuonTeBao([]);


    }

    layTeBao(){
      
        return this.teBao;
    }

    insertKhuonTeBao(khuon:number[][]){
       if(khuon.length === 0){this.khuongTeBao.push([]); return ;}
       let m:number[]=[];
       for (let i = 0; i < khuon.length; i++) {
           for (let j = 0; j < khuon[i].length; j++) {
               if(m.length===0||!m.includes(khuon[i][j])) m.push(khuon[i][j])               
           }
       }
       this.khuongTeBao.push(m);
    }

}

export class NhomTeBao{
   teBao:number[][] = [];
   constructor(teBao:number[][]){
      this.teBao = teBao;
   }
} 