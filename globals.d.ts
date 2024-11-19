export {}; // Ensures this file is treated as a module

declare global {
  interface Window {
    googletag: any;
    ispopup: any;
    jsso?: {
      getValidLoggedInUser?: any;
      getUserDetails?: any;
      signOutUser?: any;
    };
    isSurveyLoad: any;
    dataLayer: [];
    ssoWidget?: any;
    verifyLoginSuccess?: any;
    objUser: {
      watchlistCount?: number;
      ssoid?: any;
      ticketId?: any;
      loginType?: string;
      afterCheckUserLoginStatus?: boolean;
      prevPath?: string;
      info?: {
        thumbImageUrl: any;
        primaryEmail: string;
        firstName: string;
      };
      isPrime?: any;
      permissions?: any;
      accessibleFeatures?: any;
      userAcquisitionType?: any;
      primeInfo?: any;
    };
    _sva: any;
    arrDfpAds: {}[];
    apstag: any;
    _dfpObj: any;
    displayAllAdsInArray: any;
    trackingEvent: (type: string, gaData: object) => void;
    customDimension: any;
    geolocation: any;
    geoinfo: any;
    opera?: string;
    MSStream?: string;
    _auds: any;
    colaud: any;
    _mfq?: any[];
    COMSCORE?: {
      beacon: (params: { c1: string; c2: string }) => void;
    };
    objVc: any;
    __APP: {
      env?: string;
    };
  }
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}
