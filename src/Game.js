import './App.css';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { createTiles, getUser, getTile, getTiles, updateTile, updatePlayer, getUsers, getGameState, updateGameState } from "./util"

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 55,
    width: 55,
  },
});


class Game extends React.Component {

  async componentDidMount() {

    // load map of tiles: id -> bids[]
    let tiles = await getTiles();

    // load bids from user by last name
    let { bids, balance, first, last } = await getUser("McCartney");

    // get game state
    let { pot, id, lub, memMap } = await getGameState("main");

    if (tiles.size === 0) {
      createTiles();
    }

    // get player list
    let playerList = await getUsers();

    // set local state
    this.setState(() => ({
      playerMap: bids,
      user: {
        first: first,
        last: last,
        balance: balance
      },
      players: playerList.length,
      pot: pot,
      gameState: id,
      wIndex: lub,
      memMap: memMap
    }))

    this.initBoard(tiles)
  }

  constructor(props) {
    super(props);
    this.state = {
      indices: [],
      board: new Map(),
      pot: 0,
      players: 1,
      id: -1,
      wIndex: -1,
      user: {
        first: "first",
        last: "last",
        balance: -1
      },
      infoMode: true,
      playerMap: new Map(),
      loading: true,
      gameState: "none",
      memMap: new Map()
    };
  }

  initBoard(tiles) {
    let indices = [...Array(100).keys()];
    let valMap = new Map();

    indices.forEach(e => {
      valMap.set(e, tiles.get(e).length);
    });
    this.setState(() => ({
      board: valMap,
      indices: indices,
      loading: false,
    }))
    this.greeting()
  }

  greeting() {
    console.log("Welcome " + this.state.user.first + " " + this.state.user.last + "!")
  }

  render() {

    const { classes } = this.props;

    return !this.state.loading ? (
      <div>
        <div className="divRow" >
          <Paper className={classes.paper} id="count"><p id="balContent">{this.state.players + " ppl"}</p></Paper>
          <Paper className={classes.paper} id="pot"><p id="balContent">{this.state.pot + "°"}</p></Paper>
          <Grid container className={classes.root} id="timer">
            <Grid item xs={10} >
              <Grid container justifyContent="center" spacing={2} >
                {[0, 1, 2, 3].map((id) => (
                  <Grid key={id} item>
                    <Paper className={classes.paper}> <p id="timerContent" className="bar">{this.timer(id)}</p></Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" >
              {this.state.indices.map((value) => (
                <Grid key={value} item>
                  <Button onClick={(e => {
                    this.squarePressed(value)
                  })}>
                    <Paper className={classes.paper} style={{ backgroundColor: this.tileBackground(value, this.state.board.get(value)) }} />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <div className="divCol">
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justifyContent="center" >
                {[0, 1, 2, 3].map((id) => (
                  <Grid key={id} item>
                    <Button onClick={(e => {
                      this.state.infoMode ? this.infoBarPressed(id) : this.buyBarPressed(id)
                    })}>
                      <Paper className={classes.paper} style={{ backgroundColor: this.barBackground(id) }}><p className="bar">{this.barContent(id)}</p></Paper>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          {!this.state.infoMode ? <Paper className={classes.paper} id="aux"><p id="balContent">{this.state.user.balance + "°"}</p></Paper> : null}
        </div>
      </div >
    ) : null;
  }

  timer(index) {
    return ""
  }

  switchState(arr) {
    if (this.state.playerMap[this.state.id]) {
      return this.state.id === this.state.wIndex ? arr[0] : this.state.board.get(this.state.id) === 1 ? arr[1] : arr[2];
    } else {
      return arr[3]
    }
  }

  barContent(index) {
    if (!this.state.infoMode) {
      switch (index) {
        case 0:
          return "" + this.state.id
        case 1:
          return this.switchState(["L", "U", "N", "Y"])
        case 2:
          return this.switchState(["O", "N", "O", "N"])
        case 3:
          return this.switchState(["W", "I", "T", "1°"])
        default:
          console.log("ERROR");
          break;
      }
    }
  }

  barBackground(id) {

    const base = "#C7DBF2";
    const not = "#F2C7C7";
    const uni = "#D2F2C7";
    const low = "#FFF4C7";

    if (this.state.infoMode) {
      switch (id) {
        case 0:
          return base;
        case 1:
          return not;
        case 2:
          return uni;
        case 3:
          return low;
        default:
          return "#000"
      }
    }
    return "#fcfcfc"
  }

  tileBackground(id, numBids) {

    const base = "#C7DBF2";
    const not = "#F2C7C7";
    const uni = "#D2F2C7";
    const low = "#FFF4C7";

    let highlight = "";

    if (this.state.id === id) {
      highlight = "59";
    }
    if (!this.state.playerMap[id]) {
      return base + highlight;
    }
    if (this.state.wIndex === id) {
      return low;
    }

    switch (numBids) {
      case 0:
        return base + highlight;
      case 1:
        return uni + highlight;
      default:
        return not + highlight;
    }
  }

  async buySquare(val) {
    let player_id = this.state.user.last;

    this.state.board.set(val, this.state.board.get(val) + 1)
    this.state.playerMap[val] = true

    let new_pot = this.state.pot + 1

    let wIndex = this.calcWindex(val)
    if (val === wIndex) {
      console.log("winning")
    }

    this.setState(() => ({
      pot: new_pot,
      wIndex: wIndex
    }))

    await updateTile(val, player_id);
    await updatePlayer(player_id, val);
    await updateGameState(this.state.gameState, new_pot, this.state.wIndex, val, this.state.memMap[val])
  }

  async squarePressed(val) {
    this.setState(() => ({
      infoMode: false,
      id: val
    }))
    let obj = await getTile(val);
    console.log("TILE:", obj)
  }

  infoBarPressed(index) {
    switch (index) {
      case 0:
        console.log("more info on base");
        break;
      case 1:
        console.log("more info on not");
        break;
      case 2:
        console.log("more info on uni");
        break;
      case 3:
        console.log("more info on low");
        break;
      default:
        console.log("ERROR");
        break;
    }
  }
  buyBarPressed(index) {
    this.setState(() => ({
      infoMode: true,
      id: -1,
    }))
    switch (index) {
      case 1:
        if (!this.state.playerMap[this.state.id] && this.state.user.balance > 0) {
          this.setState((state) => ({
            user: {
              balance: state.user.balance - 1,
              first: state.user.first,
              last: state.user.last
            }
          }))
          this.buySquare(this.state.id);
        }
        break;
      default:
        break;
    }
  }

  calcWindex(val) {
    let wIndex = -1;
    let map = this.state.memMap;
    if (map[val] === undefined || isNaN(map[val])) {
      map[val] = 0;
    } else {
      map[val] += 1;
    }
    let keys = Object.keys(map).sort((a, b) => + a - + b);

    let minVal = 9999;
    Object.values(map).forEach((e) => {
      if (e < minVal) {
        minVal = e;
      }
    });

    for (let i = 0; i < keys.length; i++) {
      if (map[keys[i]] === minVal) {
        wIndex = keys[i];
        break;
      }
    }

    this.setState(() => ({
      memMap: map
    }))

    let parsed = parseInt(wIndex, 10);
    return parsed;
  }
}

export default withStyles(styles, { withTheme: true })(Game);