/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const utilsService = require('../services/utilsService');

let LUController = {

  getPrimaryDrugIdFromNameCodeList(req,res){
    return LUController.getDrugIdFromSnomedCodeList(req,res);
  },

  getComedicationDrugIdFromNameCodeList(req,res){
    return LUController.getDrugIdFromSnomedCodeList(req,res);
  },

  getDrugIdFromSnomedCodeList(req,res){
    var drugList = [];
    var drugNameCodeList = [];
    if (req.body.primaryDrugNameCodeList)
      drugNameCodeList = req.body.primaryDrugNameCodeList;
    else
      drugNameCodeList = req.body.comedicationDrugNameCodeList;
    var error;


    LuMapping.find({
      where: {"snomed_medicinal_product_name_code": drugNameCodeList},
      select: ['lu_id', 'id', 'snomed_medicinal_product_name_code']
    }).exec(function (err,drugList) {
      if (typeof err !== 'undefined' && err) {
        error = utilsService.makeErrQuery(err.message);
        res.json(error);
      } else if (typeof drugList !== 'undefined' && drugList) {
        let myDrugList = [];
        _.each(drugList,(d) => {
// Return the lu_id instead of the id
          myDrugList.push({
            id: d.lu_id,
            snomed_medicinal_product_name_code: d.snomed_medicinal_product_name_code
          });
        });

        return res.json({error: null, drugList: myDrugList});
      }
    });
  },

/**
  * A function to return drug interactions from the LU drug interaction database (cached in our DB)
  * @param interactionDetailsInputList an array of drug ids {comedicationId, primaryMedicationId}.
  * @returns array of responseObjects: {interaction_status, lu_comedication_drug_collection_id, lu_primary_drug_collection_id}
  */
  drugInteraction(req,res){

    var interactionDetailsOutputList =[];
    var interactionDetailsInputList = [];
    var conditionObjectArray =[];
    interactionDetailsInputList = req.body.interactionDetailsInputList;

    if (!interactionDetailsInputList)
      return res.json(utilsService.makeErrParameter("Missing input parameter(s)"));

    var error;


    for (var i=0; i<interactionDetailsInputList.length; i++) {
      var comedicationId = interactionDetailsInputList[i].comedicationId;
      var primaryMedicationId = interactionDetailsInputList[i].primaryMedicationId;
      var conditionObject = {
        "lu_comedication_drug_collection_id":comedicationId,
        "lu_primary_drug_collection_id":primaryMedicationId
      };
      conditionObjectArray.push(conditionObject);
    }


    DrugInteraction.find({
      where: {or:conditionObjectArray}, 
      select: ['interaction_status','lu_comedication_drug_collection_id','lu_primary_drug_collection_id']
    }).
    exec(function (err,responseObjectArray) {
      if (typeof err !== 'undefined' && err) {
        error = utilsService.makeErrQuery(err.message);
        res.send({error, interactionDetailsOutputList});
      } else if (typeof responseObjectArray !== 'undefined' && responseObjectArray) {
        interactionDetailsOutputList = responseObjectArray;
        res.send({error: null, interactionDetailsOutputList});
      }
    });
  }
};

module.exports = LUController;
