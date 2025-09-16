import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  IconButton,
  List,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box p={isMobile ? 2 : 3}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Automation Rules
      </Typography>
      <List>
        {automationRules.map((rule) => (
          <StyledCard key={rule.id}>
            <CardContent>
              {isMobile ? (
                // Mobile Layout: Stacked
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" sx={{ flex: 1, pr: 1 }}>
                      {rule.name}
                    </Typography>
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
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Condition:</strong> {rule.condition}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Action:</strong> {rule.action}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton size="small" sx={{ color: '#2E7D32' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d32f2f' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                // Desktop Layout: Side by side
                <Box>
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
                </Box>
              )}
            </CardContent>
          </StyledCard>
        ))}
      </List>
    </Box>
  );
};

export default AutomationRules;
