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
  console.log("STARTED SUCCESSFULLY\n-----------------------------------------------------------\n  ___  _                                                            _   \n |   \\(_)___ ___ __ _ ___ ___   __ _ ______ ___ _______ __  ___ _ _| |_ \n | |) | (_-</ -_) _` (_-</ -_) / _` (_-<_-</ -_|_-<_-< '  \\/ -_) ' \\  _|\n |___/|_/__/\\___\\__,_/__/\\___| \\__,_/__/__/\\___/__/__/_|_|_\\___|_||_\\__|");
}

module.exports.bootstrap = function(cb) {

// Potentially important change :)
   process.env.TZ = 'Australia/Melbourne';

  let api_key_name = 'ms.disease_assessment_key';

  try {
    DiseaseAssessmentParameters.find().exec(function(err, mcd) {
  		if (err) {
  			console.log("Error: ",err);
  			throw(err);
  		}
  		let code2datatype = {};
  		_.each(mcd,(mc)=>{
  			code2datatype[mc.code] = {datatype: mc.datatype, id: mc.id};
  		});
  		if (code2datatype.length === 0)
  			console.error("Could not find any DiseaseAssessmentParameters for cache");
  		CacheService.set('DiseaseAssessmentParameters.code2datatype',code2datatype);
      utilsService.getApiKey(api_key_name,function(err) {
        if (err)
          return cb(err);
        else {
          announce();
          return cb();
        }
      });
  	});

  } catch (e) {
    return cb(e);
  }

};
