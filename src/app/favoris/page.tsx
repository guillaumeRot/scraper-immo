import { Suspense } from "react";
import FavorisClient from "../../components/FavorisClient";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <FavorisClient />
    </Suspense>
  );
}
