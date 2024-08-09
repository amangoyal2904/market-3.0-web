"use client";

import useOnAppLoad from "./useOnAppLoad";
import jStorageReact from "../../utils/jStorageReact";
import TopBannerPrimeUser from "./ShowTopNudgePrime/Banner";
import BottomStrip from "./BottomNudge/BottomStrip";
import RightSideStrip from "./BottomNudge/RightSideStrip";
import PrimeToolBanner from "./OnlyPrimeToolNudge/PrimeToolBanner";
import SliderBanner from "./CenterSliderNudge/SliderBanner";
import { useStateContext } from "@/store/StateContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import APIS_CONFIG from "@/network/api_config.json";
import { APP_ENV } from "@/utils";

const CommonNudge = ({ modalType }: any) => {
  const pathName = usePathname();
  const { state, dispatch } = useStateContext();
  const { isLogin, isPrime, permissions, subscriptionDetails } = state.login;
  const { modalState } = state;
  const [allNudgeSubscriptionData, setAllNudgeSubscriptionData]: any = useState(
    {},
  );
  const [metaInfoTopNudege, setMetaInfoTopNudege]: any = useState({});
  const [metaInfoBottomNudege, setMetaInfoBottomNudege]: any = useState({});
  const [metaInfoPrimeNudege, setMetaInfoPrimeNudege]: any = useState({});
  const [bottomBannerType, setBottomBannerType] = useState("");
  const [bottomBannerTypeOption, setBottomBannerTypeOption] = useState("");
  const [userType, setUserType] = useState("");
  const [primePagesBannerType, setPrimePagesBannerType] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCenterSlider, setShowCenterSlider] = useState(false);

  //console.log("modalState___", modalState, isPrime, pathName);
  const checkPermission = (type: any) => {
    let permissionFlag = 0,
      __permissions = permissions || [];
    if (typeof type == "string") {
      if (type == "adfree") {
        if (__permissions.indexOf("etadfree_subscribed") != -1) {
          permissionFlag = 1;
        }
      } else {
        if (__permissions.indexOf(type) != -1) {
          permissionFlag = 1;
        }
      }
    } else {
      for (var i = 0; i < type.length; i++) {
        if (__permissions.indexOf(type[i]) != -1) {
          permissionFlag = 1;
          break;
        }
      }
    }
    return permissionFlag;
  };
  const callAPIforNudgeSubscription = async () => {
    try {
      const isGroupUser = checkPermission("group_subscription");
      const apiUrl = (APIS_CONFIG as any)?.["ALL_USER_SUBSCRIPTIONS"][APP_ENV];
      const response = await fetch(
        `${apiUrl}?merchantCode=ET&isGroupUser=${isGroupUser}`,
        {
          credentials: "include", // This ensures cookies are sent with the request
          headers: {
            "Content-Type": "application/json", // If your API requires specific headers
          },
        },
      );
      const resData = await response.json();
      if (resData && resData.length > 0) {
        setAllNudgeSubscriptionData(resData[0]);
      }
    } catch (error) {
      console.log("error - allUserSubscriptions API");
    }
  };
  const checkUrl = () =>
    pathName.includes("top-india-investors-portfolio") ||
    pathName.includes("stock-market-mood");
  const getNudgeCheck = (key: any) => {
    const nudge = jStorageReact.get(key) && JSON.parse(jStorageReact.get(key));
    return {
      nudge,
      showRule: nudge ? +new Date() > nudge.reActivatedOn : true,
    };
  };
  const { nudge: yellowTopNudgeCheck, showRule: showYellowTopNudgeRule } =
    getNudgeCheck("topNudgeObj");
  //console.log("yellowTopNudgeCheck", yellowTopNudgeCheck);

  const {
    nudge: topPrimeToolsNudgeCheck,
    showRule: showTopPrimeToolsNudgeRule,
  } = getNudgeCheck("primeToolNudge");

  const { nudge: bottomRightNudgeCheck, showRule: showBottomRightNudgeRule } =
    getNudgeCheck("btmNudge");

  const { nudge: centerNudgeCheck, showRule: showCenterNudgeCheckRule } =
    getNudgeCheck("centerNudge");

  const isPrimeTools = checkUrl();
  const fetchMetaInfoDataTopNudge = async () => {
    const apiUrl = (APIS_CONFIG as any)?.["META_INFO"][APP_ENV];
    const data = await fetch(`${apiUrl}?msid=98201998`);
    const resonse = await data.json();
    setMetaInfoTopNudege(resonse?.metainfo);
  };
  const fetchMetaInfoDataBottomNudge = async () => {
    const apiUrl = (APIS_CONFIG as any)?.["META_INFO"][APP_ENV];
    const data = await fetch(`${apiUrl}?msid=111625583`);
    const response = await data.json();
    setMetaInfoBottomNudege(response?.metainfo);
  };

  const fetchMetaInfoDataPrimeNudge = async () => {
    const apiUrl = (APIS_CONFIG as any)?.["META_INFO"][APP_ENV];
    const data = await fetch(`${apiUrl}?msid=111625583`);
    const response = await data.json();
    setMetaInfoPrimeNudege(response?.metainfo);
  };
  const allNudgeRuleCheck = () => {
    //console.log("___check all nudeg Rule and call api", userType);
    if (
      showYellowTopNudgeRule &&
      modalState?.activeModal === "" &&
      userType !== ""
    ) {
      fetchMetaInfoDataTopNudge();
    } else if (
      !isPrime &&
      showBottomRightNudgeRule &&
      !isPrimeTools &&
      modalState?.activeModal === ""
    ) {
      fetchMetaInfoDataBottomNudge();
    } else if (
      !isPrime &&
      showTopPrimeToolsNudgeRule &&
      isPrimeTools &&
      modalState?.activeModal === ""
    ) {
      fetchMetaInfoDataPrimeNudge();
    } else if (
      showCenterNudgeCheckRule &&
      modalState?.activeModal === "" &&
      !isPrime
    ) {
      fetchMetaInfoDataPrimeNudge();
    }
  };
  const setReactivationDate = (key: any, ttl = 1) => {
    const reActivatedOn = +new Date() + Number(ttl) * 1000 * 60 * 60 * 24;
    jStorageReact.set(key, JSON.stringify({ reActivatedOn }));
    setShowModal(false);
    if (modalState?.activeModal !== "") {
      dispatch({
        type: "SHOW_MODAL",
        payload: {
          activeModal: "",
        },
      });
    }
    //console.log(`${key} close button run`);
  };
  const closeHandlerTopNudege = (ttl: any) =>
    setReactivationDate("topNudgeObj", ttl);
  const bottomModalCloseHandler = () => setReactivationDate("btmNudge");
  const modalCloseHandlerPrimeTools = () =>
    setReactivationDate("primeToolNudge");
  const modalCloseHandlerSliderbanner = (ttl: any) =>
    setReactivationDate("centerNudge", ttl);
  const renderComponents = () => {
    //console.log("check Value____________ finel step render code ");
    if (
      showYellowTopNudgeRule &&
      modalState?.activeModal === "" &&
      userType !== ""
    ) {
      if (
        userType === "grace_period" &&
        metaInfoTopNudege?.["ColumnLabel"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["NewsletterEmail"]?.value}
            imageMsid={metaInfoTopNudege?.["Photographer"]?.value}
            bannerText={metaInfoTopNudege?.["NewsKeywords"]?.value}
            bannerSubtext={metaInfoTopNudege?.["CCIOnlineAuthorName"]?.value}
            buttonLink={metaInfoTopNudege?.["5888Follow"]?.value}
            buttonText={metaInfoTopNudege?.["Abbreviation"]?.value}
            bannerCross={metaInfoTopNudege?.["Shoppingcarturl"]?.value}
            crossFrequency={
              metaInfoTopNudege?.["ContentRulesInfoGraphicId"]?.value
            }
            closeHandler={closeHandlerTopNudege}
          />
        );
      } else if (
        userType === "about_to_expire" &&
        metaInfoTopNudege?.["TemplateBreadrumbs"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["Altdescription"]?.value}
            imageMsid={metaInfoTopNudege?.["Sluglinebeforeheadline"]?.value}
            bannerText={metaInfoTopNudege?.["overridetemplate"]?.value}
            bannerSubtext={metaInfoTopNudege?.["SpecialID"]?.value}
            buttonLink={metaInfoTopNudege?.["canonicalURL"]?.value}
            buttonText={metaInfoTopNudege?.["Sluglineafterheadline"]?.value}
            bannerCross={metaInfoTopNudege?.["MetaKeywords"]?.value}
            crossFrequency={metaInfoTopNudege?.["Matchid"]?.value}
            closeHandler={closeHandlerTopNudege}
          />
        );
      } else if (
        userType === "cancelled" &&
        metaInfoTopNudege?.["MovieReviewTrivia"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["MovieReviewSpoiler"]?.value}
            imageMsid={metaInfoTopNudege?.["RelatedDefinitions"]?.value}
            bannerText={metaInfoTopNudege?.["MovieShortCode"]?.value}
            bannerSubtext={
              metaInfoTopNudege?.["MovieReviewTwitterHandle"]?.value
            }
            buttonLink={metaInfoTopNudege?.["MovieBuzz"]?.value}
            buttonText={metaInfoTopNudege?.["SpecialMovieRevID"]?.value}
            bannerCross={metaInfoTopNudege?.["MovieReviewHeadline"]?.value}
            crossFrequency={metaInfoTopNudege?.["MovieReviewBoxOffice"]?.value}
            closeHandler={closeHandlerTopNudege}
          />
        );
      } else if (
        userType === "cancelled_nonrec" &&
        metaInfoTopNudege?.["ETPersonDesignation"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["EventLocation"]?.value}
            imageMsid={metaInfoTopNudege?.["PersonsFirstName"]?.value}
            bannerText={metaInfoTopNudege?.["PersonsLastName"]?.value}
            bannerSubtext={metaInfoTopNudege?.["BeautyPageantCollege"]?.value}
            buttonLink={metaInfoTopNudege?.["Alttitle"]?.value}
            buttonText={metaInfoTopNudege?.["Profession"]?.value}
            bannerCross={metaInfoTopNudege?.["EventName"]?.value}
            crossFrequency={metaInfoTopNudege?.["BeautyPageantSchool"]?.value}
            closeHandler={closeHandlerTopNudege}
          />
        );
      } else if (
        userType === "active_nonrec" &&
        metaInfoTopNudege?.["PriceRange"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["Checkout"]?.value}
            imageMsid={metaInfoTopNudege?.["Address"]?.value}
            bannerText={metaInfoTopNudege?.["Phone"]?.value}
            bannerSubtext={metaInfoTopNudege?.["FoodCategory"]?.value}
            buttonLink={metaInfoTopNudege?.["Website"]?.value}
            buttonText={metaInfoTopNudege?.["Email"]?.value}
            bannerCross={metaInfoTopNudege?.["Checkin"]?.value}
            crossFrequency={metaInfoTopNudege?.["NumberOfRooms"]?.value}
            closeHandler={closeHandlerTopNudege}
          />
        );
      } else if (
        userType === "adFree" &&
        metaInfoTopNudege?.["POIMapIdentifier"]?.value === "ON"
      ) {
        return (
          <TopBannerPrimeUser
            bannerType={userType}
            bannerBg={metaInfoTopNudege?.["GuideContinent"]?.value}
            imageMsid={metaInfoTopNudege?.["BestTimeToVisit"]?.value}
            bannerText={metaInfoTopNudege?.["Currency"]?.value}
            bannerSubtext={metaInfoTopNudege?.["IconClass"]?.value}
            buttonLink={metaInfoTopNudege?.["Timezone"]?.value}
            buttonText={metaInfoTopNudege?.["Festivals"]?.value}
            bannerCross={metaInfoTopNudege?.["GuideCountry"]?.value}
            crossFrequency={metaInfoTopNudege?.["MapCenter"]?.value}
            closeHandler={closeHandlerTopNudege}
          />
        );
      }
    } else if (
      !isPrime &&
      showBottomRightNudgeRule &&
      !isPrimeTools &&
      modalState?.activeModal === ""
    ) {
      const subscriptionDetailsInfo: any = allNudgeSubscriptionData;
      const eu_benchmark = 15;
      const timestampNow = +new Date();
      const expiryDaysLeft = Math.floor(
        (+new Date(subscriptionDetailsInfo?.expiryDate) - timestampNow) /
          (1000 * 60 * 60 * 24),
      );
      const isAboutToExpire =
        subscriptionDetailsInfo?.daysLeft <= eu_benchmark && expiryDaysLeft > 0;

      if (bottomBannerType === "bottom" && bottomBannerTypeOption === "a") {
        const buttonTextExpired =
          metaInfoBottomNudege?.["Sluglineafterheadline"]?.value;
        const buttonText =
          metaInfoBottomNudege?.["Sluglinebeforeheadline"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <BottomStrip
            nudgeType="type1"
            bannerSubtext={metaInfoBottomNudege?.["PrimaryTag"]?.value}
            bannerText={metaInfoBottomNudege?.["overridetemplate"]?.value}
            buttonText={btnTxt}
            closeHandler={bottomModalCloseHandler}
          />
        );
      } else if (
        bottomBannerType === "bottom" &&
        bottomBannerTypeOption === "b"
      ) {
        const buttonTextExpired = metaInfoBottomNudege?.["SpecialID"]?.value;
        const buttonText = metaInfoBottomNudege?.["Matchid"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <BottomStrip
            nudgeType="type2"
            bannerText={metaInfoBottomNudege?.["canonicalURL"]?.value}
            buttonText={btnTxt}
            buttonSubText={metaInfoBottomNudege?.["MetaKeywords"]?.value}
            closeHandler={bottomModalCloseHandler}
          />
        );
      } else if (
        bottomBannerType === "bottom" &&
        bottomBannerTypeOption === "c"
      ) {
        const buttonTextExpired =
          metaInfoBottomNudege?.["CARDPAGETEMPLATE"]?.value;
        const buttonText = metaInfoBottomNudege?.["AlternateURL"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <BottomStrip
            nudgeType="type3"
            bannerText={metaInfoBottomNudege?.["AMPURL"]?.value}
            bannerTopSubText={
              metaInfoBottomNudege?.["TemplateH1TopHeading"]?.value
            }
            buttonText={btnTxt}
            closeHandler={bottomModalCloseHandler}
          />
        );
      } else if (
        bottomBannerType === "right" &&
        bottomBannerTypeOption === "a"
      ) {
        const buttonTextExpired =
          metaInfoBottomNudege?.["RelatedDefinitions"]?.value;
        const buttonText = metaInfoBottomNudege?.["Abbreviation"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <RightSideStrip
            nudgeType="type1"
            bannerText={metaInfoBottomNudege?.["Photographer"]?.value}
            buttonText={btnTxt}
            closeHandler={bottomModalCloseHandler}
          />
        );
      } else if (
        bottomBannerType === "right" &&
        bottomBannerTypeOption === "b"
      ) {
        const buttonTextExpired = metaInfoBottomNudege?.["BlogsName"]?.value;
        const buttonText = metaInfoBottomNudege?.["BlogPost"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <RightSideStrip
            nudgeType="type2"
            bannerText={
              metaInfoBottomNudege?.["ContentRulesInfoGraphicId"]?.value
            }
            buttonText={btnTxt}
            buttonSubText={metaInfoBottomNudege?.["BlogAuthorName"]?.value}
            closeHandler={bottomModalCloseHandler}
          />
        );
      }
    } else if (
      !isPrime &&
      primePagesBannerType !== "" &&
      showTopPrimeToolsNudgeRule &&
      isPrimeTools &&
      modalState?.activeModal === ""
    ) {
      const subscriptionDetailsInfo: any = allNudgeSubscriptionData;
      const eu_benchmark = 15;
      const timestampNow = +new Date();
      const expiryDaysLeft = Math.floor(
        (+new Date(subscriptionDetailsInfo?.expiryDate) - timestampNow) /
          (1000 * 60 * 60 * 24),
      );
      const isAboutToExpire =
        subscriptionDetailsInfo?.daysLeft <= eu_benchmark && expiryDaysLeft > 0;
      if (primePagesBannerType === "a") {
        const buttonTextExpired = metaInfoPrimeNudege?.["MovieBuzz"]?.value;
        const buttonText = metaInfoPrimeNudege?.["SpecialMovieRevID"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <PrimeToolBanner
            closeHandler={modalCloseHandlerPrimeTools}
            bannerText={metaInfoPrimeNudege?.["MovieShortCode"]?.value}
            btnTxt={btnTxt}
            bannerType={primePagesBannerType}
          />
        );
      } else if (primePagesBannerType === "b") {
        const buttonTextExpired =
          metaInfoPrimeNudege?.["MovieReviewSpoiler"]?.value;
        const buttonText =
          metaInfoPrimeNudege?.["MovieReviewYouTubeVideoId"]?.value;
        const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
        return (
          <PrimeToolBanner
            closeHandler={modalCloseHandlerPrimeTools}
            bannerText={
              metaInfoPrimeNudege?.["MovieReviewZoomTVReviewId"]?.value
            }
            btnTxt={btnTxt}
            subBannerText={metaInfoPrimeNudege?.["MovieReviewHeadline"]?.value}
            bannerType={primePagesBannerType}
          />
        );
      }
    } else if (
      showCenterNudgeCheckRule &&
      modalState?.activeModal === "" &&
      !isPrime &&
      metaInfoPrimeNudege?.["MovieReviewRatingStory"] &&
      metaInfoPrimeNudege?.["MovieReviewRatingStory"]?.value &&
      metaInfoPrimeNudege?.["MovieReviewRatingStory"]?.value !== "" &&
      metaInfoPrimeNudege?.["MovieReviewRatingStory"]?.value !== undefined
    ) {
      const subscriptionDetailsInfo: any = allNudgeSubscriptionData;
      const eu_benchmark = 15;
      const timestampNow = +new Date();
      const expiryDaysLeft = Math.floor(
        (+new Date(subscriptionDetailsInfo?.expiryDate) - timestampNow) /
          (1000 * 60 * 60 * 24),
      );
      const isAboutToExpire =
        subscriptionDetailsInfo?.daysLeft <= eu_benchmark && expiryDaysLeft > 0;

      const buttonTextExpired =
        metaInfoPrimeNudege?.["MovieReviewRatingAction"]?.value;
      const buttonText = metaInfoPrimeNudege?.["MovieReviewRatingMusic"]?.value;
      const btnTxt = isAboutToExpire ? buttonTextExpired : buttonText;
      return (
        <SliderBanner
          bannerText={`${metaInfoPrimeNudege?.["MovieReviewRatingStory"]?.value}`}
          buttonText={btnTxt}
          buttonSubText={
            metaInfoPrimeNudege?.["MovieReviewRatingFearFactor"]?.value
          }
          closeHandler={modalCloseHandlerSliderbanner}
          isPrime={isPrime}
          showTimeFrame={
            metaInfoPrimeNudege?.["MovieReviewRatingVisualAppeal"]?.value
          }
        />
      );
    }
  };
  const sethandlerUserType = () => {
    const subscriptionDetailsInfo: any = allNudgeSubscriptionData;
    const subStatus = subscriptionDetailsInfo;
    const timestampNow = +new Date();
    const eu_benchmark = 15;
    const expiryDaysLeft = Math.floor(
      (+new Date(subscriptionDetailsInfo?.expiryDate) - timestampNow) /
        (1000 * 60 * 60 * 24),
    );
    const isUserCancelled = subStatus === "cancelled";

    const isGracePeriodOn =
      timestampNow > +new Date(subscriptionDetailsInfo?.expiryDate) &&
      timestampNow < +new Date(subscriptionDetailsInfo?.graceEndDate);
    const isAboutToExpire =
      subscriptionDetailsInfo?.daysLeft <= eu_benchmark && expiryDaysLeft > 0;
    const isCancelledElgible =
      expiryDaysLeft <= eu_benchmark && isUserCancelled;
    const isCancelledNonRec = expiryDaysLeft > eu_benchmark && isUserCancelled;
    const daysSincePlanStart = Math.floor(
      (timestampNow -
        +new Date(subscriptionDetailsInfo?.subscriptionStartDate)) /
        (1000 * 60 * 60 * 24),
    );

    const timeStampDiff =
      +new Date() - +new Date(subscriptionDetailsInfo.graceEndDate);
    const dayDiff = Math.round(timeStampDiff / (1000 * 3600 * 24));
    const adFree = dayDiff > 0;

    const userDefineRole = isGracePeriodOn
      ? "grace_period"
      : isAboutToExpire
        ? "about_to_expire"
        : isCancelledNonRec
          ? "cancelled_nonrec"
          : isCancelledElgible
            ? "cancelled"
            : // : daysSincePlanStart > 30
              //   ? "active_nonrec"
              adFree
              ? "adFree"
              : "";

    //setUserType("adFree");
    setUserType(userDefineRole);
    //console.log("__userDefineRole__", userDefineRole);
  };
  const onAppLoad = () => {
    //console.log("________Application is fully loaded and state is updated");
    setTimeout(() => {
      setShowModal(true);
    });
  };
  useOnAppLoad(onAppLoad);
  useEffect(() => {
    allNudgeRuleCheck();
  }, [userType]);
  useEffect(() => {
    //
    // top organge band
    renderComponents();
  }, [metaInfoTopNudege]);
  useEffect(() => {
    const showBannerType =
      metaInfoBottomNudege?.["BlogAuthorImageUrl"]?.value || "";
    const showNudgeBanner =
      showBannerType === "1" ? "bottom" : showBannerType === "2" ? "right" : "";
    // const showBannerOption = "b";
    const showBannerOption =
      metaInfoBottomNudege?.["ContentRulesIndiatimesShoppingProductId"]
        ?.value || "";
    const showNudgeBanerOption =
      showBannerOption !== "" ? showBannerOption.toLowerCase() : "";
    setBottomBannerType(showNudgeBanner);
    setBottomBannerTypeOption(showNudgeBanerOption);
    //  setBottomBannerType("bottom");
    //  setBottomBannerTypeOption("b");
  }, [metaInfoBottomNudege]);
  useEffect(() => {
    const showBannerType =
      metaInfoPrimeNudege?.["MovieReviewTrivia"]?.value || "";
    const showNudgeBanner =
      showBannerType === "1" ? "a" : showBannerType === "2" ? "b" : "";
    setPrimePagesBannerType(showNudgeBanner);
    //setPrimePagesBannerType("b")
    renderComponents();
    //console.log("prime tools nudeg call here ", metaInfoPrimeNudege);
  }, [metaInfoPrimeNudege]);

  useEffect(() => {
    console.log({ isPrime, permissions });
    if (typeof window.objUser != "undefined") {
      if (
        showModal &&
        !isLogin &&
        !allNudgeSubscriptionData?.currency &&
        !window.objUser.afterCheckUserLoginStatus
      ) {
        sethandlerUserType();
      } else if (
        showModal &&
        isLogin &&
        !allNudgeSubscriptionData?.currency &&
        window.objUser.afterCheckUserLoginStatus &&
        isPrime &&
        permissions?.indexOf("group_subscription") === -1
      ) {
        callAPIforNudgeSubscription();
      } else if (
        showModal &&
        isLogin &&
        allNudgeSubscriptionData?.currency &&
        allNudgeSubscriptionData?.currency !== "" &&
        window.objUser.afterCheckUserLoginStatus
      ) {
        sethandlerUserType();
      }
    }
  }, [showModal, isLogin, allNudgeSubscriptionData?.currency]);

  return <>{showModal && renderComponents()}</>;
};

export default CommonNudge;
