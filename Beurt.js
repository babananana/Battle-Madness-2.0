



function BeurtUitvoeren(beurtSheetData) 
{
  /*var toernooiSpreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit#gid=1784571136');*/

  Logger.log("BeurtUitvoeren: " + JSON.stringify(beurtSheetData));
  var spelerSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);
  var spelerSheet = spelerSpreadsheet.getSheets()[0];
  var spelerStatSheet = spelerSpreadsheet.getSheets()[2];
  
  var beurtUitgevoerd = _BeurtOptellen(spelerSheet, "M1");
  _VooruitzichtNaarHuidigeBeurt(spelerSheet);
  _NieuweActiesBepalen(spelerStatSheet, spelerSheet);
  _InvoerLeegmaken(spelerSheet);

  return beurtUitgevoerd;
}

function _BeurtOptellen(spelerSheet, rangeA1)
{
  Logger.log("BeurtOptellen");
  beurtCell = spelerSheet.getRange(rangeA1).getCell(1,1);
  var oldValue = parseInt(beurtCell.getValue());
  beurtCell.setValue(oldValue+1);
  return oldValue;
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

function _InvoerLeegmaken(spelerSheet)
{
  var spelerInvoer = new SpelerInvoer();
  spelerInvoer.ClearInvoer(spelerSheet);
}
