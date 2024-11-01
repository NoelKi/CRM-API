import express from 'express';
import path from 'path';
import myRoutes from './routes';

// Erstellen Sie eine Express-Anwendung
const app = express();

// Middleware zum Parsen von JSON
app.use(express.json());

// Setzen Sie die Portnummer für den Server
const port = 3000;

// Rootpath für Bilder
const ROOT_PATH = path.join(__dirname, '/assets/img/logos');

// Binden Sie den userRouter unter dem Pfad '/api' ein
app.use('/api', myRoutes.userRouter);
app.use('/api', myRoutes.assetsRouter);

// Starten Sie den Server und hören Sie auf den angegebenen Port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
