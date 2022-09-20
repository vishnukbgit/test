/**
 * Created by aravindhanchandrasekar on 4/4/17.
 */

 'use strict';
 let errorCodeService = require('../services/ErrorCodeService');
let NotificationManagerController = {

  updateTPlanStatus(req, res) {
    let response = null;
    try {

    } catch (e) {
      return res.send({error:errorCodeService.genericInternalErrorCode(), response});
    }
  }
};

module.exports = NotificationManagerController;
