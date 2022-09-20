'use strict';
let logger = require('./LoggerService');
let DiseaseAssessmentService = {
  getDiseaseAssessmentDetails(assessmentId,callback) {
    let error=null;
    let response=[];
    if (assessmentId) {

      try {
        DiseaseAssessment.find({"id":assessmentId}).exec(     //jshint ignore:line
          function (err,assessment){
               if (err) {
                 logger.error("Error",err);
                 error = new Error();
                 error.code="INTERNAL_ERROR";
                 error.message =err.message;


               } else if (assessment) {

                 response = assessment;

               }


            return callback(error,response);

          }
        );

      } catch (e) {
        logger.error("Error",e);
        error = new Error();
        error.code="INTERNAL_ERROR";
        error.message =e.message;

        return callback(error,response);
      }

    } else {
      logger.error("Missing required input parameters",null);
      error = new Error();
      error.code="MISSING_PARAMETER";
      error.message ="id not passed";

      return callback(error,response);
    }

  }

};

module.exports = DiseaseAssessmentService;

