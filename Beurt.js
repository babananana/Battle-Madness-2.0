
function BeurtenUitvoeren()
{
  CheckUi();
  var statistiekenSpreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1PeO6XTn-d13cDyrfw5_x1fYowsOyv-uiGepEHXE-zjI/edit');
  var homepageSpreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/12Ri71NxzYuK5PVu_l743wovqDnLoGX7YULuJuyYhLes/edit');
  
  var allOK = false;
  var statistiekenBeurtBewerkenSheet = statistiekenSpreadSheet.getSheetByName("Beurt Bewerken");
  var beurtSheetLijst = statistiekenBeurtBewerkenSheet.getRange(STATISTIEKEN_BEURT_BEWERKEN_RANGE).getValues();
  Logger.log("beurtSheetLijst: " + JSON.stringify(beurtSheetLijst));
  var homeUpdater = new HomepageUpdater(homepageSpreadSheet, statistiekenSpreadSheet);
  allOK = _CheckSpelersInvoerInteractive(homeUpdater, beurtSheetLijst);

  if (allOK) 
  {
    homeUpdater.ResetSpelersReady();
    //homeUpdater.UpdateHomepage();
    //beurtSheetLijst = [beurtSheetLijst[0]];
    for (var beurtSheetData of beurtSheetLijst)
    {
      BeurtUitvoeren(beurtSheetData);
    }
    var hoofdpagina = homepageSpreadSheet.getSheetByName("Hoofdpagina");
    var huidigeBeurt = _BeurtOptellen(hoofdpagina, "C2");
    
    var statUpdater = new StatistiekenUpdater(statistiekenSpreadSheet);
    statUpdater.UpdateSpelersStatistieken(beurtSheetLijst, huidigeBeurt);
    
    // Alle battle reports invullen op speler sheet
    var winnaars = [];
    for (var beurtSheetData of beurtSheetLijst)
    {
      var spelerNaam = beurtSheetData[0];
      var tegenstanderNaam = homeUpdater.GetTegenstander(spelerNaam);
      var statsTegenstander = statUpdater.GetStatistieken(tegenstanderNaam, huidigeBeurt);
      var battleInvuller = new BattleInvuller(SpreadsheetApp.openByUrl(beurtSheetData[1]));
      var tegenstanderGewonnen = battleInvuller.UpdateBattleSpelerB(statsTegenstander, tegenstanderNaam);
      if (tegenstanderGewonnen)
      {
        winnaars.push(tegenstanderNaam);
      }
    }
    statUpdater.SetWinnaars(winnaars, huidigeBeurt);

    homeUpdater.UpdateHomepage(huidigeBeurt);
    
  }
  else
  {
    Logger.log("Er is iets niet OK, beurten zijn niet uitgevoerd!");
  }
}

function _CheckSpelersInvoerInteractive(homepageUpdater, beurtSheetLijst)
{
    CheckUi();
    var warning = ""
    
    Logger.log("beurtSheetLijst: " + JSON.stringify(beurtSheetLijst))
    warning += homepageUpdater._CheckSpelersReady();
    warning += _CheckGoudHoutIJzerOver(beurtSheetLijst)
    if (globalThis.uiActief)
    {
      var ui = SpreadsheetApp.getUi(); 
      var result = ui.alert(
      'Beurten verwerken',
      warning + '\nWeet je zeker dat je alle beurten wilt verwerken?',
      ui.ButtonSet.YES_NO)
      if (result == ui.Button.YES) 
      {
          warning = "";
      }
    }
    return (warning == "");
}

function _CheckGoudHoutIJzerOver(beurtSheetLijst)
{
  var warning = "";
  for (var beurtSheetData of beurtSheetLijst)
  {
    var naam = beurtSheetData[0];
    var toernooiSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1])
    var sheet = toernooiSpreadsheet.getSheets()[0];
    var goudOver = sheet.getRange("T28").getCell(1,1).getValue();
    var houtOver = sheet.getRange("U28").getCell(1,1).getValue();
    var ijzerOver = sheet.getRange("V28").getCell(1,1).getValue();
    
    if (goudOver > 0 || houtOver > 0 || ijzerOver > 0) 
    {
        warning += "Let op! " + naam + " heeft nog " + goudOver + " Goud, " + houtOver + " Hout en " + ijzerOver + " IJzer over! \n";
    }
  }
  return warning;
}

function BeurtUitvoeren(beurtSheetData) 
{
  /*var toernooiSpreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit#gid=1784571136');*/

  Logger.log("BeurtUitvoeren: " + JSON.stringify(beurtSheetData));
  var spelerSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);
  var spelerSheet = spelerSpreadsheet.getSheets()[0];
  var spelerStatSheet = spelerSpreadsheet.getSheets()[2];
  
  _VooruitzichtNaarHuidigeBeurt(spelerSheet);
  _NieuweActiesBepalen(spelerStatSheet, spelerSheet);
  _InvoerLeegmaken(spelerSheet);
  var beurtUitgevoerd = _BeurtOptellen(spelerSheet, "M1");

  return beurtUitgevoerd;
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
