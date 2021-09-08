import React from 'react'
import './App.css';
import Timer from "./Timer"

function convertTime(start) {
  let current_time = new Date().getTime() / 1000;
  let time_until_end = Math.floor(start - current_time);
  return {
    hours: Math.floor(time_until_end / 60 / 60),
    minutes: Math.floor(time_until_end / 60 % 60),
    seconds: Math.floor(time_until_end % 60 % 60)
  }
}

const WaitingRoom = ({ startTime }) => {

  let hoursMinSecs = convertTime(startTime);


  return hoursMinSecs.hours > 0 ? (
    <div style={{ marginLeft: "22%", marginTop: "14%" }}>
      <Timer hoursMinSecs={hoursMinSecs}></Timer>
      <p id="SignInContent" style={{ marginLeft: "-28%", marginTop: "1%", fontSize: "18px" }} >waiting for game to start</p>
    </div>
  ) : null;
}

export default WaitingRoom;