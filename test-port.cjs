const net = require('net');
const s = net.createServer();
s.listen(3000, "0.0.0.0", () => {
  console.log("Listening callback called!");
});
s.on('error', (err) => {
  console.log("Error event:", err.message);
});
