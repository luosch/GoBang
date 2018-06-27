var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;
var gameId;
var intervalQueryId;
var enableDebug = true;
var contractAdress = "n1irwPQtSUUTRt8bVRZLNdK2nKWq5RDciTb";
var callback = NebPay.config.testnetUrl;
var GasToNas = 1e18;


// 发起挑战
function joinChallenge() {
  // axios.post('/game/join', {
  //   gameId: document.getElementById('gameId').value,
  //   whiteId: 'testWhiteId',
  //   whiteNickName: 'testWhiteName',
  //   whiteBet: 15.0
  // })
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
  var moneyInput = document.getElementById("moneyInput").value;
  var nickname = document.getElementById("nicknameInput").value;
  gameId = md5(nickname+Date.now());
  var to = contractAdress;
  var value = moneyInput;
  var callFunction = "startChallenge";
  var callArgs = "[\"" + gameId + "\"]"
  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    qrcode: {
      showQRCode: true
    },
    debug: enableDebug,
    callback: callback,
    listener: function (resp) {
      console.log("callback is " + resp)
    }
  });

  // 设置定时查询交易结果
  // 建议查询频率10-15s, 因为星云链出块时间为15s, 并且查询服务器限制每分钟最多查询10次。
  intervalQueryId = setInterval(function() {
    intervalQuery();
  }, 1000 * 10);
}

window.onload = function () {
  document.getElementById('acceptChallenge').addEventListener('click', joinChallenge);
}