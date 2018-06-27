var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;
var gameId;
var intervalQueryId;
var enableDebug = true;
var contractAdress = "n1qgUaxkar6p4LtGYR6i4ixkpqhvSNpZUFL";
var callback = NebPay.config.testnetUrl;
var GasToNas = 1e18;


// 发起挑战
function joinChallenge() {
  var moneyInput = document.getElementById("moneyInput").value;
  gameId = document.getElementById("gameId").value;
  var to = contractAdress;
  var value = moneyInput;
  var callFunction = "acceptChallenge";
  var callArgs = "[\"" + gameId + "\"]"
  serialNumber = nebPay.call(to, value, callFunction, callArgs, {
    qrcode: {
      showQRCode: false
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

function intervalQuery() {   
  // queryPayInfo的options参数用来指定查询交易的服务器地址,(如果是主网可以忽略,因为默认服务器是在主网查询)
  nebPay.queryPayInfo(serialNumber, {
    debug: enableDebug,
    callback: NebPay.config.testnetUrl //在测试网查询
  })
  .then(function (resp) {
    //resp is a JSON string
    console.log("tx result: " + resp) 
    var respObject = JSON.parse(resp)
    //code == 0 交易发送成功, status == 1 交易已被打包上链
    if (respObject.code === 0 && respObject.data.status === 1) {
        var walletAddress = respObject["data"]["from"];
        var value = respObject["data"]["value"];
        var nickname = document.getElementById("nicknameInput").value;
        
        console.log('walletAddress', walletAddress, parseFloat(value) / GasToNas, nickname, gameId);
        
        axios.post("/game/join", {
          "gameId": gameId,
          "whiteId": walletAddress,
          "whiteNickName": nickname,
          "whiteBet": parseFloat(value) / GasToNas
        })
        .then(function (response) {
          console.log(response);
          alert(response["data"]["message"]);
          window.location.href = "/match/" + gameId;
        })
        .catch(function (error) {
          console.log(error);
        });

        clearInterval(intervalQueryId)    //清除定时查询
    }
  })
  .catch(function (err) {
    console.log(err);
  });
}

window.onload = function () {
  document.getElementById('acceptChallenge').addEventListener('click', joinChallenge);
}