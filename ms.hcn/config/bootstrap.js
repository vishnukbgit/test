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
/* jshint undef: false*/
// Warning: we can't include this service, as it causes it to be re-initialised
// const CacheService = require('../api/services/CacheService');

// Source of ASCII art: http://patorjk.com/software/taag/#p=display&f=Small&t=HCN%20microservice%0A
function announce(){
  console.log("STARTED SUCCESSFULLY\n-------------------------------------------------------\n  _  _  ___ _  _         _                            _        \n | || |/ __| \\| |  _ __ (_)__ _ _ ___ ___ ___ _ ___ _(_)__ ___ \n | __ | (__| .` | | '  \\| / _| '_/ _ (_-</ -_) '_\\ V / / _/ -_)\n |_||_|\\___|_|\\_| |_|_|_|_\\__|_| \\___/__/\\___|_|  \\_/|_\\__\\___|");
}


module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

  let api_key = 'ms.hcn_key';

  try {
    utilsService.getApiKey(api_key,function(err) {
      if (err)
        return cb(err);
      else {
        HealthPractitionerType.find().exec(function(error,hpt) {
        if (error) {
          console.log("Error reading HealthPractitionerType ",error);

          return cb(error);
        }
        let roleId2name = {};
        _.each(hpt,r => {
          roleId2name[r.id] = r.description;
        });
          CacheService.set("roleId2name",roleId2name);
          let roleId2code = {};
          _.each(hpt,r => {
            roleId2code[r.id] = r.code;
          });
        CacheService.set("roleId2code",roleId2code);

        announce();
        return cb();

        });
      }
    });
  } catch (e) {
    return cb(e);
  }
};
