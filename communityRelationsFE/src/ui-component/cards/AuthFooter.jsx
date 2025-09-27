// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function AuthFooter() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 0.5, sm: 2 }}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        py: 2,
        px: 1,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        by{' '}
        <Link
          href="https://github.com/VenturaAdrian/CommunityRelationsInformationSystem"
          target="_blank"
          underline="hover"
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          adriankurtventura
        </Link>
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © {new Date().getFullYear()}{' '}
        <Link
          href="https://lepantomining.com"
          target="_blank"
          underline="hover"
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          lepantomining.com
        </Link>
      </Typography>
    </Stack>
  );
}
