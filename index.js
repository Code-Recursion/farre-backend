const app = require('./app')
const logger = require('./utils/logger')
const { PORT } = require("./utils/config");

app.listen(PORT, () => {
  logger.info(`Server running on port http://127.0.0.1:${PORT}`);
});
