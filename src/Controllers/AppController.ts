import * as express from 'express';
import { ToanTu } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic';
import { ChuyenStringThanhBieuThuc } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { BaiTap } from '../BieuDienTriThuc/BaiTap/BaiTap';
import { MenhDeTuongDuong } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { BieuThucMenhDe } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanC/BieuThucMenhDe';
import { RutGonBieuThuc } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/RutGonBieuThuc';

export  class Controller{
    public index(req:express.Request,res:express.Response){
        let toanTus:string[] =[];
        ToanTu.kyHieus.forEach(e=>{toanTus.push(e)});
        toanTus.push('(')
        toanTus.push(')')
        toanTus.push('\u2261')
        toanTus.push('TRUE')
        toanTus.push('FALSE')

        res.render('index.ejs',{toanTus:toanTus});
    }

    public notBai(req:express.Request,res:express.Response){
        let deBai:string  =   req.body.noidung;

        console.log(deBai);

        deBai= deBai.replace(new RegExp('TRUE','g'),'1');
        deBai= deBai.replace(new RegExp('FALSE','g'),'0');
        let baiTap:BaiTap = new MenhDeTuongDuong(deBai);

        // let db:BieuThucMenhDe = ChuyenStringThanhBieuThuc.chuyenDoi(deBai);
        // let rg:RutGonBieuThuc = new RutGonBieuThuc(db);
        // console.log(rg.giai());   

        let lg= baiTap.giai(); 
        let loiGiai = lg.kq;
        let VT = lg.VT;
        let VP = lg.VP;
        // console.log(loiGiai);
        
        if(loiGiai === null || loiGiai === []){
            res.send(
                {
                    complete:false
                });
        }
            res.send({
                complete:true,
                loiGiai:loiGiai,
                VT:VT,
                VP:VP
            });
    }
}