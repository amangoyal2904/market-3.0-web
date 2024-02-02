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
export const GLOBAL_CONFIG: GlobalConfig = {
    development: {
        ssoWidget: "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js",
        jssoSDK: "https://jssocdnstg.indiatimes.com/crosswalk_sdk/sdk/jsso_crosswalk_0.7.92.js"
    },
    production: {
        ssoWidget: "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js",
        jssoSDK: "https://jssocdnstg.indiatimes.com/crosswalk_sdk/sdk/jsso_crosswalk_0.7.92.js"
    },
    gaId: "UA-198011-5",
    grxId: "g7af6dd9d",
    gtmId: "GTM-566NCXC"
};

