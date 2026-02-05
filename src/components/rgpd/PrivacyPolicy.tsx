import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Shield, Lock, Eye, Database, Mail, FileText, CheckCircle } from 'lucide-react';

/**
 * 📜 Page de Politique de Confidentialité
 *
 * Conforme au RGPD (Règlement UE 2016/679)
 * et à la loi Informatique et Libertés
 *
 * Basée sur l'étude de faisabilité juridique Virida
 * Design selon la charte graphique Virida
 */
const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      icon: <Shield size={24} color="#2AD368" />,
      title: '1. Responsable du Traitement',
      content: [
        'Virida est responsable de la collecte et du traitement de vos données personnelles.',
        'Contact DPO (Délégué à la Protection des Données) : privacy@virida.fr',
        'Siège social : [À compléter]',
      ],
    },
    {
      icon: <Database size={24} color="#2AD368" />,
      title: '2. Données Collectées',
      content: [
        {
          subtitle: 'Données d\'identification (Art. 4 §1 RGPD)',
          items: ['Nom, prénom', 'Adresse e-mail', 'Identifiant unique'],
        },
        {
          subtitle: 'Données d\'usage (Art. 6 §4 RGPD)',
          items: ['Logs de connexion', 'Actions dans l\'application', 'Préférences utilisateur'],
        },
        {
          subtitle: '💬 Conversations avec Eve (Assistant IA)',
          items: [
            'Historique des conversations avec l\'assistant Eve',
            'Messages envoyés et réponses reçues',
            'Métadonnées (horodatage, méthode RAG utilisée)',
            'Stockage local et synchronisation serveur',
            'Vous pouvez exporter ou supprimer vos conversations à tout moment',
          ],
        },
        {
          subtitle: 'Données environnementales (Non personnelles)',
          items: [
            'Humidité du sol',
            'Température, CO₂',
            'Niveau d\'eau',
            'Ces données sont associées à votre compte mais ne deviennent personnelles que par association',
          ],
        },
      ],
    },
    {
      icon: <FileText size={24} color="#2AD368" />,
      title: '3. Base Juridique (Art. 6 RGPD)',
      content: [
        {
          subtitle: 'Consentement (Art. 6 §1-a)',
          items: ['Collecte des données lors de l\'inscription', 'Popup de consentement explicite'],
        },
        {
          subtitle: 'Exécution du contrat (Art. 6 §1-b)',
          items: ['Fourniture du service Virida', 'Gestion de votre serre connectée'],
        },
        {
          subtitle: 'Intérêt légitime (Art. 6 §1-f)',
          items: ['Amélioration du service', 'Détection d\'anomalies', 'Analyse de données'],
        },
      ],
    },
    {
      icon: <Lock size={24} color="#2AD368" />,
      title: '4. Sécurité et Protection (Art. 32 RGPD)',
      content: [
        {
          subtitle: 'Mesures de sécurité',
          items: [
            '🔒 Chiffrement AES-256 des données sensibles',
            '🇫🇷 Hébergement en France (Scaleway / OVH / Azure EU)',
            '🔐 Authentification sécurisée par JWT',
            '🛡️ Communication MQTT chiffrée (TLS 1.2+)',
            '🔍 Audit pentest avant déploiement',
            '📊 Registre de traitement RGPD tenu à jour',
          ],
        },
      ],
    },
    {
      icon: <Eye size={24} color="#2AD368" />,
      title: '5. Vos Droits (Art. 15-21 RGPD)',
      content: [
        {
          subtitle: 'Vous pouvez exercer les droits suivants',
          items: [
            'Droit d\'accès (Art. 15) : Consulter vos données',
            'Droit de rectification (Art. 16) : Corriger vos données',
            'Droit à l\'effacement (Art. 17) : Supprimer vos données',
            'Droit à la portabilité (Art. 20) : Exporter vos données',
            'Droit d\'opposition (Art. 21) : Refuser le traitement',
            'Droit de limitation (Art. 18) : Limiter l\'utilisation',
          ],
        },
        {
          subtitle: 'Comment exercer vos droits ?',
          items: [
            'Par e-mail : privacy@virida.fr',
            'Depuis l\'application : Menu > Paramètres > Mes données',
            'Délai de réponse : Maximum 30 jours (Art. 12 §3 RGPD)',
          ],
        },
      ],
    },
    {
      icon: <Mail size={24} color="#2AD368" />,
      title: '6. Conservation des Données',
      content: [
        'Données de compte : Conservées pendant la durée du contrat + 3 ans',
        'Données de connexion : 1 an (conformité CNIL)',
        '💬 Conversations avec Eve : Conservées pendant la durée du contrat (suppression possible à tout moment)',
        'Données environnementales : Conservation illimitée (non personnelles)',
        'Consentement cookies : Renouvellement tous les 13 mois (Art. 82 LIL)',
      ],
    },
    {
      icon: <CheckCircle size={24} color="#2AD368" />,
      title: '7. Cookies et Traceurs',
      content: [
        {
          subtitle: 'Types de cookies utilisés',
          items: [
            '🔧 Cookies essentiels : Authentification, sécurité (toujours actifs)',
            '📊 Cookies analytiques : Statistiques d\'usage (avec consentement)',
            '⚙️ Cookies fonctionnels : Préférences utilisateur (avec consentement)',
            '❌ Cookies marketing : Non utilisés par Virida',
          ],
        },
        {
          subtitle: 'Gestion des cookies',
          items: [
            'Vous pouvez modifier vos préférences à tout moment',
            'Menu > Paramètres > Préférences de confidentialité',
          ],
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          padding: { xs: 2, md: 4 },
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* En-tête */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#121A21',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Shield size={36} color="#2AD368" />
            Politique de Confidentialité
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#121A21', opacity: 0.7 }}>
            Conforme au RGPD (UE 2016/679) et à la loi Informatique et Libertés
          </Typography>
          <Typography variant="caption" sx={{ color: '#121A21', opacity: 0.5 }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Introduction */}
        <Box
          sx={{
            mb: 4,
            p: 2.5,
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            borderLeft: '4px solid #2AD368',
          }}
        >
          <Typography variant="body1" sx={{ color: '#121A21', lineHeight: 1.8 }}>
            Chez <strong>Virida</strong>, nous prenons la protection de vos données personnelles
            très au sérieux. Cette politique explique comment nous collectons, utilisons et
            protégeons vos informations conformément au Règlement Général sur la Protection des
            Données (RGPD) et à la loi Informatique et Libertés.
          </Typography>
        </Box>

        {/* Sections */}
        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              {section.icon}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#052E1C', fontSize: '1.15rem' }}
              >
                {section.title}
              </Typography>
            </Box>

            {section.content.map((item, itemIndex) => {
              if (typeof item === 'string') {
                return (
                  <Typography
                    key={itemIndex}
                    variant="body2"
                    sx={{ mb: 1, color: '#121A21', lineHeight: 1.7, pl: 2 }}
                  >
                    • {item}
                  </Typography>
                );
              } else {
                return (
                  <Box key={itemIndex} sx={{ mb: 2, pl: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: '#052E1C', mb: 1 }}
                    >
                      {item.subtitle}
                    </Typography>
                    <List dense>
                      {item.items.map((listItem, listIndex) => (
                        <ListItem key={listIndex} sx={{ py: 0.5, pl: 2 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle size={16} color="#2AD368" />
                          </ListItemIcon>
                          <ListItemText
                            primary={listItem}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { color: '#121A21', lineHeight: 1.6 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                );
              }
            })}
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Footer avec informations de contact */}
        <Box
          sx={{
            p: 2.5,
            backgroundColor: '#F5F5F5',
            borderRadius: '12px',
            borderLeft: '4px solid #2AD368',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052E1C' }}>
            📧 Contact et Réclamations
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#121A21', lineHeight: 1.7 }}>
            Pour toute question concernant vos données personnelles :
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: '#121A21' }}>
            • <strong>E-mail DPO :</strong> privacy@virida.fr
          </Typography>
          <Typography variant="body2" sx={{ color: '#121A21', lineHeight: 1.7 }}>
            • <strong>CNIL :</strong> Vous pouvez déposer une réclamation auprès de la Commission
            Nationale de l'Informatique et des Libertés (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2AD368', fontWeight: 500, textDecoration: 'none' }}
            >
              www.cnil.fr
            </a>
            )
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
