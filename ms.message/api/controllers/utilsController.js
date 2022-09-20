/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const logger = require('../services/LoggerService');
const utilsService = require('../services/utilsService');
module.exports = {

  version(req, res) {
    try {

      return res.json({version: utilsService.version()});

    } catch (err) {
      logger.error("Error: ", err);

      return res.json({error: err});
    }
  }

};
