"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiTap = void 0;
const TapLuatTuongDuong_1 = require("../ChuongLogic/ThanhPhanRules/TapLuatTuongDuong");
class BaiTap {
    constructor() {
        this.tapLuat = new TapLuatTuongDuong_1.TapLuat();
    }
}
exports.BaiTap = BaiTap;
