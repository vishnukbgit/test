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
  console.log("STARTED SUCCESSFULLY\n-------------------------------------------------------\n  ___      _   _         _           _                            _        \n | _ \\__ _| |_(_)___ _ _| |_   _ __ (_)__ _ _ ___ ___ ___ _ ___ _(_)__ ___ \n |  _/ _` |  _| / -_) ' \\  _| | '  \\| / _| '_/ _ (_-</ -_) '_\\ V / / _/ -_)\n |_| \\__,_|\\__|_\\___|_||_\\__| |_|_|_|_\\__|_| \\___/__/\\___|_|  \\_/|_\\__\\___|");
}

module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

  let api_key_name = 'ms.patient_key';

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
