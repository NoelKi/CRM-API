function environment() {
  const local = {
    port: 3000,
    production: false,
    mongo: {
      database: 'crmDb',
      host: '127.0.0.1:27017',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  };

  return local;
}

export default environment();
