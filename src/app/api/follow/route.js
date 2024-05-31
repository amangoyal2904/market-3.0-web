import { NextResponse } from "next/server";
import APIS_CONFIG from "../../../network/api_config.json";
import { APP_ENV } from "../../../utils/index";

const saveWatchlist = async (followData, _authorization) => {
  const API_URL = APIS_CONFIG?.WATCHLISTAPI?.addWatchList[APP_ENV];
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

const getAllWatchList = async (_authorization, type, usersettingsubType) => {
  const API_URL = APIS_CONFIG?.WATCHLISTAPI?.getAllWatchlist[APP_ENV];
  const headers = new Headers();
  headers.append("Authorization", _authorization);
  const res = await fetch(
    `${API_URL}?stype=${type}&usersettingsubType=${usersettingsubType}`,
    {
      cache: "no-store",
      headers: headers,
    },
  );
  const resData = await res.json();
  return resData;
};
export const GET = async (req, res) => {
  try {
    var urlObj = new URL(req.url);
    var params = new URLSearchParams(urlObj.search);
    var authorization = params.get("authorization");
    var type = params.get("type");
    var usersettingsubType = params.get("usersettingsubType");
    const resData = await getAllWatchList(
      authorization,
      type,
      usersettingsubType,
    );
    return NextResponse.json(
      {
        message: "ok",
        postData: {
          authorization,
          type,
          usersettingsubType,
        },
        resData: resData,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "Error sss",
      },
      {
        status: 500,
      },
    );
  }
};

export const POST = async (req, res) => {
  try {
    const { followData, _authorization } = await req.json();
    const resData = await saveWatchlist(followData, _authorization);
    //console.log('resData', resData);
    return NextResponse.json(
      {
        nextjsSuccess: "ok",
        ...resData,
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
