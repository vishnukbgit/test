  /**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const moment = require('moment');
const _ = require('lodash');
const utilsService = require('../services/utilsService');
const errorCodeService = require('../services/ErrorCodeService');
const patientDetailService = require('../services/PatientDetailService');
let ctrl = "Patient";
const logger = require('../services/LoggerService');
module.exports = {

  async update (req, res) {
    try {
      let patientData = req.allParams();

      let patientId = parseInt(req.param('id'),10);
      let biometric = _.clone(patientData.biometric);
      let care_unit = _.clone(patientData.care_unit);
      if (!care_unit || !biometric) {
        return res.json({code: "MISSING",error: "Both care_unit and biometric data MUST be supplied"});
      }

      let deleteThese = ["biometric","care_unit","history","snomed","disease_assessment","diagnosis","user_account_id", "encounter", "treatment_plan"];
      _.each(deleteThese,(del) => {
        delete patientData[del];
      });

      Patient.update({id: patientId}).
        set(patientData).
        fetch().
        exec(function afterwards(err, updated) {
        if (err) {
          logger.error("Error: ",err);

return res.json(utilsService.makeErrQuery(err.message));
        }
        if (biometric) {
          var biometricrecord = biometric[0];
          if (biometricrecord) {
            PatientBiometric.
            update(biometricrecord.id, biometricrecord).
            exec(function afterwards(err, updated) {
              if (err) {
                logger.error("Error: ", err);

return res.json(utilsService.makeErrQuery("Biometric save failed "+err));
              }
              if (care_unit) {
                var care_unitrecord = care_unit[0];
                if (care_unitrecord) {
                  CareUnitPatientAssociation.
                  update(care_unitrecord.id, care_unitrecord).
                  exec(function afterwards(err, updated) {
                    if (err) {
                      logger.error("Error: ", err);

return res.json(utilsService.makeErrQuery("Care Unit Patient Assoc save failed "+err));
                    }
                    Patient.findOne({id: patientId}).
                    populate('biometric').
                    populate('care_unit').
                    exec(function (err, data) {
                      if (err) {
                        logger.error("Error: ", err);

return res.json(utilsService.makeErrQuery("Find patient record failed "+err));
                      }
                      if (!data) {
                        return res.json(utilsService.makeErrNotFound("Patient record not found"));
                      }

return res.json(data);
                    });
                  });
                } else {
                  return res.json({});
                }
              }
            });
          } else {
            return res.json({});
          }
        }
      });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  },

  Search (req, res) {
    try {
      var criteria = req.param("criteria")
        ? req.param("criteria")
        : "";

      var page = req.param("page");
      var count = req.param("count");
      var totalcount = 0;

      if (moment(criteria, ["DD-MM-YYYY", "DD/MM/YYYY", "D-M-YYYY", "D/M/YYYY"], true).isValid()) {
        var date = moment(criteria, ["DD-MM-YYYY", "DD/MM/YYYY", "D-M-YYYY", "D/M/YYYY"]).format('YYYY-MM-DD');
        Patient.count({date_of_birth: date}).exec(function (err, patientscount) {
          if (!err) {
            totalcount = patientscount
          }
        });

        Patient.find({where: {date_of_birth: date}, skip: page, limit: count}).
        exec(function (err, patients) {
          if (err) {
            return res.json(utilsService.makeErrQuery("Find patient record failed "+err));
          }

          return res.json({totalcount, patients});
        });
      } else {
        criteria = "%" + criteria + "%";
        Patient.count({
          or: [
            {firstname: {'like': criteria}},
            {family_name: {'like': criteria}},
            {medicare_number: {'like': criteria}},
            {address_postcode: {'like': criteria}}
          ]
        }).exec(function (err, patientscount) {
          if (!err) {
            totalcount = patientscount
          }
        });

        Patient.find({
          where: {
            or: [
              {firstname: {'like': criteria}},
              {family_name: {'like': criteria}},
              {medicare_number: {'like': criteria}},
              {address_postcode: {'like': criteria}}
            ]
          }, skip: page, limit: count
        }).exec(function (err, patients) {
          if (err) {
            return res.json(utilsService.makeErrQuery("Find patient record failed "+err));
          }

          return res.json({totalcount, patients});
        });
      }
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  },

/**
 * Fetches all patient and related details from patient and related tables
 * @param {integer} id - Patient id.
 * @return {object} patient details and related data
 */
// These come from the patient microservice in one go:
  // history:[] .  // Medical history   (fetched from patient service)
  // biometric:[] . // Patient biometrics  (fetched from patient service)
  // encounter: [] // Encounters  (fetched from patient service)
  // note: [] //Patient notes  (fetched from patient service)
  // medication: [] // Medication id's (from patient_medication)
  //
  // Need to get these

  findOneAll(req,res) {
    try {
      let patientId = parseInt(req.param('id'),10);
      Patient.findOne({id: patientId}).
        populate('biometric').
        populate('snomed').
        populate('care_unit').
        populate('encounter').
        populate('diagnosis').
        populate('disease_assessment').
        exec(async function (err, patientData) {
        if (err) {
          logger.error("Error: ", err);

          return res.json(utilsService.makeErrQuery("Find patient record failed "+err));
        }
        if (!patientData) {
          return res.json(utilsService.makeErrNotFound("Patient not found "));
        }

        if (patientData && patientData.snomed && patientData.snomed.length) {
          patientData.snomed = await Promise.all(patientData.snomed.map(async medication => {
            const medicationName = await Snomed.findOne({id: medication.medication_id});
            console.log("medication name",medicationName);
            medication.medicinal_product_name = medicationName.medicinal_product_name;
            return medication;
          }));
          // patientData.snomed.forEach(async (medication, index) => {
          //   const medicationName = await Snomed.findOne({id: medication.medication_id});
          //   console.log("medication name",medicationName);
          //   patientData.snomed[index].medicinal_product_name = medicationName.medicinal_product_name;
          // })
        }

        //patient history flag added for front end validation -- GES-878
        PatientHistory.find({patient_id : patientId}).exec(function (error, historyData) {
          if (error){
              logger.error("Error: ", error);

              return res.json(utilsService.makeErrQuery("Find patient record failed "+error));
          }

          patientData.hasPatientHistory = Boolean(historyData);
          patientData.history = historyData || [];
          UserAccount.findOne({id : patientData.user_account_id}).exec(function (error, user) {
            if (error){
              logger.error("Error: ", error);

              return res.json(utilsService.makeErrQuery("Find user record failed "+error));
            }
            if (!user || !user.email) {
              patientData.verified_flag = true;   // No user account is a valid case, just pretend it's validated
            } else {
              patientData.verified_flag = !user.verify_token;   // It's verified if the token is absent
            }
            return res.json(patientData);
          });
        });

      });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }

  },

  create(req,res) {
    try {

      let incoming = req.body;

      let query = {
        firstname: incoming.firstname,
        family_name: incoming.family_name,
        medicare_number: incoming.medicare_number,
        date_of_birth: incoming.date_of_birth
      };
      if (!incoming.care_unit || !incoming.biometric) {
        return res.json(utilsService.makeErrParameter("Both care_unit and biometric data MUST be supplied"));
      }
      CareUnit.findOne({id: incoming.care_unit[0].care_unit_id}).
      exec(function (err, cu) {
        if (err) {
          logger.error("Error: ", err);

          return res.json(utilsService.makeErrQuery("Find care unit record failed "+err));
        }
        if (!cu) {
          return res.json(utilsService.makeErrParameter("Care unit "+incoming.care_unit[0].care_unit_id+" not found"));
        }
        Patient.findOne(query).
          exec(function (err, existing) {
          if (err) {
            logger.error("Error: ", err);

            return res.json(utilsService.makeErrQuery("Find patient record failed "+err));
          }
          if (existing) {
            return res.json(utilsService.makeErrValidation("Patient exists"));
          }
          if (incoming.care_unit && incoming.care_unit.length >0) {
            if (!incoming.care_unit.created_by) {
              incoming.care_unit.created_by = incoming.created_by;
            }
          }
          incoming.care_unit[0].primary_care_unit_flag = true;  // First one is always the primary

          const {biometric, care_unit, ...restPayload} = incoming;

          Patient.create(restPayload).fetch().
            exec(function (err, patientData) {
            if (err) {
              logger.error("Error: ", err);

              return res.json(utilsService.makeErrQuery("Create patient record failed "+err));
            }
            if (!patientData) {
              return res.json(utilsService.makeErrNonSequitur("Create patient record failed "));
            }
            biometric.forEach(async (eachBiometric) => await PatientBiometric.create({...eachBiometric, patient_id: patientData.id}));
            care_unit.forEach(async (eachCareUnit) => await CareUnitPatientAssociation.create({...eachCareUnit, patient_id: patientData.id}));
            
            return res.json(patientData);
          });
        });
      });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }

  },

  getPrimaryCareUnitFromPatientId(req,res){
    let error =null;
    let response =null;
    try {
    if (!isNaN(req.body.patientId)) {
      patientDetailService.getPrimaryCareUnitForPatient(req.body.patientId,
      function(err,careunitObject) {
        if (err) {
          error = errorCodeService.genericInternalErrorCode();

          return res.send({error,response});
        }
        response = careunitObject;

        return res.send({error,response});
       }
      );
    } else {
      error = errorCodeService.missingParametersErrorCode();

      return res.send({error,response});
    }
    } catch (e) {
      logger.error("exception caught ",e);
      error = errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }

  },

  updatePrimaryPractitionerForPatient(req,res) {
  //patientId:patientId,pracId:pracId
    let error =null;
    let response =null;
    try {
      if (!isNaN(req.body.patientId) && !isNaN(req.body.pracId)) {
        patientDetailService.updatePrimaryPractitionerForPatient(req.body.patientId,req.body.pracId,
          function(err,careunitObject) {
            if (err) {
              error = errorCodeService.genericInternalErrorCode();

              return res.send({error,response});
            }
            response = careunitObject;

            return res.send({error,response});
          }
        );
      } else {
        error = errorCodeService.missingParametersErrorCode();

        return res.send({error,response});
      }
    } catch (e) {
      error = errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },

  patientVerify(req,res) {
    try {

      let incoming = req.body;
      if (!incoming) {
        incoming = req.allParams();
      }
      patientDetailService.patientVerify(incoming,function (err, patientData) {
        if (err) {
          return res.json(err);
        }

        return res.json(patientData);
      });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  },

  findPatient(req, res) {
    try {

      patientDetailService.getPatientRecordById(req.body.patient_id,
        function (error, returnData) {
          if (error) {
            logger.error(ctrl + "Error returned from service:", error);

            return res.json(utilsService.makeErrException(error));
            // return res.json({ error: error });
          }

          return res.json(returnData);
        });
    } catch (err) {
      logger.error("Error",err);

      return res.json(utilsService.makeErrException(err));
      // return res.json({code: "EXCEPTION", error: "Exception in " + ctrl + ".findPatient:" + err.message});
    }
  }


};
