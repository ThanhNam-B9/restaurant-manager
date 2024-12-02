import dishesApiRequest from "@/apiRequest/dishes";
import DishDetail from "@/app/(public)/dishes/[slug]/dishe-detail";
import { wrapServerApi } from "@/lib/utils";
import React from "react";

async function DishesPage({
  params: { slug },
}: {
  params: {
    slug: number;
  };
}) {
  const data = await wrapServerApi(() => dishesApiRequest.getDishDetail(slug));
  const dish = data?.payload.data;
  return <DishDetail dish={dish} />;
}

export default DishesPage;
