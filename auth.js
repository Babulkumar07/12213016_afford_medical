import fetch from 'node-fetch';

export const getAuthToken = async () => {
  const response = await fetch('http://20.244.56.144/evaluation-service/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'babul121kumar@gmail.com',
      name: 'babul kumar',
      rollNo: '12213016',
      accessCode: 'CZypQK',
      clientID: 'c05b78b2-7df2-4996-a055-89b0cad5e7c1',
      clientSecret: 'WMtJQhWQzzzfaVGD'
    })
  });

  const data = await response.json();
  return data.access_token;
};
