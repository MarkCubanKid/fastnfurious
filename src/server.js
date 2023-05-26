const express = require('express');
const bodyParser = require('body-parser');
var axios = require('axios');

const app = express();
app.use(bodyParser.json());

const expectedKey = 'testPwd@123';

app.get('/teter', (req, res) => {
    const event = req.body;
    const receivedKey = req.headers['x-vidyard-signature'];
  
    if (receivedKey === expectedKey) {
    
        res.send('Hello, world!');
        console.log('Received an valid Vidyard webhook');

     
    } else {
      console.log('Received an invalid Vidyard webhook');
      res.status(401).json({ message: 'Unauthorized' });
    }
  });


app.post('/vidyard-webhook', (req, res) => {
   console.log("Requqq is ",req);
   console.log("Requqq is ",req.headers);


    console.log("Body is ",req.body);
  const event = req.body;
  const receivedKey = req.headers['x-vidyard-signature'];

  if (receivedKey === expectedKey) {
  
    var data = JSON.stringify({
      "description": "From Video",
      "subject": "From vidyard to ticket",
      "email": "jeron.mohan@freshworks.com",
      "priority": 1,
      "status": 2
    });
    
    var config = {
      method: 'post',
      url: 'https://freshworks8867.freshdesk.com/api/v2/tickets',
      headers: { 
        'Authorization': 'Basic TEljcVhjOXRUODFvTU5HcGxlbG0=', 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (data) {
      console.log(JSON.stringify(data.data));
      console.log('Received an valid Vidyard webhook');
      const response = {
        message: 'Webhook received and verified successfully',
        event: event
      };
      res.json(response);
    })
    .catch(function (error) {
      console.log(error);
      res.status(403).json({ message: 'Cannot create FD ticket' });
    });
    
   
   
  } else {
    console.log('Received an invalid Vidyard webhook');
    res.status(200).json({ message: 'Unauthorized' });
  }
});

const port = 3000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
