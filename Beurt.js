
var uiActief = false;

var statistiekenSpreadSheetUrlTest = 'https://docs.google.com/spreadsheets/d/1PeO6XTn-d13cDyrfw5_x1fYowsOyv-uiGepEHXE-zjI/edit'; 
var statistiekenSpreadSheetUrlOfficial = 'https://docs.google.com/spreadsheets/d/1ESkLwUngdBr2tfcROcgssE2r1FHJF8xmSu-xgQxNgt4/edit'; 

var homepageUrlOfficial = 'https://docs.google.com/spreadsheets/d/12Ri71NxzYuK5PVu_l743wovqDnLoGX7YULuJuyYhLes/edit'; 
var homepageUrlTest = 'https://docs.google.com/spreadsheets/d/1MAla-4TrH3ZyJVC9HpPGveMQcjQDwBf-_WiiVHN-n0k/edit';

function BeurtenUitvoeren()
{
  CheckUi();
  var homepageUrl = homepageUrlTest;
  var statistiekenSpreadSheetUrl = statistiekenSpreadSheetUrlTest;
  if (GetMode() == "official")
  {
    homepageUrl = homepageUrlOfficial;
    statistiekenSpreadSheetUrl = statistiekenSpreadSheetUrlOfficial;
  }

  Logger.log("StatistiekenSheet URL: [" + statistiekenSpreadSheetUrl + "]");
  Logger.log("Homepage URL: [" + homepageUrl + "]");
  
  var statistiekenSpreadSheet = SpreadsheetApp.openByUrl(statistiekenSpreadSheetUrl);
  var homepageSpreadSheet = SpreadsheetApp.openByUrl(homepageUrl);
  
  var allOK = false;
  var statistiekenBeurtBewerkenSheet = statistiekenSpreadSheet.getSheetByName("Beurt Bewerken");
  var beurtSheetLijst = statistiekenBeurtBewerkenSheet.getRange(STATISTIEKEN_BEURT_BEWERKEN_RANGE).getValues();
  if (GetMode() != "official")
  {
    var filtered = beurtSheetLijst.filter(function(value) {
      return (value[0] != "" && value[1] != "");
    });
    beurtSheetLijst = filtered;
  }
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
    statUpdater.UpdateSpelersStatistiekenVoorIngevuldBattleReport(beurtSheetLijst, huidigeBeurt);

    if (_IsBattleBeurt(huidigeBeurt))
    {
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

        if (tegenstanderNaam == "CPU")
        {
          statUpdater.UpdateSpelersStatistiekenNaIngevuldBattleReport("CPU", huidigeBeurt, battleInvuller.GetStatsSpelerB());
          statUpdater.SetCPUTegenstander(spelerNaam, huidigeBeurt);
        }

        statUpdater.UpdateSpelersStatistiekenNaIngevuldBattleReport(spelerNaam, huidigeBeurt, battleInvuller.GetStats());
      }
      statUpdater.SetWinnaars(winnaars, huidigeBeurt);
      homeUpdater.BattleInvullen(huidigeBeurt);
    }

    if (_IsVolgendeBeurtBattleBeurt(huidigeBeurt))
    {
      homeUpdater.VolgendeBeurtKlaarzetten();
    }
        
    var actiesRandomizer = new ActiesRandomizer(statistiekenBeurtBewerkenSheet);
    actiesRandomizer.NieuweActiesBepalen();
    actiesRandomizer.UpdateStatSheet(huidigeBeurt + 1);

    for (var beurtSheetData of beurtSheetLijst)
    {
      SpelerSheetKlaarmakenVoorVolgendeBeurt(beurtSheetData, actiesRandomizer);
    }
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
    if (uiActief)
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

    var result = true;
    if (warning != "")
    {
      result = false;
      Logger.log(warning);
    }
    return result;
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
  
  var result = true;
  if (warning != "")
  {
    result = false;
    Logger.log(warning);
  }
  return result;
}

function BeurtUitvoeren(beurtSheetData) 
{
  Logger.log("BeurtUitvoeren: " + JSON.stringify(beurtSheetData));
  var spelerSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);
  var spelerSheet = spelerSpreadsheet.getSheets()[0];
  
  _VooruitzichtNaarHuidigeBeurt(spelerSheet);
  var beurtUitgevoerd = _BeurtOptellen(spelerSheet, "M1");

  return beurtUitgevoerd;
}

function SpelerSheetKlaarmakenVoorVolgendeBeurt(beurtSheetData, actiesRandomizer)
{
  var spelerSpreadsheet = SpreadsheetApp.openByUrl(beurtSheetData[1]);
  var spelerSheet = spelerSpreadsheet.getSheets()[0];
  actiesRandomizer.UpdateSpelerSheet(spelerSheet);

  var spelerInvoer = new SpelerInvoer();
  spelerInvoer.ClearInvoer(spelerSheet);
}

function _VooruitzichtNaarHuidigeBeurt(spelerSheet)
{
  var data = SPELER_DATA_FACTORY.CreateSpelerData(spelerSheet);
  data.vooruitzicht.CopyRangeToRange(data.huidigeBeurt);
}
