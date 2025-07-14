import { Log } from './logger.js';

(async () => {
  try {
    await Log('frontend', 'info', 'utils', 'Test log from Ayush');
    console.log('Log function executed ✅');
  } catch (err) {
    console.error('Test logger failed ❌', err);
  }
})();
