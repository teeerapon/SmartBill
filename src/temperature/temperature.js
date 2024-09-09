import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const Temperature = () => {

  const [density, setDensity] = React.useState();
  const [api, setApi] = React.useState();
  const [tempC, setTempC] = React.useState();
  const [tempF, setTempF] = React.useState();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '45vh',
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 8, mb: 0 }} maxWidth="md">
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
          <Typography sx={{ fontSize: '1rem !important', fontWeight: '500w' }}>ระบบสำหรับคำนวนอุณหภูมิ</Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", alignItems: "center", p: 2 }}>
          <Stack>
            <TextField
              fullWidth
              placeholder="Density (15'C)"
              id="fullWidth"
              type="number"
              step="any"  // Allow decimal numbers
              value={density}
              onChange={(e) => {
                const newValue = e.target.value ? (141.5 / e.target.value) - 131.5 : 0;
                const formattedValue = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(newValue);
                setDensity(e.target.value)
                setApi(formattedValue)
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.7rem !important',  // ขนาดของ input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem !important',  // ขนาดของ label
                },
              }}
            />
          </Stack>
          <Stack><SwapHorizIcon sx={{ fontSize: '2rem !important' }} /></Stack>
          <Stack>
            <TextField
              fullWidth
              placeholder="API (60'F)"
              id="fullWidth"
              type="number"
              step="any"  // Allow decimal numbers
              value={api}
              onChange={(e) => {
                const newValue = e.target.value ? 141.5 / (parseFloat(e.target.value) + 131.5) : 0;
                const formattedValue = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(newValue);
                setDensity(formattedValue)
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.7rem !important',  // ขนาดของ input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem !important',  // ขนาดของ label
                },
              }}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", alignItems: "center", p: 2 }}>
          <Stack>
            <TextField
              fullWidth
              placeholder="Temp'C"
              id="fullWidth"
              type="number"
              step="any"  // Allow decimal numbers
              value={tempC}
              onChange={(e) => {
                const newValue = e.target.value ? (e.target.value * 1.8) + 32 : 0;
                const formattedValue = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(newValue);
                setTempC(e.target.value)
                setTempF(formattedValue)
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.7rem !important',  // ขนาดของ input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem !important',  // ขนาดของ label
                },
              }}
            />
          </Stack>
          <Stack><SwapHorizIcon sx={{ fontSize: '2rem !important' }} /></Stack>
          <Stack>
            <TextField
              fullWidth
              placeholder="Temp'F"
              id="fullWidth"
              type="number"
              step="any"  // Allow decimal numbers
              value={tempF}
              onChange={(e) => {
                const newValue = e.target.value ? (e.target.value - 32) / 1.8 : 0;
                const formattedValue = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(newValue);
                setTempF(e.target.value)
                setTempC(formattedValue)
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.7rem !important',  // ขนาดของ input
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.7rem !important',  // ขนาดของ label
                },
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Temperature;
