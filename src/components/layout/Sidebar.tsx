import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
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
import { VIRIDA_COLORS } from '../../theme/colors';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    background: VIRIDA_COLORS.greenDark, // Vert foncé de la charte pour la sidebar
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRight: `1px solid rgba(42, 211, 104, 0.1)`, // Bordure subtile avec vert vif
    boxShadow: 'none',
    transition: 'all 0.3s ease',
  },
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  margin: '4px 12px',
  borderRadius: '12px',
  backgroundColor: active ? VIRIDA_COLORS.greenBright : 'transparent', // Vert vif pour l'item actif
  transition: 'all 0.2s ease',
  position: 'relative',
  minHeight: '48px',
  ...(active && {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '60%',
      backgroundColor: VIRIDA_COLORS.greenBright,
      borderRadius: '0 4px 4px 0',
    },
  }),
  '&:hover': {
    backgroundColor: active ? VIRIDA_COLORS.greenBright : 'rgba(42, 211, 104, 0.15)', // Hover avec vert vif
    transform: 'translateX(4px)',
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
          borderBottom: '1px solid rgba(42, 211, 104, 0.1)',
        }}
      >
        <IconButton 
          onClick={onToggle} 
          sx={{ 
            color: VIRIDA_COLORS.white,
            '&:hover': {
              backgroundColor: 'rgba(42, 211, 104, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <Tooltip
              key={item.id}
              title={!open ? item.label : ''}
              placement="right"
            >
              <StyledListItemButton
                active={isActive}
                onClick={() => onViewChange(item.id)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: open ? 40 : 'auto',
                    color: isActive ? VIRIDA_COLORS.white : 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.2s ease',
                    justifyContent: open ? 'flex-start' : 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        color: isActive ? VIRIDA_COLORS.white : 'rgba(255, 255, 255, 0.7)',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                      },
                    }}
                  />
                )}
              </StyledListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
