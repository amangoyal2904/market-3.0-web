import { APP_ENV } from "@/utils";
import APIS_CONFIG from "../../network/api_config.json";
import styles from "./Livestream.module.scss";
import LiveStreamSlider from "./LiveStreamSlider";

const fetchLiveStreamData = async () => {
  try {
    const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV];
    const conditions = [
      { fieldName: "eventStatus", value: [3, 5], operation: "in" },
      {
        fieldName: "endTime",
        value: 1695666600000,
        operation: "greaterThanEq",
      },
      { fieldName: "streamFlag", value: [1, 2], operation: "in" },
    ];
    const multiSort = [
      { field: "eventStatus", type: "asc" },
      { field: "startTime", type: "desc" },
    ];

    const bodyParams = {
      conditions,
      multiSort,
      pageNumber: 1,
      pageSize: 10,
    };

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyParams),
      next: { revalidate: 3600 },
    });
    const res = await data.json();
    return res.result ? res.result : [];
  } catch (e) {
    console.log("Api failed ", e);
  }
};

const LiveStreamWidget = async () => {
  const liveStreamData = await fetchLiveStreamData();
  return (
    <>
      <h1 className="heading">
        Live Stream
        <span className={`eticon_caret_right ${styles.headingIcon}`} />
      </h1>
      <LiveStreamSlider liveStreamData={liveStreamData} />
    </>
  );
};
export default LiveStreamWidget;
