'use strict';

var Bet = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.gameId = o.gameId;
    this.blackId = o.blackId;
    this.whiteId = o.whiteId;
    this.money = new BigNumber(o.money);
    this.status = o.status;
  } else {
    this.gameId = '';
    this.blackId = '';
    this.whiteId = '';
    this.money = new BigNumber(0);
    this.status = 0;
  }
};
Bet.prototype = {
  toString: function () {
    return JSON.stringify(this);
  },
};

var GoBangContract = function () {
  LocalContractStorage.defineMapProperty(this, "dataMap", {
    parse: function (text) {
      return new Bet(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

GoBangContract.prototype = {
  init: function () {
    
  },

  startChallenge: function (gameId) {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;

    var orig_bet = this.dataMap.get(gameId);
    if (orig_bet) {
      throw new Error("Bet Exists.");
    }

    var bet = new Bet();
    bet.gameId = gameId;
    bet.blackId = from;
    bet.money = value;
    bet.status = 1;

    this.dataMap.put(gameId, bet);
  },

  acceptChallenge: function (gameId) {
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;

    var bet = this.dataMap.get(gameId);

    if (!bet) {
      throw new Error("Bet Not Exists.");
    }

    bet.whiteId = from;
    bet.money = bet.money.plus(value);
    bet.status = 2;

    this.dataMap.put(gameId, bet);
  },

  endGame: function(gameId, status) {
    var from = Blockchain.transaction.from;
    var bet = this.dataMap.get(gameId);
    
    if (!bet) {
      throw new Error("No Bet Before.");
    }

    var amount = bet.money;
    var winnerId = '';

    // TODO: status == 3
    if (status == 4) {
      winnerId = bet.blackId;
      bet.status = 4;
    } else if (status == 5) {
      winnerId = bet.whiteId;
      bet.status = 5;
    } else {
      throw new Error("Wrong Status.");
    }

    var result = Blockchain.transfer(winnerId, amount);
    if (!result) {
      throw new Error("transfer failed.");
    }

    Event.Trigger("GoBang", {
      Transfer: {
        from: Blockchain.transaction.to,
        to: winnerId,
        value: amount.toString()
      }
    });

    bet.money = bet.money.sub(amount);
    this.dataMap.put(gameId, bet);
  },

  info: function (gameId) {
    return this.dataMap.get(gameId);
  },

  verifyAddress: function (address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  }

};
module.exports = GoBangContract;