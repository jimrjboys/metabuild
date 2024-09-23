
function doGet(e) {
    // Extraire le GUID de la requête
      var guid = e.queryString || 'GUID not provided';
      var template = HtmlService.createTemplateFromFile('Index');
      template.guid = guid;
    
     // Passer le GUID à votre fichier HTML
      return   template.evaluate();
    }
    
    
    
    function getSheetData() {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheets = spreadsheet.getSheets();
      let data = {};
    
      sheets.forEach(sheet => {
        const numRows = sheet.getLastRow() - 1 > 0 ? sheet.getLastRow() - 1 : 1;
    
        let sheetData = sheet.getRange(2, 1, numRows, 6).getValues(); // Colonne 1 pour ID, Colonne 2 pour la valeur
        data[sheet.getName()] = sheetData.map(col => {
    
          // On ajoute des infos supplémentaire pour la localisation
          if(sheet.getName() === "localisation") return {
            id: col[0],
            value: col[1],
            codeEtage: col[2],
            libelleGMAO: col[4],
            ifcGUID: col[5]
          }
    
          // On ajoute des propiété supplementaire pour lea feuille Mapping GMAO IFC
          if(sheet.getName() == "Mapping GMAO_IFC") return {
            id: col[0],
            value: col[1],
            codeEquipement: col[3],
            codeLocalGMAO: col[5],
          }
          
          if(sheet.getName() == "taskId" || sheet.getName() === "domainId") return {
            id: col[0],
            value: col[2],
          }
          // Sinon on reprend juste l'id et la valeur pour le reste des feuilles
          return {
            id: col[0],
            value: col[1],
          }
        });
      });
    
      const order = [
        "domainId",
        "taskId",
        "ActivitytypeId",
        "localisation",
        "equipmentId",
        "requestorId",
        "workTeamId",
        "operatorId",
        "Mapping GMAO_IFC",
        "Mapping_localisation_GMAO_IFC"
      ]
    
      const newData = order.map(key => ({ [key]: data[key] }));
    
      return newData;
    }
    
    function logFormData(formData) {
      console.log(formData);
    }
    