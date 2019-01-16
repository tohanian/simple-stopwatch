(() => {
  let run = false;
  let reset = false;
  let startTime;
  let time = 0;
  let stopTime = 0;
  let interval;
  let splits = [];

  attachEventListeners();

  function attachEventListeners() {
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
      if (splits.length > 15) {
        splits.shift();
      }
      renderSplits();
    } else {
      document.getElementById('split-reset-button').disabled = false;
      handleReset();
    }
  }

  // Render Functions
  function renderAll() {
    renderTime();
    renderSplits();
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
})();
