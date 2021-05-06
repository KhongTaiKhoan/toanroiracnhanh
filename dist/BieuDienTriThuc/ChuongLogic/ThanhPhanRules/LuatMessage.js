"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuatMessage = void 0;
const BieuThucMenhDe_1 = require("../ThanhPhanC/BieuThucMenhDe");
class LuatMessage {
    constructor(bt, msg1, msg2) {
        this.bieuThuc = new BieuThucMenhDe_1.BieuThucMenhDe();
        this.bieuThuc = bt;
        if (msg1 !== undefined)
            this.msg1 = msg1;
        if (msg1 !== undefined)
            this.msg2 = msg2;
    }
}
exports.LuatMessage = LuatMessage;
