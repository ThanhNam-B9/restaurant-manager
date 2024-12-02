import dishesApiRequest from "@/apiRequest/dishes";
import Modal from "@/app/(public)/@modal/(.)dishes/[slug]/modal-dishes";
import DishDetail from "@/app/(public)/dishes/[slug]/dishe-detail";
import { wrapServerApi } from "@/lib/utils";

async function DishesRoutePage({
  params: { slug },
}: {
  params: {
    slug: number;
  };
}) {
  const data = await wrapServerApi(() => dishesApiRequest.getDishDetail(slug));
  const dish = data?.payload.data;
  return (
    <div>
      <Modal>
        <DishDetail dish={dish} />
      </Modal>
    </div>
  );
}

export default DishesRoutePage;
