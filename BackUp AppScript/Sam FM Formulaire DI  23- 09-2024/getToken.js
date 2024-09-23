  //Chargement des variables  d'environement.
  const scriptProperties = PropertiesService.getScriptProperties();
  
  const  tokenUrl =  scriptProperties.getProperty('tokenUrl');
  const  clientId = scriptProperties.getProperty('clientId');
  const clientSecret = scriptProperties.getProperty('clientSecret'); 
  const sendOperationUrl = scriptProperties.getProperty('sendOperationUrl');
  const endpointOperation = scriptProperties.getProperty('operationUrl');

  function getToken() {

    // Encodage des informations d'identification en Base64
    const credentials = Utilities.base64Encode(clientId + ':' + clientSecret);

    // Options de la requête pour obtenir le jeton.
    const  options = {
      'method': 'post',
      'headers': {
        'Authorization': 'Basic ' + credentials,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      'muteHttpExceptions': true,
      'payload': 'grant_type=client_credentials'
    };

    // Envoi de la requête pour obtenir le jeton
    const response = UrlFetchApp.fetch(tokenUrl, options);
    const jsonResponse = JSON.parse(response.getContentText());

    // Vérification de la présence du jeton dans la réponse.
    if (!jsonResponse || !jsonResponse['access_token']) {
      Logger.log('Failed to fetch access token');
      return null;
    }

    // Log du jeton d'authentification
    //Logger.log('Access Token: ' + jsonResponse['access_token']);

    return jsonResponse['access_token'];

  }