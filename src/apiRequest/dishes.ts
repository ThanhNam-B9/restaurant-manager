import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const DISHESTPATH = "/dishes";
const dishesApiRequest = {
  getDishList: () =>
    http.get<DishListResType>(DISHESTPATH, {
      next: { tags: ["dishes"] },
      //Note: Next.js 15 thì mặc định fecth sẽ là {cache: 'no-store} (dynamic rendering)
      // còn next.js 14 thì mặc đinh fecth sẽ là {cache: 'force-cache'} nghĩa là cache (static rendering )
      //  cache: "no-store", //(Dynamic )
    }),
  getDishDetail: (id: number) => http.get<DishResType>(`${DISHESTPATH}/${id}`),
  createDish: (body: CreateDishBodyType) =>
    http.post<DishResType>(DISHESTPATH, body),
  updateDish: ({ id, body }: { id: number; body: UpdateDishBodyType }) =>
    http.put<DishResType>(`${DISHESTPATH}/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`${DISHESTPATH}/${id}`),
};
export default dishesApiRequest;
