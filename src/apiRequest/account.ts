import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { UploadImageResType } from "@/schemaValidations/media.schema";
const ACCOUNTPATH = "/accounts";
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${ACCOUNTPATH}/me`),
  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${ACCOUNTPATH}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  uploadAvatar: (body: FormData) =>
    http.post<UploadImageResType>(`${ACCOUNTPATH}/media/upload`, body),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/change-password`, body),
  listEmployees: () => http.get<AccountListResType>(ACCOUNTPATH),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(ACCOUNTPATH, body),
  getEmployee: (id: string) =>
    http.get<AccountResType>(`${ACCOUNTPATH}/detail/${id}`),
  updateEmployee: (body: UpdateEmployeeAccountBodyType, id: string) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/detail/${id}`, body),
  deteleEmployee: (id: string) =>
    http.delete<AccountResType>(`${ACCOUNTPATH}/detail/${id}`),
};
export default accountApiRequest;
