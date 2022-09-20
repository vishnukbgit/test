/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
module.exports = {

  version(req, res) {
    try {

      return res.json({version: utilsService.version()});

    } catch (err) {
      logger.error("Error: ", err);

      return res.json(utilsService.makeErrException(err));
    }
  }

};
