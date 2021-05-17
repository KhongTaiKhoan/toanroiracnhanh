import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { LuatMessage } from "./LuatMessage";

export interface KetQua{
    ketQua(P:BieuThucMenhDe, con?:LuatMessage):BieuThucMenhDe;
}