"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiaKarNaugh5Bien = void 0;
const BiaKarnaugh_1 = require("./BiaKarnaugh");
class BiaKarNaugh5Bien extends BiaKarnaugh_1.BiaKarnaugh {
    constructor(karnaugh) {
        super();
        this.KarNaugh = [];
        this.KarNaugh = karnaugh;
    }
    teBao16() {
        let rs = [];
        for (let index = 0; index < this.KarNaugh.length; index++) {
            let hl = false;
            for (let i = 0; i < this.KarNaugh[index].length; i++) {
                for (let j = 0; j < this.KarNaugh[index][i].length; j++) {
                    if (this.KarNaugh[index][i][j] === -1) {
                        hl = false;
                        break;
                    }
                }
                if (!hl)
                    break;
            }
            if (hl) {
                let m = [];
                for (let i = 0; i < this.KarNaugh[index].length; i++)
                    for (let j = 0; j < this.KarNaugh[index][i].length; j++)
                        m.push(this.KarNaugh[index][i][j]);
                rs.push(m);
            }
        }
        //#region  KIEM TRA TRUNG
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            if (this.KarNaugh[0][i][0] === -1)
                continue;
            if (this.KarNaugh[0][i][0] === -1 || this.KarNaugh[0][i][1] === -1 || this.KarNaugh[0][i][2] === -1 || this.KarNaugh[0][i][3] === -1)
                continue;
            if (this.KarNaugh[0][i + 1][0] === -1 || this.KarNaugh[0][i + 1][1] === -1 || this.KarNaugh[0][i + 1][2] === -1 || this.KarNaugh[0][i + 1][3] === -1)
                continue;
            if (this.KarNaugh[1][i][0] === -1 || this.KarNaugh[1][i][1] === -1 || this.KarNaugh[1][i][2] === -1 || this.KarNaugh[1][i][3] === -1)
                continue;
            if (this.KarNaugh[1][i + 1][0] === -1 || this.KarNaugh[1][i + 1][1] === -1 || this.KarNaugh[1][i + 1][2] === -1 || this.KarNaugh[1][i + 1][3] === -1)
                continue;
            let m = new Array();
            for (let j = 0; j < 2; j++) {
                for (let z = 0; z < 4; z++) {
                    m.push(this.KarNaugh[0][i + j][z]);
                    m.push(this.KarNaugh[1][i + j][z]);
                }
            }
            rs.push(m);
        }
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            if (this.KarNaugh[0][0][i] === -1)
                continue;
            if (this.KarNaugh[0][0][i] === -1 || this.KarNaugh[0][1][i] === -1 || this.KarNaugh[0][2][i] === -1 || this.KarNaugh[0][3][i] === -1)
                continue;
            if (this.KarNaugh[0][0][i + 1] === -1 || this.KarNaugh[0][1][i + 1] === -1 || this.KarNaugh[0][2][i + 1] === -1 || this.KarNaugh[0][3][i + 1] === -1)
                continue;
            if (this.KarNaugh[1][0][i] === -1 || this.KarNaugh[1][1][i] === -1 || this.KarNaugh[1][2][i] === -1 || this.KarNaugh[1][3][i] === -1)
                continue;
            if (this.KarNaugh[1][0][i + 1] === -1 || this.KarNaugh[1][1][i + 1] === -1 || this.KarNaugh[1][2][i + 1] === -1 || this.KarNaugh[1][3][i + 1] === -1)
                continue;
            let m = new Array();
            for (let j = 0; j < 2; j++) {
                for (let z = 0; z < 4; z++) {
                    m.push(this.KarNaugh[0][z][i + j]);
                    m.push(this.KarNaugh[1][z][i + j]);
                }
            }
            rs.push(m);
        }
        /// KIEM TRA HANG TREN CUNG VA HANG DUOI CUNG
        if (this.KarNaugh[0][0][0] !== -1 && this.KarNaugh[0][0][1] !== -1 && this.KarNaugh[0][0][2] !== -1 && this.KarNaugh[0][0][3] !== -1
            && this.KarNaugh[0][3][0] !== -1 && this.KarNaugh[0][3][1] !== -1 && this.KarNaugh[0][3][2] !== -1 && this.KarNaugh[0][3][3] !== -1) {
            if (this.KarNaugh[1][0][0] !== -1 && this.KarNaugh[1][0][1] !== -1 && this.KarNaugh[1][0][2] !== -1 && this.KarNaugh[1][0][3] !== -1
                && this.KarNaugh[1][3][0] !== -1 && this.KarNaugh[1][3][1] !== -1 && this.KarNaugh[1][3][2] !== -1 && this.KarNaugh[1][3][3] !== -1) {
                let m = [];
                m.push(this.KarNaugh[0][0][0]);
                m.push(this.KarNaugh[0][0][1]);
                m.push(this.KarNaugh[0][0][2]);
                m.push(this.KarNaugh[0][0][3]);
                m.push(this.KarNaugh[0][3][0]);
                m.push(this.KarNaugh[0][3][1]);
                m.push(this.KarNaugh[0][3][2]);
                m.push(this.KarNaugh[0][3][3]);
                m.push(this.KarNaugh[1][0][0]);
                m.push(this.KarNaugh[1][0][1]);
                m.push(this.KarNaugh[1][0][2]);
                m.push(this.KarNaugh[1][0][3]);
                m.push(this.KarNaugh[1][3][0]);
                m.push(this.KarNaugh[1][3][1]);
                m.push(this.KarNaugh[1][3][2]);
                m.push(this.KarNaugh[1][3][3]);
                rs.push(m);
            }
        }
        /// KIEM TRA COT DAU TIEN VA COT CUOI CUNG
        if (this.KarNaugh[0][0][0] !== -1 && this.KarNaugh[0][1][0] !== -1 && this.KarNaugh[0][2][0] !== -1 && this.KarNaugh[0][3][0] !== -1
            && this.KarNaugh[0][0][3] !== -1 && this.KarNaugh[0][1][3] !== -1 && this.KarNaugh[0][2][3] !== -1 && this.KarNaugh[0][3][3] !== -1) {
            if (this.KarNaugh[1][0][0] !== -1 && this.KarNaugh[1][1][0] !== -1 && this.KarNaugh[1][2][0] !== -1 && this.KarNaugh[1][3][0] !== -1
                && this.KarNaugh[1][0][3] !== -1 && this.KarNaugh[1][1][3] !== -1 && this.KarNaugh[1][2][3] !== -1 && this.KarNaugh[1][3][3] !== -1) {
                let m = [];
                m.push(this.KarNaugh[0][0][0]);
                m.push(this.KarNaugh[0][1][0]);
                m.push(this.KarNaugh[0][2][0]);
                m.push(this.KarNaugh[0][3][0]);
                m.push(this.KarNaugh[0][0][3]);
                m.push(this.KarNaugh[0][1][3]);
                m.push(this.KarNaugh[0][2][3]);
                m.push(this.KarNaugh[0][3][3]);
                m.push(this.KarNaugh[1][0][0]);
                m.push(this.KarNaugh[1][1][0]);
                m.push(this.KarNaugh[1][2][0]);
                m.push(this.KarNaugh[1][3][0]);
                m.push(this.KarNaugh[1][0][3]);
                m.push(this.KarNaugh[1][1][3]);
                m.push(this.KarNaugh[1][2][3]);
                m.push(this.KarNaugh[1][3][3]);
                rs.push(m);
            }
        }
        //#endregion
        if (rs.length === 0)
            return null;
        return new BiaKarnaugh_1.NhomTeBao(rs);
    }
    teBao8() {
        let rs = [];
        for (let index = 0; index < this.KarNaugh.length; index++) {
            /// KIEM TRA HANG
            for (let i = 0; i < this.KarNaugh[index].length - 1; i++) {
                if (this.KarNaugh[index][i][0] === -1)
                    continue;
                if (this.KarNaugh[index][i][0] === -1 || this.KarNaugh[index][i][1] === -1 || this.KarNaugh[index][i][2] === -1 || this.KarNaugh[index][i][3] === -1)
                    continue;
                if (this.KarNaugh[index][i + 1][0] === -1 || this.KarNaugh[index][i + 1][1] === -1 || this.KarNaugh[index][i + 1][2] === -1 || this.KarNaugh[index][i + 1][3] === -1)
                    continue;
                let m = new Array();
                for (let j = 0; j < 2; j++) {
                    for (let z = 0; z < 4; z++)
                        m.push(this.KarNaugh[index][i + j][z]);
                }
                rs.push(m);
            }
            /// KIEM TRA COT
            for (let i = 0; i < this.KarNaugh[index].length - 1; i++) {
                if (this.KarNaugh[index][0][i] === -1)
                    continue;
                if (this.KarNaugh[index][0][i] === -1 || this.KarNaugh[index][1][i] === -1 || this.KarNaugh[index][2][i] === -1 || this.KarNaugh[index][3][i] === -1)
                    continue;
                if (this.KarNaugh[index][0][i + 1] === -1 || this.KarNaugh[index][1][i + 1] === -1 || this.KarNaugh[index][2][i + 1] === -1 || this.KarNaugh[index][3][i + 1] === -1)
                    continue;
                let m = new Array();
                for (let j = 0; j < 2; j++) {
                    for (let z = 0; z < 4; z++)
                        m.push(this.KarNaugh[index][z][i + j]);
                }
                rs.push(m);
            }
            /// KIEM TRA HANG TREN CUNG VA HANG DUOI CUNG
            if (this.KarNaugh[index][0][0] !== -1 && this.KarNaugh[index][0][1] !== -1 && this.KarNaugh[index][0][2] !== -1 && this.KarNaugh[index][0][3] !== -1)
                if (this.KarNaugh[index][3][0] !== -1 && this.KarNaugh[index][3][1] !== -1 && this.KarNaugh[index][3][2] !== -1 && this.KarNaugh[index][3][3] !== -1) {
                    let m = [];
                    m.push(this.KarNaugh[index][0][0]);
                    m.push(this.KarNaugh[index][0][1]);
                    m.push(this.KarNaugh[index][0][2]);
                    m.push(this.KarNaugh[index][0][3]);
                    m.push(this.KarNaugh[index][3][0]);
                    m.push(this.KarNaugh[index][3][1]);
                    m.push(this.KarNaugh[index][3][2]);
                    m.push(this.KarNaugh[index][3][3]);
                    rs.push(m);
                }
            /// KIEM TRA COT DAU TIEN VA COT CUOI CUNG
            if (this.KarNaugh[index][0][0] !== -1 && this.KarNaugh[index][1][0] !== -1 && this.KarNaugh[index][2][0] !== -1 && this.KarNaugh[index][3][0] !== -1)
                if (this.KarNaugh[index][0][3] !== -1 && this.KarNaugh[index][1][3] !== -1 && this.KarNaugh[index][2][3] !== -1 && this.KarNaugh[index][3][3] !== -1) {
                    let m = [];
                    m.push(this.KarNaugh[index][0][0]);
                    m.push(this.KarNaugh[index][1][0]);
                    m.push(this.KarNaugh[index][2][0]);
                    m.push(this.KarNaugh[index][3][0]);
                    m.push(this.KarNaugh[index][0][3]);
                    m.push(this.KarNaugh[index][1][3]);
                    m.push(this.KarNaugh[index][2][3]);
                    m.push(this.KarNaugh[index][3][3]);
                    rs.push(m);
                }
        }
        //#region KIEM TRA CUNG VI TRI HAI BANG
        //// DUYET HANG
        for (let i = 0; i < this.KarNaugh[0].length; i++) {
            if (this.KarNaugh[0][i][0] === -1 || this.KarNaugh[0][i][1] === -1 || this.KarNaugh[0][i][2] === -1 || this.KarNaugh[0][i][3] === -1)
                continue;
            if (this.KarNaugh[1][i][0] === -1 || this.KarNaugh[1][i][1] === -1 || this.KarNaugh[1][i][2] === -1 || this.KarNaugh[1][i][3] === -1)
                continue;
            let m = [this.KarNaugh[0][i][0], this.KarNaugh[0][i][1], this.KarNaugh[0][i][2], this.KarNaugh[0][i][3],
                this.KarNaugh[1][i][0], this.KarNaugh[1][i][1], this.KarNaugh[1][i][2], this.KarNaugh[1][i][3]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //// DUYET COT
        for (let i = 0; i < this.KarNaugh[0].length; i++) {
            if (this.KarNaugh[0][0][i] === -1 || this.KarNaugh[0][1][i] === -1 || this.KarNaugh[0][2][i] === -1 || this.KarNaugh[0][3][i] === -1)
                continue;
            if (this.KarNaugh[1][0][i] === -1 || this.KarNaugh[1][1][i] === -1 || this.KarNaugh[1][2][i] === -1 || this.KarNaugh[1][3][i] === -1)
                continue;
            let m = [this.KarNaugh[0][0][i], this.KarNaugh[0][1][i], this.KarNaugh[0][2][i], this.KarNaugh[0][3][i],
                this.KarNaugh[1][0][i], this.KarNaugh[1][1][i], this.KarNaugh[1][2][i], this.KarNaugh[1][3][i]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //// DET O VUONG
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            for (let j = 0; j < this.KarNaugh[0].length - 1; j++) {
                if (this.KarNaugh[0][i][j] === -1)
                    continue;
                if (this.KarNaugh[0][i][j + 1] === -1 || this.KarNaugh[0][i][j + 1] === -1 || this.KarNaugh[0][i + 1][j] === -1 || this.KarNaugh[0][i + 1][j + 1] === -1)
                    continue;
                if (this.KarNaugh[1][i][j + 1] === -1 || this.KarNaugh[1][i][j + 1] === -1 || this.KarNaugh[1][i + 1][j] === -1 || this.KarNaugh[1][i + 1][j + 1] === -1)
                    continue;
                let m = [this.KarNaugh[0][i][j], this.KarNaugh[0][i][j + 1], this.KarNaugh[0][i + 1][j], this.KarNaugh[0][i + 1][j + 1],
                    this.KarNaugh[1][i][j], this.KarNaugh[1][i][j + 1], this.KarNaugh[1][i + 1][j], this.KarNaugh[1][i + 1][j + 1],];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
        }
        //// CAC TRUONG HOP DAT BIET
        /// 1. BON GOC O MA TRAN
        if (this.KarNaugh[0][0][0] !== -1 && this.KarNaugh[0][0][3] !== -1 && this.KarNaugh[0][3][0] !== -1 && this.KarNaugh[0][3][3] !== -1) {
            if (this.KarNaugh[1][0][0] !== -1 && this.KarNaugh[1][0][3] !== -1 && this.KarNaugh[1][3][0] !== -1 && this.KarNaugh[1][3][3] !== -1) {
                let m = [this.KarNaugh[0][0][0], this.KarNaugh[0][0][3], this.KarNaugh[0][3][0], this.KarNaugh[0][3][3],
                    this.KarNaugh[1][0][0], this.KarNaugh[1][0][3], this.KarNaugh[1][3][0], this.KarNaugh[1][3][3]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
        }
        /// 2.DOI XUNG QUA HANG
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            if (this.KarNaugh[0][0][i] === -1)
                continue;
            if (this.KarNaugh[0][0][i] === -1 || this.KarNaugh[0][0][i + 1] === -1 || this.KarNaugh[0][3][i] === -1 || this.KarNaugh[0][3][i + 1] === -1)
                continue;
            if (this.KarNaugh[1][0][i] === -1 || this.KarNaugh[1][0][i + 1] === -1 || this.KarNaugh[1][3][i] === -1 || this.KarNaugh[1][3][i + 1] === -1)
                continue;
            let m = [this.KarNaugh[0][0][i], this.KarNaugh[0][0][i + 1], this.KarNaugh[0][3][i], this.KarNaugh[0][3][i + 1],
                this.KarNaugh[1][0][i], this.KarNaugh[1][0][i + 1], this.KarNaugh[1][3][i], this.KarNaugh[1][3][i + 1],];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        /// 3.DOI XUNG QUA COT
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            if (this.KarNaugh[0][i][0] === -1)
                continue;
            if (this.KarNaugh[0][i][0] === -1 || this.KarNaugh[0][i + 1][0] === -1 || this.KarNaugh[0][i][3] === -1 || this.KarNaugh[0][i + 1][3] === -1)
                continue;
            if (this.KarNaugh[1][i][0] === -1 || this.KarNaugh[1][i + 1][0] === -1 || this.KarNaugh[1][i][3] === -1 || this.KarNaugh[1][i + 1][3] === -1)
                continue;
            let m = [this.KarNaugh[0][i][0], this.KarNaugh[0][i + 1][0], this.KarNaugh[0][i][3], this.KarNaugh[0][i + 1][3],
                this.KarNaugh[1][i][0], this.KarNaugh[1][i + 1][0], this.KarNaugh[1][i][3], this.KarNaugh[1][i + 1][3],];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //#endregion
        if (rs.length === 0)
            return null;
        return new BiaKarnaugh_1.NhomTeBao(rs);
    }
    teBao4() {
        let rs = [];
        //// KIEM TRA THONG THUONG
        for (let index = 0; index < this.KarNaugh.length; index++) {
            //// DUYET HANG
            for (let i = 0; i < this.KarNaugh.length; i++) {
                if (this.KarNaugh[index][i][0] === -1 || this.KarNaugh[index][i][1] === -1 || this.KarNaugh[index][i][2] === -1 || this.KarNaugh[index][i][3] === -1)
                    continue;
                let m = [this.KarNaugh[index][i][0], this.KarNaugh[index][i][1], this.KarNaugh[index][i][2], this.KarNaugh[index][i][3]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
            //// DUYET COT
            for (let i = 0; i < this.KarNaugh.length; i++) {
                if (this.KarNaugh[index][0][i] === -1 || this.KarNaugh[index][1][i] === -1 || this.KarNaugh[index][2][i] === -1 || this.KarNaugh[index][3][i] === -1)
                    continue;
                let m = [this.KarNaugh[index][0][i], this.KarNaugh[index][1][i], this.KarNaugh[index][2][i], this.KarNaugh[index][3][i]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
            //// DET O VUONG
            for (let i = 0; i < this.KarNaugh.length - 1; i++) {
                for (let j = 0; j < this.KarNaugh[0].length - 1; j++) {
                    if (this.KarNaugh[index][i][j] === -1)
                        continue;
                    if (this.KarNaugh[index][i][j + 1] === -1 || this.KarNaugh[index][i][j + 1] === -1 || this.KarNaugh[index][i + 1][j] === -1 || this.KarNaugh[index][i + 1][j + 1] === -1)
                        continue;
                    let m = [this.KarNaugh[index][i][j], this.KarNaugh[index][i][j + 1], this.KarNaugh[index][i + 1][j], this.KarNaugh[index][i + 1][j + 1]];
                    if (this.kiemTraChuaDung(m)) {
                        rs.push(m);
                    }
                }
            }
            //// CAC TRUONG HOP DAT BIET
            /// 1. BON GOC O MA TRAN
            if (this.KarNaugh[index][0][0] !== -1 && this.KarNaugh[index][0][3] !== -1 && this.KarNaugh[index][3][0] !== -1 && this.KarNaugh[index][3][3] !== -1) {
                let m = [this.KarNaugh[index][0][0], this.KarNaugh[index][0][3], this.KarNaugh[index][3][0], this.KarNaugh[index][3][3]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
            /// 2.DOI XUNG QUA HANG
            for (let i = 0; i < this.KarNaugh[index].length - 1; i++) {
                if (this.KarNaugh[index][0][i] === -1)
                    continue;
                if (this.KarNaugh[index][0][i] === -1 || this.KarNaugh[index][0][i + 1] === -1 || this.KarNaugh[index][3][i] === -1 || this.KarNaugh[index][3][i + 1] === -1)
                    continue;
                let m = [this.KarNaugh[index][0][i], this.KarNaugh[index][0][i + 1], this.KarNaugh[index][3][i], this.KarNaugh[index][3][i + 1]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
            /// 3.DOI XUNG QUA COT
            for (let i = 0; i < this.KarNaugh[index].length - 1; i++) {
                if (this.KarNaugh[index][i][0] === -1)
                    continue;
                if (this.KarNaugh[index][i][0] === -1 || this.KarNaugh[index][i + 1][0] === -1 || this.KarNaugh[index][i][3] === -1 || this.KarNaugh[index][i + 1][3] === -1)
                    continue;
                let m = [this.KarNaugh[index][i][0], this.KarNaugh[index][i + 1][0], this.KarNaugh[index][i][3], this.KarNaugh[index][i + 1][3]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
        }
        //#region  KIEM TRA CAC O TRUNG O HAI BANH
        //// KIEM TRA TRUONG HOP LIEN KET THUONG
        for (let i = 0; i < this.KarNaugh[0].length - 1; i++) {
            for (let j = 0; j < this.KarNaugh[0][0].length - 1; j++) {
                if (this.KarNaugh[0][i][j] === -1)
                    continue;
                /// KIEM TRA NGANG
                if (j < this.KarNaugh[0][i].length - 1 && (this.KarNaugh[0][i][j] !== -1 && this.KarNaugh[0][i][j + 1] !== -1 && this.KarNaugh[1][i][j] !== -1 && this.KarNaugh[1][i][j + 1] !== -1)) {
                    let m = [this.KarNaugh[0][i][j], this.KarNaugh[0][i][j + 1], this.KarNaugh[1][i][j], this.KarNaugh[1][i][j + 1]];
                    if (this.kiemTraChuaDung(m)) {
                        rs.push(m);
                    }
                }
                /// KIEM TRA DOC
                if (i < this.KarNaugh[0].length - 1 && (this.KarNaugh[0][i][j] !== -1 && this.KarNaugh[0][i + 1][j] !== -1 && this.KarNaugh[1][i][j] !== -1 && this.KarNaugh[1][i + 1][j] !== -1)) {
                    let m = [this.KarNaugh[0][i + 1][j], this.KarNaugh[0][i][j], this.KarNaugh[1][i + 1][j], this.KarNaugh[1][i][j]];
                    if (this.kiemTraChuaDung(m)) {
                        rs.push(m);
                    }
                }
            }
        }
        //// KIEM TRA DOI XUNG BIEN NGANG
        for (let i = 0; i < this.KarNaugh[0].length; i++) {
            if (this.KarNaugh[0][0][i] === -1 || this.KarNaugh[0][3][i] === -1)
                continue;
            if (this.KarNaugh[1][0][i] === -1 || this.KarNaugh[1][3][i] === -1)
                continue;
            let m = [this.KarNaugh[0][0][i], this.KarNaugh[0][3][i], this.KarNaugh[1][0][i], this.KarNaugh[1][3][i]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //// KIEM TRA DOI XUNG BIEN THANG
        for (let i = 0; i < this.KarNaugh[0].length; i++) {
            if (this.KarNaugh[0][i][0] === -1 || this.KarNaugh[0][i][3] === -1)
                continue;
            if (this.KarNaugh[1][i][0] === -1 || this.KarNaugh[1][i][3] === -1)
                continue;
            let m = [this.KarNaugh[0][i][0], this.KarNaugh[0][i][3], this.KarNaugh[1][i][0], this.KarNaugh[1][i][3]];
            if (this.kiemTraChuaDung(m)) {
                rs.push(m);
            }
        }
        //#endregion
        if (rs.length === 0)
            return null;
        return new BiaKarnaugh_1.NhomTeBao(rs);
    }
    teBao2() {
        let rs = [];
        for (let index = 0; index < this.KarNaugh.length; index++) {
            //// KIEM TRA TRUONG HOP LIEN KET THUONG
            for (let i = 0; i < this.KarNaugh[index].length; i++) {
                for (let j = 0; j < this.KarNaugh[index][0].length; j++) {
                    if (this.KarNaugh[index][i][j] === -1)
                        continue;
                    /// KIEM TRA NGANG
                    if (j < this.KarNaugh[index][i].length - 1 && (this.KarNaugh[index][i][j] !== -1 && this.KarNaugh[index][i][j + 1] !== -1)) {
                        let m = [this.KarNaugh[index][i][j], this.KarNaugh[index][i][j + 1]];
                        if (this.kiemTraChuaDung(m)) {
                            rs.push(m);
                        }
                    }
                    /// KIEM TRA DOC
                    if (i < this.KarNaugh[index].length - 1 && (this.KarNaugh[index][i][j] !== -1 && this.KarNaugh[index][i + 1][j] !== -1)) {
                        let m = [this.KarNaugh[index][i + 1][j], this.KarNaugh[index][i][j]];
                        if (this.kiemTraChuaDung(m)) {
                            rs.push(m);
                        }
                    }
                }
            }
            //// KIEM TRA DOI XUNG BIEN NGANG
            for (let i = 0; i < this.KarNaugh[index].length; i++) {
                if (this.KarNaugh[index][0][i] === -1 || this.KarNaugh[index][3][i] === -1)
                    continue;
                let m = [this.KarNaugh[index][0][i], this.KarNaugh[index][3][i]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
            //// KIEM TRA DOI XUNG BIEN THANG
            for (let i = 0; i < this.KarNaugh[index].length; i++) {
                if (this.KarNaugh[index][i][0] === -1 || this.KarNaugh[index][i][3] === -1)
                    continue;
                let m = [this.KarNaugh[index][i][0], this.KarNaugh[index][i][3]];
                if (this.kiemTraChuaDung(m)) {
                    rs.push(m);
                }
            }
        }
        //#region  KIEM TRA TRUNG
        for (let i = 0; i < this.KarNaugh[0].length; i++) {
            for (let j = 0; j < this.KarNaugh[0][i].length; j++) {
                if (this.KarNaugh[0][i][j] === -1)
                    continue;
                if (this.KarNaugh[1][i][j] === -1)
                    continue;
                let m = [this.KarNaugh[0][i][j], this.KarNaugh[1][i][j]];
                if (this.kiemTraChuaDung(m))
                    rs.push(m);
            }
        }
        //#endregion 
        if (rs.length === 0)
            return null;
        return new BiaKarnaugh_1.NhomTeBao(rs);
    }
    teBao1() {
        let m = [];
        for (let index = 0; index < this.KarNaugh.length; index++) {
            for (let i = 0; i < this.KarNaugh[index].length; i++) {
                for (let j = 0; j < this.KarNaugh[index][i].length; j++) {
                    if (this.KarNaugh[index][i][j] === -1)
                        continue;
                    let b = false;
                    for (let z = 0; z < this.khuongTeBao.length; z++) {
                        if (this.khuongTeBao[z].includes(this.KarNaugh[index][i][j])) {
                            b = true;
                            break;
                        }
                    }
                    if (!b)
                        m.push(this.KarNaugh[index][i][j]);
                }
            }
        }
        if (m.length === 0)
            return null;
        return new BiaKarnaugh_1.NhomTeBao([m]);
    }
}
exports.BiaKarNaugh5Bien = BiaKarNaugh5Bien;
