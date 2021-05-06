import express from "express"
import { BaiTap } from '../BieuDienTriThuc/BaiTap/BaiTap';
import { MenhDeTuongDuong } from '../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong';
import { BieuThucMenhDe } from "../BieuDienTriThuc/ChuongLogic/ThanhPhanC/BieuThucMenhDe";
import {urlencoded} from "body-parser"

import path from "path";
import router from "../routers/Routing";


class App {
    private app: express.Application;
    private port: Number;
    private bai: BaiTap;
    constructor(port: Number) {
        this.app = express();
        this.port = port;
        this.bai = new MenhDeTuongDuong('');

    }
 
    async run() {
        /// SETTING
        await this.setting();

        /// Routing
        await this.routing();


        await this.app.listen(this.port);
        console.log(`SERVER DANG CHAY O PORT ${this.port}`);
    }

    async setting(){
        /// SETTING BODY PARSER
        const urlencodedParser = urlencoded({ extended: false });
        this.app.use(urlencodedParser);


        /// SETTING VIEW ENGINE
        this.app.set ('views',path.join(__dirname,'../../views'));
        this.app.set('view engine','ejs');

        ///SETTING STATIC FOLDER
        this.app.use(express.static(path.join(__dirname,'../../public')));
    }
    async routing(){
        this.app.use(router);
    }

    async chay(){
       
    }
}

export { App };