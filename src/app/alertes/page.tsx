import { Suspense } from "react";
import AlertesClient from "../../components/AlertesClient";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <AlertesClient />
    </Suspense>
  );
}
