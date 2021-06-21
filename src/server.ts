import {App} from "./core/App";
import * as config from "dotenv";
import { ToiUuHoa } from './BieuDienTriThuc/DaiSoBoolean/ToiThieuHoaKarNaugh';
import { BaiTap } from "./BieuDienTriThuc/BaiTap/BaiTap";


// config.config();
// let port:Number  = Number( process.env.PORT) || 4300;


// let app = new App(port);
// app.run();

let baiTap:BaiTap = new  ToiUuHoa();
baiTap.giai();