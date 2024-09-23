// Function to update the buildings into the Google Sheet filtered by site = "0179"
function updateBuildings() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('buildingId'); // Get the sheet named 'buildingId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/buildings?pageNumber=1&pageSize=30000'; // API URL for fetching buildings
  
    // Define the headers for the API request
    const options = {
      'method': 'get',
      'headers': {
        'Authorization': 'Bearer ' + accessToken,
      },
      'muteHttpExceptions': true
    };
  
    // Send the request to the API
    const response = UrlFetchApp.fetch(apiUrl, options);
    const jsonResponse = JSON.parse(response.getContentText()); // Parse the response
  
    // Clear the previous data in the sheet
    sheet?.clear();
    
    // Add headers to the sheet
    sheet.getRange(1, 1).setValue('id');
    sheet.getRange(1, 2).setValue('label');
    sheet.getRange(1, 3).setValue('code');
    sheet.getRange(1, 4).setValue('site');
    sheet.getRange(1, 5).setValue('grossAreaValue');
    sheet.getRange(1, 6).setValue('netAreaValue');
    sheet.getRange(1, 7).setValue('built');
    sheet.getRange(1, 8).setValue('contract');
    sheet.getRange(1, 9).setValue('numberOfUsers');
    sheet.getRange(1, 10).setValue('notes');
  
    // Iterate over the response and filter buildings by site = "0179"
    let rowIndex = 2; // Start at row 2
    for (let i = 0; i < jsonResponse.length; i++) {
      const building = jsonResponse[i];
  
      // Check if the building's site matches "0179"
      if (building.site === "0179") {
        sheet.getRange(rowIndex, 1).setValue(building.id); // Insert 'id'
        sheet.getRange(rowIndex, 2).setValue(building.label); // Insert 'label'
        sheet.getRange(rowIndex, 3).setValue(building.code); // Insert 'code'
        sheet.getRange(rowIndex, 4).setValue(building.site || ''); // Insert 'site'
        sheet.getRange(rowIndex, 5).setValue(building.grossAreaValue || ''); // Insert 'grossAreaValue'
        sheet.getRange(rowIndex, 6).setValue(building.netAreaValue || ''); // Insert 'netAreaValue'
        sheet.getRange(rowIndex, 7).setValue(building.built || ''); // Insert 'built'
        sheet.getRange(rowIndex, 8).setValue(building.contract || ''); // Insert 'contract'
        sheet.getRange(rowIndex, 9).setValue(building.numberOfUsers || ''); // Insert 'numberOfUsers'
        sheet.getRange(rowIndex, 10).setValue(building.notes || ''); // Insert 'notes'
        
        rowIndex++; // Move to the next row for the next matching building
      }
    }
  
    Logger.log('Buildings updated successfully, filtered by site = "0179"');
  }
  