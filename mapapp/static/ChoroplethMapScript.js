let map;
let featureLayer;
let infoWindow;
let lastInteractedFeatureIds = [];
let lastClickedFeatureIds = [];
let severityChart;
let accidentSeverityData = [2, 87, 269, 0]; // Made-up data for severity levels 1-4
let suburbs = {};  // Empty initially, to be filled by API data

// Data for suburbs in the City of Melbourne area with total counts and severity levels
async function fetchAccidentData() {
  try {
    const response = await fetch('https://bisafe0.azurewebsites.net/api/accident-data/');
    const data = await response.json();
    console.log("Data fetched:", data); // Check if data is being fetched
    data.forEach(item => {
      suburbs[item.place_id] = {
        total: item.total,
        name: item.suburb,
        severityData: [item.severity_1, item.severity_2, item.severity_3, item.severity_4]
      };
    });
    console.log(suburbs);
  } catch (error) {
    console.error('Failed to fetch accident data:', error);
  }
}

// Default data for the whole City of Melbourne area




function handleClick(e) {
  const filteredFeatures = e.features.filter(f => suburbs.hasOwnProperty(f.placeId));
  lastClickedFeatureIds = filteredFeatures.map(f => f.placeId);
  lastInteractedFeatureIds = [];
  featureLayer.style = applyStyle;
  if (filteredFeatures.length > 0) {
    const suburb = filteredFeatures[0];
    createInfoWindow(suburb, e.latLng);
    updateChart(suburbs[suburb.placeId].severityData);
  }
}

function handleMouseMove(e) {
  const filteredFeatures = e.features.filter(f => suburbs.hasOwnProperty(f.placeId));
  lastInteractedFeatureIds = filteredFeatures.map(f => f.placeId);
  featureLayer.style = applyStyle;
}

async function initMap() {
  await fetchAccidentData();
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');

  map = new Map(document.getElementById('map'), {
    center: { lat: -37.8136, lng: 144.9631 },
    zoom: 12,
    mapId: "ec2250b739342291",
    mapTypeControl: false,
  });

  // Add the feature layer.
  featureLayer = map.getFeatureLayer('LOCALITY');

  // Add the event listeners for the feature layer.
  featureLayer.addListener('click', handleClick);
  featureLayer.addListener('mousemove', handleMouseMove);

  // Map event listener.
  map.addListener('mousemove', () => {
    if (lastInteractedFeatureIds?.length) {
      lastInteractedFeatureIds = [];
      featureLayer.style = applyStyle;
    }
  });

  // Create the infowindow.
  infoWindow = new InfoWindow({});
  // Apply style on load, to enable clicking.
  featureLayer.style = applyStyle;

  // Add the legend to the map
  const legend = document.getElementById("legend");
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

  // Initialize the bar chart with default data
  initChart(accidentSeverityData);
}

// Helper function for the infowindow.
function createInfoWindow(feature, latLng) {
  const data = suburbs[feature.placeId];
  let content = `<span style="font-size:small">Count of Cyclist Accident: ${data.total}</span>`;
  updateInfoWindow(content, latLng);
}

// Define styles.
const styleDefault = {
  strokeColor: 'transparent', // Hide borders by default
  strokeOpacity: 0,
  strokeWeight: 0,
  fillColor: 'transparent', // Hide fills by default
  fillOpacity: 0,
};
const styleClicked = {
  strokeColor: '#810FCB',
  strokeOpacity: 1.0,
  strokeWeight: 2.0,
  fillOpacity: 0.5,
};
const styleMouseMove = {
  strokeWeight: 4.0,
  fillOpacity: 0.5, // Default fillOpacity; will be overridden dynamically
};

// Apply styles using a feature style function.
function applyStyle(params) {
  const placeId = params.feature.placeId;
  if (!suburbs.hasOwnProperty(placeId)) {
    return styleDefault;
  }
  if (lastClickedFeatureIds.includes(placeId)) {
    return { ...styleClicked, fillColor: getFillColor(placeId) };
  }
  if (lastInteractedFeatureIds.includes(placeId)) {
    return { ...styleMouseMove, fillColor: getFillColor(placeId) };
  }

  return getStyleBasedOnData(placeId);
}

function getFillColor(placeId) {
  const data = suburbs[placeId];
  const total = data.total;
  if (total < 30) {
    return '#EACDD2';
  } else if (total < 60) {
    return '#D6A0A9';
  } else if (total < 90) {
    return '#C17985';
  } else {
    return '#AD5765';
  }
}

function getStyleBasedOnData(placeId) {
  const data = suburbs[placeId];
  if (data !== undefined) {
    return {
      strokeColor: '#810FCB',
      strokeOpacity: 1.0,
      strokeWeight: 2.0,
      fillColor: getFillColor(placeId),
      fillOpacity: 0.8,
    };
  }
  return styleDefault;
}

// Helper function to create an info window.
function updateInfoWindow(content, center) {
  infoWindow.setContent(content);
  infoWindow.setPosition(center);
  infoWindow.open({
    map,
    shouldFocus: false,
  });
}

// Initialize the bar chart
function initChart(data) {
  const ctx = document.getElementById('severityChart').getContext('2d');
  severityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Severity 1', 'Severity 2', 'Severity 3', 'Severity 4'],
      datasets: [{
        label: 'Number of Accidents in Selected Area',
        data: data, // Initialize with default data
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


// Update the chart data
function updateChart(data) {
  severityChart.data.datasets[0].data = data;
  severityChart.update();
}

initMap();

// Event listener for the button to switch between Accident Map and Navigation Map
document.getElementById('switchAccidentMap').addEventListener('click', () => {
  window.location.href = 'AccidentMap.html';
});

document.getElementById('switchNavigationMap').addEventListener('click', () => {
  window.location.href = 'NavigationMap.html';
});






