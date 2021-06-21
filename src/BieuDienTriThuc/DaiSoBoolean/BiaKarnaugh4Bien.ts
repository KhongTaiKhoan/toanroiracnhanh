import { BiaKarnaugh, NhomTeBao } from "./BiaKarnaugh";

export class BiaKarNaugh4Bien extends BiaKarnaugh {
    protected KarNaugh:number[][]=[];
    constructor(karnaugh: number[][]) {
        super();
        this.KarNaugh = karnaugh;
    }

    teBao16(): NhomTeBao|null {
        return null;
    }

    teBao8(): NhomTeBao|null {
        let rs: number[][] = [];
        for (let i = 0; i < this.KarNaugh.length - 1; i++) {
            if (this.KarNaugh[i][0] === -1) continue;
            if (this.KarNaugh[i][0] === -1 || this.KarNaugh[i][1] === -1 || this.KarNaugh[i][2] === -1 || this.KarNaugh[i][3] === -1) continue;
            if (this.KarNaugh[i + 1][0] === -1 || this.KarNaugh[i + 1][1] === -1 || this.KarNaugh[i + 1][2] === -1 || this.KarNaugh[i + 1][3] === -1) continue;

            let m = new Array();
            for (let j = 0; j < 2; j++) {
                for (let z = 0; z < 4; z++)
                    m.push(this.KarNaugh[i + j][z]);
            }

            rs.push(m);
        }

        for (let i = 0; i < this.KarNaugh.length - 1; i++) {
            if (this.KarNaugh[0][i] === -1) continue;
            if (this.KarNaugh[0][i] === -1 || this.KarNaugh[1][i] === -1 || this.KarNaugh[2][i] === -1 || this.KarNaugh[3][i] === -1) continue;
            if (this.KarNaugh[0][i + 1] === -1 || this.KarNaugh[1][i + 1] === -1 || this.KarNaugh[2][i + 1] === -1 || this.KarNaugh[3][i + 1] === -1) continue;

            let m = new Array();
            for (let j = 0; j < 2; j++) {
                for (let z = 0; z < 4; z++)
                    m.push(this.KarNaugh[z][i + j]);
            }

            rs.push(m);
        }

        /// KIEM TRA HANG TREN CUNG VA HANG DUOI CUNG
        if (this.KarNaugh[0][0] !== -1 && this.KarNaugh[0][1] !== -1 && this.KarNaugh[0][2] !== -1 && this.KarNaugh[0][3] !== -1)
            if (this.KarNaugh[3][0] !== -1 && this.KarNaugh[3][1] !== -1 && this.KarNaugh[3][2] !== -1 && this.KarNaugh[3][3] !== -1) {
                let m = [];
                m.push(this.KarNaugh[0][0])
                m.push(this.KarNaugh[0][1])
                m.push(this.KarNaugh[0][2])
                m.push(this.KarNaugh[0][3])

                m.push(this.KarNaugh[3][0])
                m.push(this.KarNaugh[3][1])
                m.push(this.KarNaugh[3][2])
                m.push(this.KarNaugh[3][3])
                rs.push(m);
            }

        /// KIEM TRA COT DAU TIEN VA COT CUOI CUNG
        if (this.KarNaugh[0][0] !== -1 && this.KarNaugh[1][0] !== -1 && this.KarNaugh[2][0] !== -1 && this.KarNaugh[3][0] !== -1)
            if (this.KarNaugh[0][3] !== -1 && this.KarNaugh[1][3] !== -1 && this.KarNaugh[2][3] !== -1 && this.KarNaugh[3][3] !== -1) {
                let m = [];
                m.push(this.KarNaugh[0][0])
                m.push(this.KarNaugh[1][0])
                m.push(this.KarNaugh[2][0])
                m.push(this.KarNaugh[3][0])

                m.push(this.KarNaugh[0][3])
                m.push(this.KarNaugh[1][3])
                m.push(this.KarNaugh[2][3])
                m.push(this.KarNaugh[3][3])
                rs.push(m);
            }


        if(rs.length === 0 )return null;

        return new NhomTeBao(rs);
    }

    teBao4(): NhomTeBao|null {
        let rs: number[][] = [];
        //// DUYET HANG
        for (let i = 0; i < this.KarNaugh.length; i++) {
            if (this.KarNaugh[i][0] === -1 || this.KarNaugh[i][1] === -1 || this.KarNaugh[i][2] === -1 || this.KarNaugh[i][3] === -1) continue;
            let m = [this.KarNaugh[i][0], this.KarNaugh[i][1], this.KarNaugh[i][2], this.KarNaugh[i][3]];
            if (this.kiemTraChuaDung( m)) {
                rs.push(m);
            }
        }
        //// DUYET COT
        for (let i = 0; i < this.KarNaugh.length; i++) {
            if (this.KarNaugh[0][i] === -1 || this.KarNaugh[1][i] === -1 || this.KarNaugh[2][i] === -1 || this.KarNaugh[3][i] === -1) continue;
            let m: number[] = [this.KarNaugh[0][i], this.KarNaugh[1][i], this.KarNaugh[2][i], this.KarNaugh[3][i]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //// DET O VUONG
        for (let i = 0; i < this.KarNaugh.length - 1; i++) {
            for (let j = 0; j < this.KarNaugh[0].length - 1; j++) {
                if (this.KarNaugh[i][j] === -1) continue;
                if (this.KarNaugh[i][j + 1] === -1 || this.KarNaugh[i][j + 1] === -1 || this.KarNaugh[i + 1][j] === -1 || this.KarNaugh[i + 1][j + 1] === -1) continue;
                let m: number[] = [this.KarNaugh[i][j], this.KarNaugh[i][j + 1], this.KarNaugh[i + 1][j], this.KarNaugh[i + 1][j + 1]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
        }
        //// CAC TRUONG HOP DAT BIET

        /// 1. BON GOC O MA TRAN
        if (this.KarNaugh[0][0] !== -1 && this.KarNaugh[0][3] !== -1 && this.KarNaugh[3][0] !== -1 && this.KarNaugh[3][3] !== -1) {
            let m: number[] = [this.KarNaugh[0][0], this.KarNaugh[0][3], this.KarNaugh[3][0], this.KarNaugh[3][3]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        /// 2.DOI XUNG QUA HANG
        for (let i = 0; i < this.KarNaugh.length-1; i++) {
            if (this.KarNaugh[0][i] === -1) continue;
            if (this.KarNaugh[0][i] === -1 || this.KarNaugh[0][i + 1] === -1 || this.KarNaugh[3][i] === -1 || this.KarNaugh[3][i + 1] === -1) continue;
            let m: number[] = [this.KarNaugh[0][i], this.KarNaugh[0][i + 1], this.KarNaugh[3][i], this.KarNaugh[3][i + 1]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        /// 3.DOI XUNG QUA COT
        for (let i = 0; i < this.KarNaugh.length-1; i++) {
            if (this.KarNaugh[i][0] === -1) continue;
            if (this.KarNaugh[i][0] === -1 || this.KarNaugh[i + 1][0] === -1 || this.KarNaugh[i][3] === -1 || this.KarNaugh[i + 1][3] === -1) continue;
            let m: number[] = [this.KarNaugh[i][0], this.KarNaugh[i + 1][0], this.KarNaugh[i][3], this.KarNaugh[i + 1][3]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }

        if(rs.length === 0 )return null;

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
        //// KIEM TRA DOI XUNG BIEN NGANG
        for (let i = 0; i < this.KarNaugh.length; i++) {
            if (this.KarNaugh[0][i] === -1 || this.KarNaugh[3][i] === -1) continue;
            let m: number[] = [this.KarNaugh[0][i], this.KarNaugh[3][i]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //// KIEM TRA DOI XUNG BIEN THANG
        for (let i = 0; i < this.KarNaugh.length; i++) {
            if (this.KarNaugh[i][0] === -1 || this.KarNaugh[i][3] === -1) continue;
            let m: number[] = [this.KarNaugh[i][0], this.KarNaugh[i][3]];
            if (this.kiemTraChuaDung( m)) {
                rs.push(m);
            }
        }
        if(rs.length === 0 )return null;

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

   
}