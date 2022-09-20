/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
module.exports = {
  Search: function (req, res) {
    try {
      var criteria = '%' + req.param("criteria") + '%';
      Snomed.find({medicinal_product_name: { like: criteria } })
      .exec(function (err, medications) {
        if (err) {
          logger.error("Error: ", err);

          return res.json(utilsService.makeErrQuery(err));
        } else {
          return res.json({medications: medications});
        }
      });
    } catch(err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  }

};
