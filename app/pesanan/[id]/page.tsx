// app/pesanan/[id]/page.tsx

import OrderDetailsView from "@/components/OrderDetailsView";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <OrderDetailsView id={params.id} />
    </div>
  );
}