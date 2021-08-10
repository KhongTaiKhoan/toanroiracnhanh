"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapSuyDien = void 0;
const Luat_1 = require("./Luat");
const LuatMessage_1 = require("./LuatMessage");
const BieuThucBuilder_1 = require("../ThanhPhanC/BieuThucBuilder");
const ToanTuLogic_1 = require("../ThanhPhanOpts/ToanTuLogic");
const Helper_1 = require("../ThanhPhanFuncs/Helper");
const TapLuatTuongDuong_1 = require("./TapLuatTuongDuong");
const SuyLuanLogic_1 = require("../../BaiTap/BaiTap_Logic/SuyLuanLogic");
const MenhDeTuongDuong_1 = require("../../BaiTap/BaiTap_Logic/MenhDeTuongDuong");
const ChuyenStringThanhBieuThuc_1 = require("../ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
class TapSuyDien {
    // public static LUAT_CONG = 0;
    constructor(suyDien) {
        this.tapLuat = [];
        this.tapLuat = [];
        this.suyDienNotiFyObject = suyDien;
        this.xayDungTapLuat();
    }
    xayDungTapLuat() {
        //#region RUT GON
        this.tapLuat.push(new Luat_1.Luat(0, 'Luật rút gọn', new class {
            boKiemTra(P) {
                let luan = P.bieuThucCons[0];
                if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(luan))
                    return null;
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO || luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUONG_DUONG)
                    return null;
                let datas = [];
                let back = Helper_1.Helper.SAO_CHEP(luan);
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.PHU_DINH && !Helper_1.Helper.IS_BIEU_THUC_SO_CAP(luan)) {
                    let tapLuan = new TapLuatTuongDuong_1.TapLuat();
                    luan = tapLuan.getLuat(TapLuatTuongDuong_1.TapLuat.LUAT_DE_MORGAN).nhanKetQua(luan);
                    datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(luan, tapLuan.getLuat(TapLuatTuongDuong_1.TapLuat.LUAT_DE_MORGAN).tenLuat));
                }
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.HOI) {
                    return new LuatMessage_1.LuatMessage(luan, back, datas);
                }
                luan = back;
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                return con.bieuThuc;
            }
        }));
        //#endregion 
        //#region Luat tam doan luan khang dinh
        this.tapLuat.push(new Luat_1.Luat(1, 'Tam đoạn luận khẳng định', new class {
            boKiemTra(P) {
                let giaThiet = P.bieuThucCons[1].bieuThucCons[0];
                let luan = P.bieuThucCons[0];
                let i = 0;
                let back = Helper_1.Helper.SAO_CHEP(luan);
                if (luan.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.KEO_THEO || Helper_1.Helper.IS_BIEU_THUC_SO_CAP(luan))
                    return null;
                /// BIEU THUC VE PHAI KHONG CAN TACH RA
                for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                    if (giaThiet.bieuThucCons[i].id === luan.id)
                        continue;
                    if (luan.bieuThucCons[0].id === giaThiet.bieuThucCons[i].id)
                        return new LuatMessage_1.LuatMessage(luan.bieuThucCons[1], giaThiet.bieuThucCons[i]);
                    let tuongDuong = new MenhDeTuongDuong_1.MenhDeTuongDuong();
                    tuongDuong.VT = giaThiet.bieuThucCons[i]; //Helper.SAO_CHEP();    
                    tuongDuong.VP = luan.bieuThucCons[0]; ///Helper.SAO_CHEP();
                    let loiGiaiChuyenDoi = tuongDuong.giai();
                    if (loiGiaiChuyenDoi !== null) {
                        let datas = [];
                        //    let tapTuongDuong:TapLuat= new TapLuat();
                        loiGiaiChuyenDoi.forEach(e => {
                            datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(e.btGoc), e.luat));
                        });
                        return new LuatMessage_1.LuatMessage(luan.bieuThucCons[1], giaThiet.bieuThucCons[i], datas);
                    }
                }
                //#region  TIEN HANH TACH VE PHAI RA KHI CHUA DAU HOI
                let VT = luan.bieuThucCons[0];
                if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(VT))
                    return null;
                let datas = [];
                //// TIM CAC MENH DE LIEN QUAN DEN MENH DE CON
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(ToanTuLogic_1.ToanTu.HOI);
                let tv = [];
                for (let j = 0; j < VT.bieuThucCons.length; j++) {
                    let index = giaThiet.bieuThucCons.findIndex(e => {
                        return e.id == VT.bieuThucCons[j].id || e.id == Helper_1.Helper.PHU_DINH_MENH_DE(VT.bieuThucCons[j]).id;
                    });
                    if (index === -1)
                        return null;
                    tv.push(index);
                }
                let hop = [];
                for (i = 0; i < tv.length; i++) {
                    builder.addBieuThucCon2(giaThiet.bieuThucCons[tv[i]]);
                    hop.push(giaThiet.bieuThucCons[tv[i]]);
                }
                let medtd = new MenhDeTuongDuong_1.MenhDeTuongDuong();
                medtd.VT = builder.build();
                medtd.VP = Helper_1.Helper.SAO_CHEP(VT);
                let loiGiai = medtd.giai();
                // console.log(loiGiai);
                if (loiGiai !== null) {
                    // console.log("NULL");
                    datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(builder.build(), TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_HOP], hop));
                    loiGiai.forEach(e => {
                        datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua), e.luat));
                    });
                    return new LuatMessage_1.LuatMessage(luan.bieuThucCons[1], builder.build(), datas);
                }
                //#endregion                      
                luan = back;
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                return con.bieuThuc;
            }
        }()));
        //#endregion    
        //#region Tam doan luan phu dinh
        this.tapLuat.push(new Luat_1.Luat(2, 'Tam đoạn luận phủ định', new class {
            boKiemTra(P) {
                let giaThiet = P.bieuThucCons[1].bieuThucCons[0];
                let luan = P.bieuThucCons[0];
                let i = 0;
                if (luan.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.KEO_THEO || Helper_1.Helper.IS_BIEU_THUC_SO_CAP(luan))
                    return null;
                /// BIEU THUC VE PHAI KHONG CAN TACH RA
                for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                    if (giaThiet.bieuThucCons[i].id === luan.id)
                        continue;
                    if (luan.bieuThucCons[1].id === Helper_1.Helper.PHU_DINH_MENH_DE(giaThiet.bieuThucCons[i]).id ||
                        luan.bieuThucCons[1].id === Helper_1.Helper.DOI_NGAU(giaThiet.bieuThucCons[i]).id)
                        return new LuatMessage_1.LuatMessage(Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]), giaThiet.bieuThucCons[i]);
                    let tuongDuong = new MenhDeTuongDuong_1.MenhDeTuongDuong();
                    tuongDuong.VP = Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[1]);
                    tuongDuong.VT = giaThiet.bieuThucCons[i]; //Helper.SAO_CHEP();    
                    let loiGiaiChuyenDoi = tuongDuong.giai();
                    if (loiGiaiChuyenDoi !== null) {
                        let datas = [];
                        loiGiaiChuyenDoi.forEach(e => {
                            datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(e.btGoc), e.luat));
                        });
                        return new LuatMessage_1.LuatMessage(Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]), giaThiet.bieuThucCons[i], datas);
                    }
                }
                //#region  TIEN HANH TACH VE PHAI RA KHI CHUA DAU HOI
                let VP = luan.bieuThucCons[1];
                if (Helper_1.Helper.IS_BIEU_THUC_SO_CAP(VP))
                    return null;
                let datas = [];
                //// TIM CAC MENH DE LIEN QUAN DEN MENH DE CON
                let builder = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(ToanTuLogic_1.ToanTu.HOI);
                let tv = [];
                for (let j = 0; j < VP.bieuThucCons.length; j++) {
                    let index = giaThiet.bieuThucCons.findIndex(e => {
                        return e.id == VP.bieuThucCons[j].id || e.id == Helper_1.Helper.PHU_DINH_MENH_DE(VP.bieuThucCons[j]).id;
                    });
                    if (index === -1)
                        return null;
                    tv.push(index);
                }
                let hop = [];
                for (i = 0; i < tv.length; i++) {
                    builder.addBieuThucCon2(giaThiet.bieuThucCons[tv[i]]);
                    hop.push(giaThiet.bieuThucCons[tv[i]]);
                }
                let medtd = new MenhDeTuongDuong_1.MenhDeTuongDuong();
                medtd.VT = builder.build();
                medtd.VP = Helper_1.Helper.PHU_DINH_MENH_DE(VP);
                let loiGiai = medtd.giai();
                // console.log(loiGiai);
                if (loiGiai !== null) {
                    // console.log("NULL");
                    datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(builder.build(), TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_HOP], hop));
                    loiGiai.forEach(e => {
                        datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua), e.luat));
                    });
                    return new LuatMessage_1.LuatMessage(Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[0]), builder.build(), datas);
                }
                //#endregion
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                return con.bieuThuc;
            }
        }()));
        //#endregion
        //#region  Tam doan luan gia dinh
        this.tapLuat.push(new Luat_1.Luat(2, 'Tam đoạn luận giả định', new class {
            boKiemTra(P) {
                let luan = P.bieuThucCons[0];
                let giaThiet = P.bieuThucCons[1].bieuThucCons[0];
                if (luan.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.KEO_THEO)
                    return null;
                let VT = luan.bieuThucCons[0];
                let datas = [];
                /// KIEM TRA MA KHONG CA GOP LAI
                for (let i = 0; i < giaThiet.bieuThucCons.length; i++) {
                    if (giaThiet.bieuThucCons[i].toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.KEO_THEO)
                        continue;
                    if (VT.id === giaThiet.bieuThucCons[i].bieuThucCons[1].id) {
                        let bt = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon(giaThiet.bieuThucCons[i].bieuThucCons[0])
                            .addBieuThucCon(luan.bieuThucCons[1])
                            .addToanTu(ToanTuLogic_1.ToanTu.KEO_THEO)
                            .build();
                        return new LuatMessage_1.LuatMessage(bt, giaThiet.bieuThucCons[i]);
                    }
                    // let md:MenhDeTuongDuong = new MenhDeTuongDuong();
                    // md.VT = giaThiet.bieuThucCons[i].bieuThucCons[1]// Helper.SAO_CHEP();
                    // md.VP =  VT;//Helper.SAO_CHEP(VT);
                    // let loiGiai:LoiGiaiMenhDeTuongDuong[]|null = md.giai();
                    // if(loiGiai !== null){
                    //     loiGiai.forEach(e=>{
                    //         datas.push(new SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua),e.luat)) 
                    //     });
                    //     let bt:BieuThucMenhDe= new BieuThucBuilder().addBieuThucCon(giaThiet.bieuThucCons[i].bieuThucCons[0])
                    //                         .addBieuThucCon(luan.bieuThucCons[1])
                    //                         .addToanTu(ToanTu.KEO_THEO)
                    //                         .build();
                    //     return new LuatMessage(bt,i,datas);
                    // }
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                // let giaThiet = P.bieuThucCons[1];
                // let bt_1:BieuThucMenhDe = con.bieuThuc;
                // let bt_2:BieuThucMenhDe = giaThiet.bieuThucCons[con.msg1];
                return con.bieuThuc;
            }
        }()));
        //#endregion
        //#region Tam doan luan loai tru
        this.tapLuat.push(new Luat_1.Luat(4, 'Tam đoạn luận loại trừ', new class {
            boKiemTra(P) {
                let luan = P.bieuThucCons[0];
                let giaThiet = P.bieuThucCons[1].bieuThucCons[0];
                let i = 0;
                let j = 0;
                let count = false;
                let datas = [];
                if (luan.toanTu.tenToanTu !== ToanTuLogic_1.ToanTu.TUYEN)
                    return null;
                for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                    for (j = 0; j < luan.bieuThucCons.length; j++) {
                        let md = new MenhDeTuongDuong_1.MenhDeTuongDuong();
                        md.VP = Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]);
                        md.VT = giaThiet.bieuThucCons[i];
                        let loiGiai = md.giai();
                        if (loiGiai !== null) {
                            loiGiai.forEach(e => {
                                datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(e.btKetQua), e.luat));
                            });
                            count = true;
                            luan.bieuThucCons.splice(j, 1);
                            if (luan.bieuThucCons.length === 1)
                                luan = luan.bieuThucCons[0];
                            break;
                        }
                    }
                    if (count)
                        return new LuatMessage_1.LuatMessage(luan, giaThiet.bieuThucCons[i], datas);
                }
                // if(count)
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                // let giaThiet: BieuThucMenhDe = P.bieuThucCons[1];
                // let luan: BieuThucMenhDe = P.bieuThucCons[0];
                // let i=con.msg1;
                // for (let j:number = 0; j < luan.bieuThucCons.length; j++) {
                //     let md = new MenhDeTuongDuong();
                //     md.VP = Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]);
                //     md.VT = giaThiet.bieuThucCons[i];
                //     let loiGiai: LoiGiaiMenhDeTuongDuong[] | null = md.giai();
                //     if (loiGiai !== null) {
                //     }
                // }
                return con.bieuThuc;
            }
        }()));
        //#endregion
        //#region Loai bo mau thuan
        this.tapLuat.push(new Luat_1.Luat(5, 'Loại bỏ mâu thuẫn', new class {
            boKiemTra(P) {
                let luan = P.bieuThucCons[0];
                let giaThiet = P.bieuThucCons[1].bieuThucCons[0];
                let i = 0;
                let j = 0;
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO) {
                    let vt = luan.bieuThucCons[0];
                    for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                        if (giaThiet.bieuThucCons[i].id === luan.id)
                            continue;
                        if (giaThiet.bieuThucCons[i].toanTu.tenToanTu !== luan.toanTu.tenToanTu)
                            continue;
                        if (giaThiet.bieuThucCons[i].bieuThucCons[0].id === Helper_1.Helper.PHU_DINH_MENH_DE(vt).id ||
                            giaThiet.bieuThucCons[i].bieuThucCons[0].id == Helper_1.Helper.DOI_NGAU(vt).id) {
                            return new LuatMessage_1.LuatMessage(new BieuThucBuilder_1.BieuThucBuilder()
                                .addBieuThucCon2(luan.bieuThucCons[1])
                                .addBieuThucCon2(giaThiet.bieuThucCons[i].bieuThucCons[0])
                                .addToanTu(ToanTuLogic_1.ToanTu.TUYEN)
                                .build(), giaThiet.bieuThucCons[i]);
                        }
                    }
                }
                ////CHUYEN DOI THANH PHEP HOI
                let datas = [];
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.KEO_THEO) {
                    let luatTuongDuong = new TapLuatTuongDuong_1.TapLuat();
                    luan = luatTuongDuong.getLuat(1).nhanKetQua(luan);
                    datas.push(new SuyLuanLogic_1.SuyDien.dataNotiFy(Helper_1.Helper.SAO_CHEP(luan), 'Luật phép kéo theo'));
                }
                if (luan.toanTu.tenToanTu === ToanTuLogic_1.ToanTu.TUYEN) {
                    for (i = 0; i < giaThiet.bieuThucCons.length; i++) {
                        if (giaThiet.bieuThucCons[i].id === luan.id)
                            continue;
                        if (giaThiet.bieuThucCons[i].toanTu.tenToanTu !== luan.toanTu.tenToanTu)
                            continue;
                        let kt = false;
                        let builde = new BieuThucBuilder_1.BieuThucBuilder().addToanTu(ToanTuLogic_1.ToanTu.TUYEN);
                        let m = [];
                        for (j = 0; j < luan.bieuThucCons.length; j++) {
                            let index = giaThiet.bieuThucCons[i].bieuThucCons.findIndex(e => {
                                return e.id === Helper_1.Helper.PHU_DINH_MENH_DE(luan.bieuThucCons[j]).id ||
                                    e.id == Helper_1.Helper.DOI_NGAU(luan.bieuThucCons[j]).id;
                            });
                            if (index !== -1) {
                                m.push(index);
                                kt = true;
                            }
                            if (index === -1 && kt)
                                builde.addBieuThucCon2(luan.bieuThucCons[j]);
                        }
                        if (kt) {
                            for (let z = 0; z < giaThiet.bieuThucCons[i].bieuThucCons.length; z++) {
                                if (m.includes(z))
                                    continue;
                                builde.addBieuThucCon2(giaThiet.bieuThucCons[i].bieuThucCons[z]);
                            }
                            return new LuatMessage_1.LuatMessage(builde.build(), giaThiet.bieuThucCons[i], datas);
                        }
                    }
                }
                return null;
            }
        }(), new class {
            ketQua(P, con) {
                return con.bieuThuc;
            }
        }()));
        //#endregion Loai bo mau thuan
    }
    suyDien(P, luan) {
        let luan_clone = Helper_1.Helper.SAO_CHEP(luan);
        let newP = new BieuThucBuilder_1.BieuThucBuilder().addBieuThucCon2(luan).addBieuThucCon2(P).addToanTu(ToanTuLogic_1.ToanTu.HOI).build();
        for (let i = 0; i < this.tapLuat.length; i++) {
            let mess = this.tapLuat[i].boKiemTra(newP);
            if (mess !== null) {
                let rs = this.tapLuat[i].nhanKetQua(newP, mess);
                let kt = false;
                let chiSoTrongLoiGiai = -1;
                //// THEM CAC LUAT CHUYEN DOI TUONG DUONG
                if (mess.msg2 !== undefined && mess.msg2 != []) {
                    let datas = mess.msg2;
                    for (let j = 0; j < datas.length; j++) {
                        if (datas[j].target.length === 0) {
                            ///// TRUONG HOP LUAT CHUYEN DOI
                            if (chiSoTrongLoiGiai === -1)
                                chiSoTrongLoiGiai = this.suyDienNotiFyObject.truyVet(mess.msg1);
                            kt = this.suyDienNotiFyObject.themLoiGiai(datas[j], [chiSoTrongLoiGiai]);
                            chiSoTrongLoiGiai = this.suyDienNotiFyObject.getChiSoLoiGiaiLonNhat();
                        }
                        else
                            //// TRUONG HOP LUAT HOP
                            kt = this.suyDienNotiFyObject.themLoiGiai(datas[j]);
                        if (kt)
                            return SuyLuanLogic_1.SuyDien.SuyDienLoGic.KET_THUC;
                    }
                }
                // console.log(luan.id);
                if (i === TapSuyDien.LUAT_RUT_GON - 1) {
                    kt = this.rutGonKetQua(rs, mess.msg1, chiSoTrongLoiGiai);
                }
                else {
                    this.suyDienNotiFyObject.ghiSuKien(rs, [luan_clone, mess.msg1]);
                    // if(chiSoTrongLoiGiai===-1)
                    kt = this.suyDienNotiFyObject.themLoiGiai(new SuyLuanLogic_1.SuyDien.dataNotiFy(rs, TapSuyDien.BANG_LUAT[i + 1], [luan_clone, mess.msg1]));
                    // else kt = this.suyDienNotiFyObject.themLoiGiai(new SuyDien.dataNotiFy(rs, TapSuyDien.BANG_LUAT[i + 1], [luan_clone,mess.msg1]),[chiSoTrongLoiGiai]);
                }
                if (kt)
                    return SuyLuanLogic_1.SuyDien.SuyDienLoGic.KET_THUC;
                else
                    return SuyLuanLogic_1.SuyDien.SuyDienLoGic.TIEP_TUC;
            }
        }
        return SuyLuanLogic_1.SuyDien.SuyDienLoGic.CHUAN_BI_KET_THUC;
    }
    getLuatSuyDien(index) {
        return this.tapLuat[index];
    }
    ///// XU LY LUAT
    rutGonKetQua(P, Back, chiSo) {
        /// LOAI BO DAU HOI
        for (let j = 0; j < P.bieuThucCons.length; j++) {
            this.suyDienNotiFyObject.ghiSuKien(P.bieuThucCons[j], [Back]);
            if (chiSo && chiSo !== -1)
                this.suyDienNotiFyObject.themLoiGiai(new SuyLuanLogic_1.SuyDien.dataNotiFy(P.bieuThucCons[j], TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_RUT_GON], [Back]), [chiSo]);
            else
                this.suyDienNotiFyObject.themLoiGiai(new SuyLuanLogic_1.SuyDien.dataNotiFy(P.bieuThucCons[j], TapSuyDien.BANG_LUAT[TapSuyDien.LUAT_RUT_GON], [Back]));
            if (this.suyDienNotiFyObject.soSanhKetQua(P.bieuThucCons[j]))
                return true;
        }
        return false;
    }
}
exports.TapSuyDien = TapSuyDien;
TapSuyDien.LUAT_HOP = 0;
TapSuyDien.LUAT_RUT_GON = 1;
TapSuyDien.TAM_DOAN_LUAN_KHANG_DINH = 2;
TapSuyDien.TAM_DOAN_LUAN_PHU_DINH = 3;
TapSuyDien.BANG_LUAT = ['Luật hợp', 'Luật rút gọn', 'luật tam đoạn luận khẳng định',
    'luật tam đoạn luận phủ định', 'luật tam đoạn luận giả định', 'luật tam đoạn luận loại trừ', 'luật loại bỏ mâu thuẫn'];
