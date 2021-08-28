"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const express = __importStar(require("express"));
const AppController_1 = require("../Controllers/AppController");
let router = express.Router();
// const urlencodedParser = urlencoded({ extended: false });
const controller = new AppController_1.Controller();
///// TRANG CHU
router.get('/', controller.index);
router.get('/suy-dien', controller.getSuyDien);
router.get('/bang-chan-tri', controller.getBangChanTri);
router.get('/rut-gon-ham-boolean', controller.getHamBoolean);
router.post('/nop-bai', controller.notBai);
router.post('/suy-dien', controller.postSuyDien);
router.post('/bang-chan-tri', controller.postBangChanTri);
router.post('/rut-gon-ham-boolean', controller.postHamBoolean);
router.post('/tinh-chat-quan-he-2-ngoi', controller.tinhChatQuanHe2Ngoi);
router.post('/quan-he-tuong-duong', controller.quanHeTuongDuong);
router.post('/quan-he-thu-tu', controller.quanHeThuTu);
router.get('/qh2ngoi/:id', controller.getQuanHe2Ngoi);
module.exports = router;
