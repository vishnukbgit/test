
let diseaseAssessmentService = require('../services/DiseaseAssessmentService');
let logger = require('../services/LoggerService');
let diseaseAssessmentDetailController = {
  getDiseaseAssessmentDetails(req,res) {
    try {

       diseaseAssessmentService.getDiseaseAssessmentDetails(req.body.diseaseAssessmentId,
        function(error,response) {
        if (error) {
          logger.error("Error",error);
        }

          return res.send({error,response});
        });

    } catch (e) {
      logger.error("Error",e);
      let response =null;
      let error = new Error();
      error.message = "internal error";
      error.code ="INTERNAL_ERROR";

      return res.send({error,response});

    }
  }
};
//noinspection JSUnresolvedVariable
module.exports = diseaseAssessmentDetailController;
