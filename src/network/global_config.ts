interface EnvironmentConfig {
    ssoWidget: string;
    jssoSDK: string;
}

interface GlobalConfig {
    development?: EnvironmentConfig;
    production: EnvironmentConfig;
    gaId: string;
    grxId: string;
    gtmId: string;
}
export const GLOBAL_CONFIG = {
    development: {
        ssoWidget: "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js",
        jssoSDK: "https://jssostg.indiatimes.com/staticsso/cdn/crosswalk_sdk/sdk/jsso_crosswalk_legacy_0.7.93.min.js",
        ET_WEB_URL: "https://etdev8243.indiatimes.com/",
        ET_WAP_URL: "https://m.economictimes.com/",
        MY_SUBS: "https://dev-buy.indiatimes.com/ET/mysubscription?fornav=1",
        Plan_PAGE: "https://dev-buy.indiatimes.com/ET/plans",
        X_CLIENT_ID: "w2a8e883ec676f417520f422068a4741"
    },
    production: {
        ssoWidget: "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js",
        jssoSDK: "https://jssostg.indiatimes.com/staticsso/cdn/crosswalk_sdk/sdk/jsso_crosswalk_legacy_0.7.93.min.js",
        ET_WEB_URL: "https://economictimes.indiatimes.com/",
        ET_WAP_URL: "https://spmdev8243.economictimes.com/",
        MY_SUBS: "https://buy.indiatimes.com/ET/mysubscription?fornav=1",
        Plan_PAGE: "https://buy.indiatimes.com/ET/plans",
        X_CLIENT_ID: "b2a8e883ec676f417520f422068a4742"
    },
    gaId: "UA-198011-5",
    grxId: "g7af6dd9d",
    gtmId: "GTM-566NCXC",
    ET_IMG_DOMAIN: "https://img.etimg.com/"
};

