import fetch from 'node-fetch';
import { getAuthToken } from './auth.js';

export const Log = async (stack, level, logPackage, message) => {
  try {
    const token = await getAuthToken();

    const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: logPackage.toLowerCase(),
        message
      })
    });

    const data = await response.json();
    console.log('✅ Log Sent:', data);
  } catch (error) {
    console.error('❌ Logging Failed:', error.message);
  }
};
