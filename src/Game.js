import './App.css';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { createTiles, getUsers, getTile, getTiles, updateTile } from "./util"

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
    let tiles = await getTiles();
    console.log(tiles.length);
    if (tiles.length < 100) {
      // createTiles();
    }
    this.setState({
      tiles: tiles
    })
    this.initBoard()
  }

  constructor(props) {
    super(props);
    this.state = {
      indices: [],
      board: new Map(),
      pot: 0,
      players: 1,
      id: -1,
      wIndex: 0,
      balance: 10,
      infoMode: true,
      playerMap: new Map(),
      tiles: []
    };
  }

  initBoard() {
    let indices = [...Array(100).keys()];
    let valMap = new Map();

    indices.forEach(e => {
      valMap[e] = this.state.tiles[e].bids.length;
    });
    this.setState({
      board: valMap,
      indices: indices
    })
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <div class="divRow">
          <Paper className={classes.paper} id="count"><p id="balContent">{this.state.players + " ppl"}</p></Paper>
          <Paper className={classes.paper} id="pot"><p id="balContent">{this.state.pot + "°"}</p></Paper>
          <Grid container className={classes.root} id="timer">
            <Grid item xs={10} >
              <Grid container justifyContent="center" spacing={2} >
                {[0, 1, 2, 3].map((id) => (
                  <Grid key={id} item>
                    <Paper className={classes.paper}> <p id="timerContent" class="bar">{this.timer(id)}</p></Paper>
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
                    <Paper className={classes.paper} style={{ backgroundColor: this.background(value, this.state.board[value]) }} />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <div class="divCol">
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container justifyContent="center" >
                {[0, 1, 2, 3].map((id) => (
                  <Grid key={id} item>
                    <Button onClick={(e => {
                      this.state.infoMode ? this.infoBarPressed(id) : this.buyBarPressed(id)
                    })}>
                      <Paper className={classes.paper} style={{ backgroundColor: this.barBackground(id) }}><p class="bar">{this.barContent(id)}</p></Paper>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          {!this.state.infoMode ? <Paper className={classes.paper} id="aux"><p id="balContent">{this.state.balance + "°"}</p></Paper> : null}
        </div>
      </div >
    );
  }

  timer(index) {
    return ""
    switch (index) {
      case 0:
        return "1"
      case 1:
        return "35"
      case 2:
        return "20"
      case 3:
        return "X"
      default:
        console.log("ERROR");
        break;
    }
  }

  switchState(arr) {
    if (this.state.playerMap[this.state.id]) {
      return this.state.id === this.state.wIndex ? arr[0] : this.state.board[this.state.id] === 1 ? arr[1] : arr[2];
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

  background(id, numBids) {

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

  buySquare(val) {
    this.calcWindex(val)
    if (val === this.state.wIndex) {
      console.log("winning")
    }
    this.state.board[val] += 1;
    this.state.playerMap[val] = true

    this.setState({
      pot: this.state.pot + 1
    })

    updateTile(val, "person")

  }

  squarePressed(val) {
    this.setState({
      infoMode: false,
      id: val
    })
    getTile(val)
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
    this.setState({
      infoMode: true,
      id: -1,
    })
    switch (index) {
      case 1:
        if (this.state.balance > 0) {
          this.setState({
            balance: this.state.balance - 1
          })
          this.buySquare(this.state.id);
        }
        break;
      default:
        break;
    }
  }

  calcWindex(val) {
    if (val < this.state.wIndex && this.state.board[val] <= this.state.board[this.state.wIndex]) {
      this.setState({
        wIndex: val
      })
    }

  }
}

export default withStyles(styles, { withTheme: true })(Game);