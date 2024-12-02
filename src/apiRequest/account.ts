import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { UploadImageResType } from "@/schemaValidations/media.schema";
import queryString from "query-string";
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
    http.post<UploadImageResType>("/media/upload", body),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/change-password`, body),
  listEmployees: () => http.get<AccountListResType>(ACCOUNTPATH),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(ACCOUNTPATH, body),
  getEmployee: ({ id }: { id: number }) =>
    http.get<AccountResType>(`${ACCOUNTPATH}/detail/${id}`),
  updateEmployee: (body: UpdateEmployeeAccountBodyType, id: number) =>
    http.put<AccountResType>(`${ACCOUNTPATH}/detail/${id}`, body),
  deteleEmployee: (id: number) =>
    http.delete<AccountResType>(`${ACCOUNTPATH}/detail/${id}`),
  getListGuest: (queryParams: GetGuestListQueryParamsType) =>
    http.get<GetListGuestsResType>(
      `${ACCOUNTPATH}/guests?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    ),
  createGuest: (body: CreateGuestBodyType) =>
    http.post<CreateGuestResType>(`${ACCOUNTPATH}/guests?`, body),
};
export default accountApiRequest;
