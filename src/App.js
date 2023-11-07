import './App.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import * as React from 'react';

import FormsStart from './smart_bill_page/FormsStart'
import ListForms from './smart_bill_page/ListForms'
import FormUpdate from './smart_bill_page/FormUpdate'
import Esg from './smart_bill_page/Esg'
import Payment from './smart_bill_page/Payment'
import ListWithdraw from './smart_bill_page/ListWithdraw'
import Signin from './Sign-in'



function App() {
  const date_login = localStorage.getItem('date_login') ?? undefined;
  const d = new Date();
  const year = (d.getFullYear()).toString();
  const month = ((d.getMonth()) + 101).toString().slice(-2);
  const date = ((d.getDate()) + 100).toString().slice(-2);
  const hours = ((d.getHours()) + 100).toString().slice(-2);
  const mins = ((d.getMinutes()) + 100).toString().slice(-2);
  const seconds = ((d.getSeconds()) + 100).toString().slice(-2);
  const datenow = `${year + month + date + hours + mins + seconds}`
  const token = localStorage.getItem('token');
  const permission = JSON.parse(localStorage.getItem('permission_MenuID'));

  if (!token || !date_login || ((datenow - date_login) > 120000) || !permission) {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("permission");
    return <Signin />
  }
  else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FormsStart />} />
          <Route path="/FormUpdate" element={<FormUpdate />} />
          <Route path="/ListForms" element={<ListForms />} />
          <Route path="/Esg" element={<Esg />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/ListWithdraw" element={<ListWithdraw />} />
          <Route path="/Sign-In" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
