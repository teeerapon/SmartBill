import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import FormsStart from './smart_bill_page/FormsStart'
import ListForms from './smart_bill_page/ListForms'
import FormUpdate from './smart_bill_page/FormUpdate'
import Esg from './smart_bill_page/Esg'
import Payment from './smart_bill_page/Payment'
import ListWithdraw from './smart_bill_page/ListWithdraw'
import Signin from './Sign-in'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));



function App() {

  const [showPopupOnce, setShowPopupOnce] = React.useState(false);
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

  React.useEffect(() => {
    const popupShownOnce = localStorage.getItem('popupShownOnce');
    if (!popupShownOnce) {
      setShowPopupOnce(true);
    }
  }, []);

  const handleClosePopupOnce = () => {
    setShowPopupOnce(false);
    localStorage.setItem('popupShownOnce', 'true');
  };

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
        <BootstrapDialog onClose={handleClosePopupOnce} open={showPopupOnce} aria-labelledby="customized-dialog-title">
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
              แจ้งเตือนการผู้ใช้งานระบบ Smart Car และ Smart Bill ทุกท่าน
            </Typography>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClosePopupOnce}
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
            <Typography gutterBottom>
              ยินดีต้อนรับทุกท่านเข้าสู่ระบบ Smart Car และ Smart Bill ฉบับใหม่ วันที่ 08/08/2024
            </Typography>
            <Typography gutterBottom>
              ระบบใหม่นี้ได้ปรับเปลี่ยนส่วนต่าง ๆ ให้ใช้งานง่ายมากยิ่งขึ้น ดังนี้ <br />
            </Typography>
            <Typography gutterBottom>
              <br />
              1. Smart Car เพิ่มส่วนที่ผู้ใช้งานสามารถเลือก Companny <br />
              2. Smart Car ปรับปรุงช่องสำหรับลง วันที่เริ่ม/วันที่สิ้นสุด ให้สามารถเลือกวันที่และเวลาได้ง่ายขึ้น <br />
              3. Smart Bill เพิ่มส่วนที่ผู้ใช้งานสามารถเลือก Companny <br />
              4. Smart Bill เปลี่ยนวิธีการแสดงผลในส่วนการลงค่าเบี้ยเลี้ยงให้ใช้งานง่ายขึ้น <br />
              5. Smart Bill เปลี่ยนวิธีการแสดงผลในส่วนการลงค่าที่พักให้ใช้งานง่ายขึ้น <br />
              6. Smart Bill เปลี่ยนวิธีการแสดงผลในส่วนการลงค่าอื่น ๆ ให้ใช้งานง่ายขึ้น <br />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopupOnce}>
              Close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </BrowserRouter >
    );
  }
}

export default App;
