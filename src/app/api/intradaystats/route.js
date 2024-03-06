import { NextResponse } from "next/server";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "../../../utils/index";

const tableDataGet = async (bodyParams, _authorization) => {
  const API_URL = APIS_CONFIG?.marketstatsIntraday[APP_ENV];
  const apiRes = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: _authorization,
      "Content-Type": "application/json",
      mode: "cors",
    },
    body: JSON.stringify(bodyParams),
  });
  const jsonResGetAPI = await apiRes.json();
  return jsonResGetAPI;
};

export const POST = async (req, res) => {
  try {
    const { bodyParams, _authorization } = await req.json();
    //console.log('bodyParams', bodyParams);
    const resNextJsData = await tableDataGet(bodyParams, _authorization);
    return NextResponse.json(
      {
        nextjsSuccess: "ok",
        resNextJsData,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error",
        error,
      },
      {
        status: 500,
      },
    );
  }
};
