// Function to update the requestors into the Google Sheet filtered by siteId = 209
function updateRequestors() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('requestorId'); // Get the sheet named 'requestorId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/requestors?pageNumber=1&pageSize=30000'; // API URL for fetching requestors
  
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
    sheet.getRange(1, 2).setValue('fullName'); // Change 'lastName' and 'firstName' to 'fullName'
    sheet.getRange(1, 3).setValue('mobilePhoneNumber');
    sheet.getRange(1, 4).setValue('mail');
    sheet.getRange(1, 5).setValue('civility');
    sheet.getRange(1, 6).setValue('service');
    sheet.getRange(1, 7).setValue('role');
    sheet.getRange(1, 8).setValue('workPhoneNumber');
    sheet.getRange(1, 9).setValue('site');
    sheet.getRange(1, 10).setValue('building');
    sheet.getRange(1, 11).setValue('zone');
    sheet.getRange(1, 12).setValue('space');
  
    // Filter the requestors by siteId = 209 and insert the data into the sheet
    let rowIndex = 2; // Start at row 2
    for (let i = 0; i < jsonResponse.length; i++) {
      const requestor = jsonResponse[i];
  
      // Check if the site exists and matches siteId 209
      if (requestor.site && requestor.site.id === 209) {
        const fullName = `${requestor.firstName || ''} ${requestor.lastName || ''}`.trim(); // Combine firstName and lastName into fullName
        
        sheet.getRange(rowIndex, 1).setValue(requestor.id); // Insert 'id'
        sheet.getRange(rowIndex, 2).setValue(fullName); // Insert 'fullName'
        sheet.getRange(rowIndex, 3).setValue(requestor.mobilePhoneNumber || ''); // Insert 'mobilePhoneNumber'
        sheet.getRange(rowIndex, 4).setValue(requestor.mail); // Insert 'mail'
        sheet.getRange(rowIndex, 5).setValue(requestor.civility); // Insert 'civility'
        sheet.getRange(rowIndex, 6).setValue(requestor.service); // Insert 'service'
        sheet.getRange(rowIndex, 7).setValue(requestor.role || ''); // Insert 'role'
        sheet.getRange(rowIndex, 8).setValue(requestor.workPhoneNumber || ''); // Insert 'workPhoneNumber'
        sheet.getRange(rowIndex, 9).setValue(JSON.stringify(requestor.site)); // Insert 'site'
        sheet.getRange(rowIndex, 10).setValue(requestor.building || ''); // Insert 'building'
        sheet.getRange(rowIndex, 11).setValue(requestor.zone || ''); // Insert 'zone'
        sheet.getRange(rowIndex, 12).setValue(requestor.space || ''); // Insert 'space'
        
        rowIndex++; // Move to the next row for the next matching requestor
      }
    }
  
    Logger.log('Requestors updated successfully, filtered by siteId 209');
  }
  