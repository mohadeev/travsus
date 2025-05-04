import React from "react";

const VideoTimeReaderChanging = (Time: Number) => {
  const VideoDuration = `${Time}`;
  const sec = parseInt(VideoDuration, 10);
  var hours = Math.floor((sec % 86400) / 3600);
  var minutes = Math.floor((sec % 3600) / 60);
  var seconds = Math.floor(sec % 60);
  let secc = "";
  if (seconds > 9) {
    secc = "" + seconds;
  } else {
    secc = "0" + seconds;
  }
  return `${minutes}:${secc}`;
};

export default VideoTimeReaderChanging;
