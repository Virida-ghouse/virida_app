import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, Avatar, Typography } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import YardIcon from '@mui/icons-material/Yard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MyGarden from './MyGarden';
import PlantLibrary from './PlantLibrary';
import PlantCare from './PlantCare';
import PlantCalendar from './PlantCalendar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const PlantsLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E0E0E0',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ backgroundColor: '#2E7D32', width: 56, height: 56 }}>
              <LocalFloristIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                Mes Plantes
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
                Gérez et surveillez vos cultures en temps réel
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Tabs Navigation */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #E0E0E0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 60,
                color: '#757575',
                '&.Mui-selected': {
                  color: '#2E7D32',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2E7D32',
                height: 3,
              },
            }}
          >
            <Tab
              icon={<YardIcon />}
              iconPosition="start"
              label="My Garden"
            />
            <Tab
              icon={<MenuBookIcon />}
              iconPosition="start"
              label="Plant Library"
            />
            <Tab
              icon={<ChecklistIcon />}
              iconPosition="start"
              label="Care"
            />
            <Tab
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              label="Calendar"
            />
          </Tabs>
        </Container>
      </Box>

      {/* Tab Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <TabPanel value={currentTab} index={0}>
          <MyGarden />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <PlantLibrary />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <PlantCare />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <PlantCalendar />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default PlantsLayout;
