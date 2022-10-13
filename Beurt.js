

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
  var spelerSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);
  var spelerSheet = spelerSpreadsheet.getSheets()[0];
  var spelerStatSheet = spelerSpreadsheet.getSheets()[2];
  
  //_BeurtOptellen(spelerSheet, "M1");
  //_VooruitzichtNaarHuidigeBeurt(spelerSheet);
  _NieuweActiesBepalen(spelerStatSheet, spelerSheet);
  //InvoerLeegmaken
}

function _BeurtOptellen(spelerSheet, rangeA1)
{
  Logger.log("BeurtOptellen");
  beurtCell = spelerSheet.getRange(rangeA1).getCell(1,1);
  var oldValue = parseInt(beurtCell.getValue());
  beurtCell.setValue(oldValue+1);
}

function _VooruitzichtNaarHuidigeBeurt(spelerSheet)
{
  var data = SPELER_DATA_FACTORY.CreateSpelerData(spelerSheet);
  data.vooruitzicht.CopyRangeToRange(data.huidigeBeurt);
}

function _NieuweActiesBepalen(spelerStatSheet, spelerSheet)
{
  var updater = new ActiesRandomizer(spelerStatSheet);
  updater.Update(spelerSheet);
}
