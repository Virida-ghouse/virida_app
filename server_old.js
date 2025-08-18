import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Vérifier si le répertoire dist existe
const distPath = path.join(__dirname, 'dist');
console.log(`Chemin du répertoire dist: ${distPath}`);
console.log(`Contenu du répertoire courant: ${fs.readdirSync(__dirname).join(', ')}`);

if (!fs.existsSync(distPath)) {
  console.error('Le répertoire dist n\'existe pas. Tentative de build automatique...');
  try {
    console.log('Exécution de la commande de build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build terminé avec succès!');
  } catch (error) {
    console.error('Erreur lors du build:', error.message);
  }
}

// Middleware pour servir les fichiers statiques
app.use(express.static(distPath));

// Vérifier si index.html existe et afficher son contenu pour le débogage
const indexPath = path.join(distPath, 'index.html');
console.log(`Chemin du fichier index.html: ${indexPath}`);
console.log(`index.html existe: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(distPath)) {
  console.log(`Contenu du répertoire dist: ${fs.readdirSync(distPath).join(', ')}`);
}

// Pour les routes SPA - redirige toutes les requêtes vers index.html
app.get('*', (req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  
  if (fs.existsSync(indexPath)) {
    console.log('Envoi du fichier index.html');
    res.sendFile(indexPath);
  } else {
    console.error('index.html introuvable!');
    res.status(404).send('Application non construite correctement. index.html introuvable.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${distPath}`);
});
