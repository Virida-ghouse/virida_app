import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useViridaStore, Plant } from '../../store/useViridaStore';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: '#FFFFFF',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    minWidth: 600,
  },
}));

const RangeInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  '& .MuiTextField-root': {
    width: 100,
  },
}));

interface PlantConfigurationProps {
  open: boolean;
  onClose: () => void;
  editPlant?: Plant;
}

const plantSpecies = [
  { label: 'Tomato', optimal: { temp: [20, 25], humidity: [60, 80], ph: [6.0, 6.8], light: [3000, 6000] } },
  { label: 'Lettuce', optimal: { temp: [15, 20], humidity: [60, 70], ph: [6.0, 7.0], light: [2500, 5000] } },
  { label: 'Basil', optimal: { temp: [18, 24], humidity: [40, 60], ph: [6.0, 7.5], light: [2000, 4000] } },
  { label: 'Strawberry', optimal: { temp: [20, 26], humidity: [65, 75], ph: [5.5, 6.8], light: [2000, 4000] } },
];

const PlantConfiguration: React.FC<PlantConfigurationProps> = ({
  open,
  onClose,
  editPlant,
}) => {
  const { setPlants, plants } = useViridaStore();
  const [formData, setFormData] = React.useState({
    name: '',
    species: '',
    temperature: { min: 20, max: 25 },
    humidity: { min: 60, max: 80 },
    ph: { min: 6.0, max: 6.8 },
    light: { min: 3000, max: 6000 },
  });

  React.useEffect(() => {
    if (editPlant) {
      setFormData({
        name: editPlant.name,
        species: editPlant.species,
        temperature: { min: 20, max: 25 },
        humidity: { min: 60, max: 80 },
        ph: { min: 6.0, max: 6.8 },
        light: { min: 3000, max: 6000 },
      });
    }
  }, [editPlant]);

  const handleSpeciesChange = (_: any, value: any) => {
    if (value) {
      const { optimal } = value;
      setFormData((prev) => ({
        ...prev,
        species: value.label,
        temperature: { min: optimal.temp[0], max: optimal.temp[1] },
        humidity: { min: optimal.humidity[0], max: optimal.humidity[1] },
        ph: { min: optimal.ph[0], max: optimal.ph[1] },
        light: { min: optimal.light[0], max: optimal.light[1] },
      }));
    }
  };

  const handleSubmit = () => {
    const newPlant: Plant = {
      id: editPlant?.id || Math.random().toString(36),
      name: formData.name,
      species: formData.species,
      category: 'vegetable',
      difficulty: 'medium',
      health: 100,
      growthStage: 'seedling',
      daysToHarvest: 30,
    };

    if (editPlant) {
      setPlants(plants.map(p => p.id === editPlant.id ? newPlant : p));
    } else {
      setPlants([...plants, newPlant]);
    }
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>
        {editPlant ? 'Edit Plant' : 'Add New Plant'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plant Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={plantSpecies}
              getOptionLabel={(option) => option.label}
              onChange={handleSpeciesChange}
              renderInput={(params) => <TextField {...params} label="Species" />}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editPlant ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default PlantConfiguration;
