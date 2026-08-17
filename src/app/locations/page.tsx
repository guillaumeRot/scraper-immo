import { Suspense } from "react";
import LocationsClient from "../../components/LocationsClient";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <LocationsClient />
    </Suspense>
  );
}
