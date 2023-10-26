import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Axios from "axios";
import config from '../config'
import swal from 'sweetalert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ListIcon from '@mui/icons-material/List';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import Stack from '@mui/material/Stack';
import PaidIcon from '@mui/icons-material/Paid';
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

export default function AddressForm() {

  const [rowHeader, setRowHeader] = React.useState();

  const SmartBill_Withdraw_Delete = async (e) => {
    const sbw_SelectAllForms = { sbw_code: e.target.value }
    await Axios.post(config.http + '/SmartBill_Withdraw_Delete', sbw_SelectAllForms, config.headers)
      .then((response) => {
        if (response.status === 200) {
          SelectHeaders();
        }
      });
  }

  const SelectHeaders = async () => {
    const sbw_SelectAllForms = { sbw_code: '' }
    await Axios.post(config.http + '/SmartBill_Withdraw_SelectAllForms', sbw_SelectAllForms, config.headers)
      .then((response) => {
        if (response.data[0]) {
          setRowHeader(response.data[0]);
        }
      });
  }

  React.useEffect(() => {
    SelectHeaders();
  }, [])

  const columns = [
    { field: 'sbw_code', headerName: 'เลขที่ดำเนินการ', flex: 1, minWidth: 100 },
    { field: 'ownercode', headerName: 'ผู้ทำรายการ', flex: 1, minWidth: 80 },
    { field: 'createdate', headerName: 'วันที่ทำรายการ', flex: 1, minWidth: 150 },
    { field: 'car_infocode', headerName: 'บะเทียนรถ', flex: 1, minWidth: 120 },
    { field: 'car_band', headerName: 'ยี่ห้อ', flex: 1, minWidth: 100 },
    { field: 'car_tier', headerName: 'ชื่อรุ่น', flex: 1, minWidth: 200 },
    {
      field: 'action',
      headerName: 'action',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => window.location.href = `/Payment?${params.row.sbw_code}`} size="large">
                <ArticleIcon fontSize="inherit" color='primary' />
              </IconButton>
              <IconButton size="large" value={params.row.sbw_code} onClick={(e) => SmartBill_Withdraw_Delete(e)}>
                <DeleteIcon fontSize="inherit" color='error' />
              </IconButton>
            </Stack>
          </React.Fragment>
        )
      }
    },
  ];

  if (rowHeader) {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
          <Box sx={{ py: 5 }}>
            <DataGrid
              rows={rowHeader}
              columns={columns}
              loading={!rowHeader.length}
              getRowId={(res) => res.sbw_code}
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