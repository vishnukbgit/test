/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
function announce(){
  console.log("STARTED SUCCESSFULLY\n-----------------------------------------------------------\n                 _ _           _   _             \n  /\\/\\   ___  __| (_) ___ __ _| |_(_) ___  _ __  \n /    \\ / _ \\/ _` | |/ __/ _` | __| |/ _ \\| '_ \\ \n/ /\\/\\ \\  __/ (_| | | (_| (_| | |_| | (_) | | | |\n\\/    \\/\\___|\\__,_|_|\\___\\__,_|\\__|_|\\___/|_| |_|");
}

module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

  let api_key_name = 'ms.medication_key';

  try {
    utilsService.getApiKey(api_key_name,function(err) {
      if (err)
        return cb(err);
      else {
        announce();
        return cb();
      }
    });
  } catch (e) {
    return cb(e);
  }

};
