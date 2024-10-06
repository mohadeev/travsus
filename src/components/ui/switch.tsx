import * as React from 'react';
import Switch from '@mui/material/Switch';

export  function ControlledSwitches({onCheckedChange , checked}:any) {



  return (
    <Switch
      checked={checked}
      onChange={onCheckedChange}
      inputProps={{ 'aria-label': 'controlled' }}
      sx={{
        '&.MuiSwitch-root': {
          color: '#ccc', // Default color (off)
        },
        '&.MuiSwitch-root.Mui-checked': {
          color: '#000', // Color when checked (black)
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: '#fff', // Thumb color (white)
        },
        '& .MuiSwitch-thumb.Mui-checked': {
          backgroundColor: '#fff', // Thumb color when checked (white)
        },
        '& .MuiSwitch-track': {
          backgroundColor: '#ccc', // Track color (off)
        },
        '& .MuiSwitch-track.Mui-checked': {
          backgroundColor: '#000', // Track color when checked (black)
        },
      }}
    />
  );
}
