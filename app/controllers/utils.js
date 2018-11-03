'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');

var Utils = require('../models/Utils');
var common = require('./common');

var HistoricSync = require('../../lib/HistoricSync');
var config = require('../../config/config');
var sockets = require('../../app/controllers/socket.js');

exports.estimateFee = function(req, res) {
  var args = req.query.nbBlocks || '2';
  var nbBlocks = args.split(',');

  var utilsObject = new Utils();
  utilsObject.estimateFee(nbBlocks, function(err, fees) {
    if (err) return common.handleErrors(err, res);
    res.jsonp(fees);
  });
};

exports.resyncRpc = function(req, res) {
  console.log('ResyncRpc Block');
  // historic_sync process
  var historicSync = new HistoricSync({
    shouldBroadcastSync: true
  });
   console.log('BroadcastSync');
  if (!config.disableHistoricSync) {
    historicSync.start({}, function(err) {
     if (err) {
        var txt = 'ABORTED with error: ' + err.message;
        console.log('[historic_sync] ' + txt);
      }
      sockets.broadcastBlock();
    });
  }
  console.log('resync Done.');
   res.send('resync Done.');
};
