import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Schedule {
  id: number;
  time: string;
  duration: number;
  days: string[];
  enabled: boolean;
}

const StyledCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)',
  border: '1px solid rgba(46, 125, 50, 0.2)',
  borderRadius: '16px',
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(46, 125, 50, 0.15)',
  },
}));

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(46, 125, 50, 0.2)',
  },
}));

const IrrigationSchedule: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      time: '06:00',
      duration: 15,
      days: ['Mon', 'Wed', 'Fri'],
      enabled: true,
    },
    {
      id: 2,
      time: '18:00',
      duration: 20,
      days: ['Tue', 'Thu', 'Sat'],
      enabled: false,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleOpenDialog = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setSelectedTime(schedule.time);
      setSelectedDuration(schedule.duration);
      setSelectedDays(schedule.days);
    } else {
      setEditingSchedule(null);
      setSelectedTime('');
      setSelectedDuration(15);
      setSelectedDays([]);
    }
    setOpenDialog(true);
  };

  const handleAddSchedule = () => {
    handleOpenDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSaveSchedule = () => {
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id 
          ? { ...schedule, time: selectedTime, duration: selectedDuration, days: selectedDays }
          : schedule
      ));
    } else {
      const newSchedule: Schedule = {
        id: Math.max(...schedules.map(s => s.id), 0) + 1,
        time: selectedTime,
        duration: selectedDuration,
        days: selectedDays,
        enabled: true,
      };
      setSchedules([...schedules, newSchedule]);
    }
    setOpenDialog(false);
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"} 
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"} 
        mb={4} 
        gap={isMobile ? 2 : 0}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ backgroundColor: '#2E7D32', width: 56, height: 56 }}>
            <WaterDropIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: '#2E7D32', fontWeight: 700 }}>
              Irrigation Schedule
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
              Gérez vos programmes d'arrosage automatique
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSchedule}
          fullWidth={isMobile}
          sx={{
            backgroundColor: '#2E7D32',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              backgroundColor: '#1B5E20',
              boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
            },
          }}
        >
          Add Schedule
        </Button>
      </Box>

      {/* Schedules Display */}
      {isMobile ? (
        // Mobile Layout: Cards
        <Grid container spacing={2}>
          {schedules.map((schedule) => (
            <Grid item xs={12} key={schedule.id}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <AccessTimeIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                      <Typography variant="h5" sx={{ color: '#2E7D32', fontWeight: 700 }}>
                        {schedule.time}
                      </Typography>
                    </Box>
                    <Switch
                      checked={schedule.enabled}
                      onChange={() =>
                        setSchedules(
                          schedules.map((s) =>
                            s.id === schedule.id ? { ...s, enabled: !s.enabled } : s
                          )
                        )
                      }
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
                  
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <CalendarTodayIcon sx={{ color: '#666', fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Duration: {schedule.duration} minutes
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
                    {schedule.days.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="small"
                        sx={{
                          backgroundColor: '#E8F5E8',
                          color: '#2E7D32',
                          fontWeight: 600,
                          borderRadius: '8px',
                        }}
                      />
                    ))}
                  </Stack>
                  
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <IconButton
                      onClick={() => handleOpenDialog(schedule)}
                      size="small"
                      sx={{ 
                        color: '#2E7D32',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.2)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      size="small"
                      sx={{ 
                        color: '#d32f2f',
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.2)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop Layout: Table
        <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(46, 125, 50, 0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#2E7D32' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Duration</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Days</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.05)' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                      <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                        {schedule.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight={500}>
                      {schedule.duration} min
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {schedule.days.map((day) => (
                        <Chip
                          key={day}
                          label={day}
                          size="small"
                          sx={{
                            backgroundColor: '#E8F5E8',
                            color: '#2E7D32',
                            fontWeight: 600,
                            borderRadius: '8px',
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={schedule.enabled}
                      onChange={() =>
                        setSchedules(
                          schedules.map((s) =>
                            s.id === schedule.id ? { ...s, enabled: !s.enabled } : s
                          )
                        )
                      }
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#2E7D32',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2E7D32',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleOpenDialog(schedule)}
                        sx={{ 
                          color: '#2E7D32',
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.2)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        sx={{ 
                          color: '#d32f2f',
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.2)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#2E7D32', fontWeight: 700, fontSize: '1.5rem' }}>
          {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="Time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#2E7D32',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: '#2E7D32' } }}>
                Duration (minutes)
              </InputLabel>
              <Select
                value={selectedDuration}
                label="Duration (minutes)"
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                sx={{
                  borderRadius: '12px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2E7D32',
                  },
                }}
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={20}>20 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle1" mb={2} sx={{ color: '#2E7D32', fontWeight: 700 }}>
                Select Days
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {daysOfWeek.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    clickable
                    onClick={() => handleToggleDay(day)}
                    sx={{
                      backgroundColor: selectedDays.includes(day) ? '#2E7D32' : '#f5f5f5',
                      color: selectedDays.includes(day) ? 'white' : '#666',
                      fontWeight: 600,
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: selectedDays.includes(day) ? '#1B5E20' : '#e0e0e0',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              color: '#666',
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSchedule}
            variant="contained"
            disabled={!selectedTime || selectedDays.length === 0}
            sx={{
              backgroundColor: '#2E7D32',
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#1B5E20',
              },
            }}
          >
            {editingSchedule ? 'Update' : 'Add'} Schedule
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default IrrigationSchedule;
