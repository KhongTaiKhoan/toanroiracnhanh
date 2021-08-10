"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapLuat = void 0;
const Luat_1 = require("./Luat");
const BieuThucMenhDe_1 = require("../ThanhPhanC/BieuThucMenhDe");
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const ToanTuFactory_1 = require("../ThanhPhanOpts/ToanTuFactory");
const BieuThucBuilder_1 = require("../ThanhPhanC/BieuThucBuilder");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
const LuatMessage_1 = require("./LuatMessage");
class TapLuat {
    constructor() {
        this.tapLuat = [];
        this.xayDungTapLuat();
    }
    xayDungTapLuat() {
        /// LUAT PHEP TUONG DUONG
        this.tapLuat.push(new Luat_1.Luat(1, "Luat phep tuong duong", new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUONG_DUONG)
                    return new LuatMessage_1.LuatMessage(P);
                return null;
            }
        }(), new class {
            ketQua(P) {
                let left = P.bieuThucCons[0];
                let right = P.bieuThucCons[1];
                let S = new BieuThucBuilder_1.BieuThucBuilder()
                    .addBieuThucCon(left)
                    .addBieuThucCon(right)
                    .addToanTu(ToanTuLogic_1.ToanTu.KEO_THEO)
                    .addCha(P)
                    .build();
                let R = new BieuThucBuilder_1.BieuThucBuilder()
                    .addBieuThucCon(right)
                    .addBieuThucCon(left)
                    .addToanTu(ToanTuLogic_1.ToanTu.KEO_THEO)
                    .addCha(P)
                    .build();
                let rs = new BieuThucBuilder_1.BieuThucBuilder()
                    .addBieuThucCon(S)
                    .addBieuThucCon(R)
                    .addToanTu(ToanTuLogic_1.ToanTu.HOI)
                    .addCha(P.cha)
                    .build();
                return rs;
            }
        }()));
        /// LUAT PHEP KEO THEO
        this.tapLuat.push(new Luat_1.Luat(2, "Luat phep keo theo", new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO)
                    return new LuatMessage_1.LuatMessage(P);
                return null;
            }
        }(), new class {
            ketQua(P) {
                let left = P.bieuThucCons[0];
                let right = P.bieuThucCons[1];
                let rs = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(Helper_1.Helper.PHU_DINH_MENH_DE(left))
                    .addBieuThucCon(right)
                    .addToanTu(ToanTuLogic_1.ToanTu.TUYEN)
                    .addCha(P.cha)
                    .build();
                // console.log(rs.id);                     
                return rs;
            }
        }()));
        /// LUAT DONG NHAT
        this.tapLuat.push(new Luat_1.Luat(3, "Luat dong nhat", new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN && P.id.includes(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI)) {
                    let bt = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(P.bieuThucCons[0])
                        .addBieuThucCon2(Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI))
                        .addCha(P.cha)
                        .addToanTu(P.toanTu.tenToanTu)
                        .build();
                    return new LuatMessage_1.LuatMessage(bt);
                }
                return null;
            }
        }(), new class {
            ketQua(P) {
                /// B1: LOAI BO HANG SAI
                let index = P.bieuThucCons.findIndex(element => element.id === BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI);
                P.bieuThucCons.splice(index, 1);
                /// B2: NEU MENH DE CHI CON 1 BIEU THUC CON, MENH DE TRO THANH MENH DE SO CAP
                if (P.bieuThucCons.length === 1)
                    P = Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id, P);
                return P;
            }
        }()));
        /// LUAT DONG NHAT
        this.tapLuat.push(new Luat_1.Luat(4, "Luat dong nhat", new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI && P.id.includes(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG))
                    return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[0])
                        .addBieuThucCon2(Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG))
                        .addCha(P.cha)
                        .addToanTu(P.toanTu.tenToanTu)
                        .build());
                return null;
            }
        }(), new class {
            ketQua(P) {
                /// B1: LOAI BO HANG SAI
                let index = P.bieuThucCons.findIndex(element => element.id === BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG);
                P.bieuThucCons.splice(index, 1);
                /// B2: NEU MENH DE CHI CON 1 BIEU THUC CON, MENH DE TRO THANH MENH DE SO CAP
                if (P.bieuThucCons.length === 1)
                    P = Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id, P);
                return P;
            }
        }()));
        /// LUAT NUOT
        this.tapLuat.push(new Luat_1.Luat(5, 'Luat nuot', new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI && P.id.includes(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI)) {
                    return new LuatMessage_1.LuatMessage(P);
                }
                return null;
            }
        }(), new class {
            ketQua(P) {
                return Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI, P);
            }
        }()));
        /// LUAT NUOT
        this.tapLuat.push(new Luat_1.Luat(6, 'Luat nuot', new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN && P.id.includes(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG))
                    return new LuatMessage_1.LuatMessage(P);
                return null;
            }
        }(), new class {
            ketQua(P) {
                return Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG, P);
            }
        }()));
        /// LUAT LUY DANG
        this.tapLuat.push(new Luat_1.Luat(7, 'Luat luy dang', new class {
            boKiemTra(P) {
                let ktTrung = false;
                let i = -1;
                let j = -1;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    for (j = 0; j < P.bieuThucCons.length; j++) {
                        if (i === j)
                            continue;
                        if (P.bieuThucCons[i].id === P.bieuThucCons[j].id) {
                            ktTrung = true;
                            break;
                        }
                    }
                    if (ktTrung)
                        break;
                }
                if ((P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI || P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN) && ktTrung) {
                    return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[i])
                        .addBieuThucCon2(P.bieuThucCons[i])
                        .addToanTu(P.toanTu.tenToanTu)
                        .build());
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let i = 0;
                i = P.bieuThucCons.findIndex(e => e.id = con.bieuThuc.id);
                P.bieuThucCons.splice(i, 1);
                if (P.bieuThucCons.length == 1) {
                    P = Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id, P);
                }
                return P;
            }
        }()));
        ///Luat Phu dinh kep
        this.tapLuat.push(new Luat_1.Luat(8, 'Luat phu dinh kep', new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH && P.bieuThucCons[0].toanTu.tenToanTu == ToanTuLogic_1.ToanTu.PHU_DINH)
                    return new LuatMessage_1.LuatMessage(P);
                return null;
            }
        }(), new class {
            ketQua(P) {
                let rs = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(P.bieuThucCons[0].bieuThucCons[0])
                    .addToanTu(P.bieuThucCons[0].bieuThucCons[0].toanTu.tenToanTu)
                    .addCha(P.cha)
                    .build();
                return Helper_1.Helper.CHUYEN_CAP(rs.bieuThucCons[0], rs);
            }
        }()));
        /// LUAT PHAN TU BU
        this.tapLuat.push(new Luat_1.Luat(9, 'Luat phan tu bu', new class {
            boKiemTra(P) {
                let ktTrung = false;
                let i = -1;
                let j = -1;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    for (j = 0; j < P.bieuThucCons.length; j++) {
                        if (i === j)
                            continue;
                        if (P.bieuThucCons[i].id === Helper_1.Helper.PHU_DINH_MENH_DE(Helper_1.Helper.SAO_CHEP(P.bieuThucCons[j])).id) {
                            ktTrung = true;
                            break;
                        }
                    }
                    if (ktTrung)
                        break;
                }
                let kt = P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN || P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI;
                if (kt && ktTrung) {
                    return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(P.bieuThucCons[i])
                        .addBieuThucCon2(P.bieuThucCons[j])
                        .addToanTu(P.toanTu.tenToanTu)
                        .build(), i, j);
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let index = con.msg1;
                P.bieuThucCons.splice(index, 1);
                index = P.bieuThucCons.findIndex(ele => ele.id == con.bieuThuc.bieuThucCons[1].id);
                P.bieuThucCons.splice(index, 1);
                let rs = con.bieuThuc.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_SAI) : Helper_1.Helper.BIEU_THUC_SO_CAP(BieuThucMenhDe_1.BieuThucMenhDe.MA_HANG_DUNG);
                if (P.bieuThucCons.length == 0)
                    return rs;
                P.bieuThucCons.push(rs);
                return P;
            }
        }()));
        //Luat hap thu
        this.tapLuat.push(new Luat_1.Luat(10, 'Luat hap thu', new class {
            boKiemTra(P) {
                let i = 0;
                let j = 0;
                let kt = false;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    for (j = 0; j < P.bieuThucCons.length; j++) {
                        if (i === j)
                            continue;
                        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[j]))
                            continue;
                        if (P.bieuThucCons[j].bieuThucCons.length < 2)
                            continue;
                        if (P.bieuThucCons[j].bieuThucCons[0].id === P.bieuThucCons[i].id || P.bieuThucCons[j].bieuThucCons[1].id === P.bieuThucCons[i].id) {
                            kt = true;
                            break;
                        }
                    }
                    if (kt)
                        break;
                }
                if (kt)
                    if (P.bieuThucCons[j].toanTu.tenToanTu !== P.toanTu.tenToanTu) {
                        return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(P.bieuThucCons[i])
                            .addBieuThucCon(P.bieuThucCons[j])
                            .addToanTu(P.toanTu.tenToanTu)
                            .build(), j);
                    }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let index = con.msg1;
                P.bieuThucCons.splice(index, 1);
                if (P.bieuThucCons.length == 1) {
                    P = Helper_1.Helper.BIEUTHUCSOCAP_TU_BIEUTHUC(P.bieuThucCons[0].id, P);
                }
                return P;
            }
        }()));
        /// LUAT PHAN PHOI
        this.tapLuat.push(new Luat_1.Luat(11, 'Luat phan phoi', new class {
            boKiemTra(P) {
                let arr = []; //// CAC CAP CHI SO CHI CAC PHAN TU CHUNG TRONG HAI TAP DANG XET
                let i = 0; ///  CHI SO TAP TRAI TRONG BIEU THUC P
                let j = 0; ///  CHI SO TAP PHAI TRONG BIEU THUC P 
                let kt = false;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                        continue;
                    for (j = 0; j < P.bieuThucCons.length; j++) {
                        if (i === j)
                            continue;
                        if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[j]))
                            continue;
                        for (let z = 0; z < P.bieuThucCons[i].bieuThucCons.length; z++) {
                            let index = P.bieuThucCons[j].bieuThucCons.findIndex(e => e.id === P.bieuThucCons[i].bieuThucCons[z].id);
                            if (index !== -1) {
                                kt = true;
                                arr.push([z, index]);
                            }
                        }
                        if (kt)
                            break;
                    }
                    if (kt)
                        break;
                }
                if (kt)
                    if (P.bieuThucCons[i].toanTu.tenToanTu === P.bieuThucCons[j].toanTu.tenToanTu && P.bieuThucCons[i].toanTu.tenToanTu !== P.toanTu.tenToanTu) {
                        return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon2(P.bieuThucCons[i])
                            .addBieuThucCon2(P.bieuThucCons[j])
                            .addToanTu(P.toanTu.tenToanTu)
                            .build(), arr, [i, j]);
                    }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                /// PHAN GIONG NHAU GIUA CAC BEU THUC CON arr: LA CAP CHI SO CUA NO
                let arr = con.msg1;
                /// BIEU THUC CON BEN TRAI
                let l_ar = [];
                //// BIEU THUC CON BEN PHAI
                let r_ar = [];
                /// CHUA CAC MANG TRUNG NHAU GIUA CAC BIEU THUC CON
                let chung = new BieuThucBuilder_1.BieuThucBuilder().addCha(P);
                if (arr.length > 1)
                    chung.addToanTu(con.bieuThuc.bieuThucCons[0].toanTu.tenToanTu);
                /// TIEN HANH ADD CUA PHAN TU, DE TAO MOT BIEU THUC MOI LA CAC BIEU THUC CHUNG CUA CA HAI BIEU THUC CON    
                for (let i = 0; i < arr.length; i++) {
                    chung.addBieuThucCon(con.bieuThuc.bieuThucCons[0].bieuThucCons[arr[i][0]]);
                    l_ar.push(arr[i][0]);
                    r_ar.push(arr[i][1]);
                }
                /// add lai vao bieu thuc ben con ben ttrai cac gia tri khong phai la giong nhau giua hai bieu thuc
                let newBuilder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                for (let i = 0; i < con.bieuThuc.bieuThucCons[0].bieuThucCons.length; i++) {
                    if (l_ar.findIndex(e => e === i) !== -1)
                        continue;
                    newBuilder.addBieuThucCon(con.bieuThuc.bieuThucCons[0].bieuThucCons[i]);
                }
                /// add lai vao bieu thuc ben con ben phai cac gia tri khong phai la giong nhau giua hai bieu thuc
                for (let i = 0; i < con.bieuThuc.bieuThucCons[1].bieuThucCons.length; i++) {
                    if (r_ar.findIndex(e => e === i) !== -1)
                        continue;
                    newBuilder.addBieuThucCon(con.bieuThuc.bieuThucCons[1].bieuThucCons[i]);
                }
                let newMd = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(chung.build())
                    .addBieuThucCon(newBuilder.build())
                    .addToanTu(con.bieuThuc.bieuThucCons[0].toanTu.tenToanTu);
                /// cuoi cung add lai cac bieu thuc con cua P ma khong ap dung vao luat phan phoi   
                let finalBulider = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                let i = 0;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    if (i !== con.msg2[0] && i !== con.msg2[1])
                        finalBulider.addBieuThucCon(P.bieuThucCons[i]);
                }
                if (2 === P.bieuThucCons.length) {
                    return newMd.build();
                }
                P = finalBulider.addBieuThucCon(newMd.build()).build();
                return P;
            }
        }()));
        /// LUAT KET HOP
        this.tapLuat.push(new Luat_1.Luat(12, 'Luat ket hop 1', new class {
            boKiemTra(P) {
                let tt = P.toanTu;
                let kt = false;
                let arr = [];
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(tt.tenToanTu);
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH)
                    return null;
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (!Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]) && (tt.tenToanTu === P.bieuThucCons[i].toanTu.tenToanTu || tt.tenToanTu === ToanTuLogic_1.ToanTu.NONE)) {
                        kt = true;
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                        arr.push(i);
                    }
                }
                if (kt)
                    return new LuatMessage_1.LuatMessage(builder.build(), arr);
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                let index = 0;
                let arr = con.msg1;
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])) {
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                    }
                    else if (!arr.includes(i)) {
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                    }
                    else {
                        for (let j = 0; j < P.bieuThucCons[i].bieuThucCons.length; j++)
                            builder.addBieuThucCon(P.bieuThucCons[i].bieuThucCons[j]);
                    }
                }
                builder.addCha(P.cha);
                return builder.build();
            }
        }()));
        /// LUAT DE MORGAN
        this.tapLuat.push(new Luat_1.Luat(13, 'Luat De Morgan', new class {
            boKiemTra(P) {
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                // let count: number = 0;
                if (P.bieuThucCons.length <= 1)
                    return null;
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (P.bieuThucCons[i].toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH ||
                        (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]) && P.bieuThucCons[i].id.includes(ToanTuLogic_1.ToanTu.PHU_DINH + ""))) {
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                        // count++;
                    }
                }
                // if(P.id === (ToanTu.HOI +'0s0t')){
                //     // console.log()
                //     console.log(P.bieuThucCons.length===builder.sizeBuilder())
                // }
                // console.log(P.id)
                if (builder.sizeBuilder() === P.bieuThucCons.length) {
                    // builder.addCha(P);
                    return new LuatMessage_1.LuatMessage(builder.build());
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let tt = P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? ToanTuLogic_1.ToanTu.TUYEN : ToanTuLogic_1.ToanTu.HOI;
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(tt);
                // console.log('OK: '+P.id);
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    // if (Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])) {
                    // Helper.BIEU_THUC_SO_CAP(P.bieuThucCons[i].id.split(ToanTu.PHU_DINH + "")[1]
                    builder.addBieuThucCon(Helper_1.Helper.PHU_DINH_MENH_DE(P.bieuThucCons[i]));
                    // } else
                    //     builder.addBieuThucCon(P.bieuThucCons[i].bieuThucCons[0]);
                }
                // console.log(new BieuThucBuilder().addToanTu(ToanTu.PHU_DINH).addBieuThucCon(builder.build()).build().id);
                return new BieuThucBuilder_1.BieuThucBuilder().addToanTu(ToanTuLogic_1.ToanTu.PHU_DINH).addBieuThucCon(builder.build()).build();
            }
        }()));
        /// LUAT DE MORGAN
        this.tapLuat.push(new Luat_1.Luat(14, 'Luat DE Morgan 1', new class {
            boKiemTra(P) {
                let tapLuat = new TapLuat();
                let kt = false;
                let back = Helper_1.Helper.SAO_CHEP(P);
                if (P.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.PHU_DINH || Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P))
                    return null;
                let tt = P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? ToanTuLogic_1.ToanTu.TUYEN : ToanTuLogic_1.ToanTu.HOI;
                // P = new BieuThucMenhDe();
                // P.toanTu = new ToanTuFactory().create(tt);
                // P.bieuThucCons = [
                //     Helper.PHU_DINH_MENH_DE(back.bieuThucCons[0].bieuThucCons[0]),
                //     Helper.PHU_DINH_MENH_DE(back.bieuThucCons[0].bieuThucCons[1])
                // ] 
                // /// KIEM TRA BIEU THUC CHA CO AP DUNG LUAT KHONG
                // for (let i: number = 0; i < tapLuat.tapLuat.length; i++) {
                //     if (tapLuat.tapLuat[i].boKiemTra(Helper.SAO_CHEP(P)) !== null) {
                //         let id: number = tapLuat.tapLuat[i].id;
                //         if (id > 2 && id <= 13) continue;
                //         else {kt=true;break;}
                //     }
                //     if (P.cha !== null)
                //         if (tapLuat.tapLuat[i].boKiemTra(Helper.SAO_CHEP(P.cha)) !== null) {
                //             let id: number = tapLuat.tapLuat[i].id;
                //             if (id > 2 && id <= 13) continue;
                //             else {kt=true;break;}
                //         }
                // }
                // console.log(P);
                if (kt)
                    if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH && !Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P)) {
                        return new LuatMessage_1.LuatMessage(P);
                    }
                    else
                        P = back;
                return null;
            }
        }(), new class {
            ketQua(P) {
                let tt = P.bieuThucCons[0].toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.TUYEN) : new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.HOI);
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(tt.tenToanTu);
                for (let i = 0; i < P.bieuThucCons[0].bieuThucCons.length; i++) {
                    let bl = Helper_1.Helper.PHU_DINH_MENH_DE(P.bieuThucCons[0].bieuThucCons[i]);
                    // console.log(bl.id);
                    builder.addBieuThucCon(bl);
                }
                builder.addCha(P.cha);
                // console.log("L: "+builder.build().id);
                return builder.build();
            }
        }()));
        /// LUAT KET HOP
        this.tapLuat.push(new Luat_1.Luat(15, 'Luat ket hop 2', new class {
            boKiemTra(P) {
                if (P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH)
                    return null;
                let bt = new BieuThucBuilder_1.BieuThucBuilder();
                let kt = false;
                let i = 0;
                let j = 0;
                bt.addToanTu(P.toanTu.tenToanTu);
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                        bt.addBieuThucCon2(P.bieuThucCons[i]);
                }
                let b = bt.build();
                if (b.bieuThucCons.length < 2)
                    return null;
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    if (!Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])) {
                        for (j = 0; j < P.bieuThucCons[i].bieuThucCons.length; j++) {
                            // if(Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i].bieuThucCons[j])) continue;
                            if (P.bieuThucCons[i].toanTu.tenToanTu !== b.toanTu.tenToanTu)
                                break;
                            if (b.id.includes(P.bieuThucCons[i].bieuThucCons[j].id)) {
                                kt = true;
                            }
                        }
                    }
                }
                if (kt)
                    return new LuatMessage_1.LuatMessage(P, i, j);
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let bt = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                let new_bt = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i])) {
                        let b = false;
                        for (let j = 0; j < con.bieuThuc.bieuThucCons.length; j++) {
                            if (con.bieuThuc.bieuThucCons[j].id.includes(P.bieuThucCons[i].id)) {
                                b = true;
                                bt.addBieuThucCon(P.bieuThucCons[i]);
                                break;
                            }
                        }
                        if (!b)
                            new_bt.addBieuThucCon(P.bieuThucCons[i]);
                    }
                    else
                        new_bt.addBieuThucCon(P.bieuThucCons[i]);
                }
                let f_bt = new_bt.addBieuThucCon(bt.build()).build();
                return f_bt;
            }
        }()));
        /// LUAT PHU DINH KEP
        this.tapLuat.push(new Luat_1.Luat(16, 'Luat phu dinh kep', new class {
            boKiemTra(P) {
                let i = 0;
                let j = 0;
                let tapHopDoiNgau = new BieuThucBuilder_1.BieuThucBuilder();
                let arr = [];
                for (i = 0; i < P.bieuThucCons.length; i++) {
                    tapHopDoiNgau = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                    if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(P.bieuThucCons[i]))
                        continue;
                    if (P.bieuThucCons[i].toanTu.tenToanTu === P.toanTu.tenToanTu)
                        continue;
                    for (j = 0; j < P.bieuThucCons[i].bieuThucCons.length; j++) {
                        let doiNgau = Helper_1.Helper.DOI_NGAU(P.bieuThucCons[i].bieuThucCons[j]);
                        let index = P.bieuThucCons.findIndex(e => e.id === doiNgau.id);
                        if (index !== -1) {
                            tapHopDoiNgau.addBieuThucCon2(P.bieuThucCons[index]);
                            arr.push(index);
                        }
                    }
                    let bt = tapHopDoiNgau.build();
                    if (bt.bieuThucCons.length >= 2 || (bt.bieuThucCons.length === 1 && !Helper_1.Helper.IS_BIEU_THUC_SO_CAP(bt))) {
                        // return new LuatMessage(bt, arr, i);
                        break;
                    }
                }
                let bt = tapHopDoiNgau.build();
                if (bt.bieuThucCons.length >= 2 || (bt.bieuThucCons.length === 1 && !Helper_1.Helper.IS_BIEU_THUC_SO_CAP(bt))) {
                    return new LuatMessage_1.LuatMessage(bt, arr, i);
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let id_duocChon = con.msg2;
                let tapDoiNgau = con.msg1;
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (tapDoiNgau.includes(i) && i !== id_duocChon) {
                        let bt = con.bieuThuc;
                        let tt = P.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI ? new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.TUYEN) : new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.HOI);
                        let con_builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(tt.tenToanTu);
                        for (let j = 0; j < bt.bieuThucCons.length; j++) {
                            con_builder.addBieuThucCon(Helper_1.Helper.DOI_NGAU(bt.bieuThucCons[j]));
                        }
                        builder.addBieuThucCon(Helper_1.Helper.PHU_DINH_MENH_DE(con_builder.build()));
                    }
                    else if (i === id_duocChon) {
                        builder.addBieuThucCon(P.bieuThucCons[id_duocChon]);
                    }
                    else
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                }
                return builder.build();
            }
        }()));
        /// LUAT PHAN PHOI
        this.tapLuat.push(new Luat_1.Luat(16, 'Luat phan phoi', new class {
            boKiemTra(P) {
                ///console.log(Helper.IS_ROOT(P));
                if (Helper_1.Helper.IS_ROOT(P) && P.bieuThucCons.length >= 2) {
                    let index = P.bieuThucCons.findIndex(e => !Helper_1.Helper.IS_BIEU_THUC_SO_CAP(e));
                    let a = 0;
                    if (index === 0)
                        a = 1;
                    if (index !== -1) {
                        return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu)
                            .addBieuThucCon(P.bieuThucCons[a])
                            .addBieuThucCon(P.bieuThucCons[index]).build(), index, a);
                    }
                    else
                        return null;
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                let index = con.msg1;
                let a = con.msg2;
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                for (let i = 0; i < P.bieuThucCons.length; i++) {
                    if (i !== a && i !== index) {
                        builder.addBieuThucCon(P.bieuThucCons[i]);
                    }
                }
                let n_builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.bieuThucCons[index].toanTu.tenToanTu);
                for (let i = 0; i < P.bieuThucCons[index].bieuThucCons.length; i++) {
                    let buil = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(P.toanTu.tenToanTu);
                    buil.addBieuThucCon(P.bieuThucCons[a])
                        .addBieuThucCon(P.bieuThucCons[index].bieuThucCons[i]);
                    n_builder.addBieuThucCon(buil.build());
                }
                if (builder.sizeBuilder() === 0) {
                    return n_builder.build();
                }
                builder.addBieuThucCon(n_builder.build());
                return builder.build();
            }
        }()));
    }
    duyetTapLuat(P, luat) {
        let num = luat.pop();
        for (let i = 1; i <= this.tapLuat.length; i++) {
            if (num !== undefined || num !== []) {
                if ((num === 11 && i === 17) || (num === 16 && i === 11))
                    continue;
                if ((num === 12 && i === 15) || (num === 15 && i === 12))
                    continue;
                if ((num === 13 && i === 14) || (num === 14 && i === 13))
                    continue;
                if ((num === 8 && i === 16) || (num === 16 && i === 8))
                    continue;
            }
            let rs = this.tapLuat[i - 1].run(P);
            if (rs !== null) {
                return { bieuThuc: rs.goc, bieuThucCon: rs.con, idLuat: i };
            }
        }
        return { bieuThuc: P, bieuThucCon: P, idLuat: -1 };
    }
    apDungLuat(P, id) {
        let mess = this.tapLuat[id].boKiemTra(P);
        if (mess !== null)
            return mess.bieuThuc;
        return null;
    }
    getLuat(id) {
        return this.tapLuat[id];
    }
}
exports.TapLuat = TapLuat;
TapLuat.LUAT_DE_MORGAN = 13;
