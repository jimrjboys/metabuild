// Function to update the operators into the Google Sheet filtered by workTeam: CAODLK, CAOREC, CAOBYE
function updateOperators() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('operatorId'); // Get the sheet named 'operatorId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/operators?pageNumber=1&pageSize=30000'; // API URL for fetching operators
  
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
    
    // Add headers to the sheet
    sheet.getRange(1, 1).setValue('id');
    sheet.getRange(1, 2).setValue('fullName'); // Change 'lastName' and 'firstName' to 'fullName'
    sheet.getRange(1, 3).setValue('workTeam');
  
    // Define the workTeams to filter by
    const workTeams = ['CAODLK', 'CAOREC', 'CAOBYE'];
  
    // Iterate over the response and filter operators by workTeam
    let rowIndex = 2; // Start at row 2
    for (let i = 0; i < jsonResponse.length; i++) {
      const operator = jsonResponse[i];
  
      // Check if the operator's workTeam is one of the desired workTeams
      if (workTeams.includes(operator.workTeam)) {
        const fullName = `${operator.firstName || ''} ${operator.lastName || ''}`.trim(); // Combine firstName and lastName into fullName
        
        sheet.getRange(rowIndex, 1).setValue(operator.id); // Insert 'id'
        sheet.getRange(rowIndex, 2).setValue(fullName); // Insert 'fullName'
        sheet.getRange(rowIndex, 3).setValue(operator.workTeam); // Insert 'workTeam'
  
        rowIndex++; // Move to the next row for the next matching operator
      }
    }
  
    Logger.log('Operators updated successfully, filtered by workTeams: CAODLK, CAOREC, CAOBYE');
  }
  