import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import environment from './environments/environment';
import { isAdmin } from './middlewares/admin-only-middleware';
import { isAuthenticated } from './middlewares/authentication-middleware';
import myRoutes from './routes'; // include index

// Erstellen Sie eine Express-Anwendung
const app = express();

// Middleware zum Parsen von JSON
app.use(express.json());
app.use(cookieParser());

// Setzen Sie die Portnummer für den Server
const port = environment.port;

// Binden Sie den customerRouter unter dem Pfad '/api' ein
app.use('/api', myRoutes.signupRouter);
app.use('/api', myRoutes.loginRouter);
app.use('/api', myRoutes.tokenRouter);
app.use('/api', isAuthenticated, myRoutes.assetsRouter);
app.use('/api', isAuthenticated, myRoutes.customerRouter);
app.use('/api', isAuthenticated, myRoutes.userRouter);
app.use('/api', isAuthenticated, isAdmin, myRoutes.adminRouter);

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
