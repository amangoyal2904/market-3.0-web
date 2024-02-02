import Service from "../network/service";

declare global {
  interface Window {
    geolocation: any;
    customDimension: any;
    geoinfo: any;
    opera?: string;
    MSStream?: string;
  }
  interface objUser {
    info: {
      isLogged: boolean;
    };
  }
}
  
  declare var ssoWidget: any;

  export const APP_ENV = (process.env.NODE_ENV && process.env.NODE_ENV.trim()) || "production";

  export const getCookie = (name: string) => {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (e) {
      console.log("getCookie", e);
    }
  };

  export const getMobileOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
    if (/android/i.test(userAgent)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }
    return "unknown";
  };

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

  export const verifyLogin = () => {
    window?.jsso?.getValidLoggedInUser(function (response: any) {
      if(response.status == 'SUCCESS') {
        console.log("SUCCESS");

        if(typeof window.objUser == "undefined") window.objUser = {};

        window.objUser.ticketId = response.data.ticketId
        setUserData();
      }else{
        console.log("failure")
        ssoLoginWidget();
      }

      const verifyLoginStatus =  new Event(response.status == 'SUCCESS' ? "verifyLoginSuccess" : "verifyLoginFail");
      document.dispatchEvent(verifyLoginStatus);
    });
  }

  export const setUserData = () => {
    window?.jsso?.getUserDetails(function (response: any) {
      if(response.status == 'SUCCESS') {
        console.log("SUCCESS", response);
        window.objUser.info  = response.data
        window.objUser.ssoid = response.data.ssoid;
      }else{
        console.log("failure")
      }

      const getUserDetailsStatus =  new Event(response.status == 'SUCCESS' ? "getUserDetailsSuccess" : "getUserDetailsFail");
      document.dispatchEvent(getUserDetailsStatus);
    });  
  }

  export const ssoLoginWidget = () => {
    const scriptElements = document.querySelectorAll('script[src*="/widget/main.bundle"]');
    const numberOfScripts = scriptElements.length;
    if(numberOfScripts == 0) {
      (function(w:any,s,el){
          var sc = document.createElement("script");
          w[el]= w[el] || function(){
              w[el]=w[el] || {};
              w[el].ev=w[el].ev || [];
              w[el].ev.push(arguments)
          }
          sc.type = "text/javascript";
          if(sessionStorage.getItem("openLogin_popup") == 'true') {
              //sc.onload = objUser.initSSOWidget();
              sessionStorage.removeItem("openLogin_popup");
          }
          sc.src = s;
          document.getElementsByTagName("head")[0].appendChild(sc);
      })(window, "https://jssocdnstg.indiatimes.com/crosswalk/156/widget/main.bundle.js","ssoWidget")
    }
  }

  export const ssoClose = () => {
    const ssoWidgetElement = document.getElementById('ssoLoginWrap');
    ssoWidgetElement?.classList.add('hide');
    const ssoLoginElm = document.getElementById('ssoLogin') as HTMLDivElement | null;;
    if(ssoLoginElm) ssoLoginElm.innerHTML = "";  
  }

  export const initSSOWidget = () => {
    console.log('Central SSO initSSOWidget');
    const ssoWidgetElement = document.getElementById('ssoLoginWrap');
    ssoWidgetElement?.classList.remove('hide');
    var centralSSOObj = {
        channelName: 'et',
        element: "ssoLogin",
        resendOtpTimer: 160,
        channelLogo: "https://economictimes.indiatimes.com/photo/103927173.cms",
        recaptcha: {
            required: false
        },
        closeIcon: !0,
        defaultSelected: !0,
        socialLoginRu: (window.location.protocol + '//' + window.location.host + '/login_code.html'),
        nonSocialLogin: {
            loginVia: ["email","mobile"],
            loginWith: ["Password", "otp"]
        },
        socialLogin: [
            {
                type:"Google",
                logoUrl:"",
                label:"",
                clientId: "936221589938.apps.googleusercontent.com"
          },
          {
                type:"Facebook",
                label:"",
                logoUrl:"",
                clientId:"424450167700259"
          },
          {
          type:"Apple",
          clientId:'com.economictimes.login'
        }
    ],
        gaChannelName: 'et',
        last_clicked_lob: 'ET',
        signInCallback: function(){
            verifyLogin();
            ssoClose();
        },
        signupForm:{
            defaultFirstName: "Guest",
            signUpFields: {
                "Email": {
                    placeholder: "enter email",
                    required: true
                },
                "MobileNumber": {
                    placeholder: "enter mobile number",
                    required: true
                },
                "firstName": {
                    placeholder: "enter first name",
                    required: true
                }
            },
            signupVia: ["Password"],
            MandatoryVerifyVia: ["email"],
        },
        termsConditionLink: '/terms-conditions',
        privacyPolicyLink: '/privacypolicy.cms',
        //defaultSelected:true,
        closeCallBack: function(){
            console.log('Central SSO closeCallBack');
            ssoClose();
        }
    };
    
    ssoWidget("init",centralSSOObj);
  }

  export const logout = () => {
    window?.jsso?.signOutUser(function (response: any) {
      if(response.status == 'SUCCESS') {
        window.location.reload();
      }else{
        console.log("failure")
      }
    });  
  }

  export const loadPrimeApi = async () => {
    try{
      const url = 'https://qa1-oauth.economictimes.indiatimes.com/oauth/api/merchant/ET/token?frm=pwa',
      oauthClientId = "w2a8e883ec676f417520f422068a4741",
      deviceId = getCookie("_grx"),
      ticketId = getCookie("TicketId"),
      userSsoId = window?.objUser?.ssoid || getCookie("ssoid");

      const body = JSON.stringify({grantType: 'refresh_token', "ticketId": ticketId, "deviceDetail": getMobileOS(), "allMerchant" : true});
      //const body = JSON.stringify({"pageno":1,"pagesize":15,"sort":[],"type":"STOCK","viewId":239,"deviceId":"web"})
      const headers = {          
        'Content-Type': "application/json;charset=UTF-8",
        'X-CLIENT-ID': oauthClientId,
        'X-DEVICE-ID': deviceId,
        'x-sso-id': userSsoId,
        'x-site-app-code': "c21b937c35b0d7cc7c6659d3b57e3d4a"
      }

      const response = await Service.post({ url, headers, payload: {}, body,  params: {} });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.json();
      // Handle the successful response data
      
    }catch(e){
      console.log("loadPrimeApi: "+ e);
    }
  }
