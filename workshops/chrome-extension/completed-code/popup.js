// create global timer object for timer
let timer;

// communication port to background script
const port = chrome.extension.connect({
  name: 'Communication'
});

// set timer once start is clicked
async function setTimer(timerSeconds) {
  let start = new Date().getTime();
  let end = new Date(start + timerSeconds * 1000).getTime();
  // Run all async tasks at once, order does not matter
  await Promise.all([
    chrome.storage.sync.set({ endTime: end }),
    chrome.storage.sync.set({ startTime: start })
   ]);
  port.postMessage(true);
  updatePopUpContents(start, end);
}

// reset timer values in storage
async function resetTimer() {
  await chrome.storage.sync.set({ endTime: null });
  await chrome.storage.sync.set({ startTime: null });
  port.postMessage(true);
  updatePopUpContents();
}

// build message stating time left in dd:hh:mm:ss format
function getTimeLeft(endTime) {
  const timeInEpochUntilEnd = new Date(endTime) - new Date();
  if (timeInEpochUntilEnd < 0) {
    return "TIME'S UP!";
  }
  let message = formatTimer(timeInEpochUntilEnd);
  return message + ' Left!';
}

// format countdown timer in dd:hh:mm:ss format
function formatTimer(timeInEpochUntilEnd) {
  // Time calculations for days, hours, minutes and seconds
  const hours = Math.floor(timeInEpochUntilEnd / (1000 * 3600));
  const minutes = Math.floor((timeInEpochUntilEnd % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((timeInEpochUntilEnd % (1000 * 60)) / 1000);

  return `${Math.max(0, hours).toString().padStart(2, "0")}:${Math.max(0, minutes).toString().padStart(2, "0")}:${Math.max(0, seconds).toString().padStart(2, "0")}`;
}

// a helper to store data using the chrome API
// storage get request is wrapped in a promise to prevent async querying
const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get([key], function(result) {
      chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result[key]);
    })
  );

document.addEventListener('DOMContentLoaded', async function() {
  // grab Chrome Storage Data
  let timerStartTime = await getStorageData('startTime');
  let timerEndTime = await getStorageData('endTime');
  let timerSeconds = await getStorageData('timerSeconds') || 0;

  // set up startTimer & resetTimer buttons on UI
  const startTimerButton = document.getElementById('startTimer');
  const resetTimerButton = document.getElementById('resetTimer');
  startTimerButton.addEventListener('click', async function() {
    await setTimer(timerSeconds);
  });
  resetTimerButton.addEventListener('click', async function() {
    await resetTimer();
  });

  updatePopUpContents(timerStartTime, timerEndTime);
});

// change the values on popup.html
async function updatePopUpContents(timerStartTime, timerEndTime) {
  document.getElementById('startTimer').style.display = timerStartTime ? 'none' : 'inline';
  document.getElementById('resetTimer').style.display = timerStartTime ? 'inline' : 'none';
  if (timerStartTime) {
    // start timer
    timer = setInterval(function() {
      document.getElementById('timerHeader').innerHTML = timerStartTime ? `${getTimeLeft(timerEndTime)}` : '';
    }, 10);
  } else {
    // reset timer to blank state
    let seconds = await getStorageData('timerSeconds');
    document.getElementById('timerHeader').innerHTML = `Click the button to start your timer for ${formatTimer(seconds * 1000)}!`;
    clearInterval(timer);
  }
}
