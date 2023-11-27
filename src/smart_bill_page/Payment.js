import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Axios from "axios";
import config from '../config'
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import logoPure from '../image/Picture1.png'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import NavBar from './NavBar'
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import THBText from 'thai-baht-text' // for ES6

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const grey = {
  200: '#d0d7de',
  800: '#32383f',
  900: '#24292f',
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    padding: 8px;
  }

  th {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  }
  `,
);

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      decimalScale={3}
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function AddressForm() {

  // ใช้สำหรับสร้างเวลาปัจจุบัน
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [counter, setCounter] = React.useState(0);
  const [users, setUsers] = React.useState([]);
  const queryString = window.location.search;
  const sbw_code = queryString.split('?')[1] ? queryString.split('?')[1] : null
  const [opensbw, setOpensbw] = React.useState(false);
  const [openDialogPayTrue, setOpenDialogPayTrue] = React.useState(false);
  const [openAllowance, setOpenAllowance] = React.useState(false);
  const [openCostHotel, setOpenCostHotel] = React.useState(false);
  const [openSmartBill_WithdrawDtlSave, setOpenSmartBill_WithdrawDtlSave] = React.useState(false);
  const [costOther, setCostOther] = React.useState()
  const [province, setProvince] = React.useState()
  const data = JSON.parse(localStorage.getItem('data'));

  //Header

  const [carInfo, setCarInfo] = React.useState([{
    car_infocode: '',
    car_infostatus_companny: '',
    car_categaryid: '',
    car_typeid: '',
    car_band: '',
    car_tier: '',
    car_color: '',
    car_remarks: '',
    car_payname: '',
  }])

  const [carInfoDataCompanny, setCarInfoDataCompanny] = React.useState([]);
  const [carInfoData, setCarInfoData] = React.useState([]);
  const [typePay, setTypePay] = React.useState(0);
  const [condition, setCondition] = React.useState(0);


  //
  const [smartBill_Withdraw, setSmartBill_Withdraw] = React.useState([{
    sbw_id: '',
    sbw_code: '',
    ownercode: data.UserCode,
    depcode: '',
    seccode: '',
    active: '',
    statusid: '',
    car_infoid: '',
    createby: '',
    createdate: '',
    Name: '',
    UserCode: '',
    car_infocode: '',
    car_band: '',
    car_tier: '',
    car_color: '',
    car_paytype: '',
    pure_card: '',
    lock_status: false,
  }]);

  const [smartBill_WithdrawDtl, setSmartBill_WithdrawDtl] = React.useState([{
    sbwdtl_id: '',
    sbw_code: '',
    sbwdtl_operationid_startdate: '',
    sbwdtl_operationid_enddate: '',
    sbwdtl_operationid_location: '',
    sbwdtl_operationid_endmile: '',
    sbwdtl_operationid_startmile: '',
    sum_mile: '',
    price_rateoil: '',
    oilBath: '',
    amouthTrueOil: '',
    amouthAllowance: '',
    amouthHotel: '',
    amouthRush: '',
    amouthAll: '',
    amouthother: '',
  }]);

  const sumAllTotal = (smartBill_WithdrawDtl[0].sbwdtl_id ? (smartBill_WithdrawDtl.map(function (elt) {
    return (/^\d+\.\d+$/.test(elt.amouthAll) || /^\d+$/.test(elt.amouthAll)) ?
      parseFloat(elt.amouthAll) : parseFloat(elt.amouthAll);
  }).reduce(function (a, b) { // sum all resulting numbers
    return a + b
  })) : 0) - (smartBill_Withdraw[0].pure_card ?? 0)

  const removeSmartBill_wddtl = async (e, index) => {
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_Delete', smartBill_WithdrawDtl[index], config.headers)
      .then((res) => {
        if (res.status === 200) {
          gettingData();
        }
      })
    // const list = [...smartBill_WithdrawDtl];
    // list.splice(index, 1);
    // setSmartBill_WithdrawDtl(list);
  }

  const [smartBill_WithdrawSave, setSmartBill_WithdrawSave] = React.useState([{
    ownercode: data.UserCode,
    car_infocode: ''
  }]);

  const [case_WithdrawDtlSave, setCase_WithdrawDtlSave] = React.useState(0);


  const [sb_operationid, setSb_operationid] = React.useState();

  const [smartBill_WithdrawDtlSave, setSmartBill_WithdrawDtlSave] = React.useState([{
    sbw_code: sbw_code,
    sb_operationid: '',
    ownercode: smartBill_Withdraw[0].ownercode,
    car_infocode: carInfo[0].car_infocode,
    remark: '',
    sbwdtl_operationid_startdate: '',
    sbwdtl_operationid_enddate: '',
    sbwdtl_operationid_endmile: '',
    sbwdtl_operationid_startmile: ''
  }]);

  const handleOpenSmartBill_WithdrawDtlSave = async () => {
    const body = { car_infocode: carInfo[0].car_infocode }
    await Axios.post(config.http + '/SmartBill_Withdraw_Addrow', body, config.headers)
      .then((res) => {
        if (res.status === 200) {
          setSb_operationid(res.data[0])
          setOpenSmartBill_WithdrawDtlSave(true);
        } else {
          setSb_operationid(null)
          setOpenSmartBill_WithdrawDtlSave(true);
        }
      })
  }

  const handleSaveSmartBill_WithdrawDtl = async () => {
    const body = {
      sbw_code: sbw_code,
      sb_operationid: '',
      ownercode: smartBill_Withdraw[0].ownercode,
      car_infocode: carInfo[0].car_infocode,
      remark: smartBill_WithdrawDtlSave[0].remark,
      sbwdtl_operationid_startdate: smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startdate,
      sbwdtl_operationid_enddate: smartBill_WithdrawDtlSave[0].sbwdtl_operationid_enddate,
      sbwdtl_operationid_endmile: smartBill_WithdrawDtlSave[0].sbwdtl_operationid_endmile,
      sbwdtl_operationid_startmile: smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startmile
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_AddrowDtl', body, config.headers)
      .then((res) => {
        if (res.status === 200) {
          setSmartBill_WithdrawDtlSave([{
            sbw_code: sbw_code,
            sb_operationid: '',
            ownercode: smartBill_Withdraw[0].ownercode,
            car_infocode: carInfo[0].car_infocode,
            remark: '',
            sbwdtl_operationid_startdate: '',
            sbwdtl_operationid_enddate: '',
            sbwdtl_operationid_endmile: '',
            sbwdtl_operationid_startmile: ''
          }])
          gettingData();
          setOpenSmartBill_WithdrawDtlSave(false);
        }
      })
  }

  const handleCloseSmartBill_WithdrawDtlSave = () => {
    setOpenSmartBill_WithdrawDtlSave(false);
    setSmartBill_WithdrawDtlSave([{
      sbw_code: sbw_code,
      sb_operationid: '',
      ownercode: smartBill_Withdraw[0].ownercode,
      car_infocode: '',
      remark: '',
      sbwdtl_operationid_startdate: '',
      sbwdtl_operationid_enddate: '',
      sbwdtl_operationid_endmile: '',
      sbwdtl_operationid_startmile: ''
    }])
  }

  const handleChangeTypePay = async (event) => {
    setTypePay(event.target.value);
    if (event.target.value === 0 || event.target.value === '0') {
      setCarInfoDataCompanny(null);
      setCarInfoData(null);
    } else {
      const body = { car_infocode: null }
      await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
        .then((response) => {
          const list = [...carInfo]
          list[0]['car_infostatus_companny'] = event.target.value
          list[0]['car_infocode'] = event.target.value === 0 ? '' : list[0]['car_infocode']
          list[0]['car_infostatus_companny'] = event.target.value === 0 ? '' : list[0]['car_infostatus_companny']
          list[0]['car_categaryid'] = event.target.value === 0 ? '' : list[0]['car_categaryid']
          list[0]['car_typeid'] = event.target.value === 0 ? '' : list[0]['car_typeid']
          list[0]['car_band'] = event.target.value === 0 ? '' : list[0]['car_band']
          list[0]['car_tier'] = event.target.value === 0 ? '' : list[0]['car_tier']
          list[0]['car_color'] = event.target.value === 0 ? '' : list[0]['car_color']
          list[0]['car_remarks'] = event.target.value === 0 ? '' : list[0]['car_remarks']
          list[0]['car_payname'] = event.target.value === 0 ? '' : list[0]['car_payname']
          setCarInfo(list)

          setCarInfoDataCompanny(response.data.filter((res) => res.car_infostatus_companny === true)); // 1 รถบริษัท
          setCondition(0);
        })
    }
  };

  const handleChangeCondition = async (event) => {
    if (event.target.value === 0 || event.target.value === '0') {
      const body = { car_infocode: null }
      await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
        .then((response) => {
          const list = [...carInfo]
          list[0]['car_infostatus_companny'] = event.target.value
          list[0]['car_infocode'] = event.target.value === 0 ? '' : list[0]['car_infocode']
          list[0]['car_infostatus_companny'] = event.target.value === 0 ? '' : list[0]['car_infostatus_companny']
          list[0]['car_categaryid'] = event.target.value === 0 ? '' : list[0]['car_categaryid']
          list[0]['car_typeid'] = event.target.value === 0 ? '' : list[0]['car_typeid']
          list[0]['car_band'] = event.target.value === 0 ? '' : list[0]['car_band']
          list[0]['car_tier'] = event.target.value === 0 ? '' : list[0]['car_tier']
          list[0]['car_color'] = event.target.value === 0 ? '' : list[0]['car_color']
          list[0]['car_remarks'] = event.target.value === 0 ? '' : list[0]['car_remarks']
          list[0]['car_payname'] = event.target.value === 0 ? '' : list[0]['car_payname']
          setCarInfo(list)

          setCarInfoDataCompanny(response.data.filter((res) => res.car_infostatus_companny === true)); // 1 รถบริษัท
          setCarInfoData(null)
          setCondition(event.target.value);
        })
    } else if (event.target.value === 1 || event.target.value === '1') {
      const body = { car_infocode: null }
      await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
        .then((response) => {
          const list = [...carInfo]
          list[0]['car_infostatus_companny'] = event.target.value
          list[0]['car_infocode'] = event.target.value === 0 ? '' : list[0]['car_infocode']
          list[0]['car_infostatus_companny'] = event.target.value === 0 ? '' : list[0]['car_infostatus_companny']
          list[0]['car_categaryid'] = event.target.value === 0 ? '' : list[0]['car_categaryid']
          list[0]['car_typeid'] = event.target.value === 0 ? '' : list[0]['car_typeid']
          list[0]['car_band'] = event.target.value === 0 ? '' : list[0]['car_band']
          list[0]['car_tier'] = event.target.value === 0 ? '' : list[0]['car_tier']
          list[0]['car_color'] = event.target.value === 0 ? '' : list[0]['car_color']
          list[0]['car_remarks'] = event.target.value === 0 ? '' : list[0]['car_remarks']
          list[0]['car_payname'] = event.target.value === 0 ? '' : list[0]['car_payname']
          setCarInfo(list)

          setCarInfoData(response.data.filter((res) => res.car_infostatus_companny === false)); //  0 รถส่วนตัว
          setCarInfoDataCompanny(null)
          setCondition(event.target.value);
        })
    } else {
      const listCar = [...smartBill_WithdrawSave]
      listCar[0]['car_infocode'] = ''
      setSmartBill_WithdrawSave(listCar)
      setCondition(event.target.value);
      setCarInfoDataCompanny(null);
      setCarInfoData(null);
      setCarInfo([{
        car_infocode: '',
        car_infostatus_companny: '',
        car_categaryid: '',
        car_typeid: '',
        car_band: '',
        car_tier: '',
        car_color: '',
        car_remarks: '',
        car_payname: '',
      }])
    }
  };

  // ค่าผ่านทาง
  const [openDialogPayRush, setOpenDialogPayRush] = React.useState(false)
  const [payRush, setPayRush] = React.useState({
    sbwdtl_id: '',
    cost_id: '',
    payTrueDtl_satatus: 1,
    category_id: 1,
    amount: '',
  });

  const handleClickOpenDialogPayRush = async (e) => {
    const body = {
      sbwdtl_id: (e.target.value).split(',')[0],
      category_id: (e.target.value).split(',')[1],
    }
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
      .then((response) => {
        if (response.data && response.data[0].length > 0) {
          setOpenDialogPayRush(true);
          setPayRush({
            sbwdtl_id: response.data[0][0].sbwdtl_id,
            cost_id: response.data[0][0].cost_id,
            payTrueDtl_satatus: 1,
            category_id: body.category_id,
            amount: response.data[0][0].amount,
          });
        } else {
          setOpenDialogPayRush(true);
          setPayRush({
            sbwdtl_id: (e.target.value).split(',')[0],
            cost_id: '',
            payTrueDtl_satatus: 1,
            category_id: body.category_id,
            amount: '',
          });
        }
      });
  };

  const handleSavePayRush = async () => {
    const body = [payRush]
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', body, config.headers)
      .then((res) => {
        if (res.status === 200) {
          gettingData();
          setOpenDialogPayRush(false)
        }
      })
  }

  const handleCloseDialogPayRush = () => {
    setOpenDialogPayRush(false);
  };

  //อื่น ๆ
  const [openDialogPayOther, setOpenDialogPayOther] = React.useState(false)
  const [payOtherCase, setPayOtherCase] = React.useState(1)

  const [payOther, setPayOther] = React.useState([{
    sbwdtl_id: '',
    cost_id: '',
    category_name: '',
    amount: '',
  }]);

  const addPayOther = () => {
    setPayOther([...payOther, {
      sbwdtl_id: payOther[0].sbwdtl_id,
      cost_id: '',
      category_name: '',
      amount: '',
    }])
  }

  const reMovePayOther = async (e, index) => {
    const body = payOther[index]
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteCategory', body, config.headers)
      .then((response) => {
        if (response.status === 200) {
          if (payOther.length === 1) {
            setPayOther([{
              sbwdtl_id: '',
              cost_id: '',
              category_name: '',
              amount: '',
            }])
            gettingData();
          } else {
            const list = [...payOther];
            list.splice(index, 1);
            setPayOther(list);
            gettingData();
          }
        }
      })
  }

  const handleClickOpenDialogPayOther = async (e) => {
    const body = {
      sbwdtl_id: (e.target.value).split(',')[0],
      category_id: null,
    }

    setOpenDialogPayOther(true);

    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
      .then((response) => {
        if (response.data && response.data[0].length > 0) {
          const dataOnec = []
          for (let i = 0; i < response.data[0].length; i++) {
            dataOnec.push({
              sbwdtl_id: response.data[0][i].sbwdtl_id,
              cost_id: response.data[0][i].cost_id,
              category_name: response.data[0][i].category_name,
              amount: response.data[0][i].amount,
            })
          }
          setOpenDialogPayOther(true);
          setPayOther(dataOnec);
        } else {
          setOpenDialogPayOther(true);
          setPayOther([{
            sbwdtl_id: body.sbwdtl_id,
            cost_id: '',
            category_name: '',
            amount: '',
          }]);
        }
      });
  };

  const handleSavePayOther = async () => {
    if (
      payOther.filter((res) => res.category_name === '' || !res.category_name)[0] ||
      payOther.filter((res) => res.amount === '' || !res.amount)[0]
    ) {
      swal("แจ้งเตือน", 'ระบุรายละเอียดในการเบิกให้ครบถ้วน', "error")
    } else {
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', payOther, config.headers)
        .then((res) => {
          if (res.status === 200) {
            setOpenDialogPayOther(false);
            gettingData();
          }
        })
    }
  }

  const handleCloseDialogPayOther = () => {
    setOpenDialogPayOther(false);
  };

  // เบิกตามบิลจริง
  const [payTrueDtl, setPayTrueDtl] = React.useState({
    sbwdtl_id: '',
    cost_id: '',
    payTrueDtl_satatus: 1,
    category_id: 1,
    amount: '',
  });

  const handleClickOpenDialogPayTrue = async (e) => {
    if (smartBill_Withdraw[0].car_paytype === false) {
      swal("แจ้งเตือน", 'รถคันนี้เบิกตามไมลล์เท่านั้น', "error")
    } else if (carInfo[0].car_infocode === '') {
      swal("แจ้งเตือน", 'ไม่สามารถเบิกได้ เนื่องจากเป็นการเดินทางโดยไม่มีพาหนะ', "error")
    } else {
      const body = {
        sbwdtl_id: (e.target.value).split(',')[0],
        category_id: (e.target.value).split(',')[1],
      }
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
        .then((response) => {
          if (response.data && response.data[0].length > 0) {
            setOpenDialogPayTrue(true);
            setPayTrueDtl({
              sbwdtl_id: response.data[0][0].sbwdtl_id,
              cost_id: response.data[0][0].cost_id,
              payTrueDtl_satatus: 1,
              category_id: body.category_id,
              amount: response.data[0][0].amount,
            });
          } else {
            setOpenDialogPayTrue(true);
            setPayTrueDtl({
              sbwdtl_id: (e.target.value).split(',')[0],
              cost_id: '',
              payTrueDtl_satatus: 1,
              category_id: body.category_id,
              amount: '',
            });
          }
        });
    }
  };

  const handleCloseDialogPayTrue = () => {
    setOpenDialogPayTrue(false);
  };

  const handleSavePayTrue = async () => {
    const body = [payTrueDtl]
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', body, config.headers)
      .then((res) => {
        if (res.status === 200) {
          gettingData();
          setOpenDialogPayTrue(false)
        }
      })
  }

  // เบี้ยเลี้ยง
  const [payAllowanceCase, setPayAllowanceCase] = React.useState(1);
  const [smartBill_CostAllowance, setSmartBill_CostAllowance] = React.useState([{
    sbwdtl_id: '',
    cost_id: '',
    id: '',
    category_id: 4,
    count: '',
    startdate: '',
    enddate: '',
    usercode: '',
    foodStatus: 0,
    amount: '',
  }]);

  const handleServiceAddAllowance = (index) => {
    setSmartBill_CostAllowance([...smartBill_CostAllowance, {
      sbwdtl_id: smartBill_CostAllowance[0].sbwdtl_id,
      cost_id: smartBill_CostAllowance[0].cost_id,
      id: '',
      category_id: 4,
      count: '',
      startdate: '',
      enddate: '',
      usercode: '',
      foodStatus: 0,
      amount: '',
    }]);
  };

  const handleServiceRemoveAllowance = async (e, index) => {
    const body = smartBill_CostAllowance[index]
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteCategory', body, config.headers)
      .then((response) => {
        if (response.data && response.data[0].length > 0) {
          setSmartBill_CostAllowance(response.data[0].map((res) => {
            return {
              sbwdtl_id: res.sbwdtl_id,
              cost_id: res.cost_id,
              id: res.id,
              category_id: res.category_id,
              count: (new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600),
              startdate: dayjs(res.startdate).utc().local(),
              enddate: dayjs(res.enddate).utc().local(),
              usercode: res.usercode,
              foodStatus: res.foodStatus === true ? 1 : 0,
              amount: res.foodStatus === true ? res.amount * 2 : res.amount,
            }
          }))
          gettingData();
        }
      })
  };

  const handleClickOpenDialogAllowance = async (e, index) => {

    const body = {
      sbwdtl_id: (e.target.value).split(',')[0],
      category_id: (e.target.value).split(',')[1],
    }

    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
      .then((response) => {
        if (response.data && response.data[0].length > 0) {
          setSmartBill_CostAllowance(response.data[0].map((res) => {
            return {
              sbwdtl_id: res.sbwdtl_id,
              cost_id: res.cost_id,
              id: res.id,
              category_id: res.category_id,
              count: (new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600),
              startdate: dayjs(res.startdate).utc().local(),
              enddate: dayjs(res.enddate).utc().local(),
              usercode: res.usercode,
              foodStatus: res.foodStatus === true ? 1 : 0,
              amount: res.foodStatus === true ? res.amount * 2 : res.amount,
            }
          }))
          setPayAllowanceCase(1)
          setOpenAllowance(true);
        } else {
          setSmartBill_CostAllowance([{
            sbwdtl_id: (e.target.value).split(',')[0],
            cost_id: '',
            id: '',
            category_id: 4,
            count: '',
            startdate: '',
            enddate: '',
            usercode: '',
            foodStatus: 0,
            amount: '',
          }])
          setPayAllowanceCase(1)
          setOpenAllowance(true);
        }
      });
  };

  const handleCloseDialogAllowance = () => {
    setOpenAllowance(false);
  };

  const handleSaveAllowance = async () => {
    if (smartBill_CostAllowance.filter((res) => (
      res.startdate === '' ||
      res.enddate === '' ||
      res.usercode === ''
    ))[0]) {
      swal("แจ้งเตือน", 'กรุณากรอกข้อมูลค่าเบี้ยเลี้ยงให้ครบถ้วน', "error")
    } else {
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', smartBill_CostAllowance, config.headers)
        .then((response) => {
          if (response.data && response.data[0].length > 0) {
            setSmartBill_CostAllowance(response.data[0].map((res) => {
              return {
                sbwdtl_id: res.sbwdtl_id,
                cost_id: res.cost_id,
                id: res.id,
                category_id: res.category_id,
                count: (new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600),
                startdate: dayjs(res.startdate).utc().local(),
                enddate: dayjs(res.enddate).utc().local(),
                usercode: res.usercode,
                foodStatus: res.foodStatus === true ? 1 : 0,
                amount: res.foodStatus === true ? res.amount * 2 : res.amount,
              }
            }))
            gettingData();
            setOpenAllowance(false);
          } else {
            gettingData();
            setOpenAllowance(false);
          }
        })
    }
  }

  // ค่าที่พัก //คนร่วมที่พัก
  const [payHotelCase, setPayHotelCase] = React.useState(1);

  const [smartBill_CostHotel, setSmartBill_CostHotel] = React.useState([{
    sbwdtl_id: '',
    cost_id: '',
    id: '',
    category_id: 3,
    count: '',
    startdate: '',
    enddate: '',
    sbc_hotelProvince: '',
    sbc_hotelname: '',
    amount: '',
    smartBill_CostHotelGroup: [{
      sbc_hotelid: '',
      sbc_hotelgroupid: '',
      usercode: '',
      amount: '',
    }]
  }]);

  const handleServiceAddCostHotelGroup = (e, index) => {
    const list = [...smartBill_CostHotel]
    list[index]['smartBill_CostHotelGroup'] = [...smartBill_CostHotel[index].smartBill_CostHotelGroup, {
      sbc_hotelid: '',
      sbc_hotelgroupid: '',
      usercode: '',
      amount: '',
    }]
    setSmartBill_CostHotel(list)
  };

  const handleServiceRemoveHotelGroup = async (e, indexGroup) => {
    const sbchIndex = e.target.value.split(',')[0]
    const sbc_hotelgroupid = e.target.value.split(',')[1]

    if (sbc_hotelgroupid === '' || !sbc_hotelgroupid) {
      const list = [...smartBill_CostHotel]
      const listCostHotel = [...smartBill_CostHotel[sbchIndex]['smartBill_CostHotelGroup']]
      listCostHotel.splice(indexGroup, 1);
      list[sbchIndex]['smartBill_CostHotelGroup'] = listCostHotel
      setSmartBill_CostHotel(list);
    } else {
      const body = { sbc_hotelgroupid: sbc_hotelgroupid }
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteHotelGroup', body, config.headers)
        .then((res) => {
          if (res.status === 200) {
            const list = [...smartBill_CostHotel]
            const listCostHotel = [...smartBill_CostHotel[sbchIndex]['smartBill_CostHotelGroup']]
            listCostHotel.splice(indexGroup, 1);
            list[sbchIndex]['smartBill_CostHotelGroup'] = listCostHotel
            setSmartBill_CostHotel(list);
            gettingData();
          }
        })
    }
  };

  const handleCloseDialogCostHotel = () => {
    setOpenCostHotel(false);
  };

  const handleServiceAddCostHotel = (index) => {
    setSmartBill_CostHotel([...smartBill_CostHotel, {
      sbwdtl_id: smartBill_CostHotel[0].sbwdtl_id,
      cost_id: smartBill_CostHotel[0].cost_id,
      id: '',
      category_id: 3,
      count: '',
      startdate: '',
      enddate: '',
      sbc_hotelProvince: '',
      sbc_hotelname: '',
      amount: '',
      smartBill_CostHotelGroup: [{
        sbc_hotelid: '',
        sbc_hotelgroupid: '',
        usercode: '',
        amount: '',
      }],
    }]);
  };

  const handleClickOpenDialogCostHotel = async (e, index) => {

    const body = {
      sbwdtl_id: (e.target.value).split(',')[0],
      category_id: (e.target.value).split(',')[1],
    }

    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
      .then(async (response) => {
        if (response.data && response.data[0].length > 0) {

          const dataOnec = []
          const dataDateDiffOnec = []
          for (let i = 0; i < response.data[0].length; i++) {
            dataOnec.push({
              sbwdtl_id: response.data[0][i].sbwdtl_id,
              cost_id: response.data[0][i].cost_id,
              id: response.data[0][i].id,
              category_id: response.data[0][i].category_id,
              count: response.data[0][i].count,
              startdate: dayjs(response.data[0][i].startdate).utc().local(),
              enddate: dayjs(response.data[0][i].enddate).utc().local(),
              sbc_hotelProvince: response.data[0][i].sbc_hotelProvince,
              sbc_hotelname: response.data[0][i].sbc_hotelname,
              amount: response.data[0][i].amount,
              smartBill_CostHotelGroup:
                await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectHotelGroup', { sbc_hotelid: response.data[0][i].id }, config.headers)
                  .then((resHotelGroup) => (resHotelGroup.data[0]))
            });
          }

          for (let i = 0; i < response.data[0].length; i++) {
            dataDateDiffOnec.push({
              dateInitialHotel: response.data[0][i].startdate,
              dateFinalHotel: response.data[0][i].enddate,
            });
          }
          setSmartBill_CostHotel(dataOnec);
          setPayHotelCase(1)
          setOpenCostHotel(true);
        } else {
          setSmartBill_CostHotel([{
            sbwdtl_id: (e.target.value).split(',')[0],
            cost_id: '',
            id: '',
            category_id: (e.target.value).split(',')[1],
            count: '',
            startdate: '',
            enddate: '',
            sbc_hotelProvince: '',
            sbc_hotelname: '',
            amount: '',
            smartBill_CostHotelGroup: [{
              sbc_hotelid: '',
              sbc_hotelgroupid: '',
              usercode: '',
              amount: '',
            }],
          }])
          setPayHotelCase(1)
          setOpenCostHotel(true);
        }
      });
  };

  const handleSaveCostHotel = async () => {
    if (smartBill_CostHotel.filter((res) => (
      res.startdate === '' ||
      res.enddate === '' ||
      res.sbc_hotelProvince === '' ||
      res.sbc_hotelname === '' ||
      res.amount === ''
    ))[0]) {
      swal("แจ้งเตือน", 'กรุณากรอกข้อมูลค่าที่พักให้ครบถ้วน', "error")
    } else {
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', smartBill_CostHotel, config.headers)
        .then(async (response) => {
          if (response.data && response.data[0].length > 0) {
            const data = response.data[0].map((res, index) => {
              return {
                sbwdtl_id: res.sbwdtl_id,
                cost_id: res.cost_id,
                id: res.id,
                category_id: res.category_id,
                count: res.count,
                startdate: dayjs(res.startdate).utc().local(),
                enddate: dayjs(res.enddate).utc().local(),
                sbc_hotelProvince: res.sbc_hotelProvince,
                sbc_hotelname: res.sbc_hotelname,
                amount: res.amount,
                smartBill_CostHotelGroup: smartBill_CostHotel[index].smartBill_CostHotelGroup.map((resGroup) => {
                  return {
                    sbc_hotelid: res.id,
                    sbc_hotelgroupid: res.sbc_hotelgroupid,
                    usercode: resGroup.usercode,
                    amount: resGroup.amount,
                  }
                }),
              }
            })
            setSmartBill_CostHotel(data)
            for (let i = 0; i < data.length; i++) {
              await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesHotelGroup', data[i].smartBill_CostHotelGroup, config.headers)
              if (data.length === i + 1) {
                gettingData();
                setOpenCostHotel(false);
              }
            }
          }
        })
    }
  }

  const handleServiceRemoveCostHotel = async (e, index) => {
    if (smartBill_CostHotel[index].startdate === '' ||
      smartBill_CostHotel[index].enddate === '' ||
      smartBill_CostHotel[index].sbc_hotelProvince === '' ||
      smartBill_CostHotel[index].sbc_hotelname === '' ||
      smartBill_CostHotel[index].amount === ''
    ) {
      const list = [...smartBill_CostHotel];
      list.splice(index, 1);
      setSmartBill_CostHotel(list);
    } else {
      const body = smartBill_CostHotel[index]
      await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteCategory', body, config.headers)
        .then((response) => {
          if (response.data && response.data[0].length > 0) {
            setSmartBill_CostHotel(response.data[0].map((res, index) => {
              return {
                sbwdtl_id: res.sbwdtl_id,
                cost_id: res.cost_id,
                id: res.id,
                category_id: res.category_id,
                count: res.count,
                startdate: dayjs(res.startdate).utc().local(),
                enddate: dayjs(res.enddate).utc().local(),
                sbc_hotelProvince: res.sbc_hotelProvince,
                sbc_hotelname: res.sbc_hotelname,
                amount: res.amount,
                smartBill_CostHotelGroup: smartBill_CostHotel[index].smartBill_CostHotelGroup.map((resGroup) => {
                  return {
                    sbc_hotelid: res.id,
                    sbc_hotelgroupid: res.sbc_hotelgroupid,
                    usercode: resGroup.usercode,
                    amount: resGroup.amount,
                  }
                }),
              }
            }))
            gettingData();
          }
        })
    }
  };

  // Basic
  const handleClickOpensbw = () => {
    setOpensbw(true);
  };

  const handleClosesbw = () => {
    setOpensbw(false);
  };

  const gettingData = async () => {
    const headers = {
      'Authorization': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    };

    // แสดง users ทั้งหมด
    await Axios.get(config.http + '/getsUserForAssetsControl', { headers })
      .then((res) => {
        setUsers(res.data.data)
      })

    const bodyCarInfoSearch = { car_infocode: null }
    await Axios.post(config.http + '/SmartBill_CarInfoSearch', bodyCarInfoSearch, config.headers)
      .then((response) => {
        setCarInfoData(response.data);
        setCarInfoDataCompanny(response.data.filter((res) => res.car_infostatus_companny === true));
      });

    await Axios.get(config.http + '/SmartBill_Withdraw_SelectCostOther', config.headers)
      .then((response) => {
        setCostOther(response.data[0]);
      });

    await Axios.get(config.http + '/Provinces_List', config.headers)
      .then((response) => {
        setProvince(response.data.map((res) => res.name_th));
      });

    if (sbw_code) {
      const sbw_SelectAllForms = { sbw_code: sbw_code }
      await Axios.post(config.http + '/SmartBill_Withdraw_SelectAllForms', sbw_SelectAllForms, config.headers)
        .then(async (response) => {
          if (response.data[0].length > 0 && response.data[1].length > 0) {
            setSmartBill_Withdraw(response.data[0]);
            setSmartBill_WithdrawDtl(response.data[1])
            const body = { car_infocode: response.data[0][0].car_infocode }
            await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
              .then((res) => {
                if (response.data[0][0].car_infocode) {
                  setTypePay(1)
                  const list = [...carInfo]
                  list[0]['car_infocode'] = res.data[0].car_infocode
                  list[0]['car_infostatus_companny'] = res.data[0].car_infostatus_companny
                  list[0]['car_categaryid'] = res.data[0].car_categaryid
                  list[0]['car_typeid'] = res.data[0].car_typeid
                  list[0]['car_band'] = res.data[0].car_band
                  list[0]['car_tier'] = res.data[0].car_tier
                  list[0]['car_color'] = res.data[0].car_color
                  list[0]['car_remarks'] = res.data[0].car_remarks
                  list[0]['car_payname'] = res.data[0].car_payname
                  setCarInfo(list)
                }
              })
          } else {
            const body = { car_infocode: response.data[0][0].car_infocode }
            await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
              .then((res) => {
                if (response.data[0][0].car_infocode) {
                  setTypePay(1)
                  const list = [...carInfo]
                  list[0]['car_infocode'] = res.data[0].car_infocode
                  list[0]['car_infostatus_companny'] = res.data[0].car_infostatus_companny
                  list[0]['car_categaryid'] = res.data[0].car_categaryid
                  list[0]['car_typeid'] = res.data[0].car_typeid
                  list[0]['car_band'] = res.data[0].car_band
                  list[0]['car_tier'] = res.data[0].car_tier
                  list[0]['car_color'] = res.data[0].car_color
                  list[0]['car_remarks'] = res.data[0].car_remarks
                  list[0]['car_payname'] = res.data[0].car_payname
                  setCarInfo(list)
                }
              })
            setSmartBill_Withdraw(response.data[0]);
          }
        });
    }
  }

  React.useEffect(() => {
    gettingData();
    window.setTimeout(() => {
      setCounter(10);
    }, 2000)
  }, [])

  const handleSmartBill_Withdraw_Save = async () => {
    await Axios.post(config.http + '/SmartBill_Withdraw_Save', smartBill_WithdrawSave[0], config.headers)
      .then((response) => {
        if (response.data[0][0].code) {
          window.location.href = '/Payment?' + response.data[0][0].code;
        } else {
          swal("แจ้งเตือน", 'error code #DEO0012', "error")
        }
      });
  }

  const smartBill_Withdraw_updateSBW = async () => {
    const body = {
      sbw_code: sbw_code,
      usercode: smartBill_Withdraw[0].ownercode,
      pure_card: smartBill_Withdraw[0].pure_card
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_updateSBW', body, config.headers)
      .then((response) => {
        if (response.status === 200) {
          window.location.href = '/Payment?' + sbw_code;
        } else {
          swal("แจ้งเตือน", 'error code #DEO0012', "error")
        }
      });
  }

  const smartBill_Withdraw_updateLockSBW = async () => {
    const body = {
      sbw_code: sbw_code,
      usercode: smartBill_Withdraw[0].ownercode,
      pure_card: smartBill_Withdraw[0].pure_card,
      lock_status: 1
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_updateSBW', body, config.headers)
      .then((response) => {
        if (response.status === 200) {
          window.location.href = '/Payment?' + sbw_code;
        } else {
          swal("แจ้งเตือน", 'error code #DEO0012', "error")
        }
      });
  }

  const smartBill_Withdraw_updateUnLockSBW = async () => {
    const body = {
      sbw_code: sbw_code,
      usercode: smartBill_Withdraw[0].ownercode,
      pure_card: smartBill_Withdraw[0].pure_card,
      lock_status: 0
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_updateSBW', body, config.headers)
      .then((response) => {
        if (response.status === 200 && response.data !== 'กรุณายกเลิกใบ PAY ก่อน') {
          window.location.href = '/Payment?' + sbw_code;
        } else if (response.data === 'กรุณายกเลิกใบ PAY ก่อน') {
          swal("แจ้งเตือน", response.data, "error")
        } else {
          swal("แจ้งเตือน", 'error code #DEO0012', "error")
        }
      });
  }




  if (!sbw_code) {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Container component="main" sx={{ minWidth: window.innerWidth * 0.9 }}>
          <Root component={Paper} sx={{ my: 5 }}>
            <Button
              variant='contained'
              sx={{ my: 2 }}
              disabled={smartBill_WithdrawSave[0].ownercode === '' ? true : false}
              onClick={handleSmartBill_Withdraw_Save}
            >
              Submit
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={10}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={4}>
                        <Box>
                          <img style={{ maxWidth: '50%' }} src={logoPure} loading="lazy" />
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item xs={12}>
                            <Typography className="payment-Forms">
                              ใบสรุปค่าใช้จ่ายพนักงาน และรายงานการใช้รถยนต์
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography className="payment-Forms">
                              บริษัท เพียวพลังงานไทย จำกัด
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="center" colSpan={4}>
                    <Typography className="payment-Forms">
                      {/* SBWD_CODE */}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      name="ownercode"
                      value={smartBill_WithdrawSave[0].ownercode}
                      options={users.map((option) => option.UserCode)}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_WithdrawSave]
                          list[0]['ownercode'] = ''
                          setSmartBill_WithdrawSave(list)
                        } else {
                          const list = [...smartBill_WithdrawSave]
                          list[0]['ownercode'] = newValue
                          setSmartBill_WithdrawSave(list)
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`ผู้เบิก (initial)`}
                          fullWidth
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell align="left" colSpan={5} />
                  <TableCell align="left" colSpan={3} />
                  <TableCell align="left" colSpan={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        format="YYYY-MM-DD HH:mm"
                        disabled
                        value={dayjs(new Date().toLocaleString().replace(",", "").replace(/:.. /, " "))}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">ใช้พาหนะเดินทางหรือไม่</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={typePay}
                        label="ใช้พาหนะเดินทางหรือไม่"
                        onChange={handleChangeTypePay}
                      >
                        <MenuItem value={0}>ไม่ใช่</MenuItem>
                        <MenuItem value={1}>ใช่</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    {typePay === 0 || typePay === '0' ? null : (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">ประเภทของพาหนะ</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={condition}
                          label="ประเภทของพาหนะ"
                          onChange={handleChangeCondition}
                        >
                          <MenuItem value={0}>พาหนะของบริษัท</MenuItem>
                          <MenuItem value={1}>พาหนะส่วนตัว</MenuItem>
                          <MenuItem value={2}>พาหนะสาธารณะ</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell align="left" colSpan={3}>
                    {(typePay === 0 || typePay === '0') || (condition === 2 || condition === '2') ? null :
                      (
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            options={(carInfoDataCompanny ? carInfoDataCompanny : carInfoData).map((option) => option.car_infocode)}
                            onInputChange={(event, newInputValue, reason) => {
                              const list = [...carInfo]
                              list[0]['car_infocode'] = newInputValue
                              setCarInfo(list)
                            }}
                            onChange={async (event, newInputValue, reason) => {
                              if (reason === 'clear') {
                                const list = [...carInfo]
                                list[0]['car_infocode'] = ''
                                list[0]['car_infostatus_companny'] = ''
                                list[0]['car_categaryid'] = ''
                                list[0]['car_typeid'] = ''
                                list[0]['car_band'] = ''
                                list[0]['car_tier'] = ''
                                list[0]['car_color'] = ''
                                list[0]['car_remarks'] = ''
                                list[0]['car_payname'] = ''
                                setCarInfo(list)

                                const listCar = [...smartBill_WithdrawSave]
                                listCar[0]['car_infocode'] = ''
                                setSmartBill_WithdrawSave(listCar)

                              } else {
                                const body = { car_infocode: newInputValue }
                                await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
                                  .then((response) => {
                                    if (response.data[0].car_infocode) {
                                      const list = [...carInfo]
                                      list[0]['car_infocode'] = newInputValue
                                      list[0]['car_infostatus_companny'] = response.data[0].car_infostatus_companny
                                      list[0]['car_categaryid'] = response.data[0].car_categaryid
                                      list[0]['car_typeid'] = response.data[0].car_typeid
                                      list[0]['car_band'] = response.data[0].car_band
                                      list[0]['car_tier'] = response.data[0].car_tier
                                      list[0]['car_color'] = response.data[0].car_color
                                      list[0]['car_remarks'] = response.data[0].car_remarks
                                      list[0]['car_payname'] = response.data[0].car_payname
                                      setCarInfo(list)

                                      const listCar = [...smartBill_WithdrawSave]
                                      listCar[0]['car_infocode'] = newInputValue
                                      setSmartBill_WithdrawSave(listCar)
                                    }
                                  })
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="ทะเบียนรถ"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      )}
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    ยี่ห้อ: {carInfo[0]['car_band']}
                  </TableCell>
                  <TableCell align="left" colSpan={4}>
                    รุ่น: {carInfo[0]['car_tier']}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {carInfo[0]['car_payname']}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: '12.5%' }}>วันที่เริ่มต้น</TableCell>
                  <TableCell align="center" sx={{ width: '12.5%' }}>วันที่สิ้นสุด</TableCell>
                  <TableCell align="center" sx={{ width: '10%' }}>บันทึกกิจกรรม</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เริ่มต้น</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>สิ้นสุด</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ระยะทาง</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>อัตราชดเชย</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบิกตามไมล์เรท</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบิกตามบิลจริง</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบี้ยเลี้ยง</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ที่พัก</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ทางด่วน</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>อื่น ๆ</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>รวม</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {['', '', '', '', '', '', '', '', '', '', '', '', '', ''].map((res) => (
                    <TableCell
                      align="center"
                    >
                      <Button
                        variant="text"
                        disabled
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                        }}
                      >
                        {res}
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={5}><b>รวม</b></TableCell>
                  {['', '', '', '0', '0', '0', '0', '0', '0'].map((res) => (
                    <TableCell
                      align="center"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      {res}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={14}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Grid item xs={9}>
                        <Typography sx={{ color: '#ff0000' }} >
                          หมายเหตุ : - <br /><br />
                          1) ให้เบิกค่าใช้จ่ายเดินทางหรือ Clear advance ต่อครั้งของการเดินทาง  ภายใน  3  วัน  นับจากวันที่กลับมาถึง <br />
                          2)  ให้แนบใบเสร็จค่าใช้จ่าย (ถ้ามี) , Report การปฏิบัติงาน, Payment Request , Petty Cash ตามจำนวนเงินที่เบิก <br />
                          3)  ค่าน้ำมันคิดที่ : ตามประกาศบริษัท ที่ 10/2548 <br />
                          4)  ค่าที่พักจ่ายตามระเบียบบริษัทฯ หรือเงื่อนไขที่กำหนดในสัญญาจ้าง <br />
                          5)  ค่าเบี้ยเลี้ยงเดินทางปฏิบัติงานต่างจังหวัดวันแรก หรือ วันที่เดินทางกลับ  ไม่น้อยกว่า  12  ช.ม. (คิดเป็น 1 วัน)  วันอื่น ๆ  จำนวน  24  ช.ม.<br />
                          (เท่ากับ 1 วัน) จำนวนเงินที่เบิกตามระบียบบริษัทฯ หรือ เงื่อนไขที่กำหนดในสัญญาจ้าง <br />
                          6)  ค่าใช้จ่ายเดินทาง ทั้งในกรุงเทพฯ , ปริมณฑล และต่างจังหวัด  แต่ไม่รวมการเดินทางไป - กลับบริษัทฯ ปกติ <br />
                          7)  การเดินทางโดยรถประจำทาง (โปรดแนบตั๋วรถโดยสาร)  Taxi  ให้ระบุจำนวนเงินในช่องอื่นๆ <br />
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="center"
                          alignItems="flex-start"
                        >
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={smartBill_Withdraw[0].pure_card}
                              disabled
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                                input: { textAlign: "right" }
                              }}
                              onChange={(e) => {
                                const list = [...smartBill_Withdraw]
                                list[0]['pure_card'] = e.target.value
                                setSmartBill_Withdraw(list)
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography color="black">
                                      Pure Card :
                                    </Typography>
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography color="black">
                                      บาท
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              disabled
                              value={sumAllTotal}
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                                input: { textAlign: "right" }
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography color="black">
                                      ยอดรวมสุทธิทั้งหมด :
                                    </Typography>
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography color="black">
                                      บาท
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              disabled
                              value={sumAllTotal > 0 ? THBText(sumAllTotal) : sumAllTotal === 0 ? 'ศูนย์บาทถ้วน' : `ลบ${THBText(Math.abs(sumAllTotal))}`}
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Root>
        </Container>
      </React.Fragment >
    );
  } else if ((!smartBill_Withdraw && sbw_code && counter < 10) || (sbw_code && counter < 10)) {
    return (
      <React.Fragment>
        <Box
          sx={{
            marginTop: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={3}>
            <CircularProgress disableShrink color="inherit" />
            <Typography className="Header-Forms" color="inherit" >
              Loading...
            </Typography>
          </Stack>
        </Box>
      </React.Fragment>
    );
  } else if (smartBill_Withdraw[0]) {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Container component="main" maxWidth="lg" sx={{ minWidth: window.innerWidth * 0.9 }}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            sx={{ mb: 1, mt: 5 }}
          >
            <Grid item>
              <Button
                variant='contained'
                color="warning"
                disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                onClick={smartBill_Withdraw_updateSBW}
              >
                Save Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                onClick={smartBill_Withdraw_updateLockSBW}
              >
                Save Lock
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                color="error"
                disabled={smartBill_Withdraw[0].lock_status === true ? false : true}
                onClick={smartBill_Withdraw_updateUnLockSBW}
              >
                UnLock Save
              </Button>
            </Grid>
          </Grid>
          <Root component={Paper} sx={{ mb: 5 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={10}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item xs={4}>
                        <Box>
                          <img style={{ maxWidth: '50%' }} src={logoPure} loading="lazy" />
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item xs={12}>
                            <Typography className="payment-Forms">
                              ใบสรุปค่าใช้จ่ายพนักงาน และรายงานการใช้รถยนต์
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography className="payment-Forms">
                              บริษัท เพียวพลังงานไทย จำกัด
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="center" colSpan={5}>
                    <Typography className="payment-Forms">
                      {sbw_code}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      disabled
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      name="ownercode"
                      value={smartBill_Withdraw[0].ownercode}
                      options={users.map((option) => option.UserCode)}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_WithdrawSave]
                          list[0]['ownercode'] = ''
                          setSmartBill_WithdrawSave(list)
                        } else {
                          const list = [...smartBill_WithdrawSave]
                          list[0]['ownercode'] = newValue
                          setSmartBill_WithdrawSave(list)
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`ผู้เบิก (initial)`}
                          fullWidth
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell align="center" colSpan={4}>
                    ชื่อ: {smartBill_Withdraw[0].Name}
                  </TableCell>
                  <TableCell align="center" colSpan={4}>
                    [{smartBill_Withdraw[0].depcode}]
                  </TableCell>
                  <TableCell align="center" colSpan={4}>
                    {smartBill_Withdraw[0].createdate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={1}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">ใช้พาหนะเดินทางหรือไม่</InputLabel>
                      <Select
                        disabled
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={typePay}
                        label="ใช้พาหนะเดินทางหรือไม่"
                        onChange={handleChangeTypePay}
                      >
                        <MenuItem value={0}>ไม่ใช่</MenuItem>
                        <MenuItem value={1}>ใช่</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    {typePay === 0 || typePay === '0' ? null : (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">ประเภทของพาหนะ</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          disabled
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                          value={condition}
                          label="ประเภทของพาหนะ"
                          onChange={handleChangeCondition}
                        >
                          <MenuItem value={0}>พาหนะของบริษัท</MenuItem>
                          <MenuItem value={1}>พาหนะส่วนตัว</MenuItem>
                          {/* <MenuItem value={2}>พาหนะสาธารณะ</MenuItem> */}
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell align="left" colSpan={4}>
                    {(typePay === 0 || typePay === '0') || (condition === 2 || condition === '2') ? null :
                      (
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            disabled
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
                            value={smartBill_Withdraw[0].car_infocode}
                            options={(carInfoDataCompanny ? carInfoDataCompanny : carInfoData).map((option) => option.car_infocode)}
                            onInputChange={(event, newInputValue, reason) => {
                              const list = [...carInfo]
                              list[0]['car_infocode'] = newInputValue
                              setCarInfo(list)
                            }}
                            onChange={async (event, newInputValue, reason) => {
                              if (reason === 'clear') {
                                const list = [...carInfo]
                                list[0]['car_infocode'] = ''
                                list[0]['car_infostatus_companny'] = ''
                                list[0]['car_categaryid'] = ''
                                list[0]['car_typeid'] = ''
                                list[0]['car_band'] = ''
                                list[0]['car_tier'] = ''
                                list[0]['car_color'] = ''
                                list[0]['car_remarks'] = ''
                                list[0]['car_payname'] = ''
                                setCarInfo(list)

                                const listCar = [...smartBill_WithdrawSave]
                                listCar[0]['car_infocode'] = ''
                                setSmartBill_WithdrawSave(listCar)

                              } else {
                                const body = { car_infocode: newInputValue }
                                await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
                                  .then((response) => {
                                    if (response.data[0].car_infocode) {
                                      const list = [...carInfo]
                                      list[0]['car_infocode'] = newInputValue
                                      list[0]['car_infostatus_companny'] = response.data[0].car_infostatus_companny
                                      list[0]['car_categaryid'] = response.data[0].car_categaryid
                                      list[0]['car_typeid'] = response.data[0].car_typeid
                                      list[0]['car_band'] = response.data[0].car_band
                                      list[0]['car_tier'] = response.data[0].car_tier
                                      list[0]['car_color'] = response.data[0].car_color
                                      list[0]['car_remarks'] = response.data[0].car_remarks
                                      list[0]['car_payname'] = response.data[0].car_payname
                                      setCarInfo(list)

                                      const listCar = [...smartBill_WithdrawSave]
                                      listCar[0]['car_infocode'] = newInputValue
                                      setSmartBill_WithdrawSave(listCar)
                                    }
                                  })
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="ทะเบียนรถ"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      )}
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    ยี่ห้อ: {carInfo[0]['car_band']}
                  </TableCell>
                  <TableCell align="left" colSpan={4}>
                    รุ่น: {carInfo[0]['car_tier']}
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    {carInfo[0]['car_payname']}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={15}>
                    <Button
                      variant="text"
                      onClick={handleOpenSmartBill_WithdrawDtlSave}
                      disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                    >
                      เพิ่มรายการ
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: '12.5%' }}>วันที่เริ่มต้น</TableCell>
                  <TableCell align="center" sx={{ width: '12.5%' }}>วันที่สิ้นสุด</TableCell>
                  <TableCell align="center" sx={{ width: '10%' }}>บันทึกกิจกรรม</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>เริ่มต้น</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>สิ้นสุด</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>ระยะทาง</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>อัตราชดเชย</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>เบิกตามไมล์เรท</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>เบิกตามบิลจริง</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>เบี้ยเลี้ยง</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>ที่พัก</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>ทางด่วน</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>อื่น ๆ</TableCell>
                  <TableCell align="center" sx={{ width: '5.6%' }}>รวม</TableCell>
                  <TableCell align="center" sx={{ width: '3%' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {smartBill_WithdrawDtl.map((res, index) => (
                  <TableRow>
                    <TableCell align="center">{res.sbwdtl_operationid_startdate}</TableCell>
                    <TableCell align="center">{res.sbwdtl_operationid_enddate}</TableCell>
                    <TableCell >{res.remark}</TableCell>
                    <TableCell align="center">{res.sbwdtl_operationid_startmile}</TableCell>
                    <TableCell align="center">{res.sbwdtl_operationid_endmile}</TableCell>
                    <TableCell align="center">{res.sum_mile.toLocaleString("en-US")}</TableCell>
                    <TableCell align="center">{res.price_rateoil.toLocaleString("en-US")}</TableCell>
                    <TableCell align="center">{res.oilBath.toLocaleString("en-US")}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        value={`${res.sbwdtl_id},1`}
                        onClick={(e) => handleClickOpenDialogPayTrue(e, index)}
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                          "&:disabled": {
                            color: 'red'
                          }
                        }}
                      >
                        {(res.amouthTrueOil === '0' || res.amouthTrueOil === 0) ? '0' : res.amouthTrueOil.toLocaleString("en-US")}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        value={`${res.sbwdtl_id},4`}
                        onClick={(e) => handleClickOpenDialogAllowance(e, index)}
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                          "&:disabled": {
                            color: 'red'
                          }
                        }}
                      >
                        {(res.amouthAllowance === '0' || res.amouthAllowance === 0) ? '0' : res.amouthAllowance.toLocaleString("en-US")}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        value={`${res.sbwdtl_id},3`}
                        onClick={(e) => handleClickOpenDialogCostHotel(e, index)}
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                          "&:disabled": {
                            color: 'red'
                          }
                        }}
                      >
                        {(res.amouthHotel === '0' || res.amouthHotel === 0) ? '0' : res.amouthHotel.toLocaleString("en-US")}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        value={`${res.sbwdtl_id},2`}
                        onClick={(e) => handleClickOpenDialogPayRush(e, index)}
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                          "&:disabled": {
                            color: 'red'
                          }
                        }}
                      >
                        {(res.amouthRush === '0' || res.amouthRush === 0) ? '0' : res.amouthRush.toLocaleString("en-US")}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        value={`${res.sbwdtl_id},null`}
                        onClick={(e) => handleClickOpenDialogPayOther(e, index)}
                        sx={{
                          fontFamily: 'monospace',
                          color: 'red',
                          fontWeight: 700,
                          "&:disabled": {
                            color: 'red'
                          }
                        }}
                      >
                        {(res.amouthother === '0' || res.amouthother === 0) ? '0' : res.amouthother.toLocaleString("en-US")}
                      </Button>
                    </TableCell>
                    <TableCell align="center">{res.amouthAll.toLocaleString("en-US")}</TableCell>
                    <TableCell>
                      <Button
                        key={index}
                        variant="text"
                        color="error"
                        onClick={(e) => removeSmartBill_wddtl(e, index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={5}><b>รวม</b></TableCell>
                  <TableCell align="center" colSpan={1}></TableCell>
                  <TableCell align="center" colSpan={1}></TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.oilBath) || /^\d+$/.test(elt.oilBath)) ?
                          parseFloat(elt.oilBath) : parseFloat(elt.oilBath);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : ''}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthTrueOil) || /^\d+$/.test(elt.amouthTrueOil)) ?
                          parseFloat(elt.amouthTrueOil) : parseFloat(elt.amouthTrueOil);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthAllowance) || /^\d+$/.test(elt.amouthAllowance)) ?
                          parseFloat(elt.amouthAllowance) : parseFloat(elt.amouthAllowance);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthHotel) || /^\d+$/.test(elt.amouthHotel)) ?
                          parseFloat(elt.amouthHotel) : parseFloat(elt.amouthHotel);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthRush) || /^\d+$/.test(elt.amouthRush)) ?
                          parseFloat(elt.amouthRush) : parseFloat(elt.amouthRush);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthother) || /^\d+$/.test(elt.amouthother)) ?
                          parseFloat(elt.amouthother) : parseFloat(elt.amouthother);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.amouthAll) || /^\d+$/.test(elt.amouthAll)) ?
                          parseFloat(elt.amouthAll) : parseFloat(elt.amouthAll);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1} />
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={15}>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <Grid item xs={9}>
                        <Typography sx={{ color: '#ff0000' }} >
                          หมายเหตุ : - <br /><br />
                          1) ให้เบิกค่าใช้จ่ายเดินทางหรือ Clear advance ต่อครั้งของการเดินทาง  ภายใน  3  วัน  นับจากวันที่กลับมาถึง <br />
                          2)  ให้แนบใบเสร็จค่าใช้จ่าย (ถ้ามี) , Report การปฏิบัติงาน, Payment Request , Petty Cash ตามจำนวนเงินที่เบิก <br />
                          3)  ค่าน้ำมันคิดที่ : ตามประกาศบริษัท ที่ 10/2548 <br />
                          4)  ค่าที่พักจ่ายตามระเบียบบริษัทฯ หรือเงื่อนไขที่กำหนดในสัญญาจ้าง <br />
                          5)  ค่าเบี้ยเลี้ยงเดินทางปฏิบัติงานต่างจังหวัดวันแรก หรือ วันที่เดินทางกลับ  ไม่น้อยกว่า  12  ช.ม. (คิดเป็น 1 วัน)  วันอื่น ๆ  จำนวน  24  ช.ม.<br />
                          (เท่ากับ 1 วัน) จำนวนเงินที่เบิกตามระบียบบริษัทฯ หรือ เงื่อนไขที่กำหนดในสัญญาจ้าง <br />
                          6)  ค่าใช้จ่ายเดินทาง ทั้งในกรุงเทพฯ , ปริมณฑล และต่างจังหวัด  แต่ไม่รวมการเดินทางไป - กลับบริษัทฯ ปกติ <br />
                          7)  การเดินทางโดยรถประจำทาง (โปรดแนบตั๋วรถโดยสาร)  Taxi  ให้ระบุจำนวนเงินในช่องอื่นๆ <br />
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="center"
                          alignItems="flex-start"
                        >
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={smartBill_Withdraw[0].pure_card}
                              onChange={(e) => {
                                const list = [...smartBill_Withdraw]
                                list[0]['pure_card'] = e.target.value
                                setSmartBill_Withdraw(list)
                              }}
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                                input: { textAlign: "right" }
                              }}
                              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography color="black">
                                      Pure Card :
                                    </Typography>
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end" sx={{ px: 1 }}>
                                    <Typography color="black">
                                      บาท
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              disabled
                              value={sumAllTotal}
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                                input: { textAlign: "right" }
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography color="black">
                                      ยอดรวมสุทธิทั้งหมด :
                                    </Typography>
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end" sx={{ px: 1 }}>
                                    <Typography color="black">
                                      บาท
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              disabled
                              value={sumAllTotal > 0 ? THBText(sumAllTotal) : sumAllTotal === 0 ? 'ศูนย์บาทถ้วน' : `ลบ${THBText(Math.abs(sumAllTotal))}`}
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Root>
        </Container>
        <BootstrapDialog
          onClose={handleCloseSmartBill_WithdrawDtlSave}
          aria-labelledby="customized-dialog-title"
          open={openSmartBill_WithdrawDtlSave}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            กรุณาระบุข้อมูลให้ครบถ้วน
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseSmartBill_WithdrawDtlSave}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">เลือกวิธีสร้างรายการ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={case_WithdrawDtlSave}
                    label="วิธีสร้างรายการ"
                    onChange={(e) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['sb_operationid'] = ''
                      list[0]['sbwdtl_operationid_startdate'] = ''
                      list[0]['sbwdtl_operationid_enddate'] = ''
                      list[0]['sbwdtl_operationid_endmile'] = ''
                      list[0]['sbwdtl_operationid_startmile'] = ''
                      list[0]['remark'] = ''
                      setSmartBill_WithdrawDtlSave(list)
                      setCase_WithdrawDtlSave(e.target.value)
                    }}
                  >
                    <MenuItem value={0}>สร้างจากรายการที่มีอยู่แล้ว</MenuItem>
                    <MenuItem value={1}>สร้างรายการใหม่</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {case_WithdrawDtlSave === 0 ? (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      options={sb_operationid}
                      disabled={!sb_operationid ? true : false}
                      getOptionLabel={(options) =>
                        `[${options.createby}] [${options.sb_code}] [${options.sb_operationid}] ${options.sb_operationid_location}`
                      }
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      onChange={(event, newInputValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_WithdrawDtlSave]
                          list[0]['sb_operationid'] = ''
                          setSmartBill_WithdrawDtlSave(list)
                        } else {
                          const list = [...smartBill_WithdrawDtlSave]
                          list[0]['sb_operationid'] = newInputValue.sb_operationid
                          list[0]['sbwdtl_operationid_startdate'] = dayjs(newInputValue.sb_operationid_startdate).utc().local()
                          list[0]['sbwdtl_operationid_enddate'] = dayjs(newInputValue.sb_operationid_enddate).utc().local()
                          list[0]['sbwdtl_operationid_endmile'] = newInputValue.sb_operationid_endmile
                          list[0]['sbwdtl_operationid_startmile'] = newInputValue.sb_operationid_startmile
                          list[0]['remark'] = newInputValue.sb_operationid_location
                          setSmartBill_WithdrawDtlSave(list)
                        }
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth label="เลือกรายการ" />}
                    />
                  </Grid>
                </React.Fragment>
              ) : null}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    format="YYYY-MM-DD HH:mm"
                    name="sbwdtl_operationid_startdate"
                    label={`วันที่เริ่มต้น`}
                    sx={{
                      width: '100%',
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                    disabled={case_WithdrawDtlSave === 0 ? true : false}
                    value={smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startdate === '' ? undefined : smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startdate}
                    onChange={(newValue) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['sbwdtl_operationid_startdate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                      setSmartBill_WithdrawDtlSave(list)
                    }}
                    ampm={false}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    format="YYYY-MM-DD HH:mm"
                    name="sbwdtl_operationid_enddate"
                    label={`วันที่สิ้นสุด`}
                    sx={{
                      width: '100%',
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                    disabled={case_WithdrawDtlSave === 0 ? true : false}
                    value={smartBill_WithdrawDtlSave[0].sbwdtl_operationid_enddate === '' ? undefined : smartBill_WithdrawDtlSave[0].sbwdtl_operationid_enddate}
                    onChange={(newValue) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['sbwdtl_operationid_enddate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                      setSmartBill_WithdrawDtlSave(list)
                    }}
                    ampm={false}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                  }}
                  disabled={case_WithdrawDtlSave === 0 ? true : false}
                  onChange={(e) => {
                    const list = [...smartBill_WithdrawDtlSave]
                    list[0]['sbwdtl_operationid_startmile'] = e.target.value
                    setSmartBill_WithdrawDtlSave(list)
                  }}
                  value={smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startmile}
                  label={`ไมลล์เริ่มต้น`}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                  }}
                  onChange={(e) => {
                    const list = [...smartBill_WithdrawDtlSave]
                    list[0]['sbwdtl_operationid_endmile'] = e.target.value
                    setSmartBill_WithdrawDtlSave(list)
                  }}
                  disabled={case_WithdrawDtlSave === 0 ? true : false}
                  value={smartBill_WithdrawDtlSave[0].sbwdtl_operationid_endmile}
                  label={`ไมลล์สิ้นสุด`}
                  fullWidth
                />
              </Grid>
              {case_WithdrawDtlSave === 0 ? null : (
                <Grid item xs={12}>
                  <TextField
                    onChange={(e) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['remark'] = e.target.value
                      setSmartBill_WithdrawDtlSave(list)
                    }}
                    value={smartBill_WithdrawDtlSave[0].remark}
                    label={`บันทึกกิจกรรม`}
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
              onClick={handleSaveSmartBill_WithdrawDtl}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        {/* เบิกค่าทางด่วน */}
        <BootstrapDialog
          onClose={handleCloseDialogPayRush}
          aria-labelledby="customized-dialog-title"
          open={openDialogPayRush}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            เบิกค่าทางด่วน ?
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogPayRush}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={payRush.payTrueDtl_satatus}
                  onChange={(event) => {
                    if (event.target.value === 0 || event.target.value === "0") {
                      setPayRush({
                        sbwdtl_id: payRush.sbwdtl_id,
                        cost_id: '',
                        payTrueDtl_satatus: event.target.value,
                        category_id: 2,
                        amount: '',
                      });
                    } else {
                      setPayRush({
                        sbwdtl_id: payRush.sbwdtl_id,
                        cost_id: payRush.cost_id,
                        payTrueDtl_satatus: event.target.value,
                        category_id: 2,
                        amount: payRush.amount,
                      });
                    }
                  }}
                >
                  <FormControlLabel value={0} control={<Radio />} label="ไม่เบิก" />
                  <FormControlLabel value={1} control={<Radio />} label="เบิก" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  disabled={payRush.payTrueDtl_satatus === 0 || payRush.payTrueDtl_satatus === '0' ? true : false}
                  value={payRush.amount}
                  onChange={(event) => {
                    setPayRush({
                      sbwdtl_id: payRush.sbwdtl_id,
                      cost_id: payRush.cost_id,
                      payTrueDtl_satatus: payRush.payTrueDtl_satatus,
                      category_id: 2,
                      amount: event.target.value,
                    });
                  }}
                  label="ยอดเงินตามบิล"
                  fullWidth
                  name="paytrue"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSavePayRush}
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        {/* ค่าอื่น ๆ */}
        <BootstrapDialog
          onClose={handleCloseDialogPayOther}
          aria-labelledby="customized-dialog-title"
          open={openDialogPayOther}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            เบิกค่าอื่น ๆ ?
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogPayOther}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={payOtherCase}
                  onChange={(event) => setPayOtherCase(event.target.value)}
                >
                  <FormControlLabel value={0} control={<Radio />} label="ไม่เบิก" />
                  <FormControlLabel value={1} control={<Radio />} label="เบิก" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <Button
                  autoFocus
                  disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                  variant='outlined'
                  onClick={addPayOther}
                >
                  เพิ่มรายการ
                </Button>
              </Grid>
              {payOther.map((res, index) => (
                <React.Fragment>
                  <Grid item xs={7}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      name="costOther"
                      value={res.category_name}
                      options={costOther.map((option) => option.category_name)}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...payOther]
                          list[index]['category_name'] = ''
                          setPayOther(list)
                        } else {
                          const list = [...payOther]
                          list[index]['category_name'] = newValue
                          setPayOther(list)
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`รายละเอียด`}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      value={res.amount}
                      onChange={(e) => {
                        const list = [...payOther]
                        list[index]['amount'] = e.target.value
                        setPayOther(list)
                      }}
                      key={index}
                      label="ยอดเงินตามบิล"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      autoFocus
                      variant='outlined'
                      color="error"
                      onClick={(e) => reMovePayOther(e, index)}
                      disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
                    >
                      DELETE
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSavePayOther}
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        {/* เบิกตามบิลจริง */}
        <BootstrapDialog
          onClose={handleCloseDialogPayTrue}
          aria-labelledby="customized-dialog-title"
          open={openDialogPayTrue}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            ต้องการเบิกตามจริงหรือไม่ ?
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogPayTrue}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={payTrueDtl.payTrueDtl_satatus}
                  onChange={(event) => {
                    if (event.target.value === 0 || event.target.value === "0") {
                      setPayTrueDtl({
                        sbwdtl_id: payTrueDtl.sbwdtl_id,
                        cost_id: '',
                        payTrueDtl_satatus: event.target.value,
                        category_id: 1,
                        amount: '',
                      });
                    } else {
                      setPayTrueDtl({
                        sbwdtl_id: payTrueDtl.sbwdtl_id,
                        cost_id: payTrueDtl.cost_id,
                        payTrueDtl_satatus: event.target.value,
                        category_id: 1,
                        amount: payTrueDtl.amount,
                      });
                    }
                  }}
                >
                  <FormControlLabel value={0} control={<Radio />} label="ไม่เบิก" />
                  <FormControlLabel value={1} control={<Radio />} label="เบิก" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                  disabled={payTrueDtl.payTrueDtl_satatus === 0 || payTrueDtl.payTrueDtl_satatus === '0' ? true : false}
                  value={payTrueDtl.amount}
                  onChange={(event) => {
                    setPayTrueDtl({
                      sbwdtl_id: payTrueDtl.sbwdtl_id,
                      cost_id: payTrueDtl.cost_id,
                      payTrueDtl_satatus: payTrueDtl.payTrueDtl_satatus,
                      category_id: 1,
                      amount: event.target.value,
                    });
                  }}
                  label="ยอดเงินตามบิล"
                  fullWidth
                  name="paytrue"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSavePayTrue}
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        {/* ค่าเบี้ยเลี้ยง */}
        <BootstrapDialog
          onClose={handleCloseDialogAllowance}
          aria-labelledby="customized-dialog-title"
          open={openAllowance}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            ต้องการเบิกค่าเบี้ยเลี้ยงหรือไม่ ?
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogAllowance}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={payAllowanceCase}
                  onChange={(event) => {
                    if (event.target.value === 0 || event.target.value === "0") {
                      setSmartBill_CostAllowance([{
                        sbwdtl_id: '',
                        cost_id: '',
                        id: '',
                        category_id: 4,
                        count: '',
                        startdate: '',
                        enddate: '',
                        usercode: '',
                        foodStatus: 0,
                        amount: '',
                      }]);
                      setPayAllowanceCase(0)
                    } else {
                      setPayAllowanceCase(event.target.value)
                    }
                  }}
                >
                  <FormControlLabel value={0} control={<Radio />} label="ไม่เบิก" />
                  <FormControlLabel value={1} control={<Radio />} label="เบิก" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      disabled={
                        (payAllowanceCase === 0 || payAllowanceCase === "0") ||
                          smartBill_Withdraw[0].lock_status === true
                          ? true : false
                      }
                      onClick={handleServiceAddAllowance}
                      variant="outlined"
                      startIcon={<ArticleIcon />}
                    >
                      เพิ่มผู้เบิกเบี้ยเลี้ยง
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {smartBill_CostAllowance.map((res, index) => (
                <React.Fragment>
                  <Grid item xs={4}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      key={index}
                      name="usercode"
                      value={res.usercode}
                      disabled={payAllowanceCase === 0 || payAllowanceCase === "0" ? true : false}
                      options={users.map((option) => option.UserCode)}
                      onChange={async (event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_CostAllowance]
                          list[index]['usercode'] = ''
                          list[index]['amount'] = ''
                          setSmartBill_CostAllowance(list)
                        } else {
                          const list = [...smartBill_CostAllowance]
                          await Axios.post(config.http + '/useright_getWelfare', { welfaretypeid: 1, usercode: newValue }, config.headers)
                            .then((res) => {
                              if (res.data.data.length > 0) {
                                list[index]['usercode'] = newValue
                                list[index]['amount'] = res.data.data.filter((getWelFare) => getWelFare.usercode === newValue)[0].amount ?? 0
                                setSmartBill_CostAllowance(list)
                              } else {
                                list[index]['usercode'] = newValue
                                list[index]['amount'] = 0
                                setSmartBill_CostAllowance(list)
                              }
                            })
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`ผู้เบิกเบี้ยเลี้ยง คนที่ ${index + 1}`}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        format="YYYY-MM-DD HH:mm"
                        name="startdate"
                        label={`วันที่เริ่มต้น`}
                        key={index}
                        sx={{ width: '100%' }}
                        disabled={payAllowanceCase === 0 || payAllowanceCase === "0" ? true : false}
                        value={res.startdate === '' ? undefined : res.startdate}
                        onChange={(newValue) => {
                          const list = [...smartBill_CostAllowance]
                          list[index]['startdate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                          list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600))
                          setSmartBill_CostAllowance(list)
                        }}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        format="YYYY-MM-DD HH:mm"
                        name="enddate"
                        label={`วันที่สิ้นสุด`}
                        key={index}
                        sx={{ width: '100%' }}
                        disabled={payAllowanceCase === 0 || payAllowanceCase === "0" ? true : false}
                        value={res.enddate === '' ? undefined : res.enddate}
                        onChange={(newValue) => {
                          const list = [...smartBill_CostAllowance]
                          list[index]['enddate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                          list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600))
                          setSmartBill_CostAllowance(list)
                        }}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel>ค่าอาหาร</InputLabel>
                      <Select
                        value={res.foodStatus}
                        key={index}
                        label="ค่าอาหาร"
                        onChange={(event) => {
                          const list = [...smartBill_CostAllowance]
                          list[index]['foodStatus'] = event.target.value
                          setSmartBill_CostAllowance(list)
                        }}
                      >
                        <MenuItem value={0}>ไม่มีอาหารเลี้ยง</MenuItem>
                        <MenuItem value={1}>มีอาหารเลี้ยง</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      disabled
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      key={index}
                      value={res.count}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      label="จำนวน ชม."
                      fullWidth
                      name="count"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      disabled
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      key={index}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      value={res.amount}
                      label="ค่าเบี้ยเลี้ยง"
                      fullWidth
                      name="amount"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      disabled
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      key={index}
                      value={
                        res.foodStatus === 1 ? (res.amount / 2) * Math.ceil(Math.trunc((res.count / 12)) / 2) :
                          res.amount * Math.ceil(Math.trunc((res.count / 12)) / 2)
                      }
                      label="ยอดเงินที่เบิกได้"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      disabled={
                        (payAllowanceCase === 0 || payAllowanceCase === "0") ||
                          smartBill_CostAllowance.length === 1 ||
                          smartBill_Withdraw[0].lock_status === true ? true : false
                      }
                      key={index}
                      onClick={(e) => handleServiceRemoveAllowance(e, index)}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      DELETE
                    </Button>
                  </Grid>
                  {index === smartBill_CostAllowance.length - 1 ? null : (
                    <Grid item xs={12}>
                      <Divider sx={{ py: 1 }} />
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSaveAllowance}
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
        {/* เบิกค่าที่พัก */}
        <BootstrapDialog
          onClose={handleCloseDialogCostHotel}
          aria-labelledby="customized-dialog-title"
          open={openCostHotel}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            ต้องการเบิกค่าที่พักหรือไม่ ?
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialogCostHotel}
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={payHotelCase}
                  onChange={(event) => {
                    if (event.target.value === 0 || event.target.value === "0") {
                      setSmartBill_CostHotel([{
                        sbwdtl_id: '',
                        cost_id: '',
                        id: '',
                        category_id: 3,
                        count: '',
                        startdate: '',
                        enddate: '',
                        sbc_hotelProvince: '',
                        sbc_hotelname: '',
                        amount: '',
                        smartBill_CostHotelGroup: [{
                          sbc_hotelid: '',
                          sbc_hotelgroupid: '',
                          usercode: '',
                          amount: '',
                        }],
                      }]);
                      setPayHotelCase(0)
                    } else {
                      setPayHotelCase(event.target.value)
                    }
                  }}
                >
                  <FormControlLabel value={0} control={<Radio />} label="ไม่เบิก" />
                  <FormControlLabel value={1} control={<Radio />} label="เบิก" />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      disabled={
                        (payHotelCase === 0 || payHotelCase === "0") ||
                          smartBill_Withdraw[0].lock_status === true
                          ? true : false
                      }
                      onClick={handleServiceAddCostHotel}
                      variant="outlined"
                      startIcon={<ArticleIcon />}
                    >
                      เพิ่มห้องพัก
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {smartBill_CostHotel.map((res, index) => (
                <React.Fragment>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        format="YYYY-MM-DD HH:mm"
                        name="startdate"
                        label={`(ห้องพัก ${index + 1}) วันที่เข้าพัก`}
                        key={index}
                        sx={{ width: '100%' }}
                        disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                        value={res.startdate === '' ? undefined : res.startdate}
                        onChange={(newValue) => {
                          const list = [...smartBill_CostHotel]
                          list[index]['startdate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                          list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 60 * 60 * 24))
                          setSmartBill_CostHotel(list)
                        }}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        format="YYYY-MM-DD HH:mm"
                        name="enddate"
                        label={`(ห้องพัก ${index + 1}) วันที่ออก`}
                        key={index}
                        sx={{ width: '100%' }}
                        disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                        value={res.enddate === '' ? undefined : res.enddate}
                        onChange={(newValue) => {
                          const list = [...smartBill_CostHotel]
                          list[index]['enddate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                          list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 60 * 60 * 24))
                          setSmartBill_CostHotel(list)
                        }}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      name="sbc_hotelProvince"
                      disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                      value={res.sbc_hotelProvince}
                      options={province}
                      onChange={async (event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_CostHotel]
                          list[index]['sbc_hotelProvince'] = ''
                          setSmartBill_CostHotel(list)
                        } else {
                          const list = [...smartBill_CostHotel]
                          list[index]['sbc_hotelProvince'] = newValue
                          if (list[index]['smartBill_CostHotelGroup'].filter((filterGroup) => filterGroup.usercode !== '')[0]) {
                            const CostHotelGroup = []
                            for (let i = 0; i < list[index]['smartBill_CostHotelGroup'].length; i++) {
                              CostHotelGroup.push({
                                sbc_hotelid: list[index]['smartBill_CostHotelGroup'][i].sbc_hotelid,
                                sbc_hotelgroupid: list[index]['smartBill_CostHotelGroup'][i].sbc_hotelgroupid,
                                usercode: list[index]['smartBill_CostHotelGroup'][i].usercode,
                                amount: await Axios.post(config.http + '/useright_getWelfare',
                                  {
                                    sbc_hotelProvince: list[index]['sbc_hotelProvince'],
                                    usercode: list[index]['smartBill_CostHotelGroup'][i].usercode
                                  },
                                  config.headers)
                                  .then((resAxios) => resAxios.data.data[0].amount),
                              })
                            }
                            list[index]['smartBill_CostHotelGroup'] = CostHotelGroup
                            setSmartBill_CostHotel(list)
                          }
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`จังหวัด`}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                      key={index}
                      value={res.sbc_hotelname}
                      label={`ชื่อที่พัก`}
                      onChange={(event) => {
                        const list = [...smartBill_CostHotel]
                        list[index]['sbc_hotelname'] = event.target.value
                        setSmartBill_CostHotel(list)
                      }}
                      fullWidth
                      name="sbc_hotelname"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      key={index}
                      value={res.count}
                      label={`จำนวนคืนที่พัก`}
                      fullWidth
                      name="count"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      disabled={payHotelCase === 0 || payHotelCase === "0" ? true : false}
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                      key={index}
                      value={res.amount}
                      label={`(ห้องพัก ${index + 1}) ยอดเงินจากบิล`}
                      onChange={(event) => {
                        const list = [...smartBill_CostHotel]
                        list[index]['amount'] = event.target.value
                        setSmartBill_CostHotel(list)
                      }}
                      fullWidth
                      name="amount"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      disabled={
                        (payHotelCase === 0 || payHotelCase === "0") ||
                          smartBill_Withdraw[0].lock_status === true ||
                          smartBill_CostHotel.length === 1
                          ? true : false
                      }
                      key={index}
                      onClick={(e) => handleServiceRemoveCostHotel(e, index)}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      DELETE
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      // disabled={
                      //   (payHotelCase === 0 || payHotelCase === "0") ||
                      //     smartBill_Withdraw[0].lock_status === true ||
                      //     smartBill_CostHotel[index]['sbc_hotelProvince'] === ''
                      //     ? true : false
                      // }
                      key={index}
                      onClick={(e) => handleServiceAddCostHotelGroup(e, index)}
                      variant="outlined"
                      startIcon={<NoteAddIcon />}
                    >
                      เพิ่มผู้ร่วมพักของห้องพักที่ {index + 1}
                    </Button>
                  </Grid>
                  {res.smartBill_CostHotelGroup.map((resGroup, indexGroup) => (
                    <React.Fragment>
                      <Grid item xs={5}>
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          key={indexGroup}
                          // disabled={(payHotelCase === 0 || payHotelCase === "0") || smartBill_CostHotel[index]['sbc_hotelProvince'] === '' ? true : false}
                          name="usercode"
                          value={resGroup.usercode}
                          options={users.map((option) => option.UserCode)}
                          onChange={async (event, newValue, reason) => {
                            if (reason === 'clear') {
                              const list = [...smartBill_CostHotel]
                              list[index]['smartBill_CostHotelGroup'][indexGroup]['usercode'] = ''
                              list[index]['smartBill_CostHotelGroup'][indexGroup]['amount'] = ''
                              setSmartBill_CostHotel(list)
                            } else {
                              const list = [...smartBill_CostHotel]
                              await Axios.post(config.http + '/useright_getWelfare', { sbc_hotelProvince: list[index]['sbc_hotelProvince'], usercode: newValue }, config.headers)
                                .then((res) => {
                                  if (res.data.data.length > 0) {
                                    list[index]['smartBill_CostHotelGroup'][indexGroup]['usercode'] = newValue
                                    list[index]['smartBill_CostHotelGroup'][indexGroup]['amount'] = res.data.data.filter((getWelFare) => getWelFare.usercode === newValue)[0].amount ?? 0
                                    setSmartBill_CostHotel(list)
                                  } else {
                                    list[index]['smartBill_CostHotelGroup'][indexGroup]['usercode'] = newValue
                                    list[index]['smartBill_CostHotelGroup'][indexGroup]['amount'] = 0
                                    setSmartBill_CostHotel(list)
                                  }
                                })
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={`ผู้ร่วมที่พักคนที่ ${indexGroup + 1} ห้องพักที่ ${index + 1}`}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          InputProps={{
                            inputComponent: NumericFormatCustom,
                          }}
                          key={indexGroup}
                          disabled
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                          value={resGroup.amount}
                          label="ค่าที่พัก/คืน"
                          onChange={(event) => {
                            const list = [...smartBill_CostHotel]
                            list[index]['smartBill_CostHotelGroup'][indexGroup]['amount'] = event.target.value
                            setSmartBill_CostHotel(list)
                          }}
                          fullWidth
                          name="amount"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          InputProps={{
                            inputComponent: NumericFormatCustom,
                          }}
                          key={indexGroup}
                          disabled
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000000",
                            },
                          }}
                          value={resGroup.amount * res.count}
                          label="ยอดเงินที่เบิกได้"
                          fullWidth
                          name="amount"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          disabled={
                            (payHotelCase === 0 || payHotelCase === "0") ||
                              res.smartBill_CostHotelGroup.length === 1 ||
                              smartBill_Withdraw[0].lock_status === true
                              ? true : false
                          }
                          key={indexGroup}
                          value={`${index},${resGroup.sbc_hotelgroupid}`}
                          onClick={(e) => handleServiceRemoveHotelGroup(e, indexGroup)}
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          color="error"
                        >
                          DELETE
                        </Button>
                      </Grid>
                    </React.Fragment>
                  ))}
                  {index === smartBill_CostHotel.length - 1 ? null : (
                    <Grid item xs={12}>
                      <Divider sx={{ py: 1 }} />
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSaveCostHotel}
              disabled={smartBill_Withdraw[0].lock_status === false ? false : true}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment >
    );
  } else {
    swal("แจ้งเตือน", 'ไม่พบรายการนี้', "error")
      .then(() => {
        window.location.href = '/Payment';
      })
  }
}