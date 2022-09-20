/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
const _=require('underscore');
// const PatientMedication = require('../models/PatientMedication');
module.exports = {
  create(req,res) {
  	try {

      let newRec = _.clone(req.body);
	  	if (!newRec.created_by) {
	  		newRec.created_by = 0;
      }

      let findCriteria = {medication_id: newRec.medication_id.snomed_medicinal_product_name_code, patient_id: newRec.patient_id};
      PatientMedication.findOne(findCriteria).
        exec(function(err, mayBePatientMedication) {
          if (err) {
            logger.error("Error",err);

            return res.json(utilsService.makeErrQuery(err));
          }

          //if not found create a medication record
          if (!mayBePatientMedication) {
            //create a new one
            
            const {medication_id, ...restPatientMedication} = newRec;

            const newPatientMedication = {...restPatientMedication, medication_id: medication_id.snomed_medicinal_product_name_code};

            PatientMedication.create(newPatientMedication).
              exec(function (err, medications) {
                if (err) {
                  logger.error("Error",err);

                  return res.json(utilsService.makeErrQuery(err));
                }

                  return res.json({medications});
              });
          } else {

            return res.json(utilsService.makeErrValidation("Medication exists."));
          }
        });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  },

  /**
   * Function to destroy a patient medication
   * @param req
   * @param res
   */
  remove(req, res) {
    try {
      let patientId = req.param('patientId');
      let medicationId = req.param('medicationId');

      PatientMedication.destroy({patient_id: patientId, medication_id: medicationId}).
        exec(function (err, deletedRecords) {
          if (err) {
            logger.error('Error while destroying patient medication:', err);

return res.json(utilsService.makeErrQuery(err));
          }

return res.json({success: true});

        });
    } catch (err) {
      logger.error('Error while calling patient medication destroy', err);

return res.json(utilsService.makeErrException(err));
    }
  },

  /**
   * Function to destroy a patient medication
   * @param req
   * @param res
   */
  find: function (req, res) {
    try {
      let patientId = req.param('patient_id');
      PatientMedication.find({patient_id: patientId}).
        populate('patient_id').
        populate('medication_id').
        exec(function (err, records) {
          if (err) {
            logger.error('Error while destroying patient medication:', err);
            
return res.json(utilsService.makeErrQuery(err));
          }
          
return res.json(records);
        });
    } catch (err) {
      logger.error('Error while calling patient medication destroy', err);
      
return res.json(utilsService.makeErrException(err));
    }
  }
};
