const fs = require('fs');
const Papa = require('papaparse');

function parseHardeningKittyOutputAndSaveJson(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileStream = fs.createReadStream(inputFilePath);

    Papa.parse(fileStream, {
      header: true,
      dynamicTyping: true,
      step: function(result) {
        if (result.errors.length) {
          console.warn('Row errors:', result.errors);
        } else {
          results.push(result.data);
        }
      },
      complete: function() {
        console.log('Parsing complete. Total rows:', results.length);
        
        // Save results to JSON file
        fs.writeFile(outputFilePath, JSON.stringify(results, null, 2), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Data saved to ${outputFilePath}`);
            resolve(results);
          }
        });
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}

// Usage example:
parseHardeningKittyOutputAndSaveJson('./hardeningKittyOutput.csv', './hardeningKittyOutput.json')
  .then(data => {
    console.log('Parsing and saving complete.');
    console.log('First row:', data[0]);
  })
  .catch(error => {
    console.error('Error parsing CSV or saving JSON:', error);
  });