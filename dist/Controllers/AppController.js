"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const ToanTuLogic_1 = require("../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic");
const MenhDeTuongDuong_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong");
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
        let baiTap = new MenhDeTuongDuong_1.MenhDeTuongDuong(deBai);
        // let db:BieuThucMenhDe = ChuyenStringThanhBieuThuc.chuyenDoi(deBai);
        // let rg:RutGonBieuThuc = new RutGonBieuThuc(db);
        // console.log(rg.giai());   
        let lg = baiTap.giai();
        let loiGiai = lg.kq;
        let VT = lg.VT;
        let VP = lg.VP;
        // console.log(loiGiai);
        if (loiGiai === null || loiGiai === []) {
            res.send({
                complete: false
            });
        }
        res.send({
            complete: true,
            loiGiai: loiGiai,
            VT: VT,
            VP: VP
        });
    }
}
exports.Controller = Controller;
