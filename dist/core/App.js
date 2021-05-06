"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const MenhDeTuongDuong_1 = require("../BieuDienTriThuc/BaiTap/BaiTap_Logic/MenhDeTuongDuong");
const body_parser_1 = require("body-parser");
const path_1 = __importDefault(require("path"));
const Routing_1 = __importDefault(require("../routers/Routing"));
class App {
    constructor(port) {
        this.app = express_1.default();
        this.port = port;
        this.bai = new MenhDeTuongDuong_1.MenhDeTuongDuong('');
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            /// SETTING
            yield this.setting();
            /// Routing
            yield this.routing();
            yield this.app.listen(this.port);
            console.log(`SERVER DANG CHAY O PORT ${this.port}`);
        });
    }
    setting() {
        return __awaiter(this, void 0, void 0, function* () {
            /// SETTING BODY PARSER
            const urlencodedParser = body_parser_1.urlencoded({ extended: false });
            this.app.use(urlencodedParser);
            /// SETTING VIEW ENGINE
            this.app.set('views', path_1.default.join(__dirname, '../../views'));
            this.app.set('view engine', 'ejs');
            ///SETTING STATIC FOLDER
            this.app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
        });
    }
    routing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(Routing_1.default);
        });
    }
    chay() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.App = App;
