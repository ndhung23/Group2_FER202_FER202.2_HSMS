const app = require('./app');

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`HSMS backend listening at http://localhost:${PORT}`);
});
