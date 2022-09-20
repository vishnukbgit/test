'use strict';
const utilsService = require('../services/utilsService');
const errorCodeService = require('./ErrorCodeService');
const logger = require('../services/LoggerService');
const _=require('underscore');
let userStatus2id = {};

let PatientDetailService = {

  getStatusCache(cb) {
    if (userStatus2id.active) {     // Do we have it already?
      return cb(null);
    }
    UserStatus.find({},function (error,statii) {
      if (error) {
        logger.error("Error finding user status values (should never happen): ",error);

        return cb(utilsService.makeErrQuery(error));
      }
      _.each(statii,(s) => {
        userStatus2id[s.code.toLowerCase()] = s.id;
      });

      return cb(null);
    });
  },

  getPatientRecordById(patientIds,callback) {
    let error = null;
    let response =null;
    let patientIdList = patientIds;

    if (!patientIdList) {
      return callback(utilsService.makeErrParameter("Required parameter missing: patientIds"));
    }
      try {
        Patient.find({"id":patientIdList}).exec(
          function (err,patientsList) {
            if (err) {
              logger.error("Error",err);

              return callback(utilsService.makeErrQuery(err));
            }

              return callback(null,patientsList);

          }
        );
      } catch (err) {
        logger.error("Error: ", err);

        return callback(utilsService.makeErrException(err));
      }

  },

  getOnePatientRecordByUserId(userId,callback) {
    let error = null;
    let response =null;
    if (!userId) {
      error = errorCodeService.missingParametersErrorCode();

      return callback(error, response);
    }
      try {
        Patient.findOne({"user_account_id":userId}).exec(
          function (err,patientRecord) {
            if (err) {
              error = errorCodeService.sqlErrorCode();

return callback(error, response);
            }

return callback(null,patientRecord);

          }
        );
      } catch (err) {
        logger.error("Error: ", err);

return callback(errorCodeService.genericInternalErrorCode(),null);
      }

  } ,
  getPrimaryCareUnitForPatient(patientId,callback){
    let error =null;
    let response =null;
    try {
      CareUnitPatientAssociation.findOne({patient_id:patientId,primary_care_unit_flag:true}).
      exec(
        function (err, careUnitObject) {
          if (err) {
            error = errorCodeService.sqlErrorCode();

            return callback(error, response);
          }
            let response =careUnitObject;

            return callback(error, response);

        }
      );
    } catch (e) {
      return callback(errorCodeService.genericInternalErrorCode(),null);
    }
  },
  updatePrimaryPractitionerForPatient(patientId,pracId,callback) {
    let error =null;
    let response =null;
    try {
      CareUnitPatientAssociation.update({patient_id:patientId,primary_care_unit_flag:true},{primary_practitioner_id:pracId}).
      exec(
        function (err, careUnitObject) {
          if (err) {
            error = errorCodeService.sqlErrorCode();

            return callback(error, response);
          } 
            response =careUnitObject;

            return callback(error, response);
          
        }
      );
    } catch (e) {
      return callback(errorCodeService.genericInternalErrorCode(),null);
    }
  },

  patientVerify(incoming,callback) {
    try {
      PatientDetailService.getStatusCache(function(err) {
        if (err) {
          return callback(utilsService.makeErrQuery(err),null);
        }

        let query = {
          firstname: incoming.firstname,
          family_name: incoming.family_name,
          medicare_number: incoming.medicare_number,
          date_of_birth: incoming.date_of_birth
        };
        Patient.findOne(query).
          exec(function (err, patient) {
          if (err) {
            logger.error("Error: ", err);

            return callback(utilsService.makeErrQuery("Find patient record failed "+err),null);
          }
          if (!patient) {
            return callback(utilsService.makeErrValidation("Patient not found"),null);
          }
          UserAccount.findOne({verify_token: incoming.token, id: patient.user_account_id}).
            exec(function (err, user) {
            if (err) {
              return callback(utilsService.makeErrQuery("Find user account record failed "+err),null);
            }
            if (!user) {
              return callback(utilsService.makeErrValidation("Invalid - have you already validated your account?"),null);
            }

            if (user.status_id === userStatus2id.pending &&
            user.verify_expiry < (new Date()).getTime()) {
             logger.error("User status is not pending, or token has expired - cannot be activated ",null);

return callback(utilsService.makeErrValidation("Invalid - validation time limit exceeded"),null);
            }
//
// We don't remove the token here, we'll wait until
//

              return callback(null,patient);

          });
        });
      });
    } catch (err) {
      return callback(utilsService.makeErrException(err),null);
    }
  }

};

module.exports = PatientDetailService;
