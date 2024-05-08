"use client";

declare global {
    interface Window {
        googletag:any;
        arrDfpAds:{}[];
    }
  }

  const getDFPData = async function(){
    try{
        let dfp;
        let pathName = location.pathname;
        if(pathName.indexOf("/home") > -1){
            dfp= await import('./AdInfo/homeAds.json');
         }
        return dfp;
    }catch(e){
        console.log("returnJSONUrl:"+e);
    }
  }
  const callDfpAd = async function(){
    try{
         let dfp :any;
         let divIds:any;
         divIds = [];
         //dfp = getDFPData();
         let pathName = location.pathname;
         if(pathName.indexOf("/home") > -1){
            dfp= await import('./AdInfo/homeAds.json');
         }else{
            dfp= await import('./AdInfo/marketstatsAds.json');
         }
       // console.log("Helloooooooooooo", dfp);
        let googleTag :any
            googleTag = window.googletag || {}
        googleTag.destroySlots()
        let dfpData = dfp.dfp;
        //dfp.forEach(function (data:any, index) {
            // Object.keys(dfpData).forEach((key:string)=>{
            //     console.log(dfpData[key]);
            //     });
        if(dfpData && Object.keys(dfpData).length > 0){    
            Object.keys(dfpData).forEach((key:string)=>{
                console.log("----------INDISE FOREACH__________");
                console.log(dfpData[key]);
            let adSlot = dfpData[key].slot ?  dfpData[key].slot  : "";
            let adSize =  dfpData[key].size  ? dfpData[key].size : "";
            let divId = dfpData[key].id ? dfpData[key].id : "";
            divIds && divIds.push(divId);
            let ad_ref ='';
            if (!(adSlot.match(/^7176/)) && !(adSlot.match(/^\/7176/))) {
            adSlot = "/7176/Economictimes/" + adSlot;
            }
            adSize = adSize && (typeof adSize == "string" ? JSON.parse(adSize) : adSize);
            adSize.push("fluid");
            if(adSlot!="" && adSize!="" && divId!="" ){
            if(typeof googleTag !="undefined" && googleTag.apiReady){
                googleTag.cmd.push(function() {
                ad_ref = googleTag.defineSlot(adSlot, adSize, divId).addService(googleTag.pubads());
                googleTag.pubads().enableSingleRequest();  
                googleTag.enableServices();       

                });  
            }
            }

            });
            if(divIds && divIds.length > 0){
                divIds.forEach(function (element:any) {
                    let ele = document.getElementById(element);
                    if(ele){ 
                        googleTag.cmd.push(function() {
                            googleTag.display(element); 
                        });
                    }else{
                        setTimeout(() => {
                          let ele = document.getElementById(element);
                            if(ele){
                                    googleTag.cmd.push(function() {
                                        googleTag.display(element); 
                                    });
                                }
                          }, 2000);
                    }
                  }); 

            }
            console.log("DIV-------------", divIds)
        }
        window.arrDfpAds=[];
    }catch(e){
        console.log("callDfpAd:"+e);
    }

}  
const renderDfpAds = (userType=true) => {
  try{
        if(!userType){
            let googleTag :any
            let maxTry = 5;
            let counter = 1; 
            googleTag = window.googletag || {}
            console.log("userType", userType);
            console.log(window.googletag)
            let ref_interval = setInterval(() => {
                if (googleTag.apiReady){
                    callDfpAd(); 
                    clearInterval(ref_interval);
                }
                counter++;
            }, 500);
            if(counter >= maxTry){
                clearInterval(ref_interval);
            }


        }
    }catch(e){
        console.log("callDfpAd:"+e);

    }
  
};

export default renderDfpAds;