const bcrypt = require('bcrypt');

async function gen() {
  const hash = await bcrypt.hash('123456', 10);
  console.log('Hash for 123456:', hash);
}

gen();
