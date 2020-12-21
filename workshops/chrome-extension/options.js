document.addEventListener('DOMContentLoaded', async function() {
  chrome.storage.sync.get(['timerSeconds'], function(result) {
    const presetSeconds = result.timerSeconds;
    if (presetSeconds) {
      const { hours, minutes, seconds } = secondsToHms(presetSeconds);
      document.getElementById('timerSeconds').value = seconds;
      document.getElementById('timerMinutes').value = minutes;
      document.getElementById('timerHours').value = hours;
    }
  });
  const saveButton = document.getElementById('save');
  saveButton.addEventListener('click', saveOptions);
});

function saveOptions() {
  const inputSeconds = document.getElementById('timerSeconds').value;
  const inputMinutes = document.getElementById('timerMinutes').value;
  const inputHours = document.getElementById('timerHours').value;
  const totalSeconds = hmsToSeconds(parseInt(inputHours), parseInt(inputMinutes), parseInt(inputSeconds));
  // Save the value the Chrome extension storage API.
  chrome.storage.sync.set({ timerSeconds: totalSeconds }, function() {
    alert('Options saved!');
  });
}

function secondsToHms(secondsFromStorage) {
  let seconds = Number(secondsFromStorage);
  const hours = Math.floor(seconds / 3600);
  if (hours) {
    seconds = seconds - (hours * 3600);
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes) {
    seconds = seconds - (minutes * 60);
  }
  return { hours, minutes, seconds };
}

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
