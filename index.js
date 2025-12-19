const weatherApi = "https://api.weather.gov/alerts/active?area=";

// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDiv = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');
const loadingDiv = document.getElementById('loading-spinner');

// Show/Hide Loading
function showLoading() {
  loadingDiv.classList.remove('hidden');
}
function hideLoading() {
  loadingDiv.classList.add('hidden');
}

// Display Error (with hidden class, auto-hide after 5s)
function displayError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => {
    errorDiv.classList.add('hidden');
  }, 5000);
}

// Clear Error Immediately
function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

// Clear previous alerts
function clearAlerts() {
  alertsDiv.innerHTML = '';
}

// Get CSS class by severity
function getSeverityClass(severity) {
  switch (severity) {
    case 'Minor': return 'severity-Minor';
    case 'Moderate': return 'severity-Moderate';
    case 'Severe': return 'severity-Severe';
    default: return 'severity-Unknown';
  }
}

// Display fetched alerts
function displayAlerts(data) {
  clearAlerts();

  if (!data.features.length) {
    displayError('No alerts for this state at the moment.');
    return;
  }

  // Summary text matching Jest test
  const summary = document.createElement('p');
  summary.textContent = `Weather Alerts: ${data.features.length}`;
  summary.classList.add('alert-summary');
  alertsDiv.appendChild(summary);

  const ul = document.createElement('ul');
  ul.classList.add('alert-list');

  data.features.forEach(alert => {
    const li = document.createElement('li');
    li.classList.add('alert-item');
    const severity = alert.properties.severity || 'Unknown';
    li.classList.add(getSeverityClass(severity));
    li.textContent = alert.properties.headline;
    ul.appendChild(li);
  });

  alertsDiv.appendChild(ul);
}

// Fetch weather alerts from API
async function fetchWeatherAlerts(state) {
  showLoading();
  try {
    const response = await fetch(`${weatherApi}${state}`);
    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
    const data = await response.json();
    displayAlerts(data);
  } catch (error) {
    displayError(error.message);
  } finally {
    hideLoading();
    stateInput.value = '';
  }
}

// Event: Button click
fetchBtn.addEventListener('click', () => {
  clearError();
  const state = stateInput.value.trim().toUpperCase();
  if (!state) {
    displayError('Please enter a state abbreviation.');
    return;
  }
  fetchWeatherAlerts(state);
});

// Event: Enter key submits
stateInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchBtn.click();
});
