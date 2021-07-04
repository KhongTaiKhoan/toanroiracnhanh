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
router.get('/rut-gon-ham-boolean',controller.getHamBoolean);
router.post('/nop-bai',controller.notBai);
router.post('/suy-dien',controller.postSuyDien);
router.post('/bang-chan-tri',controller.postBangChanTri);
router.post('/rut-gon-ham-boolean',controller.postHamBoolean);

export = router;