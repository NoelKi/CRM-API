import express from 'express';
import myRoutes from './routes';

// Erstellen Sie eine Express-Anwendung
const app = express();

// Middleware zum Parsen von JSON
app.use(express.json());

// Setzen Sie die Portnummer für den Server
const port = 3000;

// Binden Sie den userRouter unter dem Pfad '/api' ein
app.use('/api', myRoutes.userRouter);
app.use('/api', myRoutes.assetsRouter);

// Starten Sie den Server und hören Sie auf den angegebenen Port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
