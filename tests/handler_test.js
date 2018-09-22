//import your handler file or main file of Lambda
const { handler } = require('../src/index');

//Call your exports function with required params
//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON
handler(
  {
    queryStringParameters: {
      width: 180,
      height: null
    },
    path:
      'https://esolidar-proto-uploads.s3-eu-west-1.amazonaws.com/brands/580ded66-0364-40f3-8f37-5451c0a8010a.jpg'
  }, //event
  {}, //content
  function(data, ss) {
    //callback function with two arguments
    //console.log(data, ss);
  }
);
