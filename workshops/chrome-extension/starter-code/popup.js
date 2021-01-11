// create global timer object for timer
let timer;

// wrap storage get request in promise to prevent async querying
const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get([key], function(result) {
      chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result[key]);
    })
  );

// communication port to background script
const port = chrome.extension.connect({
  name: 'Communication'
});

// format countdown timer in dd:hh:mm:ss format
function formatTimer(timeInEpochUntilEnd) {
  // Time calculations for days, hours, minutes and seconds
  const hours = Math.floor(timeInEpochUntilEnd / (1000 * 3600));
  const minutes = Math.floor((timeInEpochUntilEnd % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((timeInEpochUntilEnd % (1000 * 60)) / 1000);

  return `${Math.max(0, hours).toString().padStart(2, "0")}:${Math.max(0, minutes).toString().padStart(2, "0")}:${Math.max(0, seconds).toString().padStart(2, "0")}`;
}

// build message stating time left in dd:hh:mm:ss format
function getTimeLeft(endTime) {
  const timeInEpochUntilEnd = new Date(endTime) - new Date();
  if (timeInEpochUntilEnd < 0) {
    return "[TODO: add message for when time is up!]";
  }
  let message = formatTimer(timeInEpochUntilEnd);
  return message + ' Left!';
}

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
  // TODO: set startTime and endTime to null
  port.postMessage(true);
  updatePopUpContents();
}

document.addEventListener('DOMContentLoaded', async function() {
  // grab Chrome Storage Data
  let timerStartTime = // TODO: query startTime from storage
  let timerEndTime = // TODO: query endTime from storage
  let timerSeconds = await getStorageData('timerSeconds') || 0;

  // set up startTimer & resetTimer buttons on UI
  const startTimerButton = document.getElementById('startTimer');
  // TODO: create reference to the reset button in the UI
  startTimerButton.addEventListener('click', async function() {
    await setTimer(timerSeconds);
  });
  // TODO: set up the event listener so that the reset button calls resetTimer
  updatePopUpContents(timerStartTime, timerEndTime);
});

