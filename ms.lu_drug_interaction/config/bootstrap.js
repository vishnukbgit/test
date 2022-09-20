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
  console.log("STARTED SUCCESSFULLY\n-----------------------------------------------------------\n    __            ___                     _____       _                      _   _             \n  / / /\\ /\\     /   \\_ __ _   _  __ _    \\_   \\_ __ | |_ ___ _ __ __ _  ___| |_(_) ___  _ __  \n / / / / \\ \\   / /\\ / '__| | | |/ _` |    / /\\/ '_ \\| __/ _ \\ '__/ _` |/ __| __| |/ _ \\| '_ \\ \n/ /__\\ \\_/ /  / /_//| |  | |_| | (_| | /\\/ /_ | | | | ||  __/ | | (_| | (__| |_| | (_) | | | |\n\\____/\\___/  /___,' |_|   \\__,_|\\__, | \\____/ |_| |_|\\__\\___|_|  \\__,_|\\___|\\__|_|\\___/|_| |_|\n                                |___/");

}

module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

// NB - THIS KEY DOES NOT MATCH THE NAME OF THE microservice. 
//  This is deliberate, as we may swap out this microservice for another at a later date
//
  let api_key_name = 'ms.drug_interaction_key';

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
