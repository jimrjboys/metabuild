// Function to update the activity types into the Google Sheet from the provided API
function updateActivityType() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ActivitytypeId'); // Get the sheet named 'ActivitytypeId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/activityTypes'; // API URL for fetching activity types
  
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
    sheet.clear();
    
    // Add headers to the sheet
    sheet.getRange(1, 1).setValue('id');
    sheet.getRange(1, 2).setValue('label');
    sheet.getRange(1, 3).setValue('code');
    sheet.getRange(1, 4).setValue('activity');
  
    // Iterate over the response and insert data into the sheet
    for (let i = 0; i < jsonResponse.length; i++) {
      const activityType = jsonResponse[i];
  
      sheet.getRange(i + 2, 1).setValue(activityType.id); // Insert 'id'
      sheet.getRange(i + 2, 2).setValue(activityType.label); // Insert 'label'
      sheet.getRange(i + 2, 3).setValue(activityType.code); // Insert 'code'
      sheet.getRange(i + 2, 4).setValue(activityType.activity); // Insert 'activity'
    }
  
    Logger.log('Activity types updated successfully');
  }
  