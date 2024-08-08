import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const pages = ['Smart-Car', 'Smart-Bill', 'ESG'];

const handleLogout = () => {
  swal("ออกจากระบบสำเร็จ", "คุณได้ออกจากระบบแล้ว", "success", {
    buttons: false,
    timer: 1500,
  })
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("data");
      localStorage.removeItem("permission_MenuID");
      window.location.href = '/Sign-In'
    });
};

function ResponsiveAppBar() {

  const data = JSON.parse(localStorage.getItem('data'));
  const [open, setOpen] = React.useState(false);
  const [alignment, setAlignment] = React.useState('คู่มือ Smart-Car');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment);
  };


  const handleRoutePage = (e) => {
    if (e.target.value === 'Smart-Car') {
      window.location.href = '/'
    } else if (e.target.value === 'ESG') {
      window.location.href = '/Esg'
    } else if (e.target.value === 'Smart-Bill') {
      window.location.href = '/Payment'
    }
  };

  const handleClickList = (e) => {
    if (window.location.pathname === '/' || window.location.pathname === '/FormUpdate') {
      window.location.href = '/ListForms'
    } else if (window.location.pathname === '/Payment') {
      window.location.href = '/ListWithdraw'
    }
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        position: 'relative',
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                value={page}
                onClick={handleRoutePage}
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={handleClickOpen}
              sx={{
                my: 2,
                color: 'inherit',
                display: 'block',
                fontFamily: 'monospace',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              คู่มือ
            </Button>
          </Box>
          <Tooltip
            title={
              window.location.pathname === '/' || window.location.pathname === '/FormUpdate' ? 'SMART-CAR LIST'
                : 'SMART-BILL LIST'
            }>
            <IconButton sx={{ mx: 10 }}>
              <ArticleIcon
                onClick={handleClickList}
                sx={{
                  fontSize: '1.5em !important',
                  color: 'inherit',
                  display: 'block',
                }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="ออกจากระบบ">
            <Button
              onClick={handleLogout}
              sx={{
                fontSize: '1.5em !important',
                color: 'inherit',
              }}
              endIcon={<LogoutIcon />}
            >
              <div size="large" aria-label="account of current user" aria-controls="menu-appbar" >
                <Typography variant="h6" component="React.Fragment" sx={{ flexGrow: 1 }} className='scaled-480px-Header' >
                  <b>{data.name}</b>
                </Typography>
              </div>
            </Button>
          </Tooltip>
        </Toolbar>
      </Container>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xl"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          คู่มือการใช้งาน
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton value="คู่มือ Smart-Car">คู่มือ Smart-Car</ToggleButton>
            <ToggleButton value="คู่มือ Smart-Bill">คู่มือ Smart-Bill</ToggleButton>
          </ToggleButtonGroup>
          <ReactPlayer
            url={
              alignment === 'คู่มือ Smart-Car' ?
                `https://www.youtube.com/watch?v=C2zu7LA_tjE` :
                `https://www.youtube.com/watch?v=DWBfKyUHVzg`
            }
            width="750px"
            height="430px"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="error">
            Exit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </AppBar>
  );
}
export default ResponsiveAppBar;
