// Function to update the tasks into the Google Sheet filtered by isSactive = TRUE
function updateTasks() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('taskId'); // Get the sheet named 'taskId'
    const accessToken = getToken(); // Get the access token using the getToken function
    const apiUrl = 'https://api01.samfm.net/if/OrchestrationApi/api/tasks?pageNumber=1&pageSize=30000'; // API URL for fetching tasks
  
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
    sheet.getRange(1, 4).setValue('isSactive');
  
    // Iterate over the response and filter tasks by isSactive = TRUE
    let rowIndex = 2; // Start at row 2
    for (let i = 0; i < jsonResponse.length; i++) {
      const task = jsonResponse[i];
  
      // Check if the task is active (isSactive is TRUE)
      if (task.isSactive === true) {
        sheet.getRange(rowIndex, 1).setValue(task.id); // Insert 'id'
        sheet.getRange(rowIndex, 2).setValue(task.label); // Insert 'label'
        sheet.getRange(rowIndex, 3).setValue(task.code); // Insert 'code'
        sheet.getRange(rowIndex, 4).setValue(task.isSactive); // Insert 'isSactive'
  
        rowIndex++; // Move to the next row for the next matching task
      }
    }
  
    Logger.log('Tasks updated successfully, filtered by isSactive = TRUE');
  }