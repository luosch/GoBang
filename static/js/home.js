function toggle(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

// 显示/隐藏 帮助页面
function toggleHelpInfo() {
  var el = document.getElementById("helpInfo");
  var className = "hidden";
  toggle(el, className);
}

// 显示/隐藏 发起挑战页面
function toggleChallengeInfo() {
  var el = document.getElementById("challengeInfo")
  var className = "hidden"
  toggle(el, className);
}

// 发起挑战
function issueChallenge() {
  // axios.post('/game/add', {
  //   blackId: 'testBlackId',
  //   blackNickName: 'testBlackName',
  //   blackBet: 15.0
  // })
  // .then(function (response) {
  //   console.log(response);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

  
}


window.onload = function (argument) {
  document.getElementById("help").addEventListener("click", toggleHelpInfo);
  document.getElementById("closeHelpInfo").addEventListener("click", toggleHelpInfo);

  document.getElementById("challenge").addEventListener("click", toggleChallengeInfo);
  document.getElementById("closeChallengeInfo").addEventListener("click", toggleChallengeInfo);

  document.getElementById("submitChallenge").addEventListener("click", issueChallenge);
}