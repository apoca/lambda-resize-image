//import your handler file or main file of Lambda
const { imageprocess } = require('../../src/handler');

//Call your exports function with required params
//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON
imageprocess(
  {
    queryStringParameters: {
      width: 330,
      height: null,
    },
    path:
      'http://localhost:3000/brands/580ded66-0364-40f3-8f37-5451c0a8010a.jpg',
  }, //event
  {}, //content
  function (data) {
    //callback function with two arguments
    console.log(data);
  }
);
