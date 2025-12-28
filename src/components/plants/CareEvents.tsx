import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useViridaStore } from '../../store/useViridaStore';

interface CareEventsProps {
  plantId: string;
}

interface CareEvent {
  id: string;
  eventType: string;
  timestamp: string;
  notes?: string;
  amount?: number;
  unit?: string;
}

const StyledCard = styled(Card)(() => ({
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const EmptyStateCard = styled(Card)(() => ({
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  border: '2px dashed #E1E8EE',
  borderRadius: '8px',
}));

const getEventIcon = (eventType: string) => {
  const icons: Record<string, string> = {
    WATERING: '💧',
    FERTILIZING: '🧪',
    PRUNING: '✂️',
    PEST_CONTROL: '🐛',
    PH_ADJUSTMENT: '🧬',
    REPOTTING: '🪴',
    HARVESTING: '🌾',
  };
  return icons[eventType] || '📝';
};

const getEventLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    WATERING: 'Arrosage',
    FERTILIZING: 'Fertilisation',
    PRUNING: 'Élagage',
    PEST_CONTROL: 'Traitement parasites',
    PH_ADJUSTMENT: 'Ajustement pH',
    REPOTTING: 'Rempotage',
    HARVESTING: 'Récolte',
  };
  return labels[eventType] || eventType;
};

const CareEvents: React.FC<CareEventsProps> = ({ plantId }) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les événements de soin
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/care-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data.data.events);
        }
      } catch (err) {
        console.error('Erreur chargement care events:', err);
        setError('Impossible de charger l\'historique des soins');
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchEvents();
    }
  }, [plantId, apiUrl]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#2AD388' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyStateCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: '#121A21', mb: 1 }}>
            Aucun événement de soin
          </Typography>
          <Typography variant="body2" color="#8091A0" sx={{ mb: 2 }}>
            Commencez à enregistrer les soins apportés à votre plante
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: '#2AD388',
              color: '#FFFFFF',
              textTransform: 'none',
              '&:hover': {
                background: '#23A075',
              },
            }}
          >
            Enregistrer un soin
          </Button>
        </CardContent>
      </EmptyStateCard>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700 }}>
          Historique des soins ({events.length})
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: '#2AD388',
            color: '#FFFFFF',
            textTransform: 'none',
            fontSize: '0.85rem',
            '&:hover': {
              background: '#23A075',
            },
          }}
        >
          Ajouter
        </Button>
      </Box>

      <Timeline position="alternate">
        {events.map((event, idx) => (
          <TimelineItem key={event.id}>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: '#2AD388',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {getEventIcon(event.eventType)}
              </TimelineDot>
              {idx < events.length - 1 && <TimelineConnector sx={{ background: '#E1E8EE' }} />}
            </TimelineSeparator>
            <TimelineContent>
              <StyledCard>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700 }}>
                    {getEventLabel(event.eventType)}
                  </Typography>
                  <Typography variant="caption" color="#8091A0">
                    {new Date(event.timestamp).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(event.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  {event.notes && (
                    <Typography variant="body2" sx={{ color: '#121A21', mt: 1 }}>
                      {event.notes}
                    </Typography>
                  )}
                  {event.amount && (
                    <Typography variant="caption" sx={{ color: '#2AD388', fontWeight: 600, mt: 1, display: 'block' }}>
                      Quantité: {event.amount} {event.unit}
                    </Typography>
                  )}
                </CardContent>
              </StyledCard>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default CareEvents;
