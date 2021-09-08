import './App.css';
import React, { useState } from 'react';
import Game from "./Game.js"
import { getUser, getGameState } from "./util"
import Title from "./Title.js";
import SignIn from "./SignIn.js";
import WaitingRoom from './WaitingRoom'


function App() {

  const [user_info, set_user] = useState(null);
  const [gameDidStart, start_game] = useState(false);
  const [waitingRoom, join_waiting_room] = useState(false);
  const [startingTime, set_time] = useState(0);

  const joinWaitingRoom = async (startTime) => {
    let current_time = new Date().getTime() / 1000;
    return startTime.seconds - current_time > 0;
  }

  const loginGame = async (email, authenticated) => {
    try {
      let user = await getUser("email", email);
      if (authenticated && user != null) {

        set_user(user)
        start_game(true);

        let { startTime } = await getGameState("main");
        if (joinWaitingRoom(startTime)) {
          console.log("JOINING WAITING ROOM", user);
          join_waiting_room(false);
          set_time(startTime.seconds);
        }
        console.log("STARTING GAME", user);
      } else {
        console.log("FAILED TO START GAME")
      }
    } catch {
      console.log("FAILED TO START GAME")
    }
  }

  return gameDidStart ? (
    <div className="App" >
      <div style={{ marginTop: '1%', marginBottom: '3%' }}>
        <Title user={user_info} />
      </div>
      {!waitingRoom ? <Game user={user_info} /> : <WaitingRoom startTime={startingTime} ></WaitingRoom>
      }
    </div >
  ) : (
      <div className="App">
        <div style={{ marginTop: '15%' }}>
          <Title />
        </div>
        <SignIn loginGame={loginGame} />
      </div>
    );
}

export default App;
