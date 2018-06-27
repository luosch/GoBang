var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;
var gameId;
var intervalQueryId;
var enableDebug = true;
var contractAdress = "n1qgUaxkar6p4LtGYR6i4ixkpqhvSNpZUFL";
var callback = NebPay.config.testnetUrl;
var GasToNas = 1e18;

var CHESSBOARD_WIDTH = 450; // 棋盘大小
var CHESSBOARD_GRID = 30; // 棋盘每格大小
var CHESSBOARD_MARGIN = 15; // 棋盘内边距
var CHESS_SIZE = 0; // 棋盘格数
var IS_BLACK = false; // 是否黑棋
var IS_WHITE = false; // 是否白棋
var IS_GAME_OVER = false; // 游戏是否结束
var IS_CAN_STEP = true; // 是否可以下棋（对手下棋时己方不能下棋）

var gameId;
var intervalId;
var seq;

// 设置canvas的content的
var ctx = null;

// 棋盘坐标数组
var arrPieces = new Array();

// 画出棋盘
function drawChessBoard() {
  var canvas = document.getElementById('chessboard');
  canvas.width = CHESSBOARD_WIDTH;
  canvas.height = CHESSBOARD_WIDTH;
  ctx = canvas.getContext('2d');
  ctx.lineWidth = 1;
  // CHESS_SIZE = Math.floor(CHESSBOARD_WIDTH / CHESSBOARD_GRID);

  for (var i = 0; i < CHESS_SIZE; i++) {
    ctx.strokeStyle = '#444';
    ctx.moveTo(CHESSBOARD_MARGIN + CHESSBOARD_GRID * i, CHESSBOARD_MARGIN);
    ctx.lineTo(CHESSBOARD_MARGIN + CHESSBOARD_GRID * i, CHESSBOARD_WIDTH - CHESSBOARD_MARGIN);
    ctx.stroke();
    ctx.moveTo(CHESSBOARD_MARGIN, CHESSBOARD_MARGIN + CHESSBOARD_GRID * i);
    ctx.lineTo(CHESSBOARD_WIDTH - CHESSBOARD_MARGIN, CHESSBOARD_MARGIN + CHESSBOARD_GRID * i);
    ctx.stroke();

    arrPieces[i] = new Array();
    for (var j = 0; j < CHESS_SIZE; j++) {
      arrPieces[i][j] = 0;
    }
  }
}

// 画出棋子
function drawPiece(i, j) {
    // 当前游戏未结束且当前节点未落子
  if (IS_CAN_STEP && !IS_GAME_OVER && arrPieces[i][j] === 0) {
    if (seq.length > 0) {
      seq += ";" + i.toString() + "_" + j.toString();
    } else {
      seq += i.toString() + "_" + j.toString();  
    }

    gameUpdate();

    // 画一个新棋子
    if (IS_BLACK) {
      drawNewPiece(i, j, true);
      IS_CAN_STEP = seq.split(";").length % 2 == 0;
    } else if (IS_WHITE) {
      drawNewPiece(i, j, false);
      IS_CAN_STEP = seq.split(";").length % 2 == 1;
    }

    // 落下棋子后进行检查
    doCheck(i, j);
  }
}

function drawNewPiece(i, j, isBlack) {
  if (arrPieces[i][j] != 0) {
    return;
  }

  var x = CHESSBOARD_MARGIN + i * CHESSBOARD_GRID + 1;
  var y = CHESSBOARD_MARGIN + j * CHESSBOARD_GRID + 1;
  ctx.beginPath();
  ctx.arc(x, y, Math.floor(CHESSBOARD_GRID / 2) - 2, 0, Math.PI * 2, true);
  ctx.closePath();
  var grd = ctx.createRadialGradient(x, y, Math.floor(CHESSBOARD_GRID / 3), x, y, Math.floor(CHESSBOARD_GRID / 10));
  if (isBlack) {
    grd.addColorStop(0, '#0A0A0A');
    grd.addColorStop(1, '#676767');
  } else {
    grd.addColorStop(0, '#D8D8D8');
    grd.addColorStop(1, '#F9F9F9');
  }
  ctx.fillStyle = grd;
  ctx.fill();

  // 记录坐标落子情况
  arrPieces[i][j] = isBlack ? 1 : 2;
}

function drawPieces(seq) {
  var items = seq.split(";");
  for (var i = 0; i < items.length; i++) {
    var foo = items[i].split('_');
    var x = foo[0];
    var y = foo[1];
    
    drawNewPiece(x, y, i % 2 == 0);
  }
}

function gameQuery() {
  axios.get("/game/info/"+gameId)
  .then(function (response) {
    seq = response["data"]["sequence"] || '';
    console.log("seq", seq);

    drawPieces(seq);
    if (IS_BLACK) {
      IS_CAN_STEP = seq.split(";").length % 2 == 0;
    } else if (IS_WHITE) {
      IS_CAN_STEP = seq.split(";").length % 2 == 1;
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function gameUpdate() {
  console.log("gameUpdate", seq);
  axios.post("/game/update/"+gameId, {
    "seq": seq
  })
  .then(function (response) {
    console.log("response", response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// 返还赌注
function endChallenge(status) {
  var to = contractAdress;
  var callFunction = "endGame";
  var callArgs = "[\"" + gameId + "\"\,\"" + status +"\"]";

  serialNumber = nebPay.call(to, "0", callFunction, callArgs, {
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
        alert("返还成功");

        axios.post("/game/end/"+gameId, {
          "status": IS_BLACK ? 4 : 5,
        })
        .then(function (response) {
          console.log(response);
          
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

// 游戏结束
function isOver(x, y, sum) {
  console.log("isOver", x, y, sum);
  if (sum >= 5) {
    IS_GAME_OVER = true;
    setTimeout(function () {
      if (IS_BLACK) {
        alert("黑棋胜利，游戏结束!");
        endChallenge("4");
      } else {
        alert("白棋胜利，游戏结束!");
      }
    }, 0);
  }
}

// 落下棋子后检查是否赢得比赛
function doCheck(x, y) {
  horizontalCheck(x, y);
  verticalCheck(x, y);
  downObliqueCheck(x, y);
  upObliqueCheck(x, y);
}

// 横轴方向检测
function horizontalCheck(x, y) {
    var sum = -1;

    for (var i = x; i >= 0; i--) {
        if (arrPieces[i][y] === arrPieces[x][y]) {
            sum++;
        } else {
            i = -1;
            break;
        }
    }
    for (var i = x; i < CHESS_SIZE; i++) {
        if (arrPieces[i][y] === arrPieces[x][y]) {
            sum++;
        } else {
            i = CHESS_SIZE;
            break;
        }
    }
    isOver(x, y, sum);
}

// 竖轴方向检测
function verticalCheck(x, y) {
    var sum = -1;

    for (var j = y; j >= 0; j--) {
        if (arrPieces[x][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = -1;
            break;
        }
    }
    for (var j = y; j < CHESS_SIZE; j++) {
        if (arrPieces[x][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = CHESS_SIZE;
            break;
        }
    }
    isOver(x, y, sum);
}

// 下斜方向检测
function downObliqueCheck(x, y) {
    var sum = -1;

    for (var i = x, j = y; i >= 0 && y >= 0;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = i = -1;
            break;
        }
        i--;
        j--;
    }
    for (var i = x, j = y; i < CHESS_SIZE && j < CHESS_SIZE;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = i = CHESS_SIZE;
            break;
        }
        i++;
        j++;
    }
    isOver(x, y, sum);
}

// 上斜方向检测
function upObliqueCheck(x, y) {
    var sum = -1;

    for (var i = x, j = y; i >= 0 && j < CHESS_SIZE;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            j = CHESS_SIZE;
            i = -1;
            break;
        }
        i--;
        j++;
    }
    for (var i = x, j = y; i < CHESS_SIZE && j >= 0;) {
        if (arrPieces[i][j] === arrPieces[x][y]) {
            sum++;
        } else {
            i = CHESS_SIZE;
            j = -1;
            break;
        }
        i++;
        j--;
    }
    isOver(x, y, sum);
}

window.onload = function () {
  CHESS_SIZE = 15;
  CHESSBOARD_WIDTH = document.getElementById('chessboard').offsetWidth;
  CHESSBOARD_GRID = (CHESSBOARD_WIDTH-CHESSBOARD_MARGIN*2.0)/(CHESS_SIZE-1);
  
  gameId = document.getElementById('gameId').value;
  var blackId = document.getElementById('blackId').value;
  var whiteId = document.getElementById('whiteId').value;
  var userId = document.getElementById('userId').value;

  if (blackId == userId) {
    IS_BLACK = true
  } else if (whiteId == userId) {
    IS_WHITE = true
  }

  gameQuery();
  intervalId = setInterval(gameQuery, 5*1000);

  // clearInterval(interval);

  drawChessBoard();

  document.getElementById('chessboard').addEventListener('click', function (e) {
    // console.log((e.offsetX-CHESSBOARD_MARGIN), (e.offsetY-CHESSBOARD_MARGIN));
    var x = Math.floor((e.offsetX-1) / CHESSBOARD_GRID);
    var y = Math.floor((e.offsetY-1) / CHESSBOARD_GRID);
    // console.log(x, y);
    drawPiece(x, y);
  });
}
