import Cookies from "js-cookie";

const allHeadersReqJson = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  let aflId = Cookies.get("aflId");
  const UserCookie = Cookies.get("user");
  headers.append("Authorization", "Bearer " + aflId);
  headers.append("UserToken", "Bearer " + UserCookie);
  return { headers: headers };
};

export default allHeadersReqJson;
