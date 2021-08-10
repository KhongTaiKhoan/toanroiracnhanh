"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhanLoaiQuanHe = void 0;
class PhanLoaiQuanHe {
    static phanLoai(loai, R) {
        let tc = R.cacTinhChat();
        let k = -1;
        if (tc[0].active && tc[1].active && tc[3].active) {
            k = this.TUONG_DUONG;
        }
        else if (tc[0].active && tc[2].active && tc[3].active) {
            k = this.THU_TU;
        }
        else
            k = this.NONE;
        return k === loai;
    }
}
exports.PhanLoaiQuanHe = PhanLoaiQuanHe;
PhanLoaiQuanHe.TUONG_DUONG = 0;
PhanLoaiQuanHe.THU_TU = 1;
PhanLoaiQuanHe.NONE = -1;
