import * as express from 'express';
import { ToanTu } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic';
import { ChuyenStringThanhBieuThuc } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { MenhDeTuongDuong, LoiGiaiMenhDeTuongDuong } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { BieuThucMenhDe } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanC/BieuThucMenhDe';
import { Helper } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/Helper';
import { SuyDien, LoiGiaiSuyDien } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/SuyLuanLogic';
import { ToanTuFactory } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuFactory';
import { BangChanTri } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/BangChanTri';

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
        let bai:MenhDeTuongDuong = new MenhDeTuongDuong();
        let lg:LoiGiaiMenhDeTuongDuong[]|null=  bai.giai(deBai);



        if (lg === null || lg === []) {

            res.send(
                {
                    complete: false
                });
        } else {
            let VT = Helper.IN(bai.vt_clone);
            let VP = Helper.IN(bai.vp_clone);
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
    public getSuyDien(req:express.Request,res:express.Response){
        let toanTus:string[] =[];
        ToanTu.kyHieus.forEach(e=>{toanTus.push(e)});
        toanTus.push('(')
        toanTus.push(')')
        toanTus.push('\u2261')
        toanTus.push('TRUE')
        toanTus.push('FALSE')

        res.render('SuyDienMenhDe.ejs',{toanTus:toanTus});
    }

    public postSuyDien(req:express.Request,res:express.Response){
        let bai:SuyDien.SuyDienLoGic = new SuyDien.SuyDienLoGic();

        let deBai:string[] = req.body['deBai[]'];
        let giaThiet:BieuThucMenhDe= new BieuThucMenhDe();
        let ketLuan:BieuThucMenhDe = new BieuThucMenhDe();

        ketLuan = ChuyenStringThanhBieuThuc.chuyenDoi(deBai[deBai.length-1]);
        deBai.pop();
        for(let i=0;i<deBai.length;i++){
            giaThiet.bieuThucCons.push(ChuyenStringThanhBieuThuc.chuyenDoi(deBai[i]));
        }
        giaThiet.toanTu = new ToanTuFactory().create(ToanTu.HOI);
        bai.xayDungDeBai(giaThiet,ketLuan);

       let loiGiai:LoiGiaiSuyDien[]|null = bai.giai();
       if(loiGiai === null){
           res.send({msg:false});
       } 
       else{
           let chiTiet: string[][] = [];
           loiGiai.forEach(e => {
               let left = `${e.index}. ${Helper.IN(e.bieuThucKetQua)}`;
               let right = '';
               if (e.target[0] === -1) right = '(GIẢ THIẾT)';
               else {
                   right = `Áp dụng ${e.luat} cho `;
                   for (let i = 0; i < e.target.length; i++) {
                       right += `(${e.target[i]}), `
                   }
                   right = right.substr(0, right.length - 2);
               }
               chiTiet.push([left, right]);

               
           })
        //    console.log(chiTiet);
           res.send({
            msg:true,
            data:chiTiet
         });
       }

    }
    //#endregion

    //#region  BANG CHAN TRI
    getBangChanTri(req:express.Request,res:express.Response){
        let toanTus:string[] =[];
        ToanTu.kyHieus.forEach(e=>{toanTus.push(e)});
        toanTus.push('(')
        toanTus.push(')')
        toanTus.push('\u2261')
        toanTus.push('TRUE')
        toanTus.push('FALSE')

        res.render('BangChanTri.ejs',{toanTus:toanTus});
    }
    postBangChanTri(req:express.Request,res:express.Response){
        let bai:BangChanTri = new BangChanTri();
        bai.bieuThuc = ChuyenStringThanhBieuThuc.chuyenDoi(req.body.deBai);

        let loiGiai  = bai.giai();
        if(loiGiai === null){
             res.send({msg:false});
            }
            else {
                res.send({msg:true,loiGiai:loiGiai});
                
        }
    }

    //#endregion
}