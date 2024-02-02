
declare var ssoWidget: any;

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

  export const verifyLogin = () => {
    window?.jsso?.getValidLoggedInUser(function (response: any) {
      if(response.status == 'SUCCESS') {
        console.log("SUCCESS");
        const verifyLoginSuccess = new Event("verifyLoginSuccess");
        document.dispatchEvent(verifyLoginSuccess);
        setUserData();
      }else{
        console.log("failure")
        ssoLoginWidget();
      }
    });
  }

  export const setUserData = () => {
    window?.jsso?.getUserDetails(function (response: any) {
      if(response.status == 'SUCCESS') {
        console.log("SUCCESS", response);
        window.objUser = response.data;

        const getUserDetailsSuccess = new Event("getUserDetailsSuccess");
        document.dispatchEvent(getUserDetailsSuccess);
      }else{
        console.log("failure")
      }
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
        socialLoginRu: (window.location.protocol + '//' + window.location.host + '/login_code.cms'),
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
            setTimeout(function(){
              window.location.reload();
            },100);
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
            ssoWidgetElement?.classList.add('hide');
            const ssoLoginElm = document.getElementById('ssoLogin') as HTMLDivElement | null;;
            if(ssoLoginElm) ssoLoginElm.innerHTML = "";
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

export const formatDate = (str:string) => {   
    // Parse the original date string
    var originalDate = new Date(str);
    // Get the components of the original date
    var originalDay = originalDate.getDate();
    var originalMonth = originalDate.toLocaleString('default', { month: 'short' });
    var originalYear = originalDate.getFullYear();
    var originalHour = originalDate.getHours();
    var originalMinute = originalDate.getMinutes();

    // Format the date in the desired format (04:02 PM | 30 Jan 2024)
    var formattedDate = ("0" + originalDay).slice(-2) + " " + originalMonth + " " + originalYear;
    var formattedTime = ((originalHour + 11) % 12 + 1) + ":" + ("0" + originalMinute).slice(-2) + " " + (originalHour >= 12 ? 'PM' : 'AM');

    // Output the formatted date and time
    //console.log(formattedTime + " | " + formattedDate);
    return formattedTime + " | " + formattedDate;
}

export const filterData = (arr:any,test:string) =>{
  const filtered = arr.filter((item:any) => item.entityType.toLowerCase() === test.toLowerCase());
  return filtered;
}
export const makeBold = (inputText:string, completeText:string) => {   
  const matchtext=new RegExp(inputText, "i");
  if (completeText.toLowerCase().indexOf(inputText.toLowerCase()) >= 0){
    const matched = completeText.substr(completeText.search(matchtext),inputText.length);
    return completeText.replace(matchtext,"<b>" + matched + "</b>");
  }
  else{
    return completeText;
  }
}
