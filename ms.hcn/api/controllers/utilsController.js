/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* jshint undef: false */
let logger = require('../services/LoggerService');
let utilsService = require('../services/utilsService');
module.exports = {

  version(req, res) {
    try {

      return res.json({
        version: utilsService.version(),
        uptime: utilsService.uptime()
      });

    } catch (err) {
      logger.error("Error: ", err);

      return res.json({error: err});
    }
  }

};
