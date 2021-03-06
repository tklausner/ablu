import React from 'react';
import '../App.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { updateGame } from '../util';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 55,
    width: 55,
  },
}));

const Timer = React.memo(({ hoursMinSecs }) => {
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = React.useState([
    hours,
    minutes,
    seconds,
  ]);
  const classes = useStyles();

  const tick = async () => {
    if (hrs <= 0 && mins <= 0 && secs <= 0)
      await updateGame('main', 'active', false);
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
        return hrs < 10 ? '0' + hrs : hrs;
      case 1:
        return 'h';
      case 2:
        return mins < 10 ? '0' + mins : mins;
      case 3:
        return 'm';
      case 4:
        return secs < 10 ? '0' + secs : secs;
      case 5:
        return 's';
      default:
        break;
    }
  };

  const reset = () =>
    setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

  React.useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <Grid container id="timer">
      <Grid item xs={10}>
        <Grid container justifyContent="center" spacing={2}>
          {[0, 1, 2, 3, 4, 5].map((id) => (
            <Grid key={id} item>
              <Paper className={classes.paper}>
                <p id="balContent" style={{ lineHeight: '1.5em' }}>
                  {genContent(id)}
                </p>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
});

export default Timer;
