/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let logger = require('../services/LoggerService');
module.exports = {
  searchmedications (req, res) {
      let criteria = '%' + req.param("criteria") + '%';
      Snomed.find({medicinal_product_name: {like: criteria}}).
      exec(function (err, medications) {
        if (err) {
          logger.error("Error",err);
          
          return res.json({err: err});
        }
        res.json({medications});
      });
  },

  getMedicationDetailsFromId(req,res){
    let medicationDetailsArray =[];
    let medicationIdList = req.body.medicationIdList;
    let error =null;


    Snomed.find({
      where: {"snomed_medicinal_product_name_code":medicationIdList},
      select: ['id','snomed_medicinal_product_name_code','medicinal_product_name']
    }).exec(function (err,medications) {
	console.log(err);
      if (typeof err !== 'undefined' && err) {
        logger.error("Error",err);
        error = new Error();
        error.code ='internal';
        error.message = err.message;
        //res.json({err:error,medicationDetailsArray:medicationDetailsArray});

        return res.send({err:error,medicationDetailsArray});
      } else if (typeof medications !== 'undefined' && medications) {
        medicationDetailsArray = medications;

        return res.send({err:error,medicationDetailsArray});
      }
    });
  },

  getPrimaryDrugIdFromNameCodeList(req,res){
    let primaryDrugList =[];
    let primaryDrugNameCodeList = req.body.primaryDrugNameCodeList;
    let error =null;


    PrimaryDrugCollection.find({"snomed_medicinal_product_name_code": primaryDrugNameCodeList},
      {select: ['id','snomed_medicinal_product_name_code']}).
      exec(function (err,primaryDrugList) {
        if (typeof err !== 'undefined' && err) {
          logger.error("Error",err);
          error = new Error();
          error.code ='internal';
          error.message = err.message;
          //res.json({err:error,medicationDetailsArray:medicationDetailsArray});
          res.send({err:error, primaryDrugList});
        } else if (typeof primaryDrugList !== 'undefined' && primaryDrugList) {
          res.send({error: null, primaryDrugList});
        }
      }
    );
  },

  getComedicationDrugIdFromNameCodeList(req,res){
    let comedicationDrugList =[];
    let comedicationDrugNameCodeList = [];
    comedicationDrugNameCodeList= req.body.comedicationDrugNameCodeList;
    let error =null;


    ComedicationDrugCollection.find({"snomed_medicinal_product_name_code": comedicationDrugNameCodeList},
      {select: ['id','snomed_medicinal_product_name_code']}).
      exec(function (err,comedDrugList) {
        if (typeof err !== 'undefined' && err) {
          logger.error("Error",err);
          error = new Error();
          error.code ='internal';
          error.message = err.message;
          //res.json({err:error,medicationDetailsArray:medicationDetailsArray});

          return res.send({err:error, comedicationDrugList});
        } else if (typeof comedDrugList !== 'undefined' && comedDrugList) {
          comedicationDrugList = comedDrugList;

return res.send({error: null, comedicationDrugList});
        }
      }
    );
  }
};
