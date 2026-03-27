# Services API - Virida Dashboard

## 📁 Architecture

Tous les appels API sont centralisés dans des services dédiés pour faciliter la maintenance et éviter les URLs en dur dans les composants.

```
src/services/api/
├── apiConfig.ts          # Configuration centralisée (URL, headers, gestion d'erreurs)
├── authService.ts        # Authentification (login, register, verify)
├── plantService.ts       # Gestion des plantes et tâches
├── sensorService.ts      # Données des capteurs
├── chatService.ts        # Chatbot EVE
├── contactService.ts     # Formulaire de contact
└── index.ts              # Export centralisé
```

## ⚙️ Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3001
```

Pour la production :
```env
VITE_API_URL=https://api.virida.com
```

### Configuration centralisée

Le fichier `apiConfig.ts` contient :
- `API_CONFIG.BASE_URL` : URL de base de l'API
- `getAuthHeaders()` : Headers avec token JWT automatique
- `apiFetch()` : Wrapper fetch avec gestion d'erreurs

## 📖 Utilisation

### Import

```typescript
import { authService, plantService, sensorService } from '@/services/api';
```

### Exemples

#### Authentification
```typescript
// Login
const { token, user } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Vérifier le token
const { valid, user } = await authService.verifyToken();
```

#### Plantes
```typescript
// Récupérer toutes les plantes
const plants = await plantService.getPlants();

// Créer une plante
const newPlant = await plantService.createPlant({
  name: 'Tomate',
  species: 'Solanum lycopersicum',
  plantedDate: '2024-03-20'
});

// Mettre à jour
await plantService.updatePlant(plantId, { status: 'healthy' });

// Supprimer
await plantService.deletePlant(plantId);
```

#### Capteurs
```typescript
// Données actuelles
const readings = await sensorService.getCurrentReadings();
// { temperature: 24.5, humidity: 65, ... }

// Historique
const history = await sensorService.getSensorHistory('temperature', '2024-03-01', '2024-03-20');
```

#### Chatbot
```typescript
// Envoyer un message
const response = await chatService.sendMessage('Comment arroser mes tomates ?');
console.log(response.message);

// Historique
const history = await chatService.getChatHistory();
```

#### Contact
```typescript
// Soumettre un formulaire
await contactService.submitContact({
  fullName: 'Jean Dupont',
  email: 'jean@example.com',
  interest: 'Participer à la beta',
  message: 'Je suis intéressé par votre projet'
});

// Liste (ADMIN)
const { contacts, pagination } = await contactService.getContacts(1, 10, 'beta');
```

## 🔒 Gestion de l'authentification

Le token JWT est automatiquement ajouté aux headers pour toutes les requêtes qui nécessitent une authentification.

```typescript
// Le token est stocké dans localStorage
localStorage.setItem('token', token);

// Il est automatiquement ajouté via getAuthHeaders()
// Pas besoin de le gérer manuellement dans les composants
```

## ❌ Gestion des erreurs

Toutes les erreurs sont gérées de manière centralisée :

```typescript
try {
  const plants = await plantService.getPlants();
} catch (error: any) {
  if (error.status === 401) {
    // Non authentifié
  } else if (error.status === 400) {
    // Erreur de validation
    console.log(error.data.details);
  } else {
    // Erreur serveur ou réseau
  }
}
```

## 🚀 Migration depuis fetch en dur

### Avant
```typescript
const response = await fetch('http://localhost:3001/api/plants', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const plants = await response.json();
```

### Après
```typescript
const plants = await plantService.getPlants();
```

## 📝 Bonnes pratiques

1. **Toujours utiliser les services** : Ne jamais faire de `fetch()` directement dans les composants
2. **Types TypeScript** : Tous les services sont typés pour IntelliSense
3. **Gestion d'erreurs** : Toujours wrapper les appels dans try/catch
4. **Configuration** : Utiliser `.env` pour les URLs différentes selon l'environnement
5. **Réutilisabilité** : Ajouter de nouvelles méthodes dans les services existants

## 🔧 Ajouter un nouveau service

1. Créer `src/services/api/monService.ts`
2. Utiliser `apiFetch` pour les appels
3. Définir les interfaces TypeScript
4. Exporter dans `index.ts`

```typescript
import { apiFetch } from './apiConfig';

export interface MonType {
  id: string;
  name: string;
}

class MonService {
  async getData(): Promise<MonType[]> {
    const response = await apiFetch('/api/mon-endpoint');
    return response.json();
  }
}

export const monService = new MonService();
```
