// Function to update the domains into the Google Sheet from the provided API
function updateDomains() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('domainId'); // Get the sheet named 'domainId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/domains'; // API URL for fetching domains
  
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
    sheet.getRange(1, 2).setValue('code');
    sheet.getRange(1, 3).setValue('label');
  
    // Iterate over the response and insert data into the sheet
    for (let i = 0; i < jsonResponse.length; i++) {
      sheet.getRange(i + 2, 1).setValue(jsonResponse[i].id); // Insert 'id'
      sheet.getRange(i + 2, 2).setValue(jsonResponse[i].code); // Insert 'code'
      sheet.getRange(i + 2, 3).setValue(jsonResponse[i].label); // Insert 'label'
    }
  
    Logger.log('Domains updated successfully');
  }
  
  