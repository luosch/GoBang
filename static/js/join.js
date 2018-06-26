// 发起挑战
function joinChallenge() {
  axios.post('/game/join', {
    gameId: document.getElementById('gameId').value,
    whiteId: 'testWhiteId',
    whiteNickName: 'testWhiteName',
    whiteBet: 15.0
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

window.onload = function () {
  document.getElementById('acceptChallenge').addEventListener('click', joinChallenge);
}