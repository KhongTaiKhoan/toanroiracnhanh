import * as express from "express";
import {Controller} from "../Controllers/AppController";
import {urlencoded} from "body-parser"
let router = express.Router();
// const urlencodedParser = urlencoded({ extended: false });
const controller = new Controller();
///// TRANG CHU
router.get('/',controller.index);
router.post('/nop-bai',controller.notBai);

export = router;