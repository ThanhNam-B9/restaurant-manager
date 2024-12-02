import http from "@/lib/http";

const oauthApiRequest = {
  login: (body: { accessToken: string; refreshToken: string }) =>
    http.post<{ accessToken: string; refreshToken: string }>(
      "/api/auth/token",
      body,
      {
        baseUrl: "",
      }
    ),
};

export default oauthApiRequest;
