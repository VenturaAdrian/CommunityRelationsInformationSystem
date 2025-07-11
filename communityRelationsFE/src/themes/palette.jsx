// material-ui
import { createTheme } from '@mui/material/styles';
import { light } from '@mui/material/styles/createPalette';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  return createTheme({
    palette: {
      mode,
      common: {
        black: colors.darkPaper
      },
      green:{
        light: colors.greenLight,
        main: colors.greenMain,
        dark: colors.greenDark
      },
      primary: {
        light: '#93c47d',
        main: '#2F5D0B',
        dark: '#274e13',
        200: '#6aa84f',
        800: '#1F3D0E'
      },
      secondary: {
        light: '#ffdc73',
        main: '#ffbf00',
        dark: '#bf9b30',
        200: '#ffcf40',
        800: '#a67c00'
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark,
        contrastText: colors.grey700
      },
      success: {
        light: colors.successLight,
        200: colors.success200,
        main: colors.successMain,
        dark: colors.successDark
      },
      grey: {
        50: colors.grey50,
        100: colors.grey100,
        500: colors.grey500,
        600: colors.grey600,
        700: colors.grey700,
        900: colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: colors.grey700,
        secondary: colors.grey500,
        dark: colors.grey900,
        hint: colors.grey100
      },
      divider: colors.grey200,
      background: {
        paper: colors.paper,
        default: colors.paper
      }
    }
  });
}
