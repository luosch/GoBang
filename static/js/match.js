var CHESSBOARD_WIDTH = 450; // 棋盘大小
var CHESSBOARD_GRID = 30; // 棋盘每格大小
var CHESSBOARD_MARGIN = 15; // 棋盘内边距
var CHESS_SIZE = 0; // 棋盘格数
var IS_BLACK = true; // 是否黑棋
var IS_GAME_OVER = false; // 游戏是否结束
var IS_CAN_STEP = true; // 是否可以下棋（对手下棋时己方不能下棋）
var COMPETITOR_NAME = '';    // 对手的昵称

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
    // 画一个新棋子
    drawNewPiece(i, j, IS_BLACK);

    // // 落下棋子后进行检查
    // doCheck(i, j, IS_BLACK);

    // // 检查是否还有空位
    // checkIsExistEmpty();

    // stepPiece(i, j, IS_GAME_OVER);
    // 黑白棋相互交换落子
    // IS_BLACK = !IS_BLACK;
  }
}

function drawNewPiece(i, j, isBlack) {
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

window.onload = function () {
  CHESS_SIZE = 15;
  CHESSBOARD_WIDTH = document.getElementById('chessboard').offsetWidth;
  CHESSBOARD_GRID = (CHESSBOARD_WIDTH-CHESSBOARD_MARGIN*2.0)/(CHESS_SIZE-1);
  
  drawChessBoard();

  document.getElementById('chessboard').addEventListener('click', function (e) {
    console.log((e.offsetX-CHESSBOARD_MARGIN), (e.offsetY-CHESSBOARD_MARGIN));
    var x = Math.floor((e.offsetX-1) / CHESSBOARD_GRID);
    var y = Math.floor((e.offsetY-1) / CHESSBOARD_GRID);
    console.log(x, y);
    drawPiece(x, y);
  });
}
