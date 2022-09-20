/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
module.exports = {

  searchdiagnosis: function (req, res) {
    try {
      var criteria = req.param("criteria");
      diagnosis.find({
          name: { startsWith: criteria }
      }).exec(function (err, diagnosis) {
        if (err) {
          logger.error("Error: ",err);

          return res.json(utilsService.makeErrQuery(err));
        }

          return res.json({ diagnosis: diagnosis });
      });
    } catch(err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  }

};
