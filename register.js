import fetch from 'node-fetch';

const register = async () => {
  const response = await fetch('http://20.244.56.144/evaluation-service/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: "Babul Kumar",
      email: "babul121kumar@gmail.com",
      mobileNo: "9508893641",
      githubUsername: "babul1298",
      rollNo: "12213016",
      accessCode: "CZypQK" // from Affordmed email
    }),
  });

  const data = await response.json();
  console.log(data);
};

register();
