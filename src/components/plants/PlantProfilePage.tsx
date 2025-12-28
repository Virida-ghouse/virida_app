import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { CircularGauge, SensorIndicator } from './ui';
import { useViridaStore } from '../../store/useViridaStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const PlantProfilePage: React.FC = () => {
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  const apiUrl = useViridaStore((state) => state.apiUrl);

  const [currentTab, setCurrentTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [plantData, setPlantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const token = localStorage.getItem('virida_token');
        const response = await fetch(`${apiUrl}/api/plant-catalog/${plantId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setPlantData(data.data);
        }
      } catch (error) {
        console.error('Error fetching plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId, apiUrl]);

  // Mock data pour la démo (sera remplacé par vraies données IoT)
  const mockSensorData = {
    temperature: 22.5,
    humidity: 68,
    light: 450,
    ph: 6.2,
    ec: 1.8,
    vwc: 42,
  };

  const mockPlant = {
    id: plantId,
    name: plantData?.commonName || 'Basilic Grand Vert',
    species: plantData?.species || 'Ocimum basilicum',
    emoji: plantData?.iconEmoji || '🌿',
    photo: plantData?.imageUrl,
    healthScore: 98,
    daysSincePlanted: 52,
    daysToHarvest: 3,
    category: plantData?.category || 'HERB',
    growthStage: 'FLOWERING',
  };

  const eveMessage = `Ta plante de ${mockPlant.name.toLowerCase()} est en excellente santé ! La récolte sera optimale dans ${mockPlant.daysToHarvest} jours. Pense à réduire légèrement l'arrosage demain pour concentrer les arômes. 🌿`;

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Chargement...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/plants')}
          sx={{
            bgcolor: 'white',
            border: '2px solid #E0E0E0',
            '&:hover': { borderColor: '#2AD388' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#121A21' }}>
            {mockPlant.emoji} {mockPlant.name}
          </Typography>
          <Typography variant="body2" color="#757575" sx={{ fontStyle: 'italic' }}>
            {mockPlant.species}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{ color: isFavorite ? '#FFA726' : '#BDBDBD' }}
        >
          {isFavorite ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
        <IconButton sx={{ color: '#757575' }}>
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Hero Section - Photo & Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Photo principale */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <Box
              sx={{
                height: 350,
                bgcolor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                backgroundImage: mockPlant.photo ? `url(${mockPlant.photo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!mockPlant.photo && (
                <Typography sx={{ fontSize: '8rem' }}>
                  {mockPlant.emoji}
                </Typography>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ color: '#757575' }}>
                  📸 Il y a 2h
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Stats et Santé */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <CircularGauge
                  value={mockPlant.healthScore}
                  size="large"
                  label="Santé Globale"
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#F5F5F5', textAlign: 'center' }}>
                    <Typography variant="caption" color="#757575">
                      Planté il y a
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#121A21' }}>
                      {mockPlant.daysSincePlanted} jours
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#2AD38820', textAlign: 'center' }}>
                    <Typography variant="caption" color="#2AD388">
                      Récolte dans
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2AD388' }}>
                      {mockPlant.daysToHarvest} jours
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Chip
                  label={mockPlant.category.replace('_', ' ')}
                  sx={{
                    bgcolor: '#81C784',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label="Floraison"
                  variant="outlined"
                  sx={{
                    borderColor: '#2AD388',
                    color: '#2AD388',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Capteurs IoT */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            📊 Données Capteurs en Temps Réel
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="temperature"
                value={mockSensorData.temperature}
                unit="°C"
                optimalRange={[20, 25]}
                compact
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="humidity"
                value={mockSensorData.humidity}
                unit="%"
                optimalRange={[60, 75]}
                compact
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="light"
                value={mockSensorData.light}
                unit="lux"
                optimalRange={[400, 600]}
                status="warning"
                compact
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="ph"
                value={mockSensorData.ph}
                unit=""
                optimalRange={[6.0, 6.5]}
                compact
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="ec"
                value={mockSensorData.ec}
                unit="mS/cm"
                optimalRange={[1.5, 2.0]}
                compact
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <SensorIndicator
                type="vwc"
                value={mockSensorData.vwc}
                unit="%"
                optimalRange={[35, 50]}
                compact
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feed EVE */}
      <Card sx={{ mb: 3, bgcolor: '#F5F5F5' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar sx={{ bgcolor: '#2AD388', width: 48, height: 48 }}>
              🤖
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  EVE Assistant
                </Typography>
                <Button
                  size="small"
                  endIcon={<ChatIcon />}
                  sx={{
                    textTransform: 'none',
                    color: '#2AD388',
                    fontWeight: 600,
                  }}
                >
                  Chat complet
                </Button>
              </Box>
              <Paper sx={{ p: 2, bgcolor: 'white' }}>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {eveMessage}
                </Typography>
              </Paper>
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#2AD388',
                    fontWeight: 600,
                  }}
                >
                  💬 Poser une question à EVE
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              },
              '& .Mui-selected': {
                color: '#2AD388 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2AD388',
              },
            }}
          >
            <Tab label="📅 Timeline" />
            <Tab label="📊 Statistiques" />
            <Tab label="📝 Journal" />
            <Tab label="⚕️ Maladies" />
            <Tab label="ℹ️ Infos" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🔄 Cycle de Croissance
            </Typography>
            <Typography color="#757575">
              Timeline avec photos à venir...
            </Typography>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CardContent>
            <Typography>Graphiques d'évolution à venir...</Typography>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <CardContent>
            <Typography>Journal de culture à venir...</Typography>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <CardContent>
            <Typography>Historique maladies à venir...</Typography>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <CardContent>
            <Typography>Informations détaillées à venir...</Typography>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Actions rapides flottantes */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <IconButton
          sx={{
            bgcolor: '#2AD388',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(42, 211, 136, 0.4)',
            '&:hover': { bgcolor: '#23A075' },
          }}
        >
          <ChatIcon />
        </IconButton>
        <IconButton
          sx={{
            bgcolor: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <CameraAltIcon />
        </IconButton>
        <IconButton
          sx={{
            bgcolor: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <NoteAddIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default PlantProfilePage;
