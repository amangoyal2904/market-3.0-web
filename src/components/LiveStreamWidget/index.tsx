import { APP_ENV } from "@/utils";
import APIS_CONFIG from "../../network/api_config.json";
import LiveStreamSlider from "./LiveStreamSlider";
import ViewAllLink from "../ViewAllLink";
import LiveStreamPlay from "../LiveStreamPlay";
import HeadingHome from "../ViewAllLink/HeadingHome";
import GLOBAL_CONFIG from "@/network/global_config.json";
import service from "@/network/service";

const fetchLiveStreamData = async () => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    )?.getTime();
    const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/getEventData";
    const conditions = [
      { fieldName: "eventStatus", value: [3, 5], operation: "in" },
      {
        fieldName: "endTime",
        value: sevenDaysAgo,
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

    const data = await service.post({
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyParams),
      cache: "no-store",
      params: {},
    });

    const res = await data.json();
    return res.result ? res.result : [];
  } catch (e) {
    console.log("Api failed ", e);
  }
};

const LiveStreamWidget = async () => {
  const liveStreamData = await fetchLiveStreamData();
  const previousLiveEvents = liveStreamData?.filter(
    (event: { eventStatus: number }) => event.eventStatus !== 3,
  );
  return liveStreamData?.length ? (
    <div className="sectionWrapper">
      <HeadingHome
        title="Live Stream"
        url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/etmarkets-livestream`}
      />
      <LiveStreamPlay />
      <LiveStreamSlider liveStreamData={previousLiveEvents} />
      <ViewAllLink
        text="See All Live Streams"
        link={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}etmarkets-livestream`}
      />
    </div>
  ) : (
    ""
  );
};
export default LiveStreamWidget;
