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
    sb_operationid_startdate: '',
    sb_operationid_startmile: '',
    sb_operationid_startoil: '',
    sb_operationid_enddate: '',
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
    for (let i = 0; i < dataFilesCount.length; i++) {

      let formData_1 = new FormData();
      formData_1.append('file', dataFilesCount[i].fileData);
      formData_1.append('sb_code', sb_code);

      await Axios.post(config.http + '/SmartBill_files', formData_1, config.headers)
        .then(() => {
          swal("แจ้งเตือน", 'เปลี่ยนแปลงข้อมูลแล้ว' + ' แล้ว', "success", { buttons: false, timer: 2000 })
            .then(() => {
              window.location.href = '/FormUpdate?' + sb_code;
            });
        })
    }
  }

  const gettingUsers = async () => {
    // แสดง users ทั้งหมด
    await Axios.get(config.http + '/getsUserForAssetsControl', config.headers)
      .then((res) => {
        setUsers(res.data.data)
      })

    await Axios.post(config.http + '/SmartBill_SelectAllForms', { sb_code: sb_code }, config.headers)
      .then(async (res) => {
        console.log(res.data[0][0].reamarks);
        setSmartBill_Header([{
          usercode: res.data[0][0].usercode,
          sb_name: res.data[0][0].sb_name,
          sb_fristName: res.data[0][0].sb_fristName,
          sb_lastName: res.data[0][0].sb_lastName,
          clean_status: res.data[0][0].clean_status === true ? 1 : 0,
          group_status: res.data[0][0].group_status === true ? 1 : 0,
          reamarks: res.data[0][0].reamarks,
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
            sb_operationid_startdate: dayjs(res_operationid.sb_operationid_startdate).utc().local(),
            sb_operationid_startmile: res_operationid.sb_operationid_startmile,
            sb_operationid_startoil: res_operationid.sb_operationid_startoil,
            sb_operationid_enddate: dayjs(res_operationid.sb_operationid_enddate).utc().local(),
            sb_operationid_endoil: res_operationid.sb_operationid_endoil,
            sb_operationid_endmile: res_operationid.sb_operationid_endmile,
            sb_paystatus: res_operationid.sb_paystatus === true ? 1 : 0,
            sb_operationid_location: res_operationid.sb_operationid_location,
          }
        }));

        setSmartBill_Associate(res.data[2].map((res_allowance) => {
          return {
            allowance_usercode: res_allowance.allowance_usercode,
            sb_associate_startdate: dayjs(res_allowance.sb_associate_startdate).utc().local(),
            sb_associate_enddate: dayjs(res_allowance.sb_associate_enddate).utc().local(),
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

  React.useEffect(() => {
    gettingUsers();
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography sx={{ py: 5 }} component="h1" variant="h4" align="center" className="Header-Forms">
            Smart-Car Form ({sb_code})
          </Typography>
          <React.Fragment>
            <React.Fragment>
              <Grid
                container
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Grid item xs={12}>
                  <TextField
                    required
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "#000000",
                      },
                    }}
                    id="sb_name"
                    name="sb_name"
                    label="วัตถุประสงค์การใช้รถ"
                    fullWidth
                    value={smartBill_Header[0].sb_name}
                    autoComplete="given-name"
                    onChange={(event) => {
                      const list = [...smartBill_Header]
                      list[0]['sb_name'] = event.target.value
                      setSmartBill_Header(list)
                    }}
                  // variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    name="usercode"
                    disabled
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
                <Grid item xs={12} sm={5}>
                  <TextField
                    disabled
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
                <Grid item xs={12} sm={5}>
                  <TextField
                    required
                    disabled
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

                <Grid item xs={6} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">ประเภทการใช้งาน</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={typeCar}
                      label="ประเภทการใช้งาน"
                      disabled
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      onChange={async (event) => {
                        if (event.target.value === 1) {
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
                              list[0]['car_categaryid'] = event.target.value === 0 ? '' : list[0]['car_categaryid']
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
                    // variant="standard"
                    >
                      <MenuItem value={1}>รถบริษัท</MenuItem>
                      <MenuItem value={0}>รถส่วนตัว</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {typeCar === 1 || typeCar === "1" ? (
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
                  </Grid>
                ) : typeCar === 0 || typeCar === "0" ? (
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
                  </Grid>
                ) : (
                  <Grid item xs={6} sm={6}>
                    <TextField fullWidth disabled />
                  </Grid>
                )}
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
                <Grid item xs={12} sm={8}>
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

                {/* <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                    sx={{ py: 1, pt: 5 }}
                  >
                    <Button variant="outlined" onClick={handleServiceAddDate} startIcon={<PostAddIcon />}>
                      Add List
                    </Button>
                    <Button variant="outlined" color="error" disabled={smartBill_Operation.length === 1 ? true : false} onClick={handleServiceRemoveDate} startIcon={<PostAddIcon />}>
                      Delete List
                    </Button>
                  </Stack>
                </Grid> */}
                <Grid item xs={12}>
                  {smartBill_Operation.map((row, index) => (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <Divider textAlign="center" sx={{ pb: 1 }}>การใช้งานครั้งที่ {index + 1}</Divider>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                      >
                        <Grid item xs={6} sm={2}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Pay</InputLabel>
                            <Select
                              disabled
                              sx={{
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                },
                              }}
                              labelId="demo-simple-select-label"
                              name="sb_paystatus"
                              label="Pay"
                              key={index}
                              onChange={(e) => {
                                const list = [...smartBill_Operation]
                                list[index]['sb_paystatus'] = e.target.value
                                setSmartBill_Operation(list)
                              }}
                              value={row.sb_paystatus}

                            // variant="standard"
                            >
                              <MenuItem value="1">เบิก</MenuItem>
                              <MenuItem value="0">ไม่เบิก</MenuItem>
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
                            name="sb_operationid_location"
                            key={index}
                            label={`บันทึกกิจกรรม (${index + 1})`}
                            fullWidth
                            value={row.sb_operationid_location}
                            onChange={(e) => {
                              const list = [...smartBill_Operation]
                              list[index]['sb_operationid_location'] = e.target.value
                              setSmartBill_Operation(list)
                            }}
                            autoComplete="shipping address-line1"
                          // variant="standard"
                          />
                        </Grid>
                      </Grid>
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

                              format="YYYY-MM-DD HH:mm"
                              name="sb_operationid_startdate"
                              label={`วันที่ออกเดินทาง (${index + 1})`}
                              key={index}
                              disabled
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              value={row.sb_operationid_startdate === '' ? undefined : row.sb_operationid_startdate}
                              onChange={(newValue) => {
                                const list = [...smartBill_Operation]
                                list[index]['sb_operationid_startdate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
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
                            disabled
                            InputProps={{
                              inputComponent: NumericFormatCustom,
                            }}
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
                            value={index === 0 ? row.sb_operationid_startmile : smartBill_Operation[index - 1].sb_operationid_endmile}
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
                              disabled
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
                              format="YYYY-MM-DD HH:mm"
                              name="sb_operationid_enddate"
                              key={index}
                              label={`วันที่สิ้นสุดเดินทาง (${index + 1})`}
                              disabled
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              value={row.sb_operationid_enddate === '' ? undefined : row.sb_operationid_enddate}
                              onChange={(newValue) => {
                                const list = [...smartBill_Operation]
                                list[index]['sb_operationid_enddate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                                setSmartBill_Operation(list)
                              }}
                              ampm={false}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            required
                            disabled
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
                              disabled
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
                {/* <Grid item xs={12}>
                  <FormControl sx={{ pl: 1 }}>
                    <RadioGroup
                      row
                      value={smartBill_Header[0].group_status}
                      onChange={(event) => {
                        const list = [...smartBill_Header]
                        list[0].group_status = event.target.value
                        setSmartBill_Header(list)
                        setTypeGroup(event.target.value)
                      }}
                    >
                      <FormControlLabel value={0} control={<Radio />} label="ไม่มีผู้ร่วมเดินทาง" />
                      <FormControlLabel value={1} control={<Radio />} label="มีผู้ร่วมเดินทาง" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {typeGroup === "1" || typeGroup === 1 ? (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={2}
                        sx={{ pb: 1 }}
                      >
                        <Button variant="outlined" onClick={handleServiceAddGroupJoin} startIcon={<PostAddIcon />}>
                          Add List
                        </Button>
                        <Button variant="outlined" color="error" disabled={smartBill_Associate.length === 1 ? true : false} onClick={handleServiceRemoveGroupJoin} startIcon={<PostAddIcon />}>
                          Delete List
                        </Button>
                      </Stack>
                    </Grid>
                    {smartBill_Associate.map((row, index) => (
                      <React.Fragment>
                        <Grid item xs={12}>
                          <Divider textAlign="center" sx={{ py: 1 }}>ผู้ร่วมเดินทางคนที่ {index + 1}</Divider>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            disabled
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                              },
                            }}
                            id="free-solo-demo"
                            freeSolo
                            key={index}
                            name="initialJoin"
                            value={smartBill_Associate[index].allowance_usercode}
                            options={users.map((option) => option.UserCode)}
                            onChange={(event, newValue, reason) => {
                              if (reason === 'clear') {
                                const list = [...smartBill_Associate]
                                list[index]['allowance_usercode'] = ''
                                list[index]['sb_associate_startdate'] = ''
                                list[index]['sb_associate_enddate'] = ''
                                setSmartBill_Associate(list)
                              } else {
                                const list = [...smartBill_Associate]
                                list[index]['allowance_usercode'] = newValue
                                setSmartBill_Associate(list)
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`ผู้ร่วมเดินทางคนที่ ${index + 1} (initial)`}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              disabled
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              format="YYYY-MM-DD HH:mm"
                              name="sb_associate_startdate"
                              key={index}
                              label={`วันที่ออกเดินทาง`}
                              value={row.sb_associate_startdate === '' ? undefined : row.sb_associate_startdate}
                              onChange={(newValue) => {
                                const list = [...smartBill_Associate]
                                list[index]['sb_associate_startdate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                                setSmartBill_Associate(list)
                              }}
                              ampm={false}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              disabled
                              sx={{
                                width: '100%',
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "#000000",
                                }
                              }}
                              format="YYYY-MM-DD HH:mm"
                              name="sb_associate_enddate"
                              key={index}
                              label={`วันที่สิ้นสุดเดินทาง`}
                              value={row.sb_associate_enddate === '' ? undefined : row.sb_associate_enddate}
                              onChange={(newValue) => {
                                const list = [...smartBill_Associate]
                                list[index]['sb_associate_enddate'] = `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`
                                setSmartBill_Associate(list)
                              }}
                              ampm={false}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ) : null} */}
                <Grid item xs={12}>
                  <TextField
                    required
                    name="reamarks"
                    disabled
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
            </React.Fragment >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                color="warning"
                sx={{ mt: 3, ml: 1 }}
              >
                Update
              </Button>
              {/* <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, ml: 1 }}
              >
                Next
              </Button> */}
            </Box>
          </React.Fragment>
        </Paper>
      </Container>
    </React.Fragment >
  );
}