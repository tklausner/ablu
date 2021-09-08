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


class Title extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      st: 0,
    };
  }

  barBackground(id) {

    const base = "#C7DBF2";
    const not = "#F2C7C7";
    const uni = "#D2F2C7";
    const low = "#FFF4C7";

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

  switchState(arr) {
    return arr[this.state.st]
  }

  barContent(index) {
    switch (index) {
      case 0:
        return this.switchState(["A", "B", "L", "U"])
      case 1:
        return this.switchState(["B", "L", "U", "A"])
      case 2:
        return this.switchState(["L", "U", "A", "B"])
      case 3:
        return this.switchState(["U", "A", "B", "L"])
      default:
        console.log("ERROR");
        break;
    }
  }

  changeContent(e) {
    this.setState((state) => ({
      st: (state.st + 1) % 4
    }))
  }

  render() {

    const { classes } = this.props;

    return (
      <div className="divCol">
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" >
              {[0, 1, 2, 3].map((id) => (
                <Grid key={id} item>
                  <Button onClick={() => this.changeContent()}>
                    <Paper className={classes.paper} style={{ backgroundColor: this.barBackground(id) }}><p className="bar">{this.barContent(id)}</p></Paper>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Title);