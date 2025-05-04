import React from "react";

const VideoTimeReader = (Time: Number) => {
  const VideoDuration = `${Time}`;
  const sec = parseInt(VideoDuration, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  let Hhours = "";
  let MMinutes = "";
  let SSeconds = "";
  let Total = "00:00";
  if (hours < 10) {
    Hhours = "0" + hours;
  } else {
    Hhours = "" + hours;
  }
  if (minutes < 10) {
    MMinutes = "0" + minutes;
  } else {
    MMinutes = "" + minutes;
  }
  if (seconds < 10) {
    SSeconds = "0" + seconds;
  } else {
    SSeconds = "" + seconds;
  }
  if (hours >= 1) {
    Total = `${Hhours + ":" + MMinutes + ":" + SSeconds}`;
    // setDuration(`${Hhours + ":" + MMinutes + ":" + SSeconds}`);
  }
  if (hours < 1 && minutes > 1) {
    Total = `${MMinutes + ":" + SSeconds}`;
  }
  if (hours < 1 && minutes < 1 && seconds >= 1) {
    Total = `${"00:" + SSeconds}`;
  }
  return Total;
};

export default VideoTimeReader;
