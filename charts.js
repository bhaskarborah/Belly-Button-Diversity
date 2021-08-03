function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: Create a Horizontal Bar Chart
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log(selectedSamples);
    //  5. Create a variable that holds the first sample in the array.
    var firstSampleValue = selectedSamples[0];
    console.log(firstSampleValue);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIdValue = firstSampleValue.otu_ids;
    var otuLabelValue = firstSampleValue.otu_labels;
    var sampleValues = firstSampleValue.sample_values;
    console.log(otuIdValue);
    console.log(otuLabelValue);
    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIdValue.slice(0,10).map(id => "OTU " + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabelValue.slice(0,10).reverse(),
      type: "bar"   
    }   
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Count"},
      yaxis: {title: "Bacteria Id",
      // tickmode provides the format of the data to be plotted. As we are retrieving the data as array, the tickmode is used as array
      tickmode: "array",
      // the position where we want the ticktext to be displayed. 0-9 denotes the top 10
      tickvals: [0,1,2,3,4,5,6,7,8,9],
      // the value that we want to be shown on the y axis
      ticktext: yticks}     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});


    // Deliverable 2: Create a Bubble Chart
    // Bar and Bubble charts
    // Create the buildCharts function.
    // Below code is commented as the sample data has already been created in the function
    //function buildCharts(sample) {
    // Use d3.json to load and retrieve the samples.json file 
    //d3.json("samples.json").then((data) => {
    
    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot(); 
    // 1. Create the trace for the bubble chart.

    var bubbleData = [{
      x: otuIdValue,
      y: sampleValues,
      text: otuLabelValue,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIdValue,
        colorscale: "Earth"
      }
    }
    ];
    // check if the data is getting correctly populated in bubbleData
    console.log(bubbleData);

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title: "OTU ID", automargin: true},
      yaxis: {automargin: true},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var sampleDataGugeChart = data.metadata.filter(data => data.id == sample);
    console.log(sampleDataGugeChart); 

    // 3. Create a variable that holds the washing frequency.
    var washFreq = +sampleDataGugeChart[0].wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        // used the code bit from https://plotly.com/javascript/gauge-charts/        
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          bgcolor: "white",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }]
        }
      }     
    ];
     // 5. Create the layout for the gauge chart.
     var gaugeLayout = { 
      autosize: true   
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});

  });
};



    
