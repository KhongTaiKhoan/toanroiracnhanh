import * as express from "express";
import {Controller} from "../Controllers/AppController";
import {urlencoded} from "body-parser"
let router = express.Router();
// const urlencodedParser = urlencoded({ extended: false });
const controller = new Controller();
///// TRANG CHU
router.get('/',controller.index);
router.get('/suy-dien',controller.getSuyDien);
router.get('/bang-chan-tri',controller.getBangChanTri);
router.post('/nop-bai',controller.notBai);
router.post('/suy-dien',controller.postSuyDien);
router.post('/bang-chan-tri',controller.postBangChanTri);

export = router;