import express from 'express';
import mongoose from 'mongoose';
import environment from './environments/environment';
import myRoutes from './routes'; // include index

// Erstellen Sie eine Express-Anwendung
const app = express();

// Middleware zum Parsen von JSON
app.use(express.json());

// Setzen Sie die Portnummer für den Server
const port = environment.port;

// Binden Sie den customerRouter unter dem Pfad '/api' ein
app.use('/api', myRoutes.customerRouter);
app.use('/api', myRoutes.assetsRouter);
app.use('/api', myRoutes.userRouter);

// Starten Sie den Server und hören Sie auf den angegebenen Port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

connectMongo();

async function connectMongo() {
  const { database, host } = environment.mongo;
  try {
    await mongoose.connect(`mongodb://${host}/${database}`);
    console.log('Mongo Server is running on ' + host + '/' + database);
  } catch (error) {
    console.error(error);
  }
}
