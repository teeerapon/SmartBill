import * as React from 'react';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Axios from "axios";
import config from '../config'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import NavBar from './NavBar'

const other = {
  autoHeight: true,
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
  rowSelection: false,
  pageSizeOptions: false,
  checkboxSelection: false,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport
        csvOptions={{
          fileName: 'ListForms',
          utf8WithBom: true,
        }}
      />
    </GridToolbarContainer>
  );
}

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

export default function Esg() {

  const [rowHeader, setRowHeader] = React.useState();
  const [dateTimeESG, setDateTimeESG] = React.useState({ startDate: null, endDate: null });

  const SelectHeaders = async () => {
    await Axios.post(config.http + '/SmartBill_ESGQuery', dateTimeESG, config.headers)
      .then((res) => {
        setRowHeader(res.data[0])
      })
  }

  const SearchDate = async () => {
    await Axios.post(config.http + '/SmartBill_ESGQuery', dateTimeESG, config.headers)
      .then((res) => {
        setRowHeader(res.data[0])
      })
  }

  React.useEffect(() => {
    SelectHeaders();
  }, [])

  const columns = [
    { field: 'car_infocode', headerName: 'เลขทะเบียน', flex: 1, maxWidth: 150, minWidth: 150 },
    { field: 'car_band', headerName: 'แบนด์', flex: 1, maxWidth: 120, minWidth: 100 },
    { field: 'car_tier', headerName: 'รุ่น', flex: 1, minWidth: 170 },
    { field: 'car_color', headerName: 'สี', flex: 1, maxWidth: 150, minWidth: 100 },
    { field: 'rateoil', headerName: 'อัตราสิ้นเปลือง', flex: 1, maxWidth: 120, minWidth: 70 },
    { field: 'mile', headerName: 'ระยะทาง (Km.)', flex: 1, maxWidth: 120, minWidth: 70 },
    { field: 'oil', headerName: 'ใช้น้ำมัน (L.)', flex: 1, maxWidth: 120, minWidth: 70 },
  ];

  if (rowHeader) {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar/>
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
          <Grid container spacing={3} sx={{ py: 1 }}>
            <Grid item xs={4} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  format="YYYY-MM-DD HH:mm"
                  name="startDate"
                  sx={{ width: '100%' }}
                  value={dateTimeESG.startDate}
                  onChange={(newValue) => {
                    setDateTimeESG({ startDate: `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}`, endDate: dateTimeESG.endDate })
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  format="YYYY-MM-DD HH:mm"
                  name="endDate"
                  sx={{ width: '100%' }}
                  value={dateTimeESG.endDate}
                  onChange={(newValue) => {
                    setDateTimeESG({ startDate: dateTimeESG.startDate, endDate: `${newValue.format('YYYY-MM-DD')}T${newValue.format('HH:mm:ss')}` })
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} sm={2}>
              <Button onClick={SearchDate} variant='contained'>
                Search
              </Button>
            </Grid>
          </Grid>
          <Box>
            <DataGrid
              rows={rowHeader}
              columns={columns}
              loading={!rowHeader.length}
              getRowId={(res) => res.car_infocode}
              getRowHeight={() => 'auto'}
              sx={{
                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                  py: '0.25rem',
                }
              }}
              slots={{
                toolbar: CustomToolbar,
              }}
              {...other}
            />
          </Box>
        </Container>
      </React.Fragment >
    );
  }
}