// Helper function to convert a single integer
// (in seconds) to hours, minutes, and seconds
function secondsToHms(secondsFromStorage) {
  let seconds = Number(secondsFromStorage);
  const hours = Math.floor(seconds / 3600);
  if (hours) {
    seconds = seconds - hours * 3600;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes) {
    seconds = seconds - minutes * 60;
  }
  return { hours, minutes, seconds };
}

// Helper function to convert hours, minutes, and
// seconds into a single integer value (in seconds)
function hmsToSeconds(hours, minutes, seconds) {
  let sec = seconds;
  if (hours > 0) {
    sec += 3600 * hours;
  }
  if (minutes > 0) {
    sec += 60 * minutes;
  }
  return sec;
}

function saveOptions() {
  const inputSeconds = document.getElementById('timerSeconds').value;
  const inputMinutes =  // retrieve from html element by id (timerMinutes)
  const inputHours =  // retrieve from html element by id (timerHours)

  // convert time into single value in seconds
  const totalSeconds = hmsToSeconds(
    parseInt(inputHours),
    parseInt(inputMinutes),
    parseInt(inputSeconds)
  );

  // Save the value using the Chrome extension storage API.
  chrome.storage.sync.set({ timerSeconds: totalSeconds }, function () {
    alert('Options saved!');
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  // query `timerSeconds` from chrome storage and render on UI
  chrome.storage.sync.get(['timerSeconds'], function(result) {
    const presetSeconds = result.timerSeconds;
    if (presetSeconds) {
      const { hours, minutes, seconds } = secondsToHms(presetSeconds);
      document.getElementById('timerSeconds').value = seconds;
      // TODO: set `timerMinutes` on the UI
      // TODO: set `timerHours` on the UI
    }
  });
  const saveButton = document.getElementById('save');
  saveButton.addEventListener('click', saveOptions);
 });