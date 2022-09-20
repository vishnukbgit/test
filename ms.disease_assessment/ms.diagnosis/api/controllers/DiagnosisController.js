/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    Search: function (req, res) {
        var criteria = req.param("criteria");
        diagnosis.find({ name: { startsWith: criteria } })
		.exec(function (err, diagnosis) {
          if (err) return res.json({ err: err });
          else res.json({ diagnosis: diagnosis });
        });
    }
	
};
