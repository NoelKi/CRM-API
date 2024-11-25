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
    },
    JWT_SECRET: '40db068a6f120f19061043cc8f8f03497de6625fd5433ef996baf626f188eece'
  };
  return local;
}

export default environment();
