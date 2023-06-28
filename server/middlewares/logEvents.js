const { format } = require('date-fns');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}, ${crypto.randomUUID()}, ${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, _, next) => {
  logEvents(`${req.method}, ${req.headers.origin}, ${req.url}`, 'reqLog.csv');
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
