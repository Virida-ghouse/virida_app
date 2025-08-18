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
    // Configuration optimisée pour le build
    process.env.NODE_OPTIONS = '--max-old-space-size=2048';
    process.env.NODE_ENV = 'production';
    
    execSync('npm run build', { 
      stdio: 'inherit',
      timeout: 600000, // 10 minutes timeout
      env: { ...process.env }
    });
    console.log('Build terminé avec succès!');
  } catch (error) {
    console.error('Erreur lors du build:', error.message);
    console.error('Le serveur va démarrer sans le dossier dist...');
  }
}

// Middleware pour servir les fichiers statiques avec cache headers
app.use(express.static(distPath, {
  maxAge: '1d', // Cache pour 1 jour
  etag: false
}));

// Vérifier si index.html existe et afficher son contenu pour le débogage
const indexPath = path.join(distPath, 'index.html');
console.log(`Chemin du fichier index.html: ${indexPath}`);
console.log(`index.html existe: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(distPath)) {
  console.log(`Contenu du répertoire dist: ${fs.readdirSync(distPath).join(', ')}`);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    distExists: fs.existsSync(distPath),
    indexExists: fs.existsSync(indexPath)
  });
});

// Pour les routes SPA - redirige toutes les requêtes vers index.html
app.get('*', (req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  
  // Vérifier à nouveau si le fichier existe (au cas où le build se termine après le démarrage)
  if (fs.existsSync(indexPath)) {
    console.log('Envoi du fichier index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du fichier:', err);
        res.status(500).send('Erreur serveur lors du chargement de l\'application.');
      }
    });
  } else {
    console.error('index.html introuvable!');
    
    // Tentative de rebuild si le fichier n'existe toujours pas
    if (!fs.existsSync(distPath)) {
      console.log('Tentative de rebuild automatique...');
      try {
        execSync('npm run build', { 
          stdio: 'pipe',
          timeout: 300000, // 5 minutes timeout pour rebuild
          env: { 
            ...process.env,
            NODE_OPTIONS: '--max-old-space-size=2048',
            NODE_ENV: 'production'
          }
        });
        
        // Vérifier à nouveau après le rebuild
        if (fs.existsSync(indexPath)) {
          console.log('Rebuild réussi, envoi du fichier index.html');
          return res.sendFile(indexPath);
        }
      } catch (buildError) {
        console.error('Erreur lors du rebuild:', buildError.message);
      }
    }
    
    res.status(404).send(`
      <html>
        <head><title>Application en cours de construction</title></head>
        <body>
          <h1>Application en cours de construction</h1>
          <p>L'application React est en cours de build. Veuillez patienter quelques minutes et rafraîchir la page.</p>
          <p>Si le problème persiste, vérifiez les logs de déploiement.</p>
          <script>
            setTimeout(() => {
              window.location.reload();
            }, 30000); // Refresh automatique après 30 secondes
          </script>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from: ${distPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Node options: ${process.env.NODE_OPTIONS || 'none'}`);
});
