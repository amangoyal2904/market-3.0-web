export const payWallMarketMood = [
  {
    key: "overview",
    heading: "",
    img: "/img/marketmood1.png",
    title:
      "Market Mood is a comprehensive tool to help you identify trend reversal & understand market sentiments better.",
    desc: "Join ETPrime & unlock complete access to Market Mood.",
    cta: "Subscribe Now",
  },
  {
    key: "periodic",
    heading: "Periodic High/Low",
    img: "/img/marketmood2.png",
    title:
      "Check the stocks reaching their all time highs & lows across indices & time frame",
    desc: "",
    cta: "Subscribe & Unlock Insights",
  },
  {
    key: "advanceDecline",
    heading: "Advance/Decline",
    img: "/img/marketmood3.png",
    title:
      "Track the no. of stocks closing above their previous day's close & no. of stocks closing below their previous low.",
    desc: "",
    cta: "Subscribe & Unlock Insights",
  },
];

export const tabData = [
  { label: "Overview", key: "overview" },
  { label: "Periodic High/Low", key: "periodic" },
  { label: "Advance/Decline", key: "advanceDecline" },
  { label: "FAQ", key: "faq" },
];

export const faqData = [
  {
    ques: "What is Market Mood?",
    ans: "Market Mood is a premium feature introduced by ETMarkets which gives an overall performance of the stocks in different indices over different time periods. It is segmented into three parts: 1) Overview 2) Periodic High/Low and 3) Advance/Decline",
  },
  {
    ques: "How to read the Overview tab of Market Mood?",
    ans: "If the count or percent is high, it is shaded in green, in yellow if it is neutral and in shades of red for a low count. Green shades indicate an uptrend, yellow shades indicate a neutral outlook and red shades indicate a downtrend. This gives the users an overall idea of the price trends in the market and where it is headed in the future. ",
  },
  {
    ques: "How to read the Periodic High/Low tab of Market Mood?",
    ans: "Periodic high/ low refers to the high and low reached in a given time period. Users can view the count of stocks that are trading near their periodic high or low for different time periods. When a security is trading at a value which is within 20% of its High-Low range, it qualifies to be shown in the Period High/Low Analysis. When the count of stocks trading near periodic high is increasing consistently, an uptrend in the market is indicated and when the percent or count of stocks trading near the periodic low is constantly increasing, a downtrend is indicated. Users can use this segment to see where the stocks lie relative to their periodic high/low values.",
  },
  {
    ques: "How to read the Advance/Decline Tab of Market Mood?",
    ans: "Advance refers to the number of stocks that have closed above their previous close and Decline refers to the number of stocks that have closed below their previous low. The bar chart shows the advance/decline for the selected index for different time periods. If advances are greater than declines consistently, an uptrend is indicated and if declines are greater than advances consistently, a downtrend is indicated. As the number of Advances increases, it indicates that stocks are performing better comparatively and an overall uptrend will come by.",
  },
  {
    ques: "How will it help you in your investment Journey?",
    ans: "This feature aims to provide users information about market trends in a very comprehensive manner. An overall look at any of the segments will help users form an opinion on market trends. Equity Research will become more efficient and faster if users use this feature efficiently",
  },
];

export const durationOptions = [
  { label: "1M", value: "1M", id: 1 },
  { label: "3M", value: "3M", id: 2 },
  { label: "6M", value: "6M", id: 3 },
  { label: "1Y", value: "1Y", id: 4 },
];

export const countPercentageOptions = [
  { label: "Count", value: "count", id: 1 },
  { label: "Percentage", value: "percentage", id: 2 },
];

export const monthlyDailyOptions = [
  { label: "Daily", value: "daily", id: 1 },
  { label: "Monthly", value: "monthly", id: 2 },
];
