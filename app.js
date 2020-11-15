document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  const div = document.createElement('div');
  const reloadDiv = document.createElement('div');

  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let isJumping = true;
  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId;
  let isGoingLeft = false;
  let isGoingRight = false;
  const welcomeText = 'Welcome to Doodle Jump';
  let scoreText = 'Your score is: ';
  let score = 0;
  const restartBtn = document.createElement('BUTTON');
  let restartBtnIcon = '<i class="fas fa-redo-alt"></i>';
  const startBtn = document.createElement('BUTTON');
  let startBtnIcon = '<i class="fas fa-play"></i>';

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log('landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    console.log('Game over');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    grid.innerHTML = scoreText + score;
    grid.appendChild(reloadDiv);
    reloadDiv.appendChild(restartBtn);
    restartBtn.innerHTML = restartBtnIcon;
    restartBtn.setAttribute('id', 'restart');

    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      //move left
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      //move right
      moveRight();
    } else if (e.key === 'ArrowUp') {
      //move straight
      moveStraight();
    }
  }

  const buttons = document.querySelectorAll('button');

  function btnControl(e) {
    if (e.target.id === 'right') {
      moveRight();
    } else if (e.target.id === 'left') {
      moveLeft();
    } else if (e.target.id === 'straight') {
      moveStraight();
    } else if (e.target.id === 'restart') {
      isGameOver = false;
      start();
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', btnControl);
  });

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveRight();
    }, 30);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else moveLeft();
    }, 30);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  //attach a button
  grid.appendChild(div);
  div.innerHTML = welcomeText;
  startBtn.innerHTML = startBtnIcon;
  grid.append(startBtn);
  startBtn.setAttribute('id', 'start');

  document.getElementById('start').onclick = function () {
    div.style.display = 'none';
    startBtn.style.display = 'none';
    start();
  };

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }
});
