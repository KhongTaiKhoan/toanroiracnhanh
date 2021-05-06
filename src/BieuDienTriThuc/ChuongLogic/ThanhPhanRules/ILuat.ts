import {BieuThucMenhDe} from "../ThanhPhanC/BieuThucMenhDe";
import { LuatMessage } from './LuatMessage';
export interface ILuat{
    boKiemTra(P:BieuThucMenhDe):LuatMessage|null;
    ketQua(P:BieuThucMenhDe, con?:LuatMessage):BieuThucMenhDe;
}