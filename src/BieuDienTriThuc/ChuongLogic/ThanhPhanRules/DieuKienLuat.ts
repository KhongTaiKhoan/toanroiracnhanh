import { BieuThucMenhDe } from "../ThanhPhanC/BieuThucMenhDe";
import { LuatMessage } from "./LuatMessage";

export interface DieuKien{
    boKiemTra(P:BieuThucMenhDe):LuatMessage|null;
}