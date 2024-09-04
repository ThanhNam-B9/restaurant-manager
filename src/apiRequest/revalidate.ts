import http from "@/lib/http";

const revalidateApiRequest = (tags: string) =>
  http.get(`/api/revalidate?tag=${tags}`, {
    baseUrl: "",
  });
export default revalidateApiRequest;
