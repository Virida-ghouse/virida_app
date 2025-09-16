import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SettingsIcon from '@mui/icons-material/Settings';
import AutomationIcon from '@mui/icons-material/SmartToy';
import BoltIcon from '@mui/icons-material/Bolt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuIcon from '@mui/icons-material/Menu';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(46, 125, 50, 0.05) 100%)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRight: 'none',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 20%, rgba(46, 125, 50, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(56, 142, 60, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(67, 160, 71, 0.02) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
    },
  },
}));

const StyledListItem = styled(ListItem)<{ active?: boolean }>(({ theme, active }) => ({
  margin: '2px 16px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? '#2E7D32' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
}));

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'plants', label: 'Plants', icon: <LocalFloristIcon /> },
  { id: 'irrigation', label: 'Irrigation', icon: <WaterDropIcon /> },
  { id: 'automation', label: 'Automation', icon: <AutomationIcon /> },
  { id: 'energy', label: 'Energy', icon: <BoltIcon /> },
  { id: 'reports', label: 'Reports', icon: <AssessmentIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  currentView,
  onViewChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: isMobile ? 0 : (open ? 240 : 72),
        flexShrink: 0,
        position: 'fixed',
        zIndex: 1200,
        display: isMobile ? (open ? 'block' : 'none') : 'block',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: isMobile ? 280 : (open ? 240 : 72),
          overflowX: 'hidden',
          position: 'fixed',
          height: '100vh',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          p: 2,
        }}
      >
        <IconButton onClick={onToggle} sx={{ color: '#121A21' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <List>
        {menuItems.map((item) => (
          <Tooltip
            key={item.id}
            title={!open ? item.label : ''}
            placement="right"
          >
            <StyledListItem
              button
              active={currentView === item.id}
              onClick={() => onViewChange(item.id)}
            >
              <ListItemIcon
                sx={{
                  minWidth: open ? 36 : 'auto',
                  color: currentView === item.id ? '#FFFFFF' : 'rgba(46, 125, 50, 0.7)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    color:
                      currentView === item.id ? '#FFFFFF' : 'rgba(46, 125, 50, 0.7)',
                  }}
                />
              )}
            </StyledListItem>
          </Tooltip>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
