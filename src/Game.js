import './App.css';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

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

  constructor(props) {
    super(props);

    // Create Square IDS
    let vals = [...Array(100).keys()];

    // Create map of Squares to Number Bid
    let valMap = new Map();
    vals.forEach(e => {
      valMap[e] = 0;
    });

    this.state = {
      vals: vals,
      board: valMap,
      wIndex: 1000,
      balance: 100,
      infoMode: true,
    };
  }
  render() {

    const { classes } = this.props;

    return (
      <div>
        <h3>{this.state.balance}</h3>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" >
              {this.state.vals.map((value) => (
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
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={4}>
            <Grid container justifyContent="center" >
              {[0, 1, 2, 3].map((id) => (
                <Grid key={id} item>
                  <Button onClick={(e => {
                    this.barPressed(id)
                  })}>
                    <Paper className={classes.paper} style={{ backgroundColor: this.barBackground(id) }} />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
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
  }

  background(id, numBids) {

    const base = "#C7DBF2";
    const not = "#F2C7C7";
    const uni = "#D2F2C7";
    const low = "#FFF4C7";

    if (this.state.wIndex === id) {
      return low;
    }

    switch (numBids) {
      case 0:
        return base;
      case 1:
        return uni;
      default:
        return not;
    }
  }

  buySquare(val) {
    this.calcWindex(val)
    if (val === this.state.wIndex) {
      console.log("winning")
    }
    this.state.board[val] += 1;

    console.log(val, this.state.board[val])

    this.setState(
      {},
    )
  }

  squarePressed(val) {
    //alert("Are you sure you want to buy this?")
    this.setState({
      infoMode: false
    })
    if (this.state.balance > 0) {
      this.setState({
        balance: this.state.balance - 20
      })
      this.buySquare(val);
    }
  }

  barPressed(id) {

    switch (id) {
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

  calcWindex(val) {
    if (val < this.state.wIndex) {
      this.setState({
        wIndex: val
      })
    }

  }
}

export default withStyles(styles, { withTheme: true })(Game);