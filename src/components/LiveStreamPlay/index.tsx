"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./LiveStreamPlay.module.scss";
import APIS_CONFIG from "../../network/api_config.json";
import Service from "../../network/service";
import { APP_ENV, getCookie } from "@/utils";
import LiveStreamPlayCards from "./LiveStreamPlayCards";
import { useStateContext } from "@/store/StateContext";
declare global {
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}
const LiveStreamPlay = (props: any) => {
  const [newsData, setNewsData] = useState([]);
  const [activeData, setActiveData] = useState(null);
  const [currentSIndex, setCurrentSIndex] = useState(0);
  const [token, setToken] = useState("");
  const [liveStatus, setLiveStatus] = useState(false);
  const [eventId, setEventId] = useState("");
  const [eventToken, setEventToken] = useState("");
  const [iframeURL, setIframeURL] = useState("");
  const [followingData, setFollowingData] = useState<any>([]);
  const [expertFollowers, setExpertFollowers] = useState("");
  const [impressionLabel, setImpressionLabel] = useState("");
  const utmSource = "?utm_source=MainHome&utm_medium=Self-Referrals";
  const iframeRef = useRef();
  const IFRAME_BASE = "https://cpl.sli.ke";
  const ET_WAP_URL = "https://m.economictimes.com/";
  const { state } = useStateContext();
  const { isLogin, userInfo, isPrime } = state.login;
  let requestIdleCallbackId = 0;

  const fetchList = async () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0);
    const sevenDaysEarlierDate = currentDate.getTime();
    const data = {
      conditions: [
        {
          fieldName: "eventStatus",
          value: [3, 5],
          operation: "in",
        },
        {
          fieldName: "streamFlag",
          value: [1, 2],
          operation: "in",
        },
        {
          fieldName: "endTime",
          value: sevenDaysEarlierDate,
          operation: "greaterThanEq",
        },
        {
          fieldName: "paidEvent",
          value: true,
          operation: "notEqual",
        },
      ],
      multiSort: [
        {
          field: "eventStatus",
          type: "asc",
        },
        {
          field: "startTime",
          type: "desc",
        },
      ],
      pageNumber: 1,
      pageSize: 5,
    };
    const apiUrl = (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/getEventData";
    const response = await Service.post({
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
      params: {},
      cache: "no-store",
    });
    const newsData = await response?.json();
    return newsData;
  };
  const fetchToken = async () => {
    const requestUrl =
      (APIS_CONFIG as any)?.liveStream[APP_ENV] + "/generateToken";
    const name =
      window.objUser && isLogin
        ? window.objUser?.info?.firstName
        : "Guest User";
    const userID = isLogin
      ? window.objUser?.info && window.objUser?.info.primaryEmail
      : getCookie("_grx")
        ? getCookie("_grx")
        : getCookie("pfuuid")
          ? getCookie("pfuuid")
          : Math.random().toString(36).slice(2);
    const payload = {
      eventID: eventId,
      eventToken,
      meta: {
        isloggedin: isLogin || false,
        section: "ETMain_HP_MWeb",
      },
      name,
      role: 0,
      userID,
    };
    const tokenRes = await Service.post({
      url: requestUrl,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload }),
      params: {},
      cache: "no-store",
    });
    const tokenData = await tokenRes?.json();
    return tokenData;
  };
  useEffect(() => {
    setIframeURL("");
    if (eventId && eventToken) {
      fetchToken()
        .then((response: any) => {
          const tokenValue = (response && response && response.token) || "";
          if (!tokenValue) throw response;
          setToken(tokenValue);
          const url = `${(APIS_CONFIG as any)?.["SLIKE_CLEO_URL"][APP_ENV]}/#id=${eventId}&jwt=${tokenValue}&apikey=et-n9GgmFF518E5Bknb&qna=false&comments=false&screenshot=false&controls=true&headless=false&autoplay=2&ffsmobile=false&bgpause=false&log=0${!liveStatus ? "&dvr=true" : "&dvr=false"}`;
          setIframeURL(url);
        })
        .catch((e: any) => console.log("error in fetchToken", e));
    }
  }, [eventId, eventToken, liveStatus]);

  const onLoadIframe = () => {
    try {
      window.addEventListener("message", (event) => {
        if (event.origin !== IFRAME_BASE) return;
        const { action, data } = event.data;
        if (action && action === "READY_TO_USE") {
          iframeTrigger();
        }
      });
    } catch (err) {
      console.error("bind iframe event", err);
    }
  };
  const iframeTrigger = () => {
    const payload = {
      action: "CREATE_SESSION",
      data: {},
    };
    const iframe: any = iframeRef.current;
    if (iframe && iframe?.contentWindow) {
      iframe.contentWindow.postMessage(payload, IFRAME_BASE);
    }
  };
  // const prepareImpression = (item = {}) => {
  //     const {title, eventId, expertId, eventStatus} = item;
  //     window.customDimension['dimension23'] = expertId;
  //     window.customDimension['dimension112'] = eventId;
  //     window.customDimension['dimension117'] = eventStatus == 3 ? "live" : "recorded";
  //     const label = `Label=VID-${eventId}-${title}/Expert=${expertId}`;
  //     setImpressionLabel(label);
  // }
  // const sendSlideImpression = (item = {}, nextIndex: number) =>{
  //     const direction = currentSIndex > nextIndex ? "Prev" : "Next";
  //     const {title, eventId, expertId, eventStatus} = item;
  //     window.customDimension['dimension23'] = expertId;
  //     window.customDimension['dimension112'] = eventId;
  //     window.customDimension['dimension117'] = eventStatus == 3 ? "live" : "recorded";
  //     const label = `Label=${direction}-Slide-${currentSIndex+1}-${nextIndex+1}`;
  //     grxEvent('event', {'event_category': 'ETLive-Impression', 'event_action': 'et-main-hp-widget', 'event_label': label});
  // }
  const startFetching = () => {
    fetchList()
      .then((response: any) => {
        const { result = [] } = response;
        if (result?.length) {
          const filteredEvents = result?.filter(
            (event: { eventStatus: number }) => event.eventStatus === 3,
          );
          setNewsData(filteredEvents);
          prepareData(filteredEvents[0]);
          // prepareImpression(result[0]);
        }
      })
      .catch((e: any) => console.log("error in Athena fetchList", e));
  };
  const fetchFollowingExperts = async () => {
    try {
      const authorization: any = getCookie("peuuid") ? getCookie("peuuid") : "";
      const requestUrl = (APIS_CONFIG as any)?.["getFollowedExperts"][APP_ENV];
      const followings = await Service.get({
        url: requestUrl,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          mode: "cors",
        },
        params: {},
        cache: "no-store",
      });
      const followingsData = await followings?.json();
      setFollowingData(followingsData);
    } catch (e) {
      console.log("Error in fetching following experts", e);
    }
  };
  const prepareData = (item: any) => {
    setActiveData(item);
    setEventId(item.eventId);
    setEventToken(item.eventToken);
    setLiveStatus(item.eventStatus == 3 ? true : false);
    if (item.eventStatus == 3) {
      sessionStorage.setItem("doNotRefreshPage", "1");
      fetchFollowingExperts();
      fetchFollowingData(item);
    } else {
      sessionStorage.removeItem("doNotRefreshPage");
    }
  };
  const fetchFollowingData = async (item: any) => {
    try {
      const data = [
        { prefDataVal: item.expertId, userSettingSubType: "Expert" },
      ];
      const apiUrl = (APIS_CONFIG as any)?.["expertFollower"][APP_ENV];
      const response = await Service.post({
        url: apiUrl,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        params: {},
        cache: "no-store",
      });
      const followingData = await response?.json();
      setExpertFollowers(followingData?.prefDataValCountList[0]?.count);
    } catch (e) {
      console.log("Error in fetching following data", e);
    }
  };
  useEffect(() => {
    startFetching();
  }, []);

  const onSwitching = (index: any) => {
    setCurrentSIndex(index);
    const item = newsData[index];
    item && prepareData(item);
    // sendSlideImpression(item, index);
  };
  //   function handleClick(target: string) {
  //     let label = `Label=click-livestream-icon`;
  //     if (activeData) {
  //       const { title, eventId, expertId, eventStatus } = activeData;
  //       const watchStatus = eventStatus == 3 ? "WatchLive" : "WatchNow";
  //       if (target === "expert") {
  //         label = `Label=ExpertNameClick-Link=${currentSIndex + 1}/Title=VID-${eventId}-${title}/Expert ID=${expertId}`;
  //       } else if (target === "storyTitle") {
  //         label = `Label=VideoClick-Link=${currentSIndex + 1}/Title=VID-${eventId}-${title}/Expert ID=${expertId}`;
  //       } else if (target === "watchButton") {
  //         label = `Label=${watchStatus}-Link=${currentSIndex + 1}/Title=VID-${eventId}-${title}/Expert ID=${expertId}`;
  //       }
  //       window.customDimension["dimension23"] = expertId;
  //       window.customDimension["dimension112"] = eventId;
  //       window.customDimension["dimension117"] =
  //         eventStatus == 3 ? "live" : "recorded";
  //     }
  //     //grxEvent('event', {'event_category': 'ETLive-Core', 'event_action': 'et-main-hp-widget', 'event_label': label});
  //   }
  return newsData && liveStatus ? (
    <div className={styles.sliderContainer}>
      {newsData?.length ? (
        <LiveStreamPlayCards
          iframeRef={iframeRef}
          newsData={newsData}
          iframeURL={iframeURL}
          onSwitching={onSwitching}
          currentSIndex={currentSIndex}
          onLoadIframe={onLoadIframe}
          expertFollowers={expertFollowers}
          followingData={followingData}
          fetchFollowingExperts={fetchFollowingExperts}
        />
      ) : (
        ""
      )}
      <h2 className={styles.heading}>Previous Active Streams</h2>
    </div>
  ) : (
    ""
  );
};
export default LiveStreamPlay;
