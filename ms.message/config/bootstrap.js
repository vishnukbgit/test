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
  console.log("STARTED SUCCESSFULLY\n-------------------------------------------------------\n  __  __                                  _                            _        \n |  \\/  |___ ______ __ _ __ _ ___   _ __ (_)__ _ _ ___ ___ ___ _ ___ _(_)__ ___ \n | |\\/| / -_|_-<_-</ _` / _` / -_) | '  \\| / _| '_/ _ (_-</ -_) '_\\ V / / _/ -_)\n |_|  |_\\___/__/__/\\__,_\\__, \\___| |_|_|_|_\\__|_| \\___/__/\\___|_|  \\_/|_\\__\\___|\n                        |___/");
}



module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

  let api_key_name = 'ms.message_key';


  try {
    utilsService.getApiKey(api_key_name,function(err) {
      if (err) {
        return cb(err);
      } else {
        let mustHaves = [
          'email_access_key',
          'email_secret_access_key',
          'email_region',
          'email_fromemailaddress',
          'email_environmentname',
          'email_environmentnameplaceholder',
          'email_logo',
          'email_activate_external',
          'email_demo_gp',
          'email_demo_specialist',
          'email_demo_nurse',
          'email_demo_patient'
        ];
        EnvironmentConfigurationSetting
          .find({configuration_name:{'startsWith': 'email'}})
          .exec(function (err,env) {
            if (err) {
                return cb(err);
              }
            if (env) {
              let emailConfigs = {};
              _.each(env,v => {
                let key = v.configuration_name.toLowerCase();
                emailConfigs[key] = v.configuration_value;
              });
              let missing = [];
              _.each(mustHaves,must => {
                if (!emailConfigs[must])
                  missing.push(must);
              });
              if (missing.length > 0) {
                console.log("Missing email configs: "+missing.join());
                return cb("Missing email configs: "+missing.join);
              }
            } else {
              return cb("Email configs not found");
            }
          }
        );
        announce();
        return cb();
      }
    });
  } catch (e) {
    return cb(e);
  }

};
