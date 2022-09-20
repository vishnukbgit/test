/* Created by Aravindhan Chandrasekar */
// policies/canAccess.js
/*Policy to check and allow the API request only if it has got the "valid" access key set in the header.
Refer to bootstrap.js for the logic to retrieve the API key value from database.
*/


//noinspection JSUnresolvedVariable
module.exports = function canAccess (req, res, next) {

let access_key_variable_name = 'access-key';
//get access key value from header
let access_key_value = req.get(access_key_variable_name);
 //check if both access key value from request header and local access key value to check against exists
if(sails.apikey && access_key_value)
{
  if(sails.apikey.trim().toLowerCase() === access_key_value.trim().toLowerCase())
  {

  return next();
  }
  //keys don't match
  else
  {
    //TODO capture in log
    res.forbidden();
  }
}
else
{
  //TODO capture in log
  res.forbidden();
}



};
