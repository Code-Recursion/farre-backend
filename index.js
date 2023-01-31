const app = require('./app')
const logger = require('./utils/logger')
const { config } = require("./utils/config");

const PORT = config.PORT | 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port http://127.0.0.1:${PORT}`);
});
