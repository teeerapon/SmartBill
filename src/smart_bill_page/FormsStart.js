/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Axios from "axios";
import config from '../config'
import swal from 'sweetalert';
import Autocomplete from '@mui/material/Autocomplete';
import NavBar from './NavBar'
import ImageListItemBar from '@mui/material/ImageListItemBar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Chip from '@mui/material/Chip';
import Picture1 from '../image/Picture1.png'
import Picture2 from '../image/Picture2.png'


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

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function FormsStart() {

  // ใช้สำหรับสร้างเวลาปัจจุบัน
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [typeCar, setTypeCar] = React.useState('');
  const [carInfoDataCompanny, setCarInfoDataCompanny] = React.useState([]);
  const [carInfoData, setCarInfoData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const data = JSON.parse(localStorage.getItem('data'));
  const [smartBill_Header, setSmartBill_Header] = React.useState([{
    usercode: data.UserCode,
    sb_name: 'PTEC',
    sb_fristName: data.fristName ? data.fristName : '',
    sb_lastName: data.lastName ? data.lastName : '',
    clean_status: 0,
    group_status: 0,
    reamarks: '',
  }])

  const [carInfo, setCarInfo] = React.useState([{
    car_infocode: '',
    car_infostatus_companny: '',
    car_categaryid: '',
    car_typeid: '',
    car_band: '',
    car_tier: '',
    car_color: '',
    car_remarks: '',
  }])

  const [smartBill_Operation, setSmartBill_Operation] = React.useState([{
    sb_operationid_startdate: dayjs().tz('Asia/Bangkok'),
    sb_operationid_startmile: '',
    sb_operationid_startoil: '',
    sb_operationid_enddate: dayjs().tz('Asia/Bangkok'),
    sb_operationid_endoil: '',
    sb_operationid_endmile: '',
    sb_paystatus: '',
    sb_operationid_location: '',
  }]);

  const [smartBill_Associate, setSmartBill_Associate] = React.useState([{
    allowance_usercode: '',
    sb_associate_startdate: '',
    sb_associate_enddate: ''
  }]);

  const [dataFilesCount, setDataFilesCount] = React.useState()

  const oil_persent = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  const handle_files = async (event) => {
    event.preventDefault();

    if (!dataFilesCount) {
      const fileBolb = URL.createObjectURL(event.target.files[0])
      setDataFilesCount([{
        file: fileBolb,
        fileData: event.target.files[0],
        filename: event.target.files[0].name,
      }])
    } else {
      const fileBolb = URL.createObjectURL(event.target.files[0])
      setDataFilesCount([...dataFilesCount, {
        file: fileBolb,
        fileData: event.target.files[0],
        filename: event.target.files[0].name,
      }])
    }
  };

  const handleServiceAddDate = (index) => {
    setSmartBill_Operation([...smartBill_Operation, {
      sb_operationid_startdate: undefined,
      sb_operationid_startmile: '',
      sb_operationid_startoil: '',
      sb_operationid_enddate: smartBill_Operation[index - 1] ? smartBill_Operation[index - 1].sb_operationid_startmile : undefined,
      sb_operationid_endoil: '',
      sb_operationid_endmile: '',
      sb_paystatus: '',
      sb_operationid_location: '',
    }]);
  };

  const handleServiceRemoveDate = () => {
    const list = [...smartBill_Operation];
    list.splice((smartBill_Operation.length - 1), 1);
    setSmartBill_Operation(list);
  };

  const handleSubmit = async () => {
    if (
      smartBill_Header[0].usercode === '' ||
      smartBill_Header[0].sb_fristName === '' ||
      smartBill_Header[0].sb_lastName === '' ||
      smartBill_Header[0].reamarks === ''
    ) {
      swal(
        "แจ้งเตือน",
        (smartBill_Header[0].sb_fristName === '' || smartBill_Header[0].sb_lastName === '') ? `ระบุชื่อจริง-นามสกุล` :
          (smartBill_Header[0].usercode === '') ? `ระบุผู้ทำรายการ` :
            smartBill_Header[0].reamarks === '' ? 'ระบุสถานที่จอดรถหลังการใช้งาน' : 'Error Code #54878584'
        , "error")
    } else if (carInfo.filter((res) =>
      res.car_infocode === '' ||
      res.car_typeid === '' ||
      res.car_band === '' ||
      res.car_tier === '' ||
      res.car_color === ''
    )[0]
    ) {
      swal(
        "แจ้งเตือน", carInfo[0].car_infocode === '' ? 'ระบุเลขทะเบียน' :
        carInfo[0].car_typeid === '' ? 'ระบุประเภท' :
          carInfo[0].car_band === '' ? 'ระบุแบรนด์' :
            carInfo[0].car_tier === '' ? 'ระบุรุ่น' :
              carInfo[0].car_color === '' ? 'ระบุสี' : 'Error Code #54878584'
        , "error")
    } else if (smartBill_Operation.filter((res) => (res.sb_operationid_startdate === '' ||
      res.sb_operationid_startmile === '' ||
      res.sb_operationid_startoil === '' ||
      res.sb_operationid_enddate === '' ||
      res.sb_operationid_endoil === '' ||
      res.sb_operationid_endmile === '' ||
      res.sb_paystatus === '' ||
      res.sb_operationid_location === ''))[0]
    ) {
      swal("แจ้งเตือน", smartBill_Operation.filter((res) => (res.sb_operationid_startdate === '' || res.sb_operationid_enddate === ''))[0] ? 'ระบุวันที่เดินทาง' :
        smartBill_Operation.filter((res) => (res.sb_operationid_startmile === '' || res.sb_operationid_endmile === ''))[0] ? 'ระบุเลขไมลล์เดินทาง' :
          smartBill_Operation.filter((res) => (res.sb_operationid_startoil === '' || res.sb_operationid_endoil === ''))[0] ? 'ระบุปริมาณน้ำมัน' :
            smartBill_Operation.filter((res) => (res.sb_operationid_location === ''))[0] ? 'ระบุกิจกรรมที่ทำ' : 'ระบุข้อมูล Pay (เบิก/ไม่เบิก)'
        , "error")
    } else if (!dataFilesCount) {
      swal("แจ้งเตือน", 'อัปโหลดรูปภาพอย่างน้อย 1 รูป', "error")
    } else if (smartBill_Operation.filter((res) => (res.sb_operationid_startmile ? parseFloat(res.sb_operationid_startmile) : 0) > (res.sb_operationid_endmile ? parseFloat(res.sb_operationid_endmile) : 0))[0]) {
      swal("แจ้งเตือน", 'เกิดข้อผิดพลาด *(ไมลล์สิ้นสุด < ไมลล์เริ่มต้น)', "error")
    } else {
      const body = {
        smartBill_Header: smartBill_Header,
        carInfo: carInfo,
        smartBill_Operation: smartBill_Operation,
        smartBill_Associate: smartBill_Associate,
      }
      await Axios.post(config.http + '/SmartBill_CreateForms', body, config.headers)
        .then(async (response) => {
          for (let i = 0; i < dataFilesCount.length; i++) {

            let formData_1 = new FormData();
            formData_1.append('file', dataFilesCount[i].fileData);
            formData_1.append('sb_code', response.data);

            await Axios.post(config.http + '/SmartBill_files', formData_1, config.headers)
              .then((res) => {
                swal("แจ้งเตือน", 'บันทึกรายการแล้ว', "success")
                  .then((res) => {
                    window.location.href = '/FormUpdate?' + response.data;
                  })
              })
          }
        })
    }
  }

  const gettingUsers = async () => {
    const headers = {
      'Authorization': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    };

    // แสดง users ทั้งหมด
    await Axios.get(config.http + '/getsUserForAssetsControl', { headers })
      .then((res) => {
        setUsers(res.data.data)
      })
  }

  React.useEffect(() => {
    gettingUsers();
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3} sx={{ pt: 5, pb: 10 }}>
            <Grid item xs={3}>
              <Box>
                <img style={{ height: 40 }} alt="logo" src={smartBill_Header[0].sb_name === 'SCT' ? Picture2 : Picture1} loading="lazy" />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" align="center" className="Header-Forms">
                {smartBill_Header[0].sb_name === 'SCT' ? 'SCT SAHAPAN COMPANY LIMITED' : 'PURE THAI ENERGY CO.,LTD.'}
              </Typography>
              <Typography variant="body2" align="center" className="Header-Forms">
                <b>Smart Car Form</b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Box alignItems="center" height={40} p={1} sx={{ border: '2px solid grey' }}>
                <Typography variant="caption" display="block" gutterBottom align="center">
                  None
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <React.Fragment>
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={6} sm={2}>
                <Autocomplete
                  autoHighlight
                  id="free-solo-demo"
                  freeSolo
                  name="usercode"
                  value={smartBill_Header[0].usercode}
                  options={users.map((option) => option.UserCode)}
                  onChange={(event, newValue, reason) => {
                    if (reason === 'clear') {
                      const list = [...smartBill_Header]
                      list[0]['usercode'] = ''
                      list[0]['sb_fristName'] = ''
                      list[0]['sb_lastName'] = ''
                      setSmartBill_Header(list)
                    } else {
                      const list = [...smartBill_Header]
                      list[0]['usercode'] = newValue
                      list[0]['sb_fristName'] = users.filter((text) => text.UserCode === newValue)[0].fristName
                      list[0]['sb_lastName'] = users.filter((text) => text.UserCode === newValue)[0].lastName
                      setSmartBill_Header(list)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`ผู้ทำรายการ`}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">companny</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={smartBill_Header[0].sb_name}
                    label="companny"
                    onChange={(e) => {
                      const list = [...smartBill_Header]
                      list[0]['sb_name'] = e.target.value
                      setSmartBill_Header(list)
                    }}
                  >
                    <MenuItem value="PTEC">PTEC</MenuItem>
                    <MenuItem value="SCT">SCT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  name="sb_fristName"
                  label="First name (ชื่อจริง)"
                  fullWidth
                  value={smartBill_Header[0].sb_fristName}
                  autoComplete="given-name"
                  onChange={(event) => {
                    const list = [...smartBill_Header]
                    list[0]['sb_fristName'] = event.target.value
                    setSmartBill_Header(list)
                  }}
                // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="sb_lastName"
                  name="sb_lastName"
                  label="Last name (นามสกุล)"
                  fullWidth
                  value={smartBill_Header[0].sb_lastName}
                  autoComplete="family-name"
                  onChange={(event) => {
                    const list = [...smartBill_Header]
                    list[0]['sb_lastName'] = event.target.value
                    setSmartBill_Header(list)
                  }}
                // variant="standard"
                />
              </Grid>

              {/* ฟอร์ม Car-Info */}
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth sx={{ ml: 1 }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">ประเภทการใช้งานรถยนต์</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="sb_paystatus"
                    onChange={async (event) => {
                      if (event.target.value == 1) {
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
                            setCarInfoDataCompanny(response.data.filter((res) => res.car_infostatus_companny === true)); // 1 รถบริษัท
                            setCarInfo(list)
                            setTypeCar(event.target.value);
                          })
                      } else {
                        const body = { car_infocode: null }
                        await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
                          .then((response) => {
                            const list = [...carInfo]
                            list[0]['car_infostatus_companny'] = event.target.value
                            list[0]['car_infocode'] = event.target.value === 0 ? '' : list[0]['car_infocode']
                            list[0]['car_infostatus_companny'] = event.target.value === 0 ? '' : list[0]['car_infostatus_companny']
                            list[0]['car_categaryid'] = event.target.value === 0 ? 5 : list[0]['car_categaryid']
                            list[0]['car_typeid'] = event.target.value === 0 ? '' : list[0]['car_typeid']
                            list[0]['car_band'] = event.target.value === 0 ? '' : list[0]['car_band']
                            list[0]['car_tier'] = event.target.value === 0 ? '' : list[0]['car_tier']
                            list[0]['car_color'] = event.target.value === 0 ? '' : list[0]['car_color']
                            list[0]['car_remarks'] = event.target.value === 0 ? '' : list[0]['car_remarks']
                            setCarInfoData(response.data.filter((res) => res.car_infostatus_companny === false)); //  0 รถส่วนตัว
                            setCarInfo(list)
                            setTypeCar(event.target.value);
                          })
                      }
                    }}
                    value={typeCar}
                  >
                    <FormControlLabel value={1} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถบริษัท" />
                    <FormControlLabel value={0} control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="รถส่วนตัว" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                {typeCar == 1 ? (
                  <Autocomplete
                    autoHighlight
                    id="free-solo-demo"
                    freeSolo
                    options={carInfoDataCompanny.map((option) => option.car_infocode)}
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
                        setCarInfo(list)
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
                              setCarInfo(list)

                              const mileStartList = [...smartBill_Operation]
                              mileStartList[0]['sb_operationid_startmile'] = response.data[0].mileRate
                              setSmartBill_Operation(mileStartList)
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
                ) : (
                  <Autocomplete
                    autoHighlight
                    id="free-solo-demo"
                    freeSolo
                    options={carInfoData.map((option) => option.car_infocode)}
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
                        setCarInfo(list)
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
                              setCarInfo(list)

                              const mileStartList = [...smartBill_Operation]
                              mileStartList[0]['sb_operationid_startmile'] = response.data[0].mileRate
                              setSmartBill_Operation(mileStartList)
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
                )}
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">ประเภทของรถ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="car_typeid"
                    label="ประเภทของรถ"
                    value={carInfo[0].car_typeid}
                    onChange={(event) => {
                      const list = [...carInfo]
                      list[0]['car_typeid'] = event.target.value
                      setCarInfo(list)
                    }}
                  // variant="standard"
                  >
                    <MenuItem value={2}>รถมอเตอร์ไซค์</MenuItem>
                    <MenuItem value={3}>รถยนต์</MenuItem>
                    <MenuItem value={4}>รถยนต์กระบะ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  required
                  name="car_band"
                  label="ยี่ห้อของรถ"
                  value={carInfo[0].car_band}
                  fullWidth
                  autoComplete="given-name"
                  onChange={(event) => {
                    const list = [...carInfo]
                    list[0]['car_band'] = event.target.value
                    setCarInfo(list)
                  }}
                // variant="standard"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  required
                  name="car_tier"
                  label="รุ่น"
                  value={carInfo[0].car_tier}
                  fullWidth
                  autoComplete="given-name"
                  onChange={(event) => {
                    const list = [...carInfo]
                    list[0]['car_tier'] = event.target.value
                    setCarInfo(list)
                  }}
                // variant="standard"
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  required
                  name="car_color"
                  label="สีรถ"
                  value={carInfo[0].car_color}
                  fullWidth
                  autoComplete="given-name"
                  onChange={(event) => {
                    const list = [...carInfo]
                    list[0]['car_color'] = event.target.value
                    setCarInfo(list)
                  }}
                // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  name="car_remarks"
                  label="หมายเหตุ"
                  multiline
                  value={carInfo[0].car_remarks}
                  fullWidth
                  autoComplete="given-name"
                  onChange={(event) => {
                    const list = [...carInfo]
                    list[0]['car_remarks'] = event.target.value
                    setCarInfo(list)
                  }}
                // variant="standard"
                />
              </Grid>

              {/* ฟอร์ม Car-Info */}

              <Grid item xs={12}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                  sx={{ py: 1, pt: 5 }}
                >
                  <Button variant="outlined" onClick={handleServiceAddDate} startIcon={<PostAddIcon />}>
                    เพิ่มรายการ
                  </Button>
                  <Button variant="outlined" color="error" disabled={smartBill_Operation.length === 1 ? true : false} onClick={handleServiceRemoveDate} startIcon={<PostAddIcon />}>
                    ลบรายการ
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                {smartBill_Operation.map((row, index) => (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <Divider textAlign="center" sx={{ pb: 1 }}>
                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          <Chip label={`รายละเอียดการใช้งานครั้งที่ ${index + 1} *`} size="small" color="error" variant="outlined" />
                        </Typography>
                      </Divider>
                    </Grid>
                    <FormControl fullWidth sx={{ ml: 1 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">เบิก/ไม่เบิก *</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="sb_paystatus"
                        key={index}
                        onChange={(e) => {
                          const list = [...smartBill_Operation]
                          list[index]['sb_paystatus'] = e.target.value
                          setSmartBill_Operation(list)
                        }}
                        value={row.sb_paystatus}
                      >
                        <FormControlLabel value="1" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="เบิก" />
                        <FormControlLabel value="0" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28, }, }} />} label="ไม่เบิก" />
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      required
                      sx={{
                        mt: 1,
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      name="sb_operationid_location"
                      key={index}
                      label={`บันทึกกิจกรรมการใช้งานครี่งที่ (${index + 1})`}
                      fullWidth
                      multiline
                      rows={5}
                      maxRows={5}
                      value={row.sb_operationid_location}
                      onChange={(e) => {
                        const list = [...smartBill_Operation]
                        list[index]['sb_operationid_location'] = e.target.value
                        setSmartBill_Operation(list)
                      }}
                      autoComplete="shipping address-line1"
                    // variant="standard"
                    />
                    <Grid container spacing={3} sx={{ py: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="L HH:mm"
                            name="sb_operationid_startdate"
                            closeOnSelect={true}
                            views={['day', 'hours']}
                            label={`วันที่ออกเดินทางของการใช้งานครั้งที่ (${index + 1})`}
                            //timezone='UTC'
                            key={index}
                            value={row.sb_operationid_startdate}
                            slotProps={{
                              textField: () => ({
                                color: !row.sb_operationid_startdate ? 'error' : null,
                                focused: !row.sb_operationid_startdate,
                              }),
                              actionBar: {
                                actions: ['today', 'clear', 'cancel', 'accept'],
                              },
                            }}
                            sx={{ width: '100%' }}
                            onChange={(newValue) => {
                              const list = [...smartBill_Operation]
                              list[index]['sb_operationid_startdate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                              list[index]['sb_operationid_enddate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                              setSmartBill_Operation(list)
                            }}
                            ampm={false}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          required
                          name="sb_operationid_startmile"
                          key={index}
                          label={`ไมล์เริ่มต้น (${index + 1})`}
                          fullWidth
                          InputProps={{
                            inputComponent: NumericFormatCustom,
                          }}
                          value={row.sb_operationid_startmile}
                          onChange={(e) => {
                            const list = [...smartBill_Operation]
                            list[index]['sb_operationid_startmile'] = e.target.value
                            setSmartBill_Operation(list)
                          }}
                          autoComplete="shipping address-line1"
                        // variant="standard"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">{`น้ำมันเริ่มต้น (${index + 1})`}</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            name="sb_operationid_startoil"
                            label={`น้ำมันเริ่มต้น (${index + 1})`} สิ้นสุด
                            key={index}
                            value={row.sb_operationid_startoil}
                            onChange={(e) => {
                              const list = [...smartBill_Operation]
                              list[index]['sb_operationid_startoil'] = e.target.value
                              setSmartBill_Operation(list)
                            }}
                          // variant="standard"
                          >
                            {oil_persent.map((res) => (
                              <MenuItem value={res}>{res} %</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            format="L HH:mm"
                            name="sb_operationid_enddate"
                            //timezone='UTC'
                            key={index}
                            closeOnSelect={true}
                            views={['day', 'hours']}
                            label={`วันที่สิ้นสุดเดินทางของการใช้งานครั้งที่ (${index + 1})`}
                            value={row.sb_operationid_enddate}
                            sx={{ width: '100%' }}
                            slotProps={{
                              textField: () => ({
                                color: !row.sb_operationid_enddate ? 'error' : null,
                                focused: !row.sb_operationid_enddate,
                                actionBar: {
                                  actions: ['today', 'clear', 'cancel', 'accept'],
                                },
                              }),
                            }}
                            onChange={(newValue) => {
                              const list = [...smartBill_Operation]
                              list[index]['sb_operationid_enddate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
                              setSmartBill_Operation(list)
                            }}
                            ampm={false}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                          required
                          name="sb_operationid_endmile"
                          key={index}
                          label={`ไมล์สิ้นสุด (${index + 1})`}
                          fullWidth
                          InputProps={{
                            inputComponent: NumericFormatCustom,
                          }}
                          value={row.sb_operationid_endmile}
                          onChange={(e) => {
                            const list = [...smartBill_Operation]
                            if (list[index + 1]) {
                              list[index]['sb_operationid_endmile'] = e.target.value
                              list[index + 1]['sb_operationid_startmile'] = e.target.value
                              setSmartBill_Operation(list)
                            } else {
                              list[index]['sb_operationid_endmile'] = e.target.value
                              setSmartBill_Operation(list)
                            }
                          }}
                          autoComplete="shipping address-line1"
                        // variant="standard"
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">{`น้ำมันสิ้นสุด (${index + 1})`}</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            name="sb_operationid_endoil"
                            key={index}
                            label={`น้ำมันสิ้นสุด (${index + 1})`}
                            value={row.sb_operationid_endoil}
                            onChange={(e) => {
                              const list = [...smartBill_Operation]
                              list[index]['sb_operationid_endoil'] = e.target.value
                              setSmartBill_Operation(list)
                            }}
                          // variant="standard"
                          >
                            {oil_persent.map((res) => (
                              <MenuItem value={res}>{res} %</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  name="reamarks"
                  label={`ระบุสถานที่จอดรถหลังจากใช้งานแล้ว`}
                  fullWidth
                  value={smartBill_Header[0].reamarks}
                  onChange={(e) => {
                    const list = [...smartBill_Header]
                    list[0]['reamarks'] = e.target.value
                    setSmartBill_Header(list)
                  }}
                  autoComplete="shipping address-line1"
                // variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl sx={{ pl: 1 }}>
                  <RadioGroup
                    row
                    value={smartBill_Header[0].clean_status}
                    onChange={(event) => {
                      const list = [...smartBill_Header]
                      list[0].clean_status = event.target.value
                      setSmartBill_Header(list)
                    }}>
                    <FormControlLabel value={0} control={<Radio />} label="ไม่ได้ล้างรถ" />
                    <FormControlLabel value={1} control={<Radio />} label="ล้างรถ" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  color="warning"
                  startIcon={<CloudUploadIcon />}
                  href="#file-upload"
                  onChange={handle_files}
                >
                  Upload files
                  <VisuallyHiddenInput type="file" />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <ImageList cols={6} variant="quilted">
                  {dataFilesCount ? dataFilesCount.map((item, index) => (
                    <ImageListItem key={item.img}>
                      <a target="_blank" href={item.file} rel="noreferrer">
                        <img
                          src={item.file}
                          srcSet={item.file}
                          alt={item.filename}
                          style={{ maxWidth: 150, width: '100%' }}
                          loading="lazy"
                        />
                      </a>
                      <ImageListItemBar
                        style={{ width: '100%' }}
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 1)' }}
                            aria-label={`info about ${item.filename}`}
                            onClick={(e) => {
                              const list = [...dataFilesCount];
                              list.splice(index, 1);
                              setDataFilesCount(list);
                            }}
                          >
                            <DeleteForeverIcon />
                            DELETE
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  )) : null}
                </ImageList>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, ml: 1 }}
              >
                Submit
              </Button>
            </Box>
          </React.Fragment>
        </Paper>
      </Container>
    </React.Fragment >
  );
}