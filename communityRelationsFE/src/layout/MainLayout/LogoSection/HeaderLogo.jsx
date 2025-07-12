import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo1 from 'ui-component/Logo1';

// ==============================|| MAIN LOGO ||============================== //

export default function HeaderLogo() {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
      <Logo1 />
    </Link>
  );
}
