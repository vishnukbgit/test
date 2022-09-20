'use strict';

let PatientDetailService= require('../services/PatientDetailService');
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
let PatientDetailController = {
  getPatientRecordById(req,res) {
    let error = null;
    let response =null;
    let patientIds = req.body.patientIds;
    if (!patientIds) {
      logger.error("Missing required parameters",null);
      error = new Error();
      error.code="PARAMETER_MISSING";
      error.message ="required parameter missing";

      return res.send(
        {error,response}
      );
    }

    try {
      PatientDetailService.getPatientRecordById(patientIds,
        function(err,userResponse) {
          error = err;
          response = userResponse;
          if (err) {
            logger.error("Error",err);
          }

          return res.send(
            {error,response}
          );
        }
      );
    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }

  },
  getOnePatientDetailsFromUserId(req,res) {
    let error = null;
    let response =null;
    let userId = req.body.userId;
    if (!userId || isNaN(req.body.userId)) {
      logger.error("Missing required parameters",null);
      error = new Error();
      error.code="PARAMETER_MISSING";
      error.message ="required parameter missing";

      return res.send(
        {error,response}
      );
    }
    try {
      PatientDetailService.getOnePatientRecordByUserId(userId,
        function(err,userResponse) {
          error = err;
          response = userResponse;
          if (err) {
            logger.error("Error",err);
          }

          return res.send(
            {error,response}
          );
        }
      );
    } catch (e) {
      logger.error("Error",e);
      error = new Error();
      error.code="INTERNAL_ERROR";
      error.message ="internal error";


      return res.send(
        {error,response}
      );
    }
  }
};
module.exports = PatientDetailController;
