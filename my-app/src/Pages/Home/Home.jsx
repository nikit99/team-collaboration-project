import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
} from '@mui/material';
import {
  Task as TaskIcon,
  Groups as TeamsIcon,
  Dashboard as DashboardIcon,
  ArrowForward as ArrowForwardIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';

const features = [
  {
    title: 'Project Management',
    description:
      'Organize projects with tasks, deadlines, and team collaboration.',
    icon: <DashboardIcon color="primary" sx={{ fontSize: 60 }} />,
  },
  {
    title: 'Task Tracking',
    description: "Monitor task progress from 'To Do' to 'Completed' status.",
    icon: <TaskIcon color="secondary" sx={{ fontSize: 60 }} />,
  },
  {
    title: 'Team Collaboration',
    description:
      'Assign tasks and collaborate with your team members seamlessly.',
    icon: <TeamsIcon color="info" sx={{ fontSize: 60 }} />,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = localStorage.getItem('authToken');

  if (token) {
    return <Dashboard />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section with Semi-Transparent Background */}
      <Box
        sx={{
          position: 'relative',
          py: 15,
          color: 'white',
          textAlign: 'center',
          backgroundImage: 'url(/Teamwork2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(21, 24, 28, 0.6)',
            // zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            position: 'relative', // Brings content above the overlay
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 500,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              paddingTop: '60px',
            }}
          >
            Welcome to Team Collaboration App
          </Typography>
          <Typography
            variant="h5"
            component="p"
            gutterBottom
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Effortless collaboration for better project management
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Sign in to access your workspace
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/SignIn')}
              sx={{
                px: 3,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                mr: 2,
                boxShadow: theme.shadows[3],
              }}
            >
              Sign In
            </Button>

            <Typography
              variant="body1"
              sx={{
                mt: 2,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Don't have an account?{' '}
              <Button
                color="info"
                onClick={() => navigate('/SignUp')}
                sx={{
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Powerful Features
        </Typography>
        <Grid
          container
          spacing={4}
          sx={{ mt: 4, display: 'flex', flexWrap: 'nowrap' }}
        >
          {features.map((feature, index) => (
            <Grid item xs={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  boxShadow: 3,
                  borderTop: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          py: 8,
          bgcolor:
            theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Ready to boost your productivity?
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/SignUp')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              mt: 3,
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
