import Cookies from "js-cookie";
import React from "react";
import allHeadersReqJson from "./allHeadersReqJson";
interface EnumServiceGetOrderBy {
  email: string;
  password: string;
  Cookies: any;
}

const basedExternalPostUrlRequest = async (url: string) => {
  const headers = allHeadersReqJson()?.headers;

  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export default basedExternalPostUrlRequest;
