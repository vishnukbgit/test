/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let logger = require('../services/LoggerService');
const math = require('mathjs');
module.exports = {
  Search: function (req, res) {
      var criteria = '%' + req.param("criteria") + '%';
      Snomed.find({medicinal_product_name: {like: criteria}}).
      exec(function (err, medications) {
        if (err) {
          logger.error("Error",err);
          
          return res.json({err: err});
        }
        res.json({medications: medications});
      });
  },
  find: async function (req, res) {
    try {
      var medicationId = req.param("medicationId");
      const id = math.bignumber(medicationId);
      const dataStore = Snomed.getDatastore();
      const snomedQuery = `select s.id, s.snomed_medicinal_product_name_code,
          s.medicinal_product_name
          from snomed s where s.snomed_medicinal_product_name_code=${medicationId}`;
      const medications = await dataStore.sendNativeQuery(snomedQuery);
      res.json({medications: medications.rows});
    } catch (err) {
      if (err) {
        logger.error("Error",err);
        
        return res.json({err: err});
      }
    }
}

};
