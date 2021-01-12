let timer;

chrome.browserAction.setBadgeBackgroundColor({ color: '#777' });

// retrieve and format timer text or play audio if time is up
function getTimeLeft(endTime) {
  const distance = new Date(endTime) - new Date();
  if (distance <= 0) {
    timerEnded();
    return '';
  }
  const hours = Math.floor(distance / (1000 * 3600));
  const minutes = Math.floor((distance % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // if multiple hours remain, format as "hh hrs" to prevent awkward UI
  if (hours > 0) {
    return `${hours} hrs`;
  }

  return `${Math.max(0, minutes).toString().padStart(2, "0")}:${Math.max(0, seconds).toString().padStart(2, "0")}`;
}

function timerEnded() {
  const myAudio = new Audio(chrome.runtime.getURL('old_town_road.mp3'));
  myAudio.play();
  clearInterval(timer);
  chrome.tabs.executeScript({
    code: `alert('Your timer has ended!');`
  });
}


// a helper to store data using the chrome API
// storage get request is wrapped in a promise to prevent async querying
const getStorageData = key =>
  new Promise((resolve, reject) =>
    chrome.storage.sync.get([key], function(result) {
      chrome.runtime.lastError ? reject(Error(chrome.runtime.lastError.message)) : resolve(result[key]);
    })
  );

// update badge timer text
async function setBadgeTimer() {
  let timerStartTime = await getStorageData('startTime');
  let timerEndTime = await getStorageData('endTime');
  // start timer if start time exists
  if (timerStartTime) {
    timer = setInterval(() => chrome.browserAction.setBadgeText({ text: getTimeLeft(timerEndTime) }), 10);
  } else {
    // reset timer to blank state
    chrome.browserAction.setBadgeText({ text: '' });
    clearInterval(timer);
  }
}

// initialize icon badge timer text
async function initializeBadgeTimer() {
  chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(updatedStartTime) {
      if (updatedStartTime) {
        await setBadgeTimer();
      }
    });
  });
}

initializeBadgeTimer();
