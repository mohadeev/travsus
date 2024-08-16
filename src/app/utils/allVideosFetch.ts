import basedGetUrlRequest from "./basedGetUrlRequest";

const allVideosFetch = async (Length: any) => {
  console.log(Length);
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const category = params.get("category");
  if (category && category.length) {
    const queryString = new URLSearchParams({
      category: category,
      length: Length,
    }).toString();
    // alert(queryString);
    if (Length) {
      try {
        return await basedGetUrlRequest(
          "/api/get/video/display/display?" + queryString,
          false
        );
      } catch (err) {}
    } else {
      try {
        return await basedGetUrlRequest(
          "/api/get/video/display/display?" + queryString,
          false
        );
      } catch (err) {}
    }
  } else {
    if (Length) {
      try {
        return await basedGetUrlRequest(
          "/api/get/video/display/" + Length,
          false
        );
      } catch (err) {}
    } else {
      try {
        return await basedGetUrlRequest(
          "/api/get/video/display/display?length=" + 0,
          false
        );
      } catch (err) {}
    }
  }
};

export default allVideosFetch;
