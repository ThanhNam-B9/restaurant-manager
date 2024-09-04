import CartOrders from "@/app/guest/orders/cart-orders";

export default function MenuPage() {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">Đơn hàng</h1>
      <CartOrders />
    </div>
  );
}
