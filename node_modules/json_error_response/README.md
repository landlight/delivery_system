# json_error_response
library for error responses in json
- npm install json_error_response (minimum working version: 1.0.3)

# npm
https://www.npmjs.com/package/json_error_response

# Methods
- IsRequired (string itemName)
- IsNotObject (string itemName, string type)
- OutOfBound (string itemName, int startPoint, int endPoint)
- Unauthorized ()
- PermissionDenied ()
- Forbidden () 
- NotImpemented ()
- SizeNegative ()
- NotFound (string itemName)

- DefaultError (string error, response res) 
* This can be used as a default error from the try catch. 

# How to use
const json_error = require("json_error_response");

console.log(json_error.IsRequired("user"))

// => {"message": "user not found"};

# How to use with response
- return res.json(json_error.isRequired("user"));

# Special Case
  try {

     // do something

  } catch (err) {
     
     json_error.DefaultError(err, res);
  
  }
  
# Buy me a coffee
<a href="https://www.buymeacoffee.com/rJeZAvL" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>
 
