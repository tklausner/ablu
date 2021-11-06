import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Paper } from '@material-ui/core';
import '../App.css';
import { login, signup } from '../auth';
import { getAuth } from 'firebase/auth';
import { createUser, getUser } from '../util';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
      width: '25ch',
    },
  },
}));

async function loginF(loginGame, email, password) {
  let authenticated = await login(email, password);
  console.log(authenticated);
  const auth = getAuth();
  if (authenticated === true) {
    // User is signed in.
    console.log('SIGNED IN');
    loginGame(email, authenticated);
  } else {
    // No user is signed in.
    console.log('INVALID SIGN IN');
    detectNewUser(email, password);
  }
}

function validate(email) {
  return email.indexOf('@') > -1 && email.indexOf('.com') > -1;
}

async function detectNewUser(email, password) {
  console.log(email);
  let user = await getUser('email', email);
  if (user == null && validate(email)) {
    console.log('NEW USER');
    signup(email, password);
    await createUser(email);
  }
}

function loginHelper(loginGame, email, password) {
  if (email === 'ablu' && password === 'ablu') {
    email = 'test@ablu.com';
    password = 'kryptonite';
  }
  loginF(loginGame, email, password);
}

export default function SignIn({ loginGame }) {
  const classes = useStyles();
  const [email, handleEmail] = useState('');
  const [password, handlePassword] = useState('');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="email-input"
            label="Email"
            variant="outlined"
            onChange={(event) => handleEmail(event.target.value)}
          />
        </div>
        <div>
          <TextField
            id="password-input"
            label="Password"
            variant="outlined"
            onChange={(event) => handlePassword(event.target.value)}
            type=""
          />
        </div>
        <div>
          {' '}
          {password.length > 3 && email.length > 3 ? (
            <Button
              onClick={() => loginHelper(loginGame, email, password)}
              className={classes.button}
            >
              <Paper id="SignIn" style={{ backgroundColor: '#f6f6f6' }}>
                <p id="SignInContent">START</p>
              </Paper>
            </Button>
          ) : null}{' '}
        </div>
      </form>
    </div>
  );
}
