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

const pages = ['Smart-Car', 'Smart-Bill', 'ESG'];

const handleLogout = () => {
  swal("ออกจากระบบสำเร็จ", "คุณได้ออกจากระบบแล้ว", "success", {
    buttons: false,
    timer: 1500,
  })
    .then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("data");
      window.location.href = '/Sign-In'
    });
};

function ResponsiveAppBar() {

  const data = JSON.parse(localStorage.getItem('data'));


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
    </AppBar>
  );
}
export default ResponsiveAppBar;
