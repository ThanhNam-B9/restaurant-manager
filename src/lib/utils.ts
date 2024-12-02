import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/components/ui/use-toast";
import { decode } from "jsonwebtoken";
import authApiRequest from "@/apiRequest/auth";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import evnClientConfig from "@/config";
import { TokenPayload } from "@/app/types/jwt.types";
import guestApiRequest from "@/apiRequest/guest";
import { io } from "socket.io-client";
import slugify from "slugify";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";

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
export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
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
  const { exp: expAccesToken, iat: iatAccessToken } = decodeToken(accessToken);
  const { exp: expRefreshToken, role } = decodeToken(refreshToken);
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
      const res =
        role === Role.Guest
          ? await guestApiRequest.refreshToken()
          : await authApiRequest.refreshToken();
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      params?.onSuccess && params.onSuccess();
    } catch (error) {
      params?.onError && params.onError();
    }
  }
};
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};
export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};
export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    default:
      return "Đã từ chối";
  }
};
export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    evnClientConfig.NEXT_PUBLIC_URL +
    "/tables/" +
    tableNumber +
    "?token=" +
    token
  );
};
export const decodeToken = (token: string) => {
  return decode(token) as TokenPayload;
};
export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const getConnectSocketInstan = (accessToken: string) => {
  return io(evnClientConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null;
  try {
    result = await fn();
  } catch (error: any) {
    // try catch mà có redirect thì sẽ bị lỗi NEXT_REDIRECT do try catch vẫn cho page đó chạy return
    // nên 1 phải dòng này để nó throww hay là không dùng try cacth
    if (error.digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return result;
};
export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`;
};
