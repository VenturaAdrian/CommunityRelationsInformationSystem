import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';

import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const categoryIcons = {
  'Human Resource Development & Institutional Building (HRDIB)': PeopleIcon,
  'Enterprise Development & Networking': BusinessIcon,
  'Assistance to Infrastructure Development & Support Services': EngineeringIcon,
  'Access to Education & Educational Support Programs': SchoolIcon,
  'Access to Health Services, Health Facilities & Health Professionals': LocalHospitalIcon,
  'Protection & Respect of Socio-Cultural Values': VolunteerActivismIcon,
  'Information Education & Communication (IEC)': LanguageIcon,
  'Development of Mining & GeoSciences & Technology': ScienceIcon,
  'Concessionaires': ApartmentIcon,
  'Company Facilities': LocationCityIcon,
  'Corporate Social Responsibility -Donations': FavoriteIcon,
};

const sdmpCategories = [
  'Human Resource Development & Institutional Building (HRDIB)',
  'Enterprise Development & Networking',
  'Assistance to Infrastructure Development & Support Services',
  'Access to Education & Educational Support Programs',
  'Access to Health Services, Health Facilities & Health Professionals',
  'Protection & Respect of Socio-Cultural Values',
  'Information Education & Communication (IEC)',
  'Development of Mining & GeoSciences & Technology',
];

const otherCategories = [
  'Concessionaires',
  'Company Facilities',
  'Corporate Social Responsibility -Donations',
];

export default function Category() {
  const navigate = useNavigate();

  //Render cards per categories
  const renderCompactCards = (categories) => (
    <Grid container spacing={2} >
      {categories.map((category, index) => {
        const IconComponent = categoryIcons[category];

        return (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                height: 120,
                background: 'linear-gradient(to bottom right, #ffffff, #d0f0c0)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardActionArea
                onClick={() => {
                  const encodedCategory = encodeURIComponent(category);
                  window.location.replace(`/comrel/category-table?category=${encodedCategory}`);
                  navigate(`/category-table?category=${encodedCategory}`);
                }}
                sx={{ height: '100%' }}
              >
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 2,
                  }}
                >
                  {IconComponent && (
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: '#2F5D0B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                  )}
                  <Typography variant="subtitle2" fontWeight={600} color="#2F5D0B" sx={{ lineHeight: 1.2 }}>
                    {category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  
  return (
    <Box
      sx={{
        p: 4,
        pt: 6,
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)',
      }}
    >
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="white"
          gutterBottom
          sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
        >
          SDMP Credited Activities
        </Typography>
        {renderCompactCards(sdmpCategories)}
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color="white"
          gutterBottom
          sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.4)' }}
        >
          Other Activities
        </Typography>
        {renderCompactCards(otherCategories)}
      </Box>
    </Box>
  );
}
