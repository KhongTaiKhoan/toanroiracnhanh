"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const ToanTuLogic_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic");
const ChuyenStringThanhBieuThuc_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc");
const Helper_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/Helper");
const SuyLuanLogic_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/SuyLuanLogic");
const BangChanTri_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/BangChanTri");
const ToiThieuHoaKarNaugh_1 = require("../BieuDienTriThuc/DaiSoBoolean/ToiThieuHoaKarNaugh");
const TapHop_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/TapHop");
const QuanHeDaiSo_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHeDaiSo");
const QuanHe_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHe");
const HauTo_1 = require("../BieuDienTriThuc/BieuThucDaiSoZ/ThanhPhanFuncs/HauTo");
const LopTuongDuong_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/LopTuongDuong");
const GiaiBaiQuanHeThuTu_1 = require("../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/GiaiBaiQuanHeThuTu");
const Deduction_1 = require("../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Deduction");
const ExpressionToString_1 = require("../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ExpressionToString");
const Equivalence_1 = require("../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Equivalence");
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
        deBai = deBai.replace(new RegExp('TRUE', 'g'), '1');
        deBai = deBai.replace(new RegExp('FALSE', 'g'), '0');
        // let bai:MenhDeTuongDuong = new MenhDeTuongDuong();
        // let lg:LoiGiaiMenhDeTuongDuong[]|null=  bai.giai(deBai);
        let trans = new Equivalence_1.Equivalence().giai(deBai);
        console.log('sssss');
        if (trans === null) {
            res.send({
                complete: false
            });
        }
        else {
            let split = deBai.split('\u2261');
            let VT = split[0];
            let VP = split[1];
            let loiGiai = [];
            trans.forEach(e => {
                let str = `${ExpressionToString_1.ExpressionToString(e.Exp())}  (${e.rule.name})`;
                loiGiai.push(str);
            });
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
        // let giaThiet:BieuThucMenhDe= new BieuThucMenhDe();
        // let ketLuan:BieuThucMenhDe = new BieuThucMenhDe();
        // ketLuan = ChuyenStringThanhBieuThuc.chuyenDoi(deBai[deBai.length-1]);
        // deBai.pop();
        // for(let i=0;i<deBai.length;i++){
        //     giaThiet.bieuThucCons.push(ChuyenStringThanhBieuThuc.chuyenDoi(deBai[i]));
        // }
        // giaThiet.toanTu = new ToanTuFactory().create(ToanTu.HOI);
        // bai.xayDungDeBai(giaThiet,ketLuan);
        let KL = deBai[deBai.length - 1];
        let GT = deBai.slice(0, deBai.length - 1);
        //    let loiGiai:LoiGiaiSuyDien[]|null = bai.giai();
        let reasoning = new Deduction_1.Deduction(GT, KL).giai();
        if (reasoning === null) {
            res.send({ msg: false });
        }
        else {
            let chiTiet = [];
            //    loiGiai.forEach(e => {
            //        let left = `${e.index}. ${Helper.IN(e.bieuThucKetQua)}`;
            //        let right = '';
            //        if (e.target[0] === -1) right = '(GI??? THI???T)';
            //        else {
            //            right = `??p d???ng ${e.luat} cho `;
            //            for (let i = 0; i < e.target.length; i++) {
            //                right += `(${e.target[i]}), `
            //            }
            //            right = right.substr(0, right.length - 2);
            //        }
            //        chiTiet.push([left, right]);
            //    })
            reasoning.forEach(e => {
                let str = [];
                str[0] = `${e.id}. ${ExpressionToString_1.ExpressionToString(e.exp)} `;
                if (e.parent.length !== 0)
                    str[1] = `( ${e.rule.name} ${e.parent})`;
                else
                    str[1] = '(GIA THIET)';
                chiTiet.push(str);
            });
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
            ketQuaRutGonHamBoolean.bieuThucLonChuyenDoi.forEach(e => {
                bieuThucLonChuyenDoi.push(Helper_1.Helper.IN(e));
            });
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
                    row.push(`${i + 1}. X??t ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`=> Quan h??? c?? ${rs[i].name}`);
                    else
                        row.push(`=> Quan h??? kh??ng c?? ${rs[i].name}`);
                    detail.push(row);
                }
                res.send({ rs: true, type: 1, msg: detail });
            }
            catch (error) {
                res.send({ rs: false, type: 1, msg: '????? b??i b??? l???i' });
            }
        }
        else
            res.send({ rs: false, type: 1, msg: 'B??i to??n ch??a ???????c h??? tr???' });
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
                    row.push(`${i + 1}. X??t ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`   Quan h??? c?? ${rs[i].name}`);
                    else
                        row.push(`   Quan h??? kh??ng c?? ${rs[i].name}`);
                    detail.push(row);
                }
                let lopTD = new LopTuongDuong_1.XacDinhLopTuongDuong(R).layLopTuongDuong();
                detail.push(['<b><i>=>V???y quan h??? l?? quan h??? t????ng ??????ng</i></b>']);
                let row = [];
                row.push('Nh?? t???p A ???????c ph??n ho???ch th??nh c??c l???p t????ng ??????ng nh?? sau:');
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
            res.send({ rs: false, type: 2, msg: 'Xin l???i!????? b??i b??? l???i ho???c ch??a ???????c h??? tr???' });
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
                    row.push(`${i + 1}. X??t ${rs[i].name}:`);
                    rs[i].describe.forEach(e => {
                        row.push(e);
                    });
                    if (rs[i].active === true)
                        row.push(`   Quan h??? c?? ${rs[i].name}`);
                    else
                        row.push(`   Quan h??? kh??ng c?? ${rs[i].name}`);
                    detail.push(row);
                }
                let l = new GiaiBaiQuanHeThuTu_1.XacDinhBaiQuanHeThuTu(R).xacDinh();
                detail.push(['<b><i>=>V???y quan h??? l?? quan h??? th??? t???</i></b>']);
                res.send({ rs: true, type: 3, msg: detail, exp: l });
            }
            catch (error) {
                console.log(error);
                detail.push(['<i><b>' + error + '</b></i>']);
                res.send({ rs: false, type: 3, msg: detail });
            }
        }
        else
            res.send({ rs: false, type: 3, msg: 'Xin l???i!????? b??i b??? l???i ho???c ch??a ???????c h??? tr???' });
    }
}
exports.Controller = Controller;
