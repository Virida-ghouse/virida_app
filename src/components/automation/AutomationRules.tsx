import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useViridaStore } from '../../store/useViridaStore';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)',
  border: '1px solid rgba(46, 125, 50, 0.2)',
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
}));

const AutomationRules: React.FC = () => {
  const { automationRules, toggleAutomationRule } = useViridaStore();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Automation Rules
      </Typography>
      <List>
        {automationRules.map((rule) => (
          <StyledCard key={rule.id}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{rule.name}</Typography>
                <Box>
                  <Switch
                    checked={rule.enabled}
                    onChange={() => toggleAutomationRule(rule.id)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2E7D32',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#2E7D32',
                      },
                    }}
                  />
                  <IconButton size="small" sx={{ color: '#2E7D32' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#d32f2f' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  Condition: {rule.condition}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Action: {rule.action}
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        ))}
      </List>
    </Box>
  );
};

export default AutomationRules;
