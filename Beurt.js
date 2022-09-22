

function TestBeurtenUitvoeren()
{
  // test invoerpagina
  var beurtSheetData = ["Testpagina", "https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit"];
  // test homepageSheet
  homepageSheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1YXH3UL6jbamBISMSZqxLgh79Is9znXGfy8mkLnyGqXY/edit').getSheets()[0];
  
  var homepageReadyRange = homepageSheet.getRange("B4:C10");
  //if (_CheckSpelersInvoerInteractive(homepageReadyRange, [beurtSheetData]))
  {
    //_ResetSpelersReady(homepageReadyRange);
    BeurtUitvoeren(beurtSheetData);
    //_BeurtOptellen(homepageSheet, "C2")
  }
}


function BeurtUitvoeren(beurtSheetData) 
{
  /*var toernooiSpreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit#gid=1784571136');*/

  Logger.log("BeurtUitvoeren: " + JSON.stringify(beurtSheetData));
  var toernooiSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);

  var sheet = toernooiSpreadsheet.getSheets()[0];
  /*_UpdateLevels(sheet);
  _UpdateLeger(sheet);
  _UpdateActies(sheet);*/
  _BeurtOptellen(sheet, "M1");
  _VooruitzichtNaarHuidigeBeurt(sheet);
  /*_BonusActieMultiplier(sheet, toernooiSpreadsheet.getSheetByName("Statistieken"));*/
}

function _BeurtOptellen(sheet, rangeA1)
{
  Logger.log("BeurtOptellen");
  beurtCell = sheet.getRange(rangeA1).getCell(1,1);
  var oldValue = parseInt(beurtCell.getValue());
  beurtCell.setValue(oldValue+1);
}

function _VooruitzichtNaarHuidigeBeurt(sheet)
{
  Logger.log(JSON.stringify(_CreateSpelerData(sheet)));
}

