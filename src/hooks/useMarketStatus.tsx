import { useEffect, useState } from "react";
import { useStateContext } from "@/store/StateContext";
import refeshConfig from "@/utils/refreshConfig.json";
import { getCurrentMarketStatus } from "@/utils/utility";

export const useMarketStatus = () => {
  const { dispatch } = useStateContext();
  const [mktStatus, setMktStatus] = useState({
    currentMarketStatus: "",
    marketStatus: "",
  });
  const [lastMarketStatus, setLastMarketStatus] = useState({
    currentMarketStatus: "",
    marketStatus: "",
  });

  useEffect(() => {
    let isCancelled = true;
    let timeoutId: number;

    const getMarketStatus = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }
      try {
        const result = await getCurrentMarketStatus();
        if (isCancelled && !!result) {
          if (
            result.currentMarketStatus !== undefined &&
            result.marketStatus !== undefined
          ) {
            setMktStatus({
              currentMarketStatus: result.currentMarketStatus,
              marketStatus: result.marketStatus,
            });
          }
          if (result?.marketStatus === "ON") {
            timeoutId = window.setTimeout(
              getMarketStatus,
              refeshConfig.marketStatus,
            );
          }
        }
      } catch (error) {
        console.warn("Error fetching market status:", error);
        // Handle error as needed, e.g., set an error state or retry mechanism
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getMarketStatus();
      } else {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial call
    if (document.visibilityState === "visible") {
      getMarketStatus();
    }

    return () => {
      isCancelled = false;
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (
      mktStatus.currentMarketStatus !== "" &&
      mktStatus.marketStatus !== "" &&
      (mktStatus.currentMarketStatus !== lastMarketStatus.currentMarketStatus ||
        mktStatus.marketStatus !== lastMarketStatus.marketStatus)
    ) {
      dispatch({
        type: "MARKET_STATUS",
        payload: {
          currentMarketStatus: mktStatus.currentMarketStatus.toUpperCase(),
          marketStatus: mktStatus.marketStatus.toUpperCase(),
        },
      });
      setLastMarketStatus({
        currentMarketStatus: mktStatus.currentMarketStatus,
        marketStatus: mktStatus.marketStatus,
      });
    }
  }, [mktStatus, lastMarketStatus]);
};
