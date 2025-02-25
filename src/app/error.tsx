"use client"; // Error components must be Client Components

import Blocker from "@/components/Blocker";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      {/* <h2>Something went wrong!</h2> */}
      <Blocker type="notFound" />
    </div>
  );
}
