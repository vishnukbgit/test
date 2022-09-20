/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let logger = require('../services/LoggerService');
module.exports = {
	update(req, res) {
		try {
			let incoming = req.allParams();
			let cnt = 0;
			var newValue = 0;

			let updatecb = function (err, data) {
				if (err) {
					logger.error("Error: ", err);

					return res.serverError(err);
				}

				cnt--;
				if (cnt <= 0)
					return res.json(incoming);
			};



			DiseaseAssessment.findOne({ patient_id: parseInt(req.param('id'), 10) })
				.populate('data')
				.exec(function (err, data) {
					if (err) {
						logger.error("Error: ", err);

						return res.serverError(err);
					}
					if (!data) {
            return res.notFound();
          }
					let assp = CacheService.get('DiseaseAssessmentParameters.code2datatype');
					//
					// Now loop through the data getting what we want from it
					//
					cnt = 0;
					_.each(_.keys(incoming), (key) => {
						let found = false;
						_.each(data.data, (ad) => {
							if (!ad.id) {
								logger.error("Missing id on DiseaseAssessmentData record!!!",null);
							} else {
								if (ad.assessment_key === key) {

									let datatype = assp[key]
										? assp[key].datatype
										: "string";
									if (!assp[key])
										logger.warn("Could not find an assessment_parameters for " + key);
									switch (datatype) {
										case 'string':
											ad.assessment_string_value = incoming[key];
											break;
										case 'float':
											newValue = typeof incoming[key] === 'string'
												? parseFloat(incoming[key])
												: incoming[key];
											ad.assessment_float_value = newValue;
											break;
										case 'integer':
											newValue = typeof incoming[key] === 'string'
												? parseInt(incoming[key])
												: incoming[key];
											ad.assessment_integer_value = newValue;
											break;
										case 'boolean':
											ad.assessment_boolean_value = incoming[key];
											break;
										default:
											logger.error("Did not find a datatype for " + ad.assessment_key);
											ad.assessment_string_value = incoming[key];		// Save it to the string_value anyway just for safety
									}
									let pk = { id: ad.id };
									cnt++;
									DiseaseAssessmentData.update(pk, ad)
										.exec(updatecb);
									found = true;
								}
							}
						});
						if (!found && key !== 'id' && key !== 'created_by' && key !== 'assessment_id') {

							if (!assp[key])
								logger.warn("Could not find an assessment_parameters for " + key);
							let newData = {
								assessment_id: data.id,
								created_by: incoming.created_by
									? (incoming.created_by)
									: 1,
								assessment_parameter_id: assp[key]
									? assp[key].id
									: 1,
								assessment_key: key
							};
							let datatype = assp[key]
								? assp[key].datatype
								: "string";
							switch (datatype) {
								case 'string':
									newData.assessment_string_value = incoming[key];
									break;
								case 'float':
									newValue = typeof incoming[key] === 'string'
										? parseFloat(incoming[key])
										: incoming[key];
									newData.assessment_float_value = newValue;
									break;
								case 'integer':
									newValue = typeof incoming[key] === 'string'
										? parseInt(incoming[key])
										: incoming[key];
									newData.assessment_integer_value = newValue;
									break;
								case 'boolean':
									newData.assessment_boolean_value = incoming[key];
									break;
								default:
									logger.error("Did not find a datatype for " + newData.assessment_key);
									newData.assessment_string_value = incoming[key];		// Save it to the string_value anyway just for safety
							}

							cnt++;
							DiseaseAssessmentData.create(newData)
								.exec(updatecb);
						}
					});
				});
		} catch (err) {
			logger.error("Error: ", err);
		}
	},


	findOne(req, res) {
		try {

			let assp = CacheService.get('DiseaseAssessmentParameters.code2datatype');
			DiseaseAssessment.findOne({ patient_id: parseInt(req.param('id'), 10) })
				.populate('data')
				.exec(function (err, data) {
					if (err) {
						logger.error("Error: ", err);

						return res.serverError(err);
					}
					// console.log(data);
					//
					// Now loop through the data getting what we want from it
					//
					if (!data)
						return res.notFound();
					let padata = { id: parseInt(req.param('id'), 10) };
					_.each(data.data, (ad) => {
						if (!assp[ad.assessment_key])
							logger.warn("Could not find an assessment_parameters for " + ad.assessment_key);
						if (!padata.assessment_id) {
							padata.assessment_id = ad.assessment_id;
						}
						let datatype = assp[ad.assessment_key]
							? assp[ad.assessment_key].datatype
							: "string";
						switch (datatype) {
							case 'string':
								padata[ad.assessment_key] = ad.assessment_string_value;
								break;
							case 'float':
								padata[ad.assessment_key] = ad.assessment_float_value;
								break;
							case 'integer':
								padata[ad.assessment_key] = ad.assessment_integer_value;
								break;
							case 'boolean':
								padata[ad.assessment_key] = ad.assessment_boolean_value;
								break;
							default:
								logger.error("Did not find a datatype for " + ad.assessment_key);
								padata[ad.assessment_key] = ad.assessment_string_value;
						}
					});
					res.json(padata);
				});
		} catch (err) {
			logger.error("Error: ", err);
		}
	}


};
