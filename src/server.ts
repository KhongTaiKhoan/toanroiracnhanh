import {App} from "./core/App";
import * as config from "dotenv";
import { BaiTap } from './BieuDienTriThuc/BaiTap/BaiTap';
import { SuyDien } from "./BieuDienTriThuc/BaiTap/BaiTap_Logic/SuyLuanLogic";
import { BangChanTri } from './BieuDienTriThuc/BaiTap/BaiTap_Logic/BangChanTri';

config.config();
let port:Number  = Number( process.env.PORT) || 4300;


let app = new App(port);
app.run();


// let baiTap:BaiTap = new  BangChanTri();
// baiTap.giai();