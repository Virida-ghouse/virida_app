import React from 'react';
import { Box, Typography, Badge, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#2AD388',
    color: '#2AD388',
  },
}));

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [notifications] = React.useState<Array<{ id: string; message: string; timestamp: Date }>>([
    { id: '1', message: 'Plant health updated', timestamp: new Date() },
  ]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <StyledBadge badgeContent={notifications.length} color="primary">
          <NotificationsIcon />
        </StyledBadge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List>
            {notifications.map((notif) => (
              <ListItem key={notif.id}>
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.timestamp).toLocaleTimeString()}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default NotificationCenter;
