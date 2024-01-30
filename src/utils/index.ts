
export const APP_ENV = (process.env.NODE_ENV && process.env.NODE_ENV.trim()) || "production";

export const pageType = (pathurl:any) => {
    console.log(">>>",pathurl)
    if (pathurl.indexOf("watchlist") != -1) {
      return "watchlist";
    } else {
      return "notfound";
    }
  };

  export const getParameterByName = (name:string) => {
    try {
      if (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      } else {
        return "";
      }
    } catch (e) {
      console.log("getParameterByName", e);
    }
  };

  export const isBotAgent = () => {
    const ua = (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || "";
    return ua.indexOf("bot") != -1 ? 1 : 0;
  };