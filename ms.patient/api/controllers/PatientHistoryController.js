/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
const CacheService = require('../services/CacheService');
const _=require('underscore');
module.exports = {

  update(req,res) {
  	try {

	  	let failed = false;
			let incoming = req.allParams();
			let cnt = 0;
			let name2id = {};
			let patientId = req.param('id');
			let updatecb = function(err, data) {
				if (err) {
					logger.error("Error: ",err);
					if (!failed) {
						failed = true;

            return res.json(utilsService.makeErrQuery(err));
					}
				}

				cnt--;
				if (cnt <= 0 && !failed){
		    	return res.json({success: !failed});
        }
			};
//
// Sanity check: does the patient exist?
//
			Patient.findOne({id: patientId}).exec(function(err, pat) {
				if (err) {
					logger.error("Patient find error: ",err);

          return res.json(utilsService.makeErrQuery(err));
				}

				if (!pat) {
					let msg = "Patient not found for id: "+patientId;
					logger.error("patient not found for the id:"+patientId,null);

          return res.json(utilsService.makeErrNotFound(msg));
				}
	// Get the id's of the medical conditions
				MedicalCondition.find().exec(function(err, mcd) {
					if (err) {
						logger.error("Error finding medical condition: ",err);

            return res.json(utilsService.makeErrQuery(err));
					}
					_.each(mcd,(mc) => {
						name2id[mc.code] = mc.id;
					});

					CacheService.set('medical_conditions',name2id);
					CacheService.get('medical_conditions');

		// Now iterate and save the data

					PatientHistory.find({patient_id: patientId}).
					exec(function(err, phd) {
						if (err) {
							logger.error("Error: ",err);

return res.json(utilsService.makeErrQuery(err));
						}
						if (!phd) {
              return res.json([]);
            }


						cnt = 0;
						_.each(_.keys(incoming),(name) => {
							let found = false;
							let key = name2id[name];
							if (!key && name !== 'id' && name !== 'created_by') {				// Bogus name in data?
								let msg = "Could not find a medical condition for "+name;
								logger.error(msg,null);
								// cnt++;
								// return updatecb(msg,null);
							} else {
								_.each(phd,(ph) => {
									if (!ph.id) {
										logger.error("Missing id on PatientHistory record!!!",null);
									} else {
										if (ph.medical_condition_id === key) {

											ph.value = incoming[name];
											let pk = {id: ph.id};
											cnt++;
											PatientHistory.update(pk,ph).
												exec(updatecb);
											found = true;
										}
									}
								});
								if (!found && name !== 'id' && name !== 'created_by') {
									logger.error("Could not find PatientHistory record for "+name,null);
									let newData = {
										patient_id: parseInt(patientId,10),
								    medical_condition_id: key,
								    value: incoming[name],
						        created_by: incoming.created_by ? incoming.created_by : 1
									};

									cnt++;
									PatientHistory.create(newData).
										exec(updatecb);
								}
							}
						});

					});
				});
			});
		} catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  },


  findOne (req,res) {
  	try {

			MedicalCondition.find().exec(function(err, mcd) {
				if (err) {
					logger.error("Error: ",err);

          return res.json(utilsService.makeErrQuery(err));
				}
				let id2name = {};
				_.each(mcd,(mc) => {
					id2name[mc.id] = mc.code;
				});


				PatientHistory.find({patient_id: parseInt(req.param('id'),10)}).
				exec(function(err, phd) {
					if (err) {
						logger.error("Error: ",err);

            return res.json(utilsService.makeErrQuery(err));
					}
					if (phd.length === 0) {
	          return res.json([]);
          }

	//
	// Now loop through the data getting what we want from it
	//
					let phdata = {id: parseInt(req.param('id'),10)};
					_.each(phd,(ph) => {
						let key = id2name[ph.medical_condition_id];
						phdata[key] = ph.value;
					});
		    	res.json(phdata);
				});
			});
		} catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  }

};
