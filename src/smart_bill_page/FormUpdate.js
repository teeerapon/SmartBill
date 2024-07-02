import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Axios from "axios";
import config from '../config'
import swal from 'sweetalert';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import NavBar from './NavBar'
import ImageListItemBar from '@mui/material/ImageListItemBar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Chip from '@mui/material/Chip';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
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

export default function AddressForm() {

  // ใช้สำหรับสร้างเวลาปัจจุบัน
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const dataUser = JSON.parse(localStorage.getItem('data'));
  const [typeCar, setTypeCar] = React.useState('');
  const [typeGroup, setTypeGroup] = React.useState(0);
  const [carInfoDataCompanny, setCarInfoDataCompanny] = React.useState([]);
  const [carInfoData, setCarInfoData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const queryString = window.location.search;
  const sb_code = queryString.split('?')[1]
  const [smartBill_Header, setSmartBill_Header] = React.useState([{
    usercode: '',
    sb_name: '',
    sb_fristName: '',
    sb_lastName: '',
    clean_status: 0,
    group_status: 0,
    reamarks: '',
    sb_status_name: '',
    usercheck_code: '',
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
    sb_operationid_location: ''
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
        sb_code: sb_code,
        smartBill_Header: smartBill_Header,
        carInfo: carInfo,
        smartBill_Operation: smartBill_Operation,
        smartBill_Associate: smartBill_Associate,
      }
      await Axios.post(config.http + '/SmartBill_CreateForms', body, config.headers)
        .then(async (response) => {
          for (const element of dataFilesCount) {
            let formData_1 = new FormData();
            formData_1.append('file', element.fileData);
            formData_1.append('sb_code', sb_code);

            await Axios.post(config.http + '/SmartBill_files', formData_1, config.headers)
              .then(() => {
                swal("แจ้งเตือน", 'เปลี่ยนแปลงข้อมูลแล้ว', "success", { buttons: false, timer: 2000 })
                  .then(() => {
                    window.location.href = '/FormUpdate?' + sb_code;
                  });
              })
          }
        })
    }
  }

  const handleSubmitAccept = async () => {
    const body = { sb_code: sb_code, usercode: dataUser.UserCode }
    await Axios.post(config.http + '/SmartBill_AcceptHeader', body, config.headers)
      .then((res) => {
        if (res.status === 200) {
          swal("แจ้งเตือน", 'เปลี่ยนแปลงข้อมูลแล้ว', "success", { buttons: false, timer: 2000 })
            .then((res) => {
              window.location.href = '/FormUpdate?' + sb_code;
            });
        };
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gettingUsers = React.useCallback(async () => {
    if (!smartBill_Header[0].usercode && !smartBill_Operation[0].sb_operationid_startmile) {
      // แสดง users ทั้งหมด
      await Axios.get(config.http + '/getsUserForAssetsControl', config.headers)
        .then((res) => {
          setUsers(res.data.data)
        })

      await Axios.post(config.http + '/SmartBill_SelectAllForms', { sb_code: sb_code }, config.headers)
        .then(async (res) => {
          setSmartBill_Header([{
            usercode: res.data[0][0].usercode,
            sb_name: res.data[0][0].sb_name === 'SCT' ? 'SCT' : 'PTEC',
            sb_fristName: res.data[0][0].sb_fristName,
            sb_lastName: res.data[0][0].sb_lastName,
            clean_status: res.data[0][0].clean_status === true ? 1 : 0,
            group_status: res.data[0][0].group_status === true ? 1 : 0,
            reamarks: res.data[0][0].reamarks,
            sb_status_name: res.data[0][0].sb_status_name,
            usercheck_code: res.data[0][0].usercheck_code
          }])

          setTypeGroup(res.data[0][0].group_status === true ? 1 : 0)

          const body = { car_infocode: null }
          await Axios.post(config.http + '/SmartBill_CarInfoSearch', body, config.headers)
            .then((resCarSearch) => {

              setCarInfoDataCompanny(resCarSearch.data.filter((res) => res.car_infostatus_companny === true));
              setCarInfoData(resCarSearch.data.filter((res) => res.car_infostatus_companny === false));

              setCarInfo([{
                car_infocode: res.data[0][0].car_infocode,
                car_infostatus_companny: res.data[0][0].car_infostatus_companny === true ? 1 : 0,
                car_categaryid: res.data[0][0].car_categaryid,
                car_typeid: res.data[0][0].car_typeid,
                car_band: res.data[0][0].car_band,
                car_tier: res.data[0][0].car_tier,
                car_color: res.data[0][0].car_color,
                car_remarks: res.data[0][0].car_remarks,
              }])

              setTypeCar(res.data[0][0].car_infostatus_companny === true ? 1 : 0);
            })

          setSmartBill_Operation(res.data[1].map((res_operationid) => {
            return {
              sb_operationid_startdate: dayjs(res_operationid.sb_operationid_startdate),
              sb_operationid_startmile: res_operationid.sb_operationid_startmile,
              sb_operationid_startoil: res_operationid.sb_operationid_startoil,
              sb_operationid_enddate: dayjs(res_operationid.sb_operationid_enddate),
              sb_operationid_endoil: res_operationid.sb_operationid_endoil,
              sb_operationid_endmile: res_operationid.sb_operationid_endmile,
              sb_paystatus: res_operationid.sb_paystatus === true ? 1 : 0,
              sb_operationid_location: res_operationid.sb_operationid_location,
            }
          }));

          setSmartBill_Associate(res.data[2].map((res_allowance) => {
            return {
              allowance_usercode: res_allowance.allowance_usercode,
              sb_associate_startdate: res_allowance.sb_associate_startdate,
              sb_associate_enddate: res_allowance.sb_associate_enddate,
            }
          }))

          setDataFilesCount(res.data[3].map((res_DataFilesCount) => {
            return {
              file: res_DataFilesCount.url,
              fileData: null,
              filename: res_DataFilesCount.NonPO_attatchid,
            }
          }))


        })
    }
  })

  const handleServiceAddDate = (index) => {
    setSmartBill_Operation([...smartBill_Operation, {
      sb_operationid_startdate: dayjs().tz('Asia/Bangkok'),
      sb_operationid_startmile: '',
      sb_operationid_startoil: '',
      sb_operationid_enddate: smartBill_Operation[index - 1] ? smartBill_Operation[index - 1].sb_operationid_startmile : dayjs().tz('Asia/Bangkok'),
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

  React.useEffect(() => {
    gettingUsers();
  }, [gettingUsers])

  if (!smartBill_Operation.map((res) => res.sb_operationid_location)[0]) {
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
  } else if (smartBill_Operation.map((res) => res.sb_operationid_location)[0]) {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
          <Typography
            component="h1"
            variant="caption"
            align="right"
            sx={{ mt: { xs: 3, md: 6 } }}
            color={smartBill_Header[0].sb_status_name === 'รอ Admin ตรวจสอบ' ? 'red' : 'green'}
          >
            ({smartBill_Header[0].sb_status_name} {smartBill_Header[0].usercheck_code ? ', ผู้ตรวจ:' + smartBill_Header[0].usercheck_code : ''})
          </Typography>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
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
                <Typography variant="body2" align="center">
                  <b>Smart Car Form</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Box alignItems="center" p={1} sx={{ border: '2px solid grey' }}>
                  <Typography variant="caption" display="block" gutterBottom align="center">
                    {sb_code}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <React.Fragment>
              <Grid
                container
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                sx={{ pt: 2 }}
              >
                <Grid item xs={6} sm={2}>
                  <Autocomplete
                    autoHighlight
                    id="free-solo-demo"
                    freeSolo
                    name="usercode"
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                    value={smartBill_Header[0].usercode}
                    options={users.map((option) => option.UserCode)}
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
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      value={carInfo[0].car_infocode}
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
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      value={carInfo[0].car_infocode}
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
                      disabled
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
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
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                    <Button variant="outlined" color="error" disabled={smartBill_Operation.length === 1} onClick={handleServiceRemoveDate} startIcon={<PostAddIcon />}>
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
                      <Grid
                        container
                        spacing={3}
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        sx={{ py: 2 }}
                      >
                        <Grid item xs={12} sm={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              format="L HH:mm"
                              name="sb_operationid_startdate"
                              label={`วันที่ออกเดินทางของการใช้งานครั้งที่ (${index + 1})`}
                              //timezone='UTC'
                              key={index}
                              closeOnSelect={true}
                              views={['day', 'hours']}
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              slotProps={{
                                textField: () => ({
                                  color: !row.sb_operationid_startdate ? 'error' : null,
                                  focused: !row.sb_operationid_startdate,
                                  actionBar: {
                                    actions: ['today', 'clear', 'cancel', 'accept'],
                                  },
                                }),
                              }}
                              value={row.sb_operationid_startdate}
                              onChange={(newValue) => {
                                const list = [...smartBill_Operation]
                                list[index]['sb_operationid_startdate'] = dayjs.tz(newValue, "YYYY-MM-DD HH:mm", "Asia/Bangkok")
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
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
                            value={row.sb_operationid_startmile}
                            onChange={(e) => {
                              const list = [...smartBill_Operation]
                              if (index === 0) {
                                list[index]['sb_operationid_startmile'] = e.target.value
                              } else {
                                list[index]['sb_operationid_startmile'] = smartBill_Operation[index - 1].sb_operationid_endmile
                              }
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
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                              }}
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
                              key={index}
                              closeOnSelect={true}
                              views={['day', 'hours']}
                              slotProps={{
                                textField: () => ({
                                  color: !row.sb_operationid_enddate ? 'error' : null,
                                  focused: !row.sb_operationid_enddate,
                                  actionBar: {
                                    actions: ['today', 'clear', 'cancel', 'accept'],
                                  },
                                }),
                              }}
                              label={`วันที่สิ้นสุดเดินทาง (${index + 1})`}
                              //timezone='UTC'
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              value={row.sb_operationid_enddate}
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
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
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
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                              }}
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
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
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
                        <a target="_blank" href={item.file}>
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
                              onClick={async (e) => {
                                await Axios.post(config.http + '/NonPO_Delete_Attach_By_attachid', { attachid: item.filename }, config.headers)
                                  .then((response) => {
                                    if (response.status === 200) {
                                      const list = [...dataFilesCount];
                                      list.splice(index, 1);

                                      setDataFilesCount(list);
                                    }
                                  })
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
                  color="warning"
                  sx={{ mt: 3, ml: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={dataUser.DepCode === '101GAD' || dataUser.DepCode === '101ITO' ? false : true}
                  onClick={handleSubmitAccept}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Accept
                </Button>
              </Box>
            </React.Fragment>
          </Paper>
        </Container>
      </React.Fragment >
    );
  }
}