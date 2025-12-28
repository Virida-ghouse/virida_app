import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useViridaStore } from '../../store/useViridaStore';

interface PhotoGalleryProps {
  plantId: string;
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
  takenAt: string;
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

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ plantId }) => {
  const apiUrl = useViridaStore((state) => state.apiUrl);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/photos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setPhotos(data.data.photos);
        }
      } catch (err) {
        console.error('Erreur chargement photos:', err);
        setError('Impossible de charger les photos');
      } finally {
        setLoading(false);
      }
    };

    if (plantId) {
      fetchPhotos();
    }
  }, [plantId, apiUrl]);

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${apiUrl}/api/plant-advanced/${plantId}/photos/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setPhotos(photos.filter((p) => p.id !== photoId));
      }
    } catch (err) {
      console.error('Erreur suppression photo:', err);
      setError('Impossible de supprimer la photo');
    }
  };

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

  if (photos.length === 0) {
    return (
      <EmptyStateCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <AddPhotoAlternateIcon
            sx={{
              fontSize: '3rem',
              color: '#E1E8EE',
              mb: 2,
            }}
          />
          <Typography variant="h6" sx={{ color: '#121A21', mb: 1 }}>
            Aucune photo
          </Typography>
          <Typography variant="body2" color="#8091A0" sx={{ mb: 2 }}>
            Commencez par ajouter une photo pour documenter la croissance de votre plante
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddPhotoAlternateIcon />}
            sx={{
              background: '#2AD388',
              color: '#FFFFFF',
              textTransform: 'none',
              '&:hover': {
                background: '#23A075',
              },
            }}
          >
            Ajouter une photo
          </Button>
        </CardContent>
      </EmptyStateCard>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#121A21', fontWeight: 700 }}>
          Timeline photos ({photos.length})
        </Typography>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
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

      <ImageList cols={3} gap={12} sx={{ width: '100%' }}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id} sx={{ position: 'relative' }}>
            <StyledCard sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt={photo.caption || 'Plant photo'}
                sx={{ objectFit: 'cover' }}
              />
              <ImageListItemBar
                title={photo.caption || 'Photo'}
                subtitle={new Date(photo.takenAt).toLocaleDateString('fr-FR')}
                position="below"
                actionIcon={
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePhoto(photo.id)}
                    sx={{
                      color: '#e74c3c',
                      '&:hover': {
                        background: '#e74c3c20',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              />
            </StyledCard>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default PhotoGallery;
