import { BiaKarnaugh, NhomTeBao } from "./BiaKarnaugh";

export class BiaKarNaugh3Bien extends BiaKarnaugh {
    protected KarNaugh:number[][]=[];

    constructor(karnaugh: number[][]) {
        super();
        this.KarNaugh = karnaugh;
    }


    teBao16(): NhomTeBao|null {
        return null;
    }
    
    teBao8(): NhomTeBao|null {
        for (let i = 0; i < this.KarNaugh.length; i++)
            for (let j = 0; j < this.KarNaugh[0].length; j++)
                if (this.KarNaugh[i][j] === -1) return null;

        return new NhomTeBao(this.KarNaugh);
    }

    teBao4(): NhomTeBao|null {
        let rs: number[][] = [];

        ///KIEM TRA O VUONG
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            if (this.KarNaugh[0][i] == -1 || this.KarNaugh[0][i + 1] == -1 || this.KarNaugh[1][i] == -1 || this.KarNaugh[1][i + 1] == -1) continue;
            let m: number[] = [this.KarNaugh[0][i], this.KarNaugh[0][i + 1], this.KarNaugh[1][i], this.KarNaugh[1][i + 1]]
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        //// KIEM TRA HANG
        if (this.KarNaugh[0][0] !== -1 && this.KarNaugh[0][1] !== -1 && this.KarNaugh[0][2] !== -1 && this.KarNaugh[0][3] !== -1) {
            let m: number[] = [this.KarNaugh[0][0], this.KarNaugh[0][1], this.KarNaugh[0][2], this.KarNaugh[0][3]]
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        //// KIEM TRA HANG 2
        if (this.KarNaugh[1][0] !== -1 && this.KarNaugh[1][1] !== -1 && this.KarNaugh[1][2] !== -1 && this.KarNaugh[1][3] !== -1) {
            let m: number[] = [this.KarNaugh[1][0], this.KarNaugh[1][1], this.KarNaugh[1][2], this.KarNaugh[1][3]]
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        /// KIEM TRA 4 GOC
        if (this.KarNaugh[0][0] !== -1 && this.KarNaugh[1][0] !== -1 && this.KarNaugh[0][3] !== -1 && this.KarNaugh[1][3] !== -1) {
            let m: number[] = [this.KarNaugh[0][0], this.KarNaugh[1][0], this.KarNaugh[0][3], this.KarNaugh[1][3]]
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        if(rs.length ===0)return null;    
        return new NhomTeBao(rs);
    }

    teBao2(): NhomTeBao|null {
        let rs: number[][] = [];
        //// KIEM TRA TRUONG HOP LIEN KET THUONG
        for (let i = 0; i < this.KarNaugh.length; i++) {
            for (let j = 0; j < this.KarNaugh[0].length; j++) {
                if (this.KarNaugh[i][j] === -1) continue;
                /// KIEM TRA NGANG
                if (j<this.KarNaugh[i].length-1 && (this.KarNaugh[i][j] !== -1 && this.KarNaugh[i][j + 1] !== -1)) {
                    let m: number[] = [this.KarNaugh[i][j], this.KarNaugh[i][j + 1]];
                    if (this.kiemTraChuaDung(m)) {
                        rs.push(m);
                    }
                }
                /// KIEM TRA DOC
                if (i < this.KarNaugh.length-1 &&( this.KarNaugh[i][j] !== -1 && this.KarNaugh[i + 1][j] !== -1)) {
                    let m: number[] = [this.KarNaugh[i + 1][j], this.KarNaugh[i][j]];
                    if (this.kiemTraChuaDung(m)) {
                        rs.push(m);
                    }
                }

            }
        }
        
        //// KIEM TRA DOI XUNG BIEN THANG
        for (let i = 0; i < this.KarNaugh.length; i++) {
            if (this.KarNaugh[i][0] === -1 || this.KarNaugh[i][3] === -1) continue;
            let m: number[] = [this.KarNaugh[i][0], this.KarNaugh[i][3]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        if(rs.length ===0)return null;    
        return new NhomTeBao(rs);
    }

    teBao1(): NhomTeBao | null {
        let m:number[] = [];
        for (let i = 0; i < this.KarNaugh.length; i++) {
            for (let j = 0; j < this.KarNaugh[i].length; j++) {
                if(this.KarNaugh[i][j] === -1) continue;
                let b:boolean=false;
                for (let z = 0; z < this.khuongTeBao.length; z++) {
                    if(this.khuongTeBao[z].includes(this.KarNaugh[i][j])){
                        b=true;
                        break;
                    }
                }
                if(!b) m.push(this.KarNaugh[i][j]);
            }             
        }
        if(m.length === 0 )return null;

        return new NhomTeBao([m]);
    }

    public thuTuBiaKNaugh:number[][]=
    [
        [1,3,7,5],
        [2,4,8,6]
    ]

}