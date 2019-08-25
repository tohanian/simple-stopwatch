(() => {
  let run = false;
  let reset = false;
  let startTime;
  let time = 0;
  let stopTime = 0;
  let interval;
  let splits = [];
  let canvasContext = null;
  let radius = 0;

  initialCanvasRender();
  attachEventListeners();

  function initialCanvasRender() {
    setCanvasDimensions();
    renderAllProgressBars();
  }

  function attachEventListeners() {
    window.addEventListener('resize', setCanvasDimensions);
    document
      .getElementById('start-stop-button')
      .addEventListener('click', handleStartStop);
    document
      .getElementById('split-reset-button')
      .addEventListener('click', handleSplit);
  }

  // Event Handlers
  function handleStartStop() {
    run = !run;
    if (run) {
      document.getElementById('start-stop-button').innerHTML = 'Stop';
      document.getElementById('split-reset-button').disabled = false;
      document.getElementById('split-reset-button').innerHTML = 'Split';
      startTimer();
    } else {
      document.getElementById('start-stop-button').innerHTML = 'Start';
      document.getElementById('split-reset-button').innerHTML = 'Reset';
      stopTimer();
    }
  }

  function handleReset() {
    reset = true;
    splits = [];
    if (!run) {
      time = 0;
      stopTime = 0;
      reset = false;
      document.getElementById('split-reset-button').disabled = true;
      document.getElementById('split-reset-button').innerHTML = 'Split';
      renderAll();
    }
  }

  function handleSplit() {
    if (run) {
      splits.push(time);
      if (splits.length >= 20) {
        splits.shift();
      }
      renderSplits();
    } else {
      document.getElementById('split-reset-button').disabled = false;
      handleReset();
    }
  }

  function setCanvasDimensions() {
    const canvas = document.getElementById('progress-bar-canvas');
    const container = document.getElementById('app-child');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    radius = Math.min(container.offsetWidth - 60, container.offsetHeight - 60) / 2
    renderAllProgressBars();
  }

  // Render Functions
  function renderAll() {
    renderTime();
    renderSplits();
    renderAllProgressBars();
  }

  function renderTime() {
    const newTime = parsedTime(time);
    document.getElementById('minutes').innerHTML = newTime.minutes;
    document.getElementById('seconds').innerHTML = newTime.seconds;
    document.getElementById('milliseconds').innerHTML = newTime.milliseconds;
  }

  function renderSplits() {
    const splitsListElement = document.getElementById('splits');
    splitsListElement.innerHTML = '';

    splits.forEach(split => {
      const newSplit = document.createElement('li');
      const parsedSplit = parsedTime(split);
      newSplit.innerHTML = `${parsedSplit.minutes}:${parsedSplit.seconds}:${
        parsedSplit.milliseconds
      }`;
      splitsListElement.appendChild(newSplit);
    });
  }

  function renderAllProgressBars() {
    const canvas = document.getElementById('progress-bar-canvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, 400, 200);
    canvasContext.beginPath();
    canvasContext.lineWidth = 5;

    const canvasParams = {
      start: 4.72,
      cw: canvasContext.canvas.width / 2,
      ch: canvasContext.canvas.height / 2,
      radius,
    };

    renderProgressBarFill(canvasParams);
    renderSecondProgressBar(canvasParams);
    renderMinuteProgressBar(canvasParams);
  }

  function renderProgressBarFill(canvasParams) {
    canvasContext.arc(
      canvasParams.cw,
      canvasParams.ch,
      canvasParams.radius + canvasContext.lineWidth / 2,
      0,
      2 * Math.PI,
      false
    );
    canvasContext.fillStyle = '#171718';
    canvasContext.fill();
    canvasContext.strokeStyle = '#000';
    canvasContext.stroke();
    canvasContext.fillStyle = '#000';
  }

  function renderSecondProgressBar(canvasParams) {
    renderProgressBar(canvasParams, 60, '#54f04f', canvasParams.radius);
  }

  function renderMinuteProgressBar(canvasParams) {
    renderProgressBar(
      canvasParams,
      3600,
      '#ff66d4',
      canvasParams.radius + canvasContext.lineWidth
    );
  }

  function renderProgressBar(canvasParams, interval, color, radius) {
    const { start, cw, ch } = canvasParams;
    const progress = getProgress(interval);
    const diff = (progress / 100) * Math.PI * 2;
    canvasContext.strokeStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(cw, ch, radius, start, diff + start, false);
    canvasContext.stroke();
  }

  // Helper functions
  function startTimer() {
    document.getElementById('start-stop-button').innerHTML = 'Stop';
    startTime = Date.now();
    interval = setInterval(incrementTimer, 10);
  }

  function stopTimer() {
    document.getElementById('start-stop-button').innerHTML = 'Start';
    stopTime = time;
    clearInterval(interval);
  }

  function incrementTimer() {
    if (!reset) {
      time = stopTime + Date.now() - startTime;
      renderTime();
      renderAllProgressBars();
    } else {
      time = 0;
      stopTime = 0;
      startTime = Date.now();
      reset = false;
      renderAll();
    }
  }

  function parsedTime(time) {
    const minutes = parsedMinutes(time);
    const seconds = parsedSeconds(time);
    const milliseconds = parsedMilliseconds(time);
    const parsedTime = { milliseconds, seconds, minutes };
    return parsedTime;
  }

  function getMinutes(time) {
    return Math.floor(time / 60000);
  }

  function parsedMinutes(time) {
    return pad(getMinutes(time), 2);
  }

  function getSeconds(time) {
    return Math.floor((time - getMinutes(time) * 60000) / 1000);
  }

  function parsedSeconds(time) {
    return pad(getSeconds(time), 2);
  }

  function getMilliseconds(time) {
    return time - getMinutes(time) * 60000 - getSeconds(time) * 1000;
  }

  function parsedMilliseconds(time) {
    return pad(getMilliseconds(time), 3);
  }

  function pad(num, size) {
    var s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  function getProgress(interval) {
    return ((time / 1000 / interval) * 100) % 100;
  }
})();
