import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import IconButton from '@mui/material/IconButton';

const pages = ['Smart-Car', 'Smart-Bill', 'ESG'];

function ResponsiveAppBar() {


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
          <IconButton>
            <ArticleIcon
              onClick={handleClickList}
              sx={{
                fontSize: '1.5em !important',
                color: 'inherit',
                display: 'block',
              }} />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
