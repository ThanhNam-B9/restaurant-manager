import dishesApiRequest from "@/apiRequest/dishes";
import envClientConfig, { locales } from "@/config";
import { generateSlugUrl } from "@/lib/utils";
import type { MetadataRoute } from "next";
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];
export default async function sitemap() {
  const res = await dishesApiRequest.getDishList();
  const dishes = res.payload.data ?? [];
  const localStaticSiteMap = locales.reduce((acc, locale) => {
    const staticSiteMap: MetadataRoute.Sitemap = staticRoutes.map((route) => {
      return {
        ...route,
        url: `${envClientConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
        lastModified: new Date(),
      };
    });
    return [...acc, ...staticSiteMap];
  }, [] as MetadataRoute.Sitemap);

  const localDishSiteMap = locales.reduce((acc, locale) => {
    const dishSiteMap: MetadataRoute.Sitemap = dishes.map((dishe) => {
      return {
        ...dishe,
        url: `${
          envClientConfig.NEXT_PUBLIC_URL
        }/${locale}/dishes/${generateSlugUrl({
          id: dishe.id,
          name: dishe.name,
        })}`,
        lastModified: dishe.createdAt,
        changeFrequency: "weekly",
        priority: 0.9,
      };
    });
    return [...acc, ...dishSiteMap];
  }, [] as MetadataRoute.Sitemap);

  return [...localStaticSiteMap, ...localDishSiteMap];
}
