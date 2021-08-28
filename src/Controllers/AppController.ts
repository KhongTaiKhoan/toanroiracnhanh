import * as express from 'express';
import { ToanTu } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuLogic';
import { ChuyenStringThanhBieuThuc } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/ChuyenStringThanhBieuThuc';
import { MenhDeTuongDuong, LoiGiaiMenhDeTuongDuong } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { BieuThucMenhDe } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanC/BieuThucMenhDe';
import { Helper } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanFuncs/Helper';
import { SuyDien, LoiGiaiSuyDien } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/SuyLuanLogic';
import { ToanTuFactory } from '../BieuDienTriThuc/ChuongLogic/ThanhPhanOpts/ToanTuFactory';
import { BangChanTri } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/BangChanTri';
import { BaiTap } from '../BieuDienTriThuc/BaiTap/BaiTap';
import { ToiUuHoa } from '../BieuDienTriThuc/DaiSoBoolean/ToiThieuHoaKarNaugh';
import { KetQuaRutGonHamBoolean } from '../BieuDienTriThuc/DaiSoBoolean/BoQuanLyBiaKarNaugh';
import { TapHop, TapHopBuilder } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/TapHop';
import { QuanHeDaiSo, QuanHeDaiSoFactory } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHeDaiSo';
import { QuanHe, QuanHeFactory } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanC/QuanHe';
import { KhonGianSoNguyen } from '../BieuDienTriThuc/BieuThucDaiSoZ/ThanhPhanC/BieuThucDaiSo';
import { HauTo } from '../BieuDienTriThuc/BieuThucDaiSoZ/ThanhPhanFuncs/HauTo';
import { TinhChatQuanHe } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanRules/TinhChatQuanHe';
import { LopTuongDuong, XacDinhLopTuongDuong } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/LopTuongDuong';
import { XacDinhBaiQuanHeThuTu, ChiTietTinhChatQuanHeThuTu } from '../BieuDienTriThuc/QuanHeHaiNgoi/ThanhPhanFuncs/GiaiBaiQuanHeThuTu';
import { Reasoning, Deduction } from '../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Deduction';
import { ExpressionToString } from '../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/ExpressionToString';
import { Simplify } from '../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Simplify';
import { Equivalence } from '../BieuDienTriThuc/LogicMenhDe/ThanhPhanFuncs/Equivalence';

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
        deBai= deBai.replace(new RegExp('TRUE','g'),'1');
        deBai= deBai.replace(new RegExp('FALSE','g'),'0');
        // let bai:MenhDeTuongDuong = new MenhDeTuongDuong();
        // let lg:LoiGiaiMenhDeTuongDuong[]|null=  bai.giai(deBai);
        let trans = new Equivalence().giai(deBai);  
        if (trans === null) {
            res.send(
                {
                    complete: false
                });
        } else {
            let split:string[] = deBai.split('\u2261');
            let VT = split[0];
            let VP = split[1];
            let loiGiai:{exp:string,rule:string}[] =[] ;
            trans.forEach(e=>{
                let str = {exp:`${ExpressionToString(e.Exp())}` , rule:`(${e.rule.name})`};
                // console.log(str);
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
        let deBai:string[] = req.body['deBai[]'];
        // let giaThiet:BieuThucMenhDe= new BieuThucMenhDe();
        // let ketLuan:BieuThucMenhDe = new BieuThucMenhDe();

        // ketLuan = ChuyenStringThanhBieuThuc.chuyenDoi(deBai[deBai.length-1]);
        // deBai.pop();
        // for(let i=0;i<deBai.length;i++){
        //     giaThiet.bieuThucCons.push(ChuyenStringThanhBieuThuc.chuyenDoi(deBai[i]));
        // }
        // giaThiet.toanTu = new ToanTuFactory().create(ToanTu.HOI);
        // bai.xayDungDeBai(giaThiet,ketLuan);

        let KL = deBai[deBai.length-1];
        let GT = deBai.slice(0,deBai.length-1);
        // console.log(GT);
    //    let loiGiai:LoiGiaiSuyDien[]|null = bai.giai();
       let reasoning = new Deduction(GT,KL).giai();
       if(reasoning.length === 0){
           res.send({msg:false});
       } 
       else{
           let chiTiet: string[][] = [];
        //    loiGiai.forEach(e => {
        //        let left = `${e.index}. ${Helper.IN(e.bieuThucKetQua)}`;
        //        let right = '';
        //        if (e.target[0] === -1) right = '(GIẢ THIẾT)';
        //        else {
        //            right = `Áp dụng ${e.luat} cho `;
        //            for (let i = 0; i < e.target.length; i++) {
        //                right += `(${e.target[i]}), `
        //            }
        //            right = right.substr(0, right.length - 2);
        //        }
        //        chiTiet.push([left, right]);
        //    })

           reasoning.forEach(e => {
               let str:string[]=[];
               str[0] = `${e.id}. ${ExpressionToString(e.exp)} `;
               if (e.parent.length !== 0)
                   str[1]= `( ${e.rule.name} ${e.parent})`;
               else str[1]= '(GIA THIET)';
               console.log(GT);
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

    //#region  HAM BOOLEAN
    public getHamBoolean(req:express.Request,res:express.Response){
        let toanTus:string[] =[];
        ToanTu.kyHieus.forEach(e=>{toanTus.push(e)});
        toanTus.push('(')
        toanTus.push(')')
        toanTus.push('\u2261')
        toanTus.push('TRUE')
        toanTus.push('FALSE')

        res.render('RutGonHamBoolean.ejs',{toanTus:toanTus});
    }
    public postHamBoolean(req:express.Request,res:express.Response){
        let baiTap:BaiTap = new ToiUuHoa();
    
        let ketQuaRutGonHamBoolean:KetQuaRutGonHamBoolean|null = baiTap.giai(req.body.deBai);
        if(ketQuaRutGonHamBoolean===null)
          res.send({mes:false});
          
        else {
            let bienCoSo:string[] = [];
            ketQuaRutGonHamBoolean.bienCoSo.forEach(e=>{bienCoSo.push(Helper.IN(e)); });

            let bieuThucLonChuyenDoi:string[]=[];
            ketQuaRutGonHamBoolean.bieuThucLonChuyenDoi.forEach(e=>{
                bieuThucLonChuyenDoi.push(Helper.IN(e))});

            let bieuThucChuyenDoi:string[]=[];
            ketQuaRutGonHamBoolean.bieuThucChuyenDoi.forEach( e=>{ bieuThucChuyenDoi.push(Helper.IN(e))});
            res.send({
                mes: true,
                deBai: Helper.IN(ketQuaRutGonHamBoolean.deBai),
                bienCoSo:bienCoSo,
                maTran:ketQuaRutGonHamBoolean.maTran,
                teBaoLon:ketQuaRutGonHamBoolean.teBaoLon ,
                bieuThucLonChuyenDoi:bieuThucLonChuyenDoi,
                bieuThucChuyenDoi:bieuThucChuyenDoi,
                mangDanhDau:ketQuaRutGonHamBoolean.mangDanhDau


            });
        }
    }
    //#endregion

    //#region  QUAN HE 2 NGOI
    getQuanHe2Ngoi(req: express.Request, res: express.Response) {
        let rs = req.params.id;
        let link = '';
        if (rs === '1') {
            link = '/tinh-chat-quan-he-2-ngoi';
        } else if (rs === '2') {
            link = '/quan-he-tuong-duong';
        }
        else {
            link = '/quan-he-thu-tu';
        }
        res.render('QuanHe2Ngoi.ejs',{link:link});
    }
    tinhChatQuanHe2Ngoi(req:express.Request,res:express.Response){
        // console.log(req.body);
        let A:TapHop = new TapHop();
        if(req.body.typeA == '1'){
            let array:number[] = [];
            let str:string[] = req.body.dataA.split(',');
            str.forEach(e=>{array.push(parseInt(e))});
            A = new TapHopBuilder().addArray(array).build();
        }else{
            A = new TapHopBuilder().addCondition(new QuanHeDaiSoFactory().create_Z()).build();
        }

        let R:QuanHe|null=null;
        if(req.body.typeR === '1'){
            let array:number[][] = [];
            let str:string[] = req.body.dataR.split(',');
            for (let i = 0; i < str.length/2; i++) {
                let s:string[] = [];
                s[0] = str[i*2].substring(1);
                s[1] = str[i*2+1].substring(0,str[i*2+1].length-1);
                // console.log(s[0] +','+s[1] );
                let row:number[]=[];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHeFactory().createQuanHeLietKe(A,array);
        }else{
            let str:string[]= req.body.dataR.split('@');
            let left:KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[0]));
            let qh:QuanHeDaiSo = new QuanHeDaiSoFactory().create_Z();

            if(str[1] === '8')
               qh = new QuanHeDaiSoFactory().create_SO_CHAN(left,[]);
            else if(str[1] === '9')
                qh = new QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right: KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);

                else if (str[1] === '3')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);

                else if (str[1] === '5')
                    qh = new QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHeFactory().createQuanHeDieuKien(A,qh);
        }

        if(R !== null){
            try {
                let rs:TinhChatQuanHe[] =   R.cacTinhChat();
                let detail:string[][] = [];
                for (let i = 0; i < rs.length; i++) {
                   let row:string[]=[];
                   row.push(`${i+1}. Xét ${rs[i].name}:`);
                   rs[i].describe.forEach (e=>{
                      row.push(e);
                   });
                   if(rs[i].active === true)row.push(`=> Quan hệ có ${rs[i].name}`);
                   else row.push(`=> Quan hệ không có ${rs[i].name}`);
                   detail.push(row);
                }
                res.send({rs:true,type:1,msg:detail});
            } catch (error) {
                res.send({rs:false,type:1,msg:'Đề bài bị lỗi'});
            }
        }else
        res.send({rs:false,type:1,msg:'Bài toán chưa được hỗ trợ'});
    }

    quanHeTuongDuong(req: express.Request, res: express.Response) {
        let A:TapHop = new TapHop();
        if(req.body.typeA === '1'){
            let array:number[] = [];
            let str:string[] = req.body.dataA.split(',');
            str.forEach(e=>{array.push(parseInt(e))});
            A = new TapHopBuilder().addArray(array).build();
        }else{
            A = new TapHopBuilder().addCondition(new QuanHeDaiSoFactory().create_Z()).build();
        }

        let R:QuanHe|null=null;
        if(req.body.typeR === '1'){
            let array:number[][] = [];
            let str:string[] = req.body.dataR.split(',');
            for (let i = 0; i < str.length/2; i++) {
                let s:string[] = [];
                s[0] = str[i*2].substring(1);
                s[1] = str[i*2+1].substring(0,str[i*2+1].length-1);
                // console.log(s[0] +','+s[1] );
                let row:number[]=[];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHeFactory().createQuanHeLietKe(A,array);
        }else{
            let str:string[]= req.body.dataR.split('@');
            let left:KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[0]));
            let qh:QuanHeDaiSo = new QuanHeDaiSoFactory().create_Z();

            if(str[1] === '8')
               qh = new QuanHeDaiSoFactory().create_SO_CHAN(left,[]);
            else if(str[1] === '9')
                qh = new QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right: KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);

                else if (str[1] === '3')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);

                else if (str[1] === '5')
                    qh = new QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHeFactory().createQuanHeDieuKien(A,qh);
        }
        let detail:string[][] = [];
        if(R!==null){
            try {
                let rs:TinhChatQuanHe[] =   R.cacTinhChat();
                
                for (let i = 0; i < rs.length; i++) {
                   let row:string[]=[];
                   row.push(`${i+1}. Xét ${rs[i].name}:`);
                   rs[i].describe.forEach (e=>{
                      row.push(e);
                   });
                   if(rs[i].active === true)row.push(`   Quan hệ có ${rs[i].name}`);
                   else row.push(`   Quan hệ không có ${rs[i].name}`);
                   detail.push(row);
                }
                let lopTD:LopTuongDuong[]=new XacDinhLopTuongDuong(R).layLopTuongDuong(); 
                detail.push(['<b><i>=>Vậy quan hệ là quan hệ tương đương</i></b>']);
                let row:string[]=[];
                row.push('Như tập A được phân hoạch thành các lớp tương đương như sau:');
                lopTD.forEach(e=>{
                    row.push(e.toString());
                });
                detail.push(row);
                res.send({rs:true,type:2,msg:detail});
            } catch (error) {
                detail.push(['<i><b>'+error+'</b></i>']);
                res.send({rs:false,type:2,msg:detail});
            }
           
        } else res.send({rs:false,type:2,msg:'Xin lỗi!Đề bài bị lỗi hoặc chưa được hỗ trợ'});
    }

    quanHeThuTu(req: express.Request, res: express.Response) {
        let A:TapHop = new TapHop();
        if(req.body.typeA === '1'){
            let array:number[] = [];
            let str:string[] = req.body.dataA.split(',');
            str.forEach(e=>{array.push(parseInt(e))});
            A = new TapHopBuilder().addArray(array).build();
        }else{
            A = new TapHopBuilder().addCondition(new QuanHeDaiSoFactory().create_Z()).build();
        }

        let R:QuanHe|null=null;
        if(req.body.typeR === '1'){
            let array:number[][] = [];
            let str:string[] = req.body.dataR.split(',');
            for (let i = 0; i < str.length/2; i++) {
                let s:string[] = [];
                s[0] = str[i*2].substring(1);
                s[1] = str[i*2+1].substring(0,str[i*2+1].length-1);
                // console.log(s[0] +','+s[1] );
                let row:number[]=[];
                row.push(parseInt(s[0]));
                row.push(parseInt(s[1]));
                array.push(row);
            }
            // console.log(array);
            R = new QuanHeFactory().createQuanHeLietKe(A,array);
        }else{
            let str:string[]= req.body.dataR.split('@');
            let left:KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[0]));
            let qh:QuanHeDaiSo = new QuanHeDaiSoFactory().create_Z();

            if(str[1] === '8')
               qh = new QuanHeDaiSoFactory().create_SO_CHAN(left,[]);
            else if(str[1] === '9')
                qh = new QuanHeDaiSoFactory().create_SO_LE(left, []);
            else {
                let right: KhonGianSoNguyen.BieuThuc = HauTo.BieuThucTuChuoi(HauTo.ChuoiHauTo(str[2]));
                if (str[1] === '0')
                    qh = new QuanHeDaiSoFactory().create_BANG(left, right, []);
                else if (str[1] === '1')
                    qh = new QuanHeDaiSoFactory().create_LON_HON(left, right, []);
                else if (str[1] === '2')
                    qh = new QuanHeDaiSoFactory().create_LON_HON_BANG(left, right, []);

                else if (str[1] === '3')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON(left, right, []);
                else if (str[1] === '4')
                    qh = new QuanHeDaiSoFactory().create_NHO_HON_BANG(left, right, []);

                else if (str[1] === '5')
                    qh = new QuanHeDaiSoFactory().create_CHIA_HET(left, right, []);
                else if (str[1] === '6')
                    qh = new QuanHeDaiSoFactory().create_UOC_SO(left, right, []);
                else if (str[1] === '7')
                    qh = new QuanHeDaiSoFactory().create_BOI_SO(left, right, []);
            }
            R = new QuanHeFactory().createQuanHeDieuKien(A,qh);
        }
        let detail:string[][] = [];
        if(R!==null){
            try {
                let rs:TinhChatQuanHe[] =   R.cacTinhChat();
                
                for (let i = 0; i < rs.length; i++) {
                   let row:string[]=[];
                   row.push(`${i+1}. Xét ${rs[i].name}:`);
                   rs[i].describe.forEach (e=>{
                      row.push(e);
                   });
                   if(rs[i].active === true)row.push(`   Quan hệ có ${rs[i].name}`);
                   else row.push(`   Quan hệ không có ${rs[i].name}`);
                   detail.push(row);
                }
                let l:ChiTietTinhChatQuanHeThuTu=new XacDinhBaiQuanHeThuTu(R).xacDinh(); 
                detail.push(['<b><i>=>Vậy quan hệ là quan hệ thứ tự</i></b>']);
                  
                res.send({rs:true,type:3,msg:detail,exp:l});
            } catch (error) {
                console.log(error);
                detail.push(['<i><b>'+error+'</b></i>']);
                res.send({rs:false,type:3,msg:detail});
            }
           
        } else res.send({rs:false,type:3,msg:'Xin lỗi!Đề bài bị lỗi hoặc chưa được hỗ trợ'});
    }
    //#endregion
}