import React from 'react';
import { 
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import { 
  Diversity3 as TeamIcon,
  Engineering as TechIcon,
  RocketLaunch as MissionIcon 
} from '@mui/icons-material';

const teamMembers = [
  {
    name: "Nikit Ojha",
    role: "Founder & CEO",
    avatar: "/avatars/alex.jpg" // Replace with actual paths
  },
  {
    name: "Dharman Shah",
    role: "Lead Developer",
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Samarth Ghule",
    role: "UX Designer",
    avatar: "/avatars/michael.jpg"
  }
];

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', pt: 4 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main'
            }}
          >
            About Our Company
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Building tools to make teamwork effortless and productive
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MissionIcon sx={{ 
                fontSize: 120,
                color: theme.palette.secondary.main,
                mb: 2
              }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                To revolutionize project management by creating intuitive tools that help teams 
                collaborate effectively and achieve their goals faster.
              </Typography>
              <Typography variant="body1">
                Founded in 2023, we've been dedicated to solving real workflow challenges with 
                innovative technology.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/Teamwork.jpg" // Replace with actual image
                alt="Team working together"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box mb={8}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <TechIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Innovation
                </Typography>
                <Typography variant="body1">
                  We constantly push boundaries to deliver cutting-edge solutions that anticipate 
                  our users' needs.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <TeamIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Collaboration
                </Typography>
                <Typography variant="body1">
                  We believe the best solutions come from diverse teams working together with 
                  mutual respect.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <MissionIcon sx={{ fontSize: 50, color: 'info.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  User-Centric
                </Typography>
                <Typography variant="body1">
                  Every decision starts with our users' needs. We build tools people love to use.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>


        <Box mb={4}>
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Avatar
                    alt={member.name}
                    src={member.avatar}
                    sx={{ 
                      width: 160, 
                      height: 160,
                      mb: 3,
                      border: `4px solid ${theme.palette.primary.main}`
                    }}
                  />
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;