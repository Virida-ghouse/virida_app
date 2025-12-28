import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isDanger = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* En-tête avec icône */}
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isDanger ? '#FFEBEE' : '#F0F9F4',
            }}
          >
            <WarningAmberIcon
              sx={{
                fontSize: '1.8rem',
                color: isDanger ? '#EF5350' : '#2E7D32',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#121A21',
              fontSize: '1.25rem',
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Contenu */}
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: '#616161',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            flex: 1,
            borderColor: '#E0E0E0',
            color: '#616161',
            fontWeight: 600,
            textTransform: 'none',
            py: 1.2,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#BDBDBD',
              bgcolor: '#FAFAFA',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            flex: 1,
            bgcolor: isDanger ? '#EF5350' : '#2E7D32',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            py: 1.2,
            borderRadius: 2,
            boxShadow: isDanger
              ? '0 2px 8px rgba(239, 83, 80, 0.3)'
              : '0 2px 8px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              bgcolor: isDanger ? '#D32F2F' : '#1B5E20',
              boxShadow: isDanger
                ? '0 4px 12px rgba(239, 83, 80, 0.4)'
                : '0 4px 12px rgba(46, 125, 50, 0.4)',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
