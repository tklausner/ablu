import './App.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 55,
    width: 55,
  },

}));

// Winning Square
let wIndex = 0;


function App() {

  const [spacing] = React.useState(2);
  const classes = useStyles();

  // Create Square IDS
  const vals = [...Array(100).keys()];

  // Create map of Squares to Number Bid
  let valMap = new Map();
  vals.forEach(e => {
    valMap[e] = 0;
  });



  return (
    <div className="App">
      <header className="App-header">
        <h1>ABLU</h1>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={spacing}>
              {vals.map((value) => (
                <Grid key={value} item>
                  <Button onClick={(a => {
                    squarePressed(valMap, value);
                  })}>
                    <Paper className={classes.paper} />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

function squarePressed(map, val) {
  if (val === wIndex) {
    console.log("winning")
  }
  map[val] += 1;
  console.log(val, map[val])
}

function calcWindex(map) {
  let min = 999;
  map.forEach(v, k => {
    if (v < min) {
      min = v;
    }
  })
  return min;
}

export default App;
