import { NextResponse } from "next/server";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "../../../utils/index";

const marketlivedata = async (data) => {
  const jsonStartIndex = await data.indexOf("[");
  const jsonEndIndex = await data.lastIndexOf("]");
  const jsonString = await data.substring(jsonStartIndex, jsonEndIndex + 1);
  return JSON.parse(jsonString);
};

const getBselivefeeds = async () => {
  const API_URL = APIS_CONFIG?.LIVE_MARKET_DATA[APP_ENV];

  const res = await fetch(`${API_URL}`);
  const resData = await res.text();
  //return await marketlivedata(resData);
  return resData;
};
export const GET = async (req, res) => {
  try {
    const resData = await getBselivefeeds();
    return NextResponse.json(
      {
        message: "ok",
        resData,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "error bselivefeeds",
      },
      {
        status: 500,
      },
    );
  }
};
