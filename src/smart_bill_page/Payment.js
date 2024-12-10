import * as React from 'react';
import Typography from '@mui/material/Typography';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
import DeleteIcon from '@mui/icons-material/Clear';
import ArticleIcon from '@mui/icons-material/Article';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import ButtonGroup from '@mui/material/ButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderDigitalClockTimeView, } from '@mui/x-date-pickers/timeViewRenderers';
import { usePickerLayout, pickersLayoutClasses, PickersLayoutRoot, PickersLayoutContentWrapper, } from '@mui/x-date-pickers/PickersLayout';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import NavBar from './NavBar'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import THBText from 'thai-baht-text' // for ES6
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Picture1 from '../image/Picture1.png'
import Picture2 from '../image/Picture2.png'


function ActionList(props) {
  const { onAccept, onClear, onCancel, onSetToday } = props;
  const actions = [
    { text: 'Clear', method: onClear },
    { text: 'Today', method: onSetToday },
    { text: 'Cancel', method: onCancel },
    { text: 'Accept', method: onAccept },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup size="small" aria-label="Small button group">
        {actions.map(({ text, method }) => (
          <Button key={text} onClick={method} disablePadding>
            {text}
          </Button>
        ))}
      </ButtonGroup>
    </Box >
  );
}

function CustomLayout(props) {
  const { tabs, content, actionBar } = usePickerLayout(props);

  return (
    <PickersLayoutRoot
      ownerState={props}
      sx={{
        overflow: 'auto',
        [`.${pickersLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
        [`.${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 2,
          gridRow: 1,
        },
      }}
    >
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
        <Divider />
        {actionBar}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const purple = {
  100: '#e5ccf1', // backgroud header
  200: '#DDA0DD', // backgroud sup header
  800: '#924794', // font header
  900: '#832161', // font sup header
};

const orange = {
  100: '#DEB841', // backgroud header
  200: '#DE9E36', // backgroud sup header
  800: '#EFA00B', // font header
  900: '#9E2B25', // font sup header
};

const green = {
  100: '#AFE3C0', // backgroud header
  200: '#90C290', // backgroud sup header
  800: '#688B58', // font header
  900: '#11270B', // font sup header
};

const Root = styled('div')(
  ({ theme }) => `
  table {
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    width: 100%;
  }
  td,th {
    border: 1px solid #BFCCD9;
    min-height: 50px;
    padding: 8px;
  }
  th {
    background-color: #FFFFFF;
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
  const [costOther, setCostOther] = React.useState([])
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
    typePay: "PTEC",
    condition: 0,
  }]);

  const [smartBill_WithdrawDtl, setSmartBill_WithdrawDtl] = React.useState([{
    sbwdtl_id: '',
    sbw_code: '',
    sbwdtl_operationid_startdate: dayjs().tz('Asia/Bangkok'),
    sbwdtl_operationid_enddate: dayjs().tz('Asia/Bangkok'),
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
      .then(response => {
        if (response.status === 200 && smartBill_WithdrawDtl.length === 1) {
          setSmartBill_WithdrawDtl([{
            sbwdtl_id: '',
            sbw_code: '',
            sbwdtl_operationid_startdate: dayjs().tz('Asia/Bangkok'),
            sbwdtl_operationid_enddate: dayjs().tz('Asia/Bangkok'),
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
          }])
        } else {
          gettingData();
        }
      })
  }

  const [case_WithdrawDtlSave, setCase_WithdrawDtlSave] = React.useState(0);


  const [sb_operationid, setSb_operationid] = React.useState();

  const [smartBill_WithdrawDtlSave, setSmartBill_WithdrawDtlSave] = React.useState([{
    sbw_code: sbw_code,
    sb_operationid: '',
    ownercode: smartBill_Withdraw[0].ownercode,
    car_infocode: carInfo[0].car_infocode,
    remark: '',
    sbwdtl_operationid_startdate: dayjs().tz('Asia/Bangkok'),
    sbwdtl_operationid_enddate: dayjs().tz('Asia/Bangkok'),
    sbwdtl_operationid_endmile: '',
    sbwdtl_operationid_startmile: ''
  }]);

  const handleOpenSmartBill_WithdrawDtlSave = async () => {
    try {
      // NonPO_PermisstionOperator
      await Axios.post(config.http + '/NonPO_PermisstionOperator', { category_nonpo: 'SCAD' }, config.headers)
        .then(async (Operator) => {

          const dataBody = ((Operator.data[0][0].acc).includes(data.UserCode) && [2, 3].includes(smartBill_Withdraw[0].condition)) ? null :
            carInfo[0].car_infocode

          const body = { car_infocode: dataBody }
          await Axios.post(config.http + '/SmartBill_Withdraw_Addrow', body, config.headers)
            .then((res) => {
              if (res.status === 200) {
                setSb_operationid(res.data[0])
                setOpenSmartBill_WithdrawDtlSave(true);
                gettingData();
              } else {
                setSb_operationid(null)
                setOpenSmartBill_WithdrawDtlSave(true);
              }
            })
        })
    } catch (error) {
      console.error(error);
    }
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
            sbwdtl_operationid_startdate: dayjs().tz('Asia/Bangkok'),
            sbwdtl_operationid_enddate: dayjs().tz('Asia/Bangkok'),
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
      sbwdtl_operationid_startdate: dayjs().tz('Asia/Bangkok'),
      sbwdtl_operationid_enddate: dayjs().tz('Asia/Bangkok'),
      sbwdtl_operationid_endmile: '',
      sbwdtl_operationid_startmile: ''
    }])
    gettingData();
  }

  const handleChangeCondition = async (event) => {
    if (smartBill_WithdrawDtl.map(res => res.sbwdtl_operationid_location !== '')[0]) {
      swal("แจ้งเตือน", 'ไม่สามารถเปลี่ยนได้ เนื่องจากมีการลงกิจกรรมแล้ว กรุณาทำรายการใหม่', "warning")
    } else if (event.target.value === 0 || event.target.value === '0') {
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
          const condition = [...smartBill_Withdraw]
          condition[0].condition = 0
          setSmartBill_Withdraw(condition)
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
          const condition = [...smartBill_Withdraw]
          condition[0].condition = 1
          setSmartBill_Withdraw(condition)
        })
    } else {
      const listCar = [...smartBill_Withdraw]
      listCar[0]['car_infocode'] = ''
      listCar[0]['condition'] = event.target.value
      setSmartBill_Withdraw(listCar)
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
    usercode: data.UserCode,
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
            usercode: response.data[0][0].usercode,
            category_id: body.category_id,
            amount: response.data[0][0].amount,
          });
        } else {
          setOpenDialogPayRush(true);
          setPayRush({
            sbwdtl_id: (e.target.value).split(',')[0],
            cost_id: '',
            payTrueDtl_satatus: 1,
            usercode: data.UserCode,
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

  const [payOther, setPayOther] = React.useState([{
    sbwdtl_id: '',
    cost_id: '',
    category_name: '',
    amount: '',
  }]);

  const handleAddOtherChip = (e, data) => {
    if (payOther.filter((res) => res.category_name === data.category_name)[0]) {
      swal('แจ้งเตือน', 'รายการนี้ถูกเพิ่มลงในบิลค่าใช้จ่ายแล้ว', 'warning')
    } else if (payOther[0].category_name === '') {
      setPayOther([{
        sbwdtl_id: payOther[0].sbwdtl_id,
        cost_id: '',
        category_name: data.category_name,
        amount: '',
      }])
    } else {
      setPayOther([...payOther, {
        sbwdtl_id: payOther[0].sbwdtl_id,
        cost_id: '',
        category_name: data.category_name,
        amount: '',
      }])
    }
  };

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
          for (const element of response.data[0]) {
            dataOnec.push({
              sbwdtl_id: element.sbwdtl_id,
              cost_id: element.cost_id,
              category_name: element.category_name,
              amount: element.amount,
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
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', payOther, config.headers)
      .then((res) => {
        if (res.status === 200) {
          setOpenDialogPayOther(false);
          gettingData();
        }
      })
  }

  const handleCloseDialogPayOther = () => {
    setOpenDialogPayOther(false);
  };

  // เบิกตามบิลจริง
  const [payTrueDtl, setPayTrueDtl] = React.useState({
    sbwdtl_id: '',
    cost_id: '',
    payTrueDtl_satatus: 1,
    usercode: data.UserCode,
    category_id: 1,
    amount: '',
  });

  const handleClickOpenDialogPayTrue = async (e) => {
    if (smartBill_Withdraw[0].car_paytype == 0) {
      swal("แจ้งเตือน", 'รถคันนี้เบิกตามไมลล์เท่านั้น', "error")
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
              usercode: response.data[0][0].usercode,
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
              usercode: data.UserCode,
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
    startdate: dayjs().tz('Asia/Bangkok'),
    enddate: dayjs().tz('Asia/Bangkok'),
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
      count: (dayjs(smartBill_CostAllowance[0].enddate).add(7, 'hour').diff(dayjs(smartBill_CostAllowance[0].startdate).add(7, 'hour'))) / (1000 * 60 * 60),
      startdate: smartBill_CostAllowance[0].startdate,
      enddate: smartBill_CostAllowance[0].enddate,
      usercode: '',
      foodStatus: 0,
      amount: '',
    }]);
  };

  const handleServiceRemoveAllowance = async (e, index) => {
    const body = {
      sbwdtl_id: smartBill_CostAllowance[index].sbwdtl_id,
      category_id: smartBill_CostAllowance[index].category_id,
    }
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectCategory', body, config.headers)
      .then((response) => {
        if (response.data[0].length === smartBill_CostAllowance.length) {
          Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteCategory', smartBill_CostAllowance[index], config.headers)
            .then((response) => {
              if (response.data && response.data[0].length > 0 && smartBill_CostAllowance.length > 1) {
                setSmartBill_CostAllowance(response.data[0].map((res) => {
                  return {
                    sbwdtl_id: res.sbwdtl_id,
                    cost_id: res.cost_id,
                    id: res.id,
                    category_id: res.category_id,
                    count: (new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600),
                    startdate: dayjs(res.startdate).add(7, "hour"),
                    enddate: dayjs(res.enddate).add(7, "hour"),
                    usercode: res.usercode,
                    foodStatus: res.foodStatus === true ? 1 : 0,
                    amount: res.foodStatus === true ? res.amount * 2 : res.amount,
                  }
                }))
                gettingData();
              } else {
                setSmartBill_CostAllowance([{
                  sbwdtl_id: '',
                  cost_id: '',
                  id: '',
                  category_id: 4,
                  count: '',
                  startdate: dayjs().tz('Asia/Bangkok'),
                  enddate: dayjs().tz('Asia/Bangkok'),
                  usercode: '',
                  foodStatus: 0,
                  amount: '',
                }])
              }
            })
        } else {
          const list = [...smartBill_CostAllowance];
          list.splice(index, 1);
          setSmartBill_CostAllowance(list);
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
              count: res.count,
              startdate: dayjs(res.startdate).add(7, "hour"),
              enddate: dayjs(res.enddate).add(7, "hour"),
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
            count: (dayjs(smartBill_WithdrawDtl[index].sbwdtl_operationid_enddate).add(7, 'hour').diff(dayjs(smartBill_WithdrawDtl[index].sbwdtl_operationid_startdate).add(7, 'hour'))) / (1000 * 60 * 60),
            startdate: dayjs(smartBill_WithdrawDtl[index].sbwdtl_operationid_startdate).add(7, 'hour'),
            enddate: dayjs(smartBill_WithdrawDtl[index].sbwdtl_operationid_enddate).add(7, 'hour'),
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
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', smartBill_CostAllowance, config.headers)
      .then((response) => {
        if (response.data && smartBill_CostAllowance.length > 1) {
          setSmartBill_CostAllowance(response.data[0].map((res) => {
            return {
              sbwdtl_id: res.sbwdtl_id,
              cost_id: res.cost_id,
              id: res.id,
              category_id: res.category_id,
              count: (new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600),
              startdate: dayjs(res.startdate).add(7, "hour"),
              enddate: dayjs(res.enddate).add(7, "hour"),
              usercode: res.usercode,
              foodStatus: res.foodStatus === true ? 1 : 0,
              amount: res.foodStatus === true ? res.amount * 2 : res.amount,
            }
          }))
          setOpenAllowance(false);
        } else {
          setSmartBill_CostAllowance([{
            sbwdtl_id: '',
            cost_id: '',
            id: '',
            category_id: 4,
            count: '',
            startdate: dayjs().tz('Asia/Bangkok'),
            enddate: dayjs().tz('Asia/Bangkok'),
            usercode: '',
            foodStatus: 0,
            amount: '',
          }])
          setOpenAllowance(false);
        }
        gettingData();
      })
  }

  // ค่าที่พัก //คนร่วมที่พัก
  const [payHotelCase, setPayHotelCase] = React.useState(1);

  const [smartBill_CostHotel, setSmartBill_CostHotel] = React.useState([{
    sbwdtl_id: '',
    cost_id: '',
    id: '',
    category_id: 3,
    count: '',
    startdate: dayjs().tz('Asia/Bangkok'),
    enddate: dayjs().tz('Asia/Bangkok'),
    sbc_hotelProvince: '',
    sbc_hotelname: '',
    amount: 0,
    usercode: data.UserCode,
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

  const handleServiceRemoveHotelGroup = async (e, index, indexGroup, resGroup) => {
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteHotelGroup', resGroup, config.headers)
      .then((res) => {
        const list = [...smartBill_CostHotel]
        const listCostHotel = [...smartBill_CostHotel[index]['smartBill_CostHotelGroup']]
        if (listCostHotel.length > 1) {
          listCostHotel.splice(indexGroup, 1);
          list[index]['smartBill_CostHotelGroup'] = listCostHotel
          setSmartBill_CostHotel(list);
        } else {
          list[index]['smartBill_CostHotelGroup'] = [{
            sbc_hotelid: '',
            sbc_hotelgroupid: '',
            usercode: '',
            amount: '',
          }]
          setSmartBill_CostHotel(list);
        }
      })
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
      startdate: dayjs().tz('Asia/Bangkok'),
      enddate: dayjs().tz('Asia/Bangkok'),
      sbc_hotelProvince: '',
      sbc_hotelname: '',
      amount: 0,
      usercode: data.UserCode,
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
              startdate: dayjs(response.data[0][i].startdate).add(7, "hour"),
              enddate: dayjs(response.data[0][i].enddate).add(7, "hour"),
              sbc_hotelProvince: response.data[0][i].sbc_hotelProvince,
              sbc_hotelname: response.data[0][i].sbc_hotelname,
              amount: response.data[0][i].amount,
              smartBill_CostHotelGroup:
                await Axios.post(config.http + '/SmartBill_WithdrawDtl_SelectHotelGroup', { sbc_hotelid: response.data[0][i].id }, config.headers)
                  .then((resHotelGroup) => (resHotelGroup.data[0]).length > 0 ? (resHotelGroup.data[0]) : [{
                    sbc_hotelid: '',
                    sbc_hotelgroupid: '',
                    usercode: '',
                    amount: '',
                  }])
            });
          }

          for (let i = 0; i < response.data[0].length; i++) {
            dataDateDiffOnec.push({
              dateInitialHotel: dayjs(response.data[0][i].startdate).add(7, "hour"),
              dateFinalHotel: dayjs(response.data[0][i].enddate).add(7, "hour"),
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
            startdate: dayjs().tz('Asia/Bangkok'),
            enddate: dayjs().tz('Asia/Bangkok'),
            sbc_hotelProvince: '',
            sbc_hotelname: '',
            amount: '',
            usercode: data.UserCode,
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
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesCategory', smartBill_CostHotel, config.headers)
      .then(async (response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0].map((res, index) => {
            return {
              sbwdtl_id: res.sbwdtl_id,
              cost_id: res.cost_id,
              id: res.id,
              category_id: res.category_id,
              count: res.count,
              startdate: dayjs(res.startdate).add(7, "hour"),
              enddate: dayjs(res.enddate).add(7, "hour"),
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
          if (data) {
            for (let i = 0; i < data.length; i++) {
              await Axios.post(config.http + '/SmartBill_WithdrawDtl_SaveChangesHotelGroup', data[i].smartBill_CostHotelGroup, config.headers)
              if (data.length === i + 1) {
                gettingData();
                setOpenCostHotel(false);
              }
            }
          } else {
            gettingData();
            setOpenCostHotel(false);
          }
        } else {
          gettingData();
          setOpenCostHotel(false);
        }
      })
  }

  const handleServiceRemoveCostHotel = async (e, index) => {
    await Axios.post(config.http + '/SmartBill_WithdrawDtl_DeleteCategory', smartBill_CostHotel[index], config.headers)
      .then((res) => {
        if (smartBill_CostHotel.map((res) => res.sbc_hotelProvince === '' || res.sbc_hotelname === '' || res.sbc_hotelname.amount === '')[0] && smartBill_CostHotel.length > 1) {
          setSmartBill_CostHotel([{
            sbwdtl_id: '',
            cost_id: '',
            id: '',
            category_id: 3,
            count: '',
            startdate: dayjs().tz('Asia/Bangkok'),
            enddate: dayjs().tz('Asia/Bangkok'),
            sbc_hotelProvince: '',
            sbc_hotelname: '',
            amount: '',
            usercode: data.UserCode,
            smartBill_CostHotelGroup: [{
              sbc_hotelid: '',
              sbc_hotelgroupid: '',
              usercode: '',
              amount: '',
            }]
          }]);
        } else {
          const list = [...smartBill_CostHotel];
          list.splice(index, 1);
          setSmartBill_CostHotel(list);
        }
      })
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setCostOther(response.data[0] ?? []);
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
            if (response.data[0][0].car_infocode) {
              const body = { car_infocode: response.data[0][0].car_infocode }
              await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
                .then((res) => {
                  if (res.data[0].car_infocode) {
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
                    if (res.data[0].car_infostatus_companny === true) {
                      const condition = [...smartBill_Withdraw]
                      condition[0].condition = 0
                      setSmartBill_Withdraw(condition)
                    } else if (res.data[0].car_infostatus_companny === false) {
                      const condition = [...smartBill_Withdraw]
                      condition[0].condition = 1
                      setSmartBill_Withdraw(condition)
                    }
                  }
                })
            } else {
              const condition = [...smartBill_Withdraw]
              condition[0].condition = 2
              setSmartBill_Withdraw(condition)
            }
            setSmartBill_Withdraw(response.data[0]);
            setSmartBill_WithdrawDtl(response.data[1])
          } else {
            const body = { car_infocode: response.data[0][0].car_infocode }
            await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
              .then((res) => {
                if (response.data[0][0].car_infocode) {
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
                  if (res.data[0].car_infostatus_companny === true) {
                    const condition = [...smartBill_Withdraw]
                    condition[0].condition = 0
                    setSmartBill_Withdraw(condition)
                  } else if (res.data[0].car_infostatus_companny === false) {
                    const condition = [...smartBill_Withdraw]
                    condition[0].condition = 1
                    setSmartBill_Withdraw(condition)
                  }
                } else {
                  const condition = [...smartBill_Withdraw]
                  condition[0].condition = 2
                  setSmartBill_Withdraw(condition)
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
    if([0,1].includes(smartBill_Withdraw[0].condition) && !smartBill_Withdraw[0].car_infocode){
      swal("แจ้งเตือน", 'กรุณาใส่เลขทะเบียนรถ', "warning")
    }else {
      await Axios.post(config.http + '/SmartBill_Withdraw_Save', smartBill_Withdraw[0], config.headers)
        .then((response) => {
          if (response.data[0][0].code) {
            window.location.href = '/Payment?' + response.data[0][0].code;
          } else {
            swal("แจ้งเตือน", 'error code #DEO0012', "error")
          }
        });
    }
  }

  const smartBill_Withdraw_updateSBW = async () => {
    const body = {
      sbw_code: sbw_code,
      usercode: smartBill_Withdraw[0].ownercode,
      condition: smartBill_Withdraw[0].condition,
      car_infocode: smartBill_Withdraw[0].car_infocode,
      pure_card: smartBill_Withdraw[0].pure_card,
      typePay: smartBill_Withdraw[0].typePay
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_updateSBW', body, config.headers)
      .then((response) => {
        if (response.status === 200) {
          swal("แจ้งเตือน", 'อัปเดทรายการสำเร็จ', "success", {
            buttons: false,
            timer: 1500,
          }).then(() => {
            window.location.href = '/Payment?' + sbw_code;
          })
        } else {
          swal("แจ้งเตือน", 'error code #DEO0012', "error")
        }
      });
  }

  const smartBill_Withdraw_updateLockSBW = async () => {
    const body = {
      sbw_code: sbw_code,
      usercode: smartBill_Withdraw[0].ownercode,
      condition: smartBill_Withdraw[0].condition,
      car_infocode: smartBill_Withdraw[0].car_infocode,
      pure_card: smartBill_Withdraw[0].pure_card,
      typePay: smartBill_Withdraw[0].typePay,
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
      condition: smartBill_Withdraw[0].condition,
      car_infocode: smartBill_Withdraw[0].car_infocode,
      pure_card: smartBill_Withdraw[0].pure_card,
      typePay: smartBill_Withdraw[0].typePay,
      lock_status: 0
    }
    await Axios.post(config.http + '/SmartBill_Withdraw_updateSBW', body, config.headers)
      .then((response) => {
        const searchTerm = 'กรุณายกเลิก';
        if (response.status === 200 && response.data.length === 0) {
          window.location.href = '/Payment?' + sbw_code;
        } else if (response.status === 200 && response.data.toLowerCase().includes(searchTerm.toLowerCase())) {
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
              disabled={smartBill_Withdraw[0].ownercode === ''}
              onClick={handleSmartBill_Withdraw_Save}
            >
              สร้างบิล
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
                          <img style={{ height: 40 }} alt="logo" src={smartBill_Withdraw[0].typePay === "PTEC" ? Picture1 : Picture2} loading="lazy" />
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
                              {smartBill_Withdraw[0].typePay === "PTEC" ? 'PURE THAI ENERGY CO.,LTD.' : 'SCT SAHAPAN COMPANY LIMITED'}
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
                  <TableCell align="center" colSpan={1}>
                    <FormControl fullWidth align="center" required sx={{ ml: 1 }}>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="companny"
                        value={smartBill_Withdraw[0].typePay}
                        onChange={(e) => {
                          const list = [...smartBill_Withdraw]
                          list[0]['typePay'] = e.target.value
                          setSmartBill_Withdraw(list);
                        }}
                      >
                        <FormControlLabel value="PTEC" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="PTEC" />
                        <FormControlLabel value="SCT" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="SCT" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" colSpan={2}>
                    <Autocomplete
                      autoHighlight
                      id="free-solo-demo"
                      freeSolo
                      name="ownercode"
                      value={smartBill_Withdraw[0].ownercode}
                      options={users.map((option) => option.UserCode)}
                      onChange={(event, newValue, reason) => {
                        if (reason === 'clear') {
                          const list = [...smartBill_Withdraw]
                          list[0]['ownercode'] = ''
                          setSmartBill_Withdraw(list)
                        } else {
                          const list = [...smartBill_Withdraw]
                          list[0]['ownercode'] = newValue
                          setSmartBill_Withdraw(list)
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
                        value={dayjs()}
                        //timezone='UTC'
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <FormControl fullWidth align="center" required sx={{ ml: 1 }}>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="companny"
                        value={smartBill_Withdraw[0].condition}
                        onChange={handleChangeCondition}
                      >
                        <FormControlLabel value={0} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์ของบริษัท" />
                        <FormControlLabel value={1} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์ส่วนตัว" />
                        <FormControlLabel value={2} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์สาธารณะ" />
                        <FormControlLabel value={3} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="อื่น ๆ" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" colSpan={3}>
                    {smartBill_Withdraw[0].condition > 1 ? <Box component="main" sx={{ height: 51.63 }} /> :
                      (
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            autoHighlight
                            id="free-solo-demo"
                            freeSolo
                            options={(carInfoDataCompanny || carInfoData).map((option) => option.car_infocode)}
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

                                const listCar = [...smartBill_Withdraw]
                                listCar[0]['car_infocode'] = ''
                                setSmartBill_Withdraw(listCar)

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

                                      const listCar = [...smartBill_Withdraw]
                                      listCar[0]['car_infocode'] = newInputValue
                                      setSmartBill_Withdraw(listCar)
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
                    {(!carInfo[0]['car_payname'] && smartBill_Withdraw[0].condition > 1 ? 'เบิกตามจริง' : carInfo[0]['car_payname'])}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: '15%' }}>ช่วงเวลาที่เดินทาง</TableCell>
                  <TableCell align="center" sx={{ width: '18%' }}>บันทึกกิจกรรม</TableCell>
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
                  <TableCell sx={{ width: '5.9%' }} />
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
                  {['', '', '0', '0', '0', '0', '0', '0', ''].map((res) => (
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
                disabled={smartBill_Withdraw[0].lock_status !== false}
                onClick={smartBill_Withdraw_updateSBW}
              >
                Save Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                disabled={smartBill_Withdraw[0].lock_status !== false}
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
                          <img style={{ height: 40 }} alt="logo" src={smartBill_Withdraw[0].typePay === "PTEC" ? Picture1 : Picture2} loading="lazy" />
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
                              {smartBill_Withdraw[0].typePay === "PTEC" ? 'PURE THAI ENERGY CO.,LTD.' : 'SCT SAHAPAN COMPANY LIMITED'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="center" colSpan={4}>
                    <Typography className="payment-Forms">
                      {sbw_code}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={1}>
                    <FormControl fullWidth align="center" required sx={{ ml: 1 }}>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="companny"
                        value={smartBill_Withdraw[0].typePay}
                        onChange={(e) => {
                          const list = [...smartBill_Withdraw]
                          list[0]['typePay'] = e.target.value
                          setSmartBill_Withdraw(list);
                        }}
                      >
                        <FormControlLabel value="PTEC" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="PTEC" />
                        <FormControlLabel value="SCT" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="SCT" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center" colSpan={2}>
                    <Autocomplete
                      autoHighlight
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
                          const list = [...smartBill_Withdraw]
                          list[0]['ownercode'] = ''
                          setSmartBill_Withdraw(list)
                        } else {
                          const list = [...smartBill_Withdraw]
                          list[0]['ownercode'] = newValue
                          setSmartBill_Withdraw(list)
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
                  <TableCell align="center" colSpan={3}>
                    {smartBill_Withdraw[0].createdate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <FormControl fullWidth align="center" required sx={{ ml: 1 }}>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="companny"
                        value={smartBill_Withdraw[0].condition}
                        onChange={handleChangeCondition}
                      >
                        <FormControlLabel value={0} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์ของบริษัท" />
                        <FormControlLabel value={1} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์ส่วนตัว" />
                        <FormControlLabel value={2} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถยนต์สาธารณะ" />
                        <FormControlLabel value={3} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="อื่น ๆ" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                  <TableCell align="left" colSpan={3}>
                    {smartBill_Withdraw[0].condition > 1 ? <Box component="main" sx={{ height: 51.63 }} /> :
                      (
                        <Grid item xs={6} sm={6}>
                          <Autocomplete
                            autoHighlight
                            id="free-solo-demo"
                            freeSolo
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
                            value={smartBill_Withdraw[0].car_infocode}
                            options={(carInfoDataCompanny || carInfoData).map((option) => option.car_infocode)}
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

                                const listCar = [...smartBill_Withdraw]
                                listCar[0]['car_infocode'] = ''
                                setSmartBill_Withdraw(listCar)

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

                                      const listCar = [...smartBill_Withdraw]
                                      listCar[0]['car_infocode'] = newInputValue
                                      setSmartBill_Withdraw(listCar)
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
                    {(!carInfo[0]['car_payname'] && smartBill_Withdraw[0].condition > 1 ? 'เบิกตามจริง' : carInfo[0]['car_payname'])}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                {smartBill_Withdraw[0].lock_status === false ? (
                  <TableRow>
                    <TableCell colSpan={14}>
                      <Button
                        variant="text"
                        fullWidth
                        onClick={handleOpenSmartBill_WithdrawDtlSave}
                      >
                        เพิ่มรายการ
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : null}
                <TableRow>
                  <TableCell align="center" sx={{ width: '15%' }}>ช่วงเวลาที่เดินทาง</TableCell>
                  <TableCell align="center" sx={{ width: '18%' }}>บันทึกกิจกรรม</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เริ่มต้น</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>สิ้นสุด</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ระยะทาง</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>อัตราชดเชย</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบิกตามไมล์เรท</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบิกตามบิล</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>เบี้ยเลี้ยง</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ที่พัก</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>ทางด่วน</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>อื่น ๆ</TableCell>
                  <TableCell align="center" sx={{ width: '5.9%' }}>รวม</TableCell>
                  <TableCell sx={{ width: '5.9%' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {smartBill_WithdrawDtl.map((res, index) => (
                  <TableRow key={res.sbwdtl_id}>
                    {res.sbwdtl_id === '' ?
                      <TableCell
                        align="center"
                        colSpan={14}
                        sx={{ fontFamily: 'monospace', color: 'red', fontWeight: 700, "&:disabled": { color: 'red' } }}
                      >
                        * กรุณาเพิ่มรายการที่ต้องการเบิก
                      </TableCell>
                      :
                      <>
                        <TableCell align="center">
                          Start Date: {dayjs(res.sbwdtl_operationid_startdate).add(7, 'hour').format('DD/MM/YYYY HH:mm')} <br />
                          End Date  : {dayjs(res.sbwdtl_operationid_enddate).add(7, 'hour').format('DD/MM/YYYY HH:mm')}
                        </TableCell>
                        <TableCell >{res.remark}</TableCell>
                        <TableCell align="center">{res.sbwdtl_operationid_startmile.toLocaleString("en-US")}</TableCell>
                        <TableCell align="center">{res.sbwdtl_operationid_endmile.toLocaleString("en-US")}</TableCell>
                        <TableCell align="center">{res.sum_mile.toLocaleString("en-US")}</TableCell>
                        <TableCell align="center">{res.price_rateoil.toLocaleString("en-US")}</TableCell>
                        <TableCell align="center">{res.sb_paystatus === false ? 0 : res.oilBath.toLocaleString("en-US")}</TableCell>
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
                            {(res.amouthTrueOil === '0' || res.amouthTrueOil === 0 || res.sb_paystatus === false) ? '0' : res.amouthTrueOil.toLocaleString("en-US")}
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
                            {(res.amouthAllowance === '0' || res.amouthAllowance === 0 || res.sb_paystatus === false) ? '0' : res.amouthAllowance.toLocaleString("en-US")}
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
                            {(res.amouthHotel === '0' || res.amouthHotel === 0 || res.sb_paystatus === false) ? '0' : res.amouthHotel.toLocaleString("en-US")}
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
                            {(res.amouthRush === '0' || res.amouthRush === 0 || res.sb_paystatus === false) ? '0' : res.amouthRush.toLocaleString("en-US")}
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
                            {(res.amouthother === '0' || res.amouthother === 0 || res.sb_paystatus === false) ? '0' : res.amouthother.toLocaleString("en-US")}
                          </Button>
                        </TableCell>
                        <TableCell align="center">{res.sb_paystatus === false ? 0 : res.amouthAll.toLocaleString("en-US")}</TableCell>
                        <TableCell>
                          <IconButton
                            key={index}
                            variant="text"
                            color="error"
                            onClick={(e) => removeSmartBill_wddtl(e, index)}
                          >
                            <DeleteIcon sx={{ fontSize: '1.2rem !important' }} />
                          </IconButton>
                        </TableCell>
                      </>
                    }
                  </TableRow>
                ))}
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={6}><b>รวม</b></TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.oilBath) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.oilBath)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.oilBath) : parseFloat(elt.sb_paystatus === false ? 0 : elt.oilBath);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : ''}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthTrueOil) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthTrueOil)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthTrueOil) : parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthTrueOil);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthAllowance) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthAllowance)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthAllowance) : parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthAllowance);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthHotel) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthHotel)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthHotel) : parseFloat(elt.sb_paystatus === false ? 0 : elt.sb_paystatus === false ? 0 : elt.amouthHotel);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthRush) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthRush)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthRush) : parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthRush);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthother) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthother)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthother) : parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthother);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell align="center" colSpan={1}>
                    <b>
                      {smartBill_WithdrawDtl[0].sbwdtl_id ? smartBill_WithdrawDtl.map(function (elt) {
                        return (/^\d+\.\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthAll) || /^\d+$/.test(elt.sb_paystatus === false ? 0 : elt.amouthAll)) ?
                          parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthAll) : parseFloat(elt.sb_paystatus === false ? 0 : elt.amouthAll);
                      }).reduce(function (a, b) { // sum all resulting numbers
                        return a + b
                      }).toLocaleString("en-US") : 0}
                    </b>
                  </TableCell>
                  <TableCell />
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
                <FormControl fullWidth align="center" required sx={{ ml: 1 }}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="companny"
                    value={case_WithdrawDtlSave}
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
                    <FormControlLabel value={0} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="เลือกรายการจาก SmartCar" />
                    <FormControlLabel value={1} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="สร้างรายการใหม่" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {case_WithdrawDtlSave == 0 ? (
                <Grid item xs={12}>
                  <Autocomplete
                    autoHighlight
                    id="free-solo-demo"
                    freeSolo
                    options={sb_operationid ?? []}
                    disabled={!sb_operationid}
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
                        list[0]['sbwdtl_operationid_startdate'] = dayjs(newInputValue.sb_operationid_startdate).add(7, "hour")
                        list[0]['sbwdtl_operationid_enddate'] = dayjs(newInputValue.sb_operationid_enddate).add(7, "hour")
                        list[0]['sbwdtl_operationid_endmile'] = newInputValue.sb_operationid_endmile
                        list[0]['sbwdtl_operationid_startmile'] = newInputValue.sb_operationid_startmile
                        list[0]['remark'] = newInputValue.sb_operationid_location
                        setSmartBill_WithdrawDtlSave(list)
                      }
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth label="เลือกรายการ" />}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    format="DD/MM/YYYY HH:mm"
                    name="sbwdtl_operationid_startdate"
                    closeOnSelect={true}
                    views={['day', 'hours']}
                    label={`วันที่เริ่มต้น`}
                    viewRenderers={{ hours: renderDigitalClockTimeView }}
                    value={smartBill_WithdrawDtlSave[0].sb_operationid ? smartBill_WithdrawDtlSave[0].sbwdtl_operationid_startdate : null}
                    slots={{
                      layout: CustomLayout,
                      actionBar: ActionList,
                    }}
                    sx={{ width: '100%' }}
                    onChange={(newValue) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['sbwdtl_operationid_startdate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                      setSmartBill_WithdrawDtlSave(list)
                    }}
                    ampm={false}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    format="DD/MM/YYYY HH:mm"
                    name="sbwdtl_operationid_enddate"
                    closeOnSelect={true}
                    views={['day', 'hours']}
                    label={`วันที่สิ้นสุด`}
                    viewRenderers={{ hours: renderDigitalClockTimeView }}
                    value={smartBill_WithdrawDtlSave[0].sb_operationid ? smartBill_WithdrawDtlSave[0].sbwdtl_operationid_enddate : null}
                    slots={{
                      layout: CustomLayout,
                      actionBar: ActionList,
                    }}
                    sx={{ width: '100%' }}
                    onChange={(newValue) => {
                      const list = [...smartBill_WithdrawDtlSave]
                      list[0]['sbwdtl_operationid_enddate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
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
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }} id="customized-dialog-title">
            ค่าทางด่วน
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
              sx={{ px: 5 }}
            >
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
                      usercode: data.UserCode,
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
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }} id="customized-dialog-title">
            ค่าใช้จ่ายอื่น ๆ
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
            >
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    pb: 2,
                    px: 5,
                    m: 0,
                    color: '#E15554',
                    fontSize: '16px !important'
                  }}
                  component="ul"
                >
                  กดปุ่มเพิ่มหัวข้อที่ต้องการเบิกจากหัวข้อด้านล่างนี้*
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    px: 5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {costOther.map((data, index) => {
                    return (
                      <ListItem key={index}>
                        <Chip
                          label={data.category_name}
                          sx={{ backgroundColor: green[200] }}
                          onClick={(e) => handleAddOtherChip(e, data)}
                        />
                      </ListItem>
                    );
                  })}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TableContainer sx={{ px: 5, py: 1 }}>
                  <Table sx={{ width: '100%', border: '1px solid', }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: green[100] }}>
                        <TableCell sx={{ fontWeight: 'bold', color: green[900] }}>รายการที่เบิก</TableCell>
                        <TableCell colSpan={2} />
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: green[900] }}>เบิกได้&nbsp;(บาท)</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(payOther.length > 0) ? payOther.map((res, index) => (
                        <TableRow key={res.sbwdtl_id}>
                          <TableCell>{res.category_name ?? ''}</TableCell>
                          <TableCell colSpan={2} />
                          <TableCell align="right">
                            <TextField
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                              }}
                              inputProps={{ style: { textAlign: 'right' } }}
                              value={res.amount}
                              onChange={(e) => {
                                const list = [...payOther]
                                list[index]['amount'] = e.target.value
                                setPayOther(list)
                              }}
                              variant='standard'
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              key={index}
                              onClick={(e) => reMovePayOther(e, index)}
                              variant="outlined"
                              color="error"
                            >
                              <DeleteIcon sx={{ fontSize: '1.2rem !important' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )) : []}
                    </TableBody>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: green[100] }}>
                        <TableCell sx={{ fontWeight: 'bold' }} colSpan={3}>
                          ยอดรวมจาหค่าอื่น ๆ ทั้งหมด
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {payOther.map(function (item) {
                            return parseFloat((item.amount === '' ? 0 : item.amount))
                          }).reduce(function (a, b) { // sum all resulting numbers
                            return a + b
                          }).toLocaleString()}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Grid>
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
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }} id="customized-dialog-title">
            ค่าน้ำมันรถเบิกตามจริง
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
              sx={{ px: 5 }}
            >
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
                      usercode: data.UserCode,
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
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }} id="customized-dialog-title">
            ค่าเบี้ยเลี้ยง
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
              <TableContainer sx={{ px: 5, py: 1 }}>
                <Table sx={{ width: '100%', border: '1px solid', }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: orange[100] }}>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: orange[900], width: 120 }}>ผู้เบิกรายการ</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: orange[900], width: 150 }}>วันที่เริ่มต้น</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: orange[900], width: 150 }}>วันที่สิ้นสุด</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: orange[900], width: 100 }}>Day:hour</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: orange[900], width: 100 }}>อาหาร</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: orange[900], width: 120 }}>เบิกได้&nbsp;(บาท)</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {smartBill_CostAllowance.map((res, index) => (
                      <TableRow key={res.sbwdtl_id}>
                        <TableCell align="center" component="th" scope="row">
                          <Autocomplete
                            autoHighlight
                            id="free-solo-demo"
                            freeSolo
                            name="usercode"
                            value={res.usercode}
                            disabled={payAllowanceCase == 0 ? true : false}
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
                                variant='standard'
                                fullWidth
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: orange[900] }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              format="DD/MM/YYYY HH:mm"
                              name="sbwdtl_operationid_enddate"
                              closeOnSelect={true}
                              views={['day', 'hours']}
                              viewRenderers={{ hours: renderDigitalClockTimeView }}
                              slots={{
                                layout: CustomLayout,
                                actionBar: ActionList,
                              }}
                              slotProps={{
                                field: { size: 'small' }, textField: {
                                  variant: 'standard',
                                },
                              }}
                              sx={{ width: '100%' }}
                              value={res.startdate ? dayjs(res.startdate) : undefined}
                              onChange={(newValue) => {
                                const list = [...smartBill_CostAllowance]
                                list[index]['startdate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                                list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600))
                                setSmartBill_CostAllowance(list)
                              }}
                              ampm={false}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: orange[900] }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              format="DD/MM/YYYY HH:mm"
                              name="sbwdtl_operationid_enddate"
                              closeOnSelect={true}
                              views={['day', 'hours']}
                              viewRenderers={{ hours: renderDigitalClockTimeView }}
                              slots={{
                                layout: CustomLayout,
                                actionBar: ActionList,
                              }}
                              slotProps={{
                                field: { size: 'small' }, textField: {
                                  variant: 'standard',
                                },
                              }}
                              sx={{ width: '100%' }}
                              value={res.enddate ? dayjs(res.enddate) : undefined}
                              onChange={(newValue) => {
                                const list = [...smartBill_CostAllowance]
                                list[index]['enddate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                                list[index]['count'] = Math.trunc((new Date(res.enddate) - new Date(res.startdate)) / (1000 * 3600))
                                setSmartBill_CostAllowance(list)
                              }}
                              ampm={false}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell align="right">
                          {Math.trunc((res.count / 24))}D : {Math.ceil((res.count % 24))}H
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" justifyContent="center">
                            <Typography>ไม่มี</Typography>
                            <Switch
                              checked={res.foodStatus === 1}
                              inputProps={{ 'aria-label': 'ant design' }}
                              onChange={(event) => {
                                const list = [...smartBill_CostAllowance]
                                list[index]['foodStatus'] = event.target.checked ? 1 : 0
                                setSmartBill_CostAllowance(list)
                              }}
                            />
                            <Typography>มี</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {(res.foodStatus === 1 ? ((res.amount === '' ? 0 : res.amount) / 2) * Math.ceil(Math.trunc((res.count / 12)) / 2) :
                            (res.amount === '' ? 0 : res.amount) * Math.ceil(Math.trunc((res.count / 12)) / 2)).toLocaleString()}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            key={index}
                            onClick={(e) => handleServiceRemoveAllowance(e, index)}
                            variant="outlined"
                            color="error"
                          >
                            <DeleteIcon sx={{ fontSize: '1.2rem !important' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Button
                          disabled={!!(payAllowanceCase == 0 || smartBill_Withdraw[0].lock_status === true)}
                          onClick={handleServiceAddAllowance}
                          variant="text"
                          startIcon={<ArticleIcon />}
                        >
                          + เพิ่มรายการผู้เบิกเบี้ยเลี้ยง
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: orange[100] }}>
                      <TableCell align="left" colSpan={5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: orange[900] }}>
                          ยอดรวมจากค่าเบี้ยเลี้ยงทั้งหมด
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: orange[900] }}>
                        {smartBill_CostAllowance.map(function (item) {
                          return item.foodStatus === 1 ? (((item.amount === '' ? 0 : item.amount) * Math.ceil(Math.trunc(((item.count === '' ? 0 : item.count) / 12)) / 2)) / 2) :
                            ((item.amount === '' ? 0 : item.amount) * Math.ceil(Math.trunc(((item.count === '' ? 0 : item.count) / 12)) / 2));
                        }).reduce(function (a, b) { // sum all resulting numbers
                          return a + b
                        }).toLocaleString()}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSaveAllowance}
              disabled={smartBill_Withdraw[0].lock_status !== false}
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
          <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }} id="customized-dialog-title">
            ค่าที่พัก
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
              <TableContainer sx={{ px: 5, py: 2 }}>
                <Table sx={{ width: '100%', }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: purple[800], fontWeight: 'bold' }}>
                        ค่าที่พักรวมทั้งหมดปัจจุบัน: {smartBill_CostHotel.map(function (item) {
                          const total = item.amount === '' ? 0 : item.amount;
                          const totalGroup = item.smartBill_CostHotelGroup.map(function (itemGroup) {
                            return parseFloat((itemGroup.amount === '' ? 0 : itemGroup.amount)) * parseFloat((item.count === '' ? 0 : item.count))
                          }).reduce(function (a, b) {
                            return a + b
                          })
                          if (totalGroup > total) {
                            return total;
                          } else {
                            return totalGroup;
                          }
                        }).reduce(function (a, b) {
                          return a + b
                        }).toLocaleString()} บาท
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {smartBill_CostHotel.map((res, index) => (
                <TableContainer key={res.cost_id} sx={{ px: 5, py: 2 }}>
                  <Table sx={{ width: '100%', border: '1px solid', }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: purple[100] }}>
                        <TableCell colSpan={3}>
                          <Typography variant='h2' sx={{ color: purple[800], fontWeight: 'bold' }}>
                            บิลค่าที่พักรายการที่ {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            key={index}
                            disabled={smartBill_CostHotel.length > 1 ? false : true}
                            onClick={(e) => handleServiceRemoveCostHotel(e, index)}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                          >
                            <DeleteIcon sx={{ fontSize: '1.2rem !important' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ backgroundColor: purple[100] }}>
                        <TableCell sx={{ width: 150 }}>
                          <Autocomplete
                            autoHighlight
                            id="free-solo-demo"
                            freeSolo
                            name="sbc_hotelProvince"
                            disabled={payHotelCase == 0 ? true : false}
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
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      จังหวัด:
                                    </InputAdornment>
                                  ),
                                }}
                                variant='standard'
                                fullWidth
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 200 }}>
                          <TextField
                            disabled={payHotelCase == 0 ? true : false}
                            key={index}
                            value={res.sbc_hotelname}
                            onChange={(event) => {
                              const list = [...smartBill_CostHotel]
                              list[index]['sbc_hotelname'] = event.target.value
                              setSmartBill_CostHotel(list)
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ชื่อที่พัก:
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            variant='standard'
                            name="sbc_hotelname"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            disabled={payHotelCase == 0 ? true : false}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                              startAdornment: (
                                <InputAdornment position="start">
                                  จำนวนคืนที่พัก:
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const list = [...smartBill_CostHotel]
                              list[index]['count'] = event.target.value
                              setSmartBill_CostHotel(list)
                            }}
                            key={index}
                            value={res.count}
                            variant='standard'
                            fullWidth
                            name="count"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ width: 50 }}>
                          <TextField
                            disabled={payHotelCase == 0 ? true : false}
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                              startAdornment: (
                                <InputAdornment position="start">
                                  ยอดตามบิล:
                                </InputAdornment>
                              ),
                            }}
                            key={index}
                            value={res.amount === 0 ? '' : res.amount}
                            onChange={(event) => {
                              const list = [...smartBill_CostHotel]
                              list[index]['amount'] = parseFloat(event.target.value)
                              setSmartBill_CostHotel(list)
                            }}
                            variant='standard'
                            fullWidth
                            name="amount"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ backgroundColor: purple[200] }}>
                        <TableCell sx={{ color: purple[900], fontWeight: 'bold', width: 100 }}>
                          ผู้เบิกรายการ
                        </TableCell>
                        <TableCell align="right" sx={{ color: purple[900], fontWeight: 'bold', width: 100 }}>
                          ค่าที่พัก/คืน
                        </TableCell>
                        <TableCell align="right" sx={{ color: purple[900], fontWeight: 'bold', width: 100 }}>
                          เบิกได้&nbsp;(บาท)
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {res.smartBill_CostHotelGroup.map((resGroup, indexGroup) => (
                        <TableRow key={indexGroup}>
                          <TableCell sx={{ width: 100 }}>
                            <Autocomplete
                              autoHighlight
                              id="free-solo-demo"
                              freeSolo
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
                                  variant='standard'
                                  label={`ผู้พักคนที่ ${indexGroup + 1}`}
                                />
                              )}
                            />
                          </TableCell >
                          <TableCell align="right" sx={{ width: 100 }}>
                            {(resGroup.amount === '' ? 0 : resGroup.amount).toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {((resGroup.amount === '' ? 0 : resGroup.amount) * (res.count === '' ? 0 : res.count)).toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              key={indexGroup}
                              onClick={(e) => handleServiceRemoveHotelGroup(e, index, indexGroup, resGroup)}
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                              color="error"
                            >
                              <DeleteIcon sx={{ fontSize: '1.2rem !important' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ width: '100%' }} colSpan={4}>
                          <Button
                            key={index}
                            onClick={(e) => handleServiceAddCostHotelGroup(e, index)}
                            variant="text"
                            startIcon={<NoteAddIcon />}
                          >
                            + เพิ่มผู้พัก
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: purple[100] }}>
                        <TableCell colSpan={2} sx={{ color: purple[800], fontWeight: 'bold' }}>
                          ยอดรวมจากผู้เข้าพัก
                        </TableCell>
                        <TableCell align='right' sx={{ color: purple[800], fontWeight: 'bold' }}>
                          {smartBill_CostHotel[index]['smartBill_CostHotelGroup'].map(function (item) {
                            return parseFloat((item.amount === '' ? 0 : item.amount) * (smartBill_CostHotel[index].count === '' ? 0 : smartBill_CostHotel[index].count))
                          }).reduce(function (a, b) { // sum all resulting numbers
                            return a + b
                          }).toLocaleString()}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                      <TableRow sx={{ backgroundColor: purple[100] }}>
                        <TableCell colSpan={2} sx={{ color: purple[800], fontWeight: 'bold' }}>
                          ยอดที่เบิกได้
                        </TableCell>
                        <TableCell align='right' sx={{ color: purple[800], fontWeight: 'bold' }}>
                          {((smartBill_CostHotel[index]['smartBill_CostHotelGroup'].map(function (item) {
                            return parseFloat((item.amount === '' ? 0 : item.amount) * (smartBill_CostHotel[index].count === '' ? 0 : smartBill_CostHotel[index].count))
                          }).reduce(function (a, b) { // sum all resulting numbers
                            return a + b
                          }) ?? 0) >= (smartBill_CostHotel[index].amount === '' ? 0 : smartBill_CostHotel[index].amount)) ? smartBill_CostHotel[index].amount.toLocaleString() :
                            (smartBill_CostHotel[index]['smartBill_CostHotelGroup'].map(function (item) {
                              return parseFloat((item.amount === '' ? 0 : item.amount) * (smartBill_CostHotel[index].count === '' ? 0 : smartBill_CostHotel[index].count))
                            }).reduce(function (a, b) { // sum all resulting numbers
                              return a + b
                            })).toLocaleString()}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                  </Table>
                  <br />
                  <br />
                </TableContainer>
              ))}
              <TableContainer sx={{ px: 5, pb: 1 }}>
                <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                  <Button
                    fullWidth
                    onClick={handleServiceAddCostHotel}
                    title="เพิ่มบิลค่าที่พัก"
                    sx={{ color: purple[800], '&:hover': { border: `1px solid ${purple[200]}` } }}
                  >
                    <AddCircleIcon sx={{ fontSize: '1.5rem !important' }} />
                  </Button>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleSaveCostHotel}
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