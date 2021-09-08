import React from 'react'
import '../App.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 55,
    width: 55,
  },
}));


const Timer = ({ hoursMinSecs }) => {

  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = React.useState([hours, minutes, seconds]);
  const classes = useStyles();


  const tick = () => {

    if (hrs <= 0 && mins <= 0 && secs <= 0)
      reset()
    else if (mins <= 0 && secs <= 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs <= 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  const genContent = (id) => {
    switch (id) {
      case 0:
        return hrs;
      case 1:
        return "::";
      case 2:
        return mins;
      case 3:
        return secs;
      default:
        break;
    }
  }


  const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);


  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });


  return (
    <Grid container id="timer">
      <Grid item xs={10} >
        <Grid container justifyContent="center" spacing={2} >
          {[0, 1, 2, 3].map((id) => (
            <Grid key={id} item>
              <Paper className={classes.paper}>
                <p id="balContent" style={{ lineHeight: "1.5em" }}>{genContent(id)}</p>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Timer;