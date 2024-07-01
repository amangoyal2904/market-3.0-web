import { removeBackSlash } from "./utility";

export const socialUrl = {
  fb: "https://www.facebook.com/sharer.php",
  twt: "https://twitter.com/share?",
  lin: "https://www.linkedin.com/cws/share?url=",
  whatsapp: "https://api.whatsapp.com//send?text=",
  openerName: "sharer",
};
export const Share = (
  evt: any,
  shareParam: { title: string; url: any; type: any },
) => {
  try {
    let shareTitle = shareParam.title || "";
    let shareUrl = shareParam.url;
    let type = shareParam.type;
    fireGAEvent(evt, type, shareUrl);
    if (type == "wa") {
      shareUrl =
        socialUrl.whatsapp +
        encodeURIComponent(removeBackSlash(shareTitle)) +
        " - " +
        shareUrl +
        encodeURIComponent(
          "?utm_source=whatsapp_market&utm_medium=social&utm_campaign=socialsharebuttons",
        );
      window.location.href = shareUrl;
    }
    if (type == "fb") {
      const fbUrl =
        socialUrl.fb +
        "?u=" +
        encodeURIComponent(
          shareUrl +
            "?utm_source=facebook_market&utm_medium=social&utm_campaign=socialsharebuttons",
        ) +
        "&t=" +
        encodeURIComponent(shareTitle);
      openDialog({ url: fbUrl, name: socialUrl?.openerName });
    } else if (type == "twt") {
      shareTitle =
        shareTitle.length <= 110
          ? shareTitle
          : shareTitle.substring(0, 107) + "...";

      const text = encodeURIComponent(
        removeBackSlash(shareTitle).replace("|", "-"),
      );
      const url = encodeURIComponent(
        shareUrl +
          "?utm_source=twitter_market&utm_medium=social&utm_campaign=socialsharebuttons",
      );
      shareUrl =
        socialUrl.twt + "text=" + text + "&url=" + url + "&via=economictimes";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    } else if (type == "lin") {
      shareUrl =
        socialUrl.lin +
        shareUrl +
        "?utm_source=linkedin_market&utm_medium=social&utm_campaign=socialsharebuttons";
      openDialog({ url: shareUrl, name: socialUrl.openerName });
    }
    // else if (type == "gp") {
    //   shareUrl =
    //     socialUrl.gp +
    //     shareUrl +
    //     "?utm_source=googleplus_market&utm_medium=social&utm_campaign=socialsharebuttons";
    //   openDialog({ url: shareUrl, name: socialUrl.openerName });
    // } else if (type == "email") {
    //   const urltoshare = shareUrl.replace("slideshow_new", "slideshow");
    //   const body = encodeURIComponent(
    //     urltoshare +
    //       "?utm_source=email_market&utm_medium=social&utm_campaign=socialsharebuttons"
    //   );
    //   shareUrl =
    //     "mailto:?subject=ET: " +
    //     encodeURIComponent(removeBackSlash(shareTitle));
    //   window.location.href = shareUrl + "&body=" + body;
    // }
  } catch (e) {
    console.log("error in SocialShare::share::", e);
  }
};
const openDialog = (config: { url: any; name: any; settings?: any }) => {
  try {
    var settings = config.settings ? config.settings : "";
    window.open(config.url, config.name, settings);
  } catch (e) {
    console.log("error in SocialShare::openDialog::" + e);
  }
};
const fireGAEventSocialShare = (
  network: string,
  action: string,
  url: string,
) => {
  try {
    let socialPayload = {
      hitType: "social",
      socialNetwork: network,
      socialAction: action,
      socialTarget: url,
    };
    // ga("send", socialPayload);
    // grxEvent('socialshare', socialPayload);
  } catch (e) {
    console.log("error in SocialShare::fireGAEventSocialShare::" + e);
  }
};
const fireGAEvent = (e: any, type: any, shareUrl: any) => {
  try {
    let utm_source = "";
    let network = "";
    switch (type) {
      case "wa":
        utm_source = "Whatsapp_market";
        network = "Whatsapp";
        break;
      case "fb":
        utm_source = "Facebook_market";
        network = "Facebook";
        break;
      case "twt":
        utm_source = "Twitter_market";
        network = "Twitter";
        break;
      case "lin":
        utm_source = "Linkedin_market";
        network = "Linkedin";
        break;
      case "email":
        utm_source = "Email_market";
        network = "Email";
        break;
      default:
        utm_source = "";
        network = "";
    }
    let url =
      (shareUrl || window.location.href) +
      "?utm_source=" +
      utm_source +
      "&utm_medium=social&utm_campaign=socialsharebuttons";
    fireGAEventSocialShare(network, "Share", url);
  } catch (e) {
    console.log("error in SocialShare::fireGAEvent::" + e);
  }
};
export default { Share };
