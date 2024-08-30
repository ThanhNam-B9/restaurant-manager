import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/components/ui/use-toast";
import { decode } from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
const isBrowser = typeof window !== "undefined";
export const removeAccessAndRefreshTokenInLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser && localStorage.setItem("accessToken", accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser && localStorage.setItem("refreshToken", refreshToken);
export const checkAndRefreshToken = async (params?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  // Không nên đưa logic access và refresh token ra khỏi cái function "checkAndRefreshToken"
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta sẽ có một acess và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  /// Chưa đăng nhập thì không cho chạy
  if (!refreshToken || !accessToken) return;
  const { exp: expAccesToken, iat: iatAccessToken } = decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const { exp: expRefreshToken } = decode(refreshToken) as {
    exp: number;
    iat: number;
  };
  // THời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = new Date().getTime() / 1000 - 1;
  // Trường hợp refresh token hết hạn thì cũng không xử lý nữa
  if (expRefreshToken <= now) {
    removeAccessAndRefreshTokenInLocalStorage();

    params?.onError && params.onError();
  }
  // Ví dụ thời gian hết hạn của access token là 10s
  // thì sẽ kiểm tra còn 1/3 thời gian (3s) thì sẽ cho refresh token lại
  // thời gian còn lại sẽ được tính theo công thức : expAccesToken - now
  // thời gian hết hạn của access token là : expAccesToken - iatAccessToken
  if (expAccesToken - now <= (expAccesToken - iatAccessToken) / 3) {
    try {
      const res = await authApiRequest.refreshToken();
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      params?.onSuccess && params.onSuccess();
    } catch (error) {
      params?.onError && params.onError();
    }
  }
};
