import http from "@/lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const TABLEPATH = "/tables";
const tableApiRequest = {
  getTableList: () => http.get<TableListResType>(TABLEPATH),
  getTableDetail: (number: number) =>
    http.get<TableResType>(`${TABLEPATH}/${number}`),
  createTable: (body: CreateTableBodyType) =>
    http.post<TableResType>(TABLEPATH, body),
  updateTable: ({
    number,
    body,
  }: {
    number: number;
    body: UpdateTableBodyType;
  }) => http.put<TableResType>(`${TABLEPATH}/${number}`, body),
  deleteTable: (number: number) =>
    http.delete<TableResType>(`${TABLEPATH}/${number}`),
};
export default tableApiRequest;
