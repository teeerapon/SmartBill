import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import swal from 'sweetalert';
import config from './config'
import Axios from "axios";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

// เพื่อใช้ทดสอบ
async function loginUser(credentials) {
  return fetch(config.http + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

async function permission(credentials) {
  return fetch(config.http + '/permission_branch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function SignInSide() {

  const d = new Date();
  const year = (d.getFullYear()).toString();
  const month = ((d.getMonth()) + 101).toString().slice(-2);
  const date = ((d.getDate()) + 100).toString().slice(-2);
  const hours = ((d.getHours()) + 100).toString().slice(-2);
  const mins = ((d.getMinutes()) + 100).toString().slice(-2);
  const seconds = ((d.getSeconds()) + 100).toString().slice(-2);
  const datenow = `${year + month + date + hours + mins + seconds}`

  const [UserCode, setUserCode] = React.useState();
  const [Password, setPassword] = React.useState();
  const URL_LINK = window.location.href
  const pathname = window.location.pathname

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await loginUser({
      UserCode,
      Password
    });
    const body = { Permission_TypeID: 1, userID: response['data'][0].userid }
    await Axios.post(config.http + '/select_Permission_Menu_NAC', body, config.headers)
      .then(response => {
        localStorage.setItem('permission_MenuID', JSON.stringify(response.data.data.map((res) => res.Permission_MenuID)));
      });
    if (UserCode == null || Password == null) {
      swal("แจ้งเตือน", 'กรุณากรอกข้อมูลเพื่อล็อคอินเข้าสู่ระบบ', "error");
    } else {
      if ('token' in response) {
        swal("แจ้งเตือน", 'คุณได้เข้าสู่กระบบแล้ว', "success", {
          buttons: false,
          timer: 1500,
        }).then(async (value) => {
          if (pathname === '/Sign-In') {
            localStorage.setItem('token', response['token']);
            localStorage.setItem('data', JSON.stringify(response['data'][0]));
            localStorage.setItem('date_login', datenow);
            window.location.href = '/';
          } else {
            localStorage.setItem('token', response['token']);
            localStorage.setItem('data', JSON.stringify(response['data'][0]));
            localStorage.setItem('date_login', datenow);
            window.location = URL_LINK;
          }
        });
      } else {
        swal("แจ้งเตือน", 'UserCode หรือ Password ไม่ถูกต้อง', "error");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://images.pexels.com/photos/1173770/pexels-photo-1173770.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="UserCode"
                name="UserCode"
                onChange={(e) => setUserCode(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                เข้าสู่ระบบ
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}