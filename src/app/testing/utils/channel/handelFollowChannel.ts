import React from "react";
import basedPostUrlRequestLogedIn from "../basedPostUrlRequestLogedIn";

const HandelFollow = async (
  channelData: any,
  IsFollowed: any,
  userId: any,
  firstFunC: any,
  lastFunc: any
) => {
  if (userId) {
    firstFunC();
    const body: any = {
      channelId: channelData._id,
      isFollowing: !IsFollowed,
    };
    await basedPostUrlRequestLogedIn(
      "/api/post/channel/follow-channel",
      body
    ).then((responseData) => {
      if (responseData) {
        return { succes: true, responseData };
      } else {
        return { succes: false, responseData };
      }
    });
  } else {
    lastFunc();
  }
};
