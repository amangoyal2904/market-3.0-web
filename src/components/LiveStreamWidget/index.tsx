import { APP_ENV } from "@/utils";
import APIS_CONFIG from "../../network/api_config.json";
import styles from "./Livestream.module.scss";
import LiveStreamSlider from "./LiveStreamSlider";
import ViewAllLink from "../ViewAllLink";
import Image from "next/image";
import HeadingHome from "../ViewAllLink/HeadingHome";
import GLOBAL_CONFIG from "@/network/global_config.json";

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
    <div className="sectionWrapper">
      <HeadingHome
        title="Live Stream"
        url={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/etmarkets-livestream`}
      />
      {/* <h2 className="heading">
        <a
          target="_blank"
          title="Live Stream"
          href={`${(APIS_CONFIG as any)?.DOMAIN[APP_ENV]}/etmarkets-livestream`}
        >
          <Image
            src="/img/liveStream.svg"
            width={166}
            height={23}
            alt="Live Stream"
            loading="lazy"
          />
          <span className={`eticon_caret_right ${styles.headingIcon}`} />
        </a>
      </h2> */}
      <LiveStreamSlider liveStreamData={liveStreamData} />
      <ViewAllLink
        text="See All Live Streams"
        link={`${(GLOBAL_CONFIG as any)[APP_ENV]["ET_WEB_URL"]}etmarkets-livestream`}
      />
    </div>
  );
};
export default LiveStreamWidget;
