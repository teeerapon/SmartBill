import './App.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';

import FormsStart from './smart_bill_page/FormsStart'
import ListForms from './smart_bill_page/ListForms'
import FormUpdate from './smart_bill_page/FormUpdate'
import Esg from './smart_bill_page/Esg'
import Payment from './smart_bill_page/Payment'
import ListWithdraw from './smart_bill_page/ListWithdraw'

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormsStart />} />
        <Route path="/FormUpdate" element={<FormUpdate />} />
        <Route path="/ListForms" element={<ListForms />} />
        <Route path="/Esg" element={<Esg />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/ListWithdraw" element={<ListWithdraw />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
