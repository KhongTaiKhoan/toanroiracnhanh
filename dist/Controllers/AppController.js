"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const ToanTuLogic_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic");
const ChuyenStringThanhBieuThuc_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
const MenhDeTuongDuong_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong");
const BieuThucMenhDe_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanC/BieuThucMenhDe");
const Helper_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/Helper");
const SuyLuanLogic_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/SuyLuanLogic");
const ToanTuFactory_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuFactory");
const BangChanTri_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/BangChanTri");
const ToiThieuHoaKarNaugh_1 = require("../BieuDienTriThuc/DaiSoBoolean/ToiThieuHoaKarNaugh");
const TapHop_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/TapHop");
const QuanHeDaiSo_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHeDaiSo");
const QuanHe_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHe");
const HauTo_1 = require("../BieuDienTriThuc/BieuThucDaiSoZ/ThanhPhanFuncs/HauTo");
const LopTuongDuong_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/LopTuongDuong");
const GiaiBaiQuanHeThuTu_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/GiaiBaiQuanHeThuTu");
class Controller {
    index(req, res) {
        let toanTus = [];
        ToanTuLogic_1.ToanTu.kyHieus.forEach(e => { toanTus.push(e); });
        toanTus.push('(');
        toanTus.push(')');
        toanTus.push('\u2261');
        toanTus.push('TRUE');
        toanTus.push('FALSE');
        res.render('index.ejs', { toanTus: toanTus });
    }
    notBai(req, res) {
        let deBai = req.body.noidung;
        console.log(deBai);
        deBai = deBai.replace(new RegExp('TRUE', 'g'), '1');
        deBai = deBai.replace(new RegExp('FALSE', 'g'), '0');
        let bai = new MenhDeTuongDuong_1.MenhDeTuongDuong();
        let lg = bai.giai(deBai);
        if (lg === null || lg === []) {
            res.send({
                complete: false
            });
        }
        else {
            let VT = Helper_1.Helper.IN(bai.vt_clone);
            let VP = Helper_1.Helper.IN(bai.vp_clone);
            let loiGiai = lg;
            res.send({
                complete: true,
                loiGiai: loiGiai,
                VT: VT,
                VP: VP
            });
        }
    }
    //#region  SUY DIEN
    getSuyDien(req, res) {
        let toanTus = [];
        ToanTuLogic_1.ToanTu.kyHieus.forEach(e => { toanTus.push(e); });
        toanTus.push('(');
        toanTus.push(')');
        toanTus.push('\u2261');
        toanTus.push('TRUE');
        toanTus.push('FALSE');
        res.render('SuyDienMenhDe.ejs', { toanTus: toanTus });
    }
    postSuyDien(req, res) {
        let bai = new SuyLuanLogic_1.SuyDien.SuyDienLoGic();
        let deBai = req.body['deBai[]'];
        let giaThiet = new BieuThucMenhDe_1.BieuThucMenhDe();
        let ketLuan = new BieuThucMenhDe_1.BieuThucMenhDe();
        ketLuan = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(deBai[deBai.length - 1]);
        deBai.pop();
        for (let i = 0; i < deBai.length; i++) {
            giaThiet.bieuThucCons.push(ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(deBai[i]));
        }
        giaThiet.toanTu = new ToanTuFactory_1.ToanTuFactory().create(ToanTuLogic_1.ToanTu.HOI);
        bai.xayDungDeBai(giaThiet, ketLuan);
        let loiGiai = bai.giai();
        if (loiGiai === null) {
            res.send({ msg: false });
        }
        else {
            let chiTiet = [];
            loiGiai.forEach(e => {
                let left = `${e.index}. ${Helper_1.Helper.IN(e.bieuThucKetQua)}`;
                let right = '';
                if (e.target[0] === -1)
                    right = '(GIẢ THIẾT)';
                else {
                    right = `Áp dụng ${e.luat} cho `;
                    for (let i = 0; i < e.target.length; i++) {
                        right += `(${e.target[i]}), `;
                    }
                    right = right.substr(0, right.length - 2);
                }
                chiTiet.push([left, right]);
            });
            //    console.log(chiTiet);
            res.send({
                msg: true,
                data: chiTiet
            });
        }
    }
    //#endregion
    //#region  BANG CHAN TRI
    getBangChanTri(req, res) {
        let toanTus = [];
        ToanTuLogic_1.ToanTu.kyHieus.forEach(e => { toanTus.push(e); });
        toanTus.push('(');
        toanTus.push(')');
        toanTus.push('\u2261');
        toanTus.push('TRUE');
        toanTus.push('FALSE');
        res.render('BangChanTri.ejs', { toanTus: toanTus });
    }
    postBangChanTri(req, res) {
        let bai = new BangChanTri_1.BangChanTri();
        bai.bieuThuc = ChuyenStringThanhBieuThuc_1.ChuyenStringThanhBieuThuc.chuyenDoi(req.body.deBai);
        let loiGiai = bai.giai();
        if (loiGiai === null) {
            res.send({ msg: false });
        }
        else {
            res.send({ msg: true, loiGiai: loiGiai });
        }
    }
    //#endregion
    //#region  HAM BOOLEAN
    getHamBoolean(req, res) {
        let toanTus = [];
        ToanTuLogic_1.ToanTu.kyHieus.forEach(e => { toanTus.push(e); });
        toanTus.push('(');
        toanTus.push(')');
        toanTus.push('\u2261');
        toanTus.push('TRUE');
        toanTus.push('FALSE');
        res.render('RutGonHamBoolean.ejs', { toanTus: toanTus });
    }
    postHamBoolean(req, res) {
        let baiTap = new ToiThieuHoaKarNaugh_1.ToiUuHoa();
        let ketQuaRutGonHamBoolean = baiTap.giai(req.body.deBai);
        if (ketQuaRutGonHamBoolean === null)
            res.send({ mes: false });
        else {
            let bienCoSo = [];
            ketQuaRutGonHamBoolean.bienCoSo.forEach(e => { bienCoSo.push(Helper_1.Helper.IN(e)); });
            let bieuThucLonChuyenDoi = [];
            ketQuaRutGonHamBoolean.bieuThucLonChuyenDoi.forEach(e => { bieuThucLonChuyenDoi.push(Helper_1.Helper.IN(e)); });
            let bieuThucChuyenDoi = [];
            ketQuaRutGonHamBoolean.bieuThucChuyenDoi.forEach(e => { bieuThucChuyenDoi.push(Helper_1.Helper.IN(e)); });
            res.send({
                mes: true,
                deBai: Helper_1.Helper.IN(ketQuaRutGonHamBoolean.deBai),
                bienCoSo: bienCoSo,
                maTran: ketQuaRutGonHamBoolean.maTran,
                teBaoLon: ketQuaRutGonHamBoolean.teBaoLon,
                bieuThucLonChuyenDoi: bieuThucLonChuyenDoi,
                bieuThucChuyenDoi: bieuThucChuyenDoi,
                mangDanhDau: ketQuaRutGonHamBoolean.mangDanhDau
            });
        }
    }
    //#endregion
    //#region  QUAN HE 2 NGOI
    getQuanHe2Ngoi(req, res) {
        let rs = req.params.id;
        let link = '';
        if (rs === '1') {
            link = '/tinh-chat-quan-he-2-ngoi';
        }
        else if (rs === '2') {
            link = '/quan-he-tuong-duong';
        }
        else {
            link = '/quan-he-thu-tu';
        }
        res.render('QuanHe2Ngoi.ejs', { link: link });
    }
    tinhChatQuanHe2Ngoi(req, res) {
        // console.log(req.body);
        let A = new TapHop_1.TapHop();
        if (req.body.typeA == '1') {
            let array = [];
            let str = req.body.dataA.split(',');
            str.forEach(e => { array.push(parseInt(e)); });
            A = new TapHop_1.TapHopBuilder().addArray(array).build();
        }
        else {
            A = new TapHop_1.TapHopBuilder().addCondition(new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z()).build();
        }
        let R = null;
        if (req.body.typeR === '1') {
            let array = [];
            let str = req.body.dataR.split(',');
            for (let i = 0; i < str.length / 2; i++) {
                let s = [];
                s[0] = str[i * 2].substring(1);
                s[1] = str[i * 2 + 1].substring(0, str[i * 2 + 1].length - 1);
                // console.log(s[0] +','+s[1] );
                let row = [];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHe_1.QuanHeFactory().createQuanHeLietKe(A, array);
        }
        else {
            let str = req.body.dataR.split('@');
            let left = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[0]));
            let qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z();
            if (str[1] === '8')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left, []);
            else if (str[1] === '9')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);
                else if (str[1] === '3')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);
                else if (str[1] === '5')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHe_1.QuanHeFactory().createQuanHeDieuKien(A, qh);
        }
        if (R !== null) {
            try {
                let rs = R.cacTinhChat();
                let detail = [];
                for (let i = 0; i < rs.length; i++) {
                    let row = [];
                    row.push(`${i + 1}. Xét ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`=> Quan hệ có ${rs[i].name}`);
                    else
                        row.push(`=> Quan hệ không có ${rs[i].name}`);
                    detail.push(row);
                }
                res.send({ rs: true, type: 1, msg: detail });
            }
            catch (error) {
                res.send({ rs: false, type: 1, msg: 'Đề bài bị lỗi' });
            }
        }
        else
            res.send({ rs: false, type: 1, msg: 'Bài toán chưa được hỗ trợ' });
    }
    quanHeTuongDuong(req, res) {
        let A = new TapHop_1.TapHop();
        if (req.body.typeA === '1') {
            let array = [];
            let str = req.body.dataA.split(',');
            str.forEach(e => { array.push(parseInt(e)); });
            A = new TapHop_1.TapHopBuilder().addArray(array).build();
        }
        else {
            A = new TapHop_1.TapHopBuilder().addCondition(new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z()).build();
        }
        let R = null;
        if (req.body.typeR === '1') {
            let array = [];
            let str = req.body.dataR.split(',');
            for (let i = 0; i < str.length / 2; i++) {
                let s = [];
                s[0] = str[i * 2].substring(1);
                s[1] = str[i * 2 + 1].substring(0, str[i * 2 + 1].length - 1);
                // console.log(s[0] +','+s[1] );
                let row = [];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHe_1.QuanHeFactory().createQuanHeLietKe(A, array);
        }
        else {
            let str = req.body.dataR.split('@');
            let left = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[0]));
            let qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z();
            if (str[1] === '8')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left, []);
            else if (str[1] === '9')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);
                else if (str[1] === '3')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);
                else if (str[1] === '5')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHe_1.QuanHeFactory().createQuanHeDieuKien(A, qh);
        }
        let detail = [];
        if (R !== null) {
            try {
                let rs = R.cacTinhChat();
                for (let i = 0; i < rs.length; i++) {
                    let row = [];
                    row.push(`${i + 1}. Xét ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`   Quan hệ có ${rs[i].name}`);
                    else
                        row.push(`   Quan hệ không có ${rs[i].name}`);
                    detail.push(row);
                }
                let lopTD = new LopTuongDuong_1.XacDinhLopTuongDuong(R).layLopTuongDuong();
                detail.push(['<b><i>=>Vậy quan hệ là quan hệ tương đương</i></b>']);
                let row = [];
                row.push('Như tập A được phân hoạch thành các lớp tương đương như sau:');
                lopTD.forEach(e => {
                    row.push(e.toString());
                });
                detail.push(row);
                res.send({ rs: true, type: 2, msg: detail });
            }
            catch (error) {
                detail.push(['<i><b>' + error + '</b></i>']);
                res.send({ rs: false, type: 2, msg: detail });
            }
        }
        else
            res.send({ rs: false, type: 2, msg: 'Xin lỗi!Đề bài bị lỗi hoặc chưa được hỗ trợ' });
    }
    quanHeThuTu(req, res) {
        let A = new TapHop_1.TapHop();
        if (req.body.typeA === '1') {
            let array = [];
            let str = req.body.dataA.split(',');
            str.forEach(e => { array.push(parseInt(e)); });
            A = new TapHop_1.TapHopBuilder().addArray(array).build();
        }
        else {
            A = new TapHop_1.TapHopBuilder().addCondition(new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z()).build();
        }
        let R = null;
        if (req.body.typeR === '1') {
            let array = [];
            let str = req.body.dataR.split(',');
            for (let i = 0; i < str.length / 2; i++) {
                let s = [];
                s[0] = str[i * 2].substring(1);
                s[1] = str[i * 2 + 1].substring(0, str[i * 2 + 1].length - 1);
                // console.log(s[0] +','+s[1] );
                let row = [];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHe_1.QuanHeFactory().createQuanHeLietKe(A, array);
        }
        else {
            let str = req.body.dataR.split('@');
            let left = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[0]));
            let qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_Z();
            if (str[1] === '8')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_CHAN(left, []);
            else if (str[1] === '9')
                qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right = HauTo_1.HauTo.BieuThucTuChuoi(HauTo_1.HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);
                else if (str[1] === '3')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);
                else if (str[1] === '5')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSo_1.QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHe_1.QuanHeFactory().createQuanHeDieuKien(A, qh);
        }
        let detail = [];
        if (R !== null) {
            try {
                let rs = R.cacTinhChat();
                for (let i = 0; i < rs.length; i++) {
                    let row = [];
                    row.push(`${i + 1}. Xét ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`   Quan hệ có ${rs[i].name}`);
                    else
                        row.push(`   Quan hệ không có ${rs[i].name}`);
                    detail.push(row);
                }
                let l = new GiaiBaiQuanHeThuTu_1.XacDinhBaiQuanHeThuTu(R).xacDinh();
                detail.push(['<b><i>=>Vậy quan hệ là quan hệ thứ tự</i></b>']);
                res.send({ rs: true, type: 3, msg: detail, exp: l });
            }
            catch (error) {
                console.log(error);
                detail.push(['<i><b>' + error + '</b></i>']);
                res.send({ rs: false, type: 3, msg: detail });
            }
        }
        else
            res.send({ rs: false, type: 3, msg: 'Xin lỗi!Đề bài bị lỗi hoặc chưa được hỗ trợ' });
    }
}
exports.Controller = Controller;
