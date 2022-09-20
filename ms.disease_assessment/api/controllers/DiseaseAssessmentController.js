/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _ = require('lodash');
let logger = require('../services/LoggerService');
module.exports = {
  update(req, res) {
    try {
      let diseaseAssessment = req.allParams();
      let diseaseAssessmentId = parseInt(req.param('id'),10);

      if (diseaseAssessment.data) {
        delete diseaseAssessment.data;
      }

      const {patient_id, ...restDiseaseAssessment} = diseaseAssessment;

      DiseaseAssessment.update(
        diseaseAssessmentId, 
        {...restDiseaseAssessment, patient_id: patient_id.id || patient_id}).
      exec(function afterwards(err, updated) {
        if (err) {
          logger.error("Error: ", err);

          return res.json({error: err});
          // return res.serverError(err);
        }

        return res.json(updated);
      });
    } catch (err) {
      logger.error("Error: ", err);

      return res.json({error: err});
    }
  }
};
