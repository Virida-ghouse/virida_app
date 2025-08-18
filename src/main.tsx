import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 Main.tsx - Démarrage de l\'application React');
console.log('🔍 Environment:', import.meta.env.MODE);
console.log('🔍 DEV mode:', import.meta.env.DEV);

const rootElement = document.getElementById('root');
console.log('📍 Root element trouvé:', !!rootElement);

if (!rootElement) {
  console.error('❌ Élément root non trouvé dans le DOM');
} else {
  console.log('✅ Création du root React...');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ Application React montée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du montage de l\'application:', error);
  }
}
