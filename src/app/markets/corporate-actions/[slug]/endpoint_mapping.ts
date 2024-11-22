export const ENDPOINT_MAPPING = {
  dividend: {
    ep: "CORPORATE_ACTIONS_DIVIDEND",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      {
        keyText: "Announced on",
        keyId: "announcementDateLong",
        sort: true,
        type: "date",
      },
      { keyText: "Type", keyId: "dividendType" },
      { keyText: "Dividend %", keyId: "percent" },
      { keyText: "Div./Share", keyId: "value" },
      { keyText: "Ex-Dividend", keyId: "xdDateLong", sort: true, type: "date" },
    ],
  },
  bonus: {
    ep: "CORPORATE_ACTIONS_BONUS",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      {
        keyText: "Announced on",
        keyId: "dateOfAnnouncementLong",
        sort: true,
        type: "date",
      },
      { keyText: "Record", keyId: "recordDateLong", type: "date" },
      { keyText: "Ratio", keyId: "ratio" },
      { keyText: "Ex-Bonus", keyId: "xbDateLong", sort: true, type: "date" },
    ],
  },
  "board-meetings": {
    ep: "CORPORATE_ACTIONS_BOARDMEETINGS",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Agenda", keyId: "purpose", sort: true },
      { keyText: "Meeting On", keyId: "meetingDateLong", type: "date" },
    ],
  },
  "agm-egm": {
    ep: "CORPORATE_ACTIONS_AGMEGM",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Meeting On", keyId: "dateLong", sort: true, type: "date" },
      { keyText: "Purpose", keyId: "purpose" },
    ],
  },
  splits: {
    ep: "CORPORATE_ACTIONS_SPLITS",
    headers: [
      { keyText: "Stock Name", keyId: "companyName", watchlist: true },
      { keyText: "Old FV", keyId: "oldFaceValue" },
      { keyText: "New FV", keyId: "newFaceValue" },
      {
        keyText: "Ex-Split",
        keyId: "xsDateLong",
        sort: true,
        type: "date",
      },
    ],
  },
  rights: {
    ep: "CORPORATE_ACTIONS_RIGHTS",
    headers: [
      {
        keyText: "Stock Name",
        keyId: "companyName",
        watchlist: true,
        width: "400px",
      },
      { keyText: "Ratio", keyId: "ratio" },
      { keyText: "FV", keyId: "faceValueOfferedInstrument" },
      { keyText: "Premium", keyId: "rightsPremium" },
      {
        keyText: "Announced on",
        keyId: "dateOfAnnouncementLong",
        sort: true,
        type: "date",
      },
      { keyText: "Record", keyId: "recordDateLong", type: "date" },
      {
        keyText: "Ex-Rights",
        keyId: "xrDateLong",
        sort: true,
        type: "date",
      },
    ],
  },
};
