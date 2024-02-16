import { NextResponse } from "next/server";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "../../../utils/index";

const saveWatchlist = async (followData, _authorization) => {
  const API_URL = APIS_CONFIG?.WATCHLISTAPI?.multipleWatchList[APP_ENV];
  const apiRes = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: _authorization,
      "Content-Type": "application/json",
      mode: "cors",
    },
    body: JSON.stringify(followData),
  });
  const jsonResGetAPI = await apiRes.json();
  return jsonResGetAPI;
};

export const POST = async (req, res) => {
  try {
    const { followData, _authorization } = await req.json();
    const resData = await saveWatchlist(followData, _authorization);
    return NextResponse.json(
      {
        nextjsSuccess: "ok",
        nextJsResponse: resData,
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
