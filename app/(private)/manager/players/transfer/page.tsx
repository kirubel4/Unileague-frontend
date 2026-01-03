import { Suspense } from "react";
import TransferClient from "./transferPage";

export default function TransferPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransferClient />
    </Suspense>
  );
}
