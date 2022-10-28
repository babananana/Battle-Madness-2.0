
function TestBeurtenUitvoeren()
{
  // test invoerpagina
  var beurtSheetData = [["Testpagina", "https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit"]];
  // test homepageSheet
  homepageSheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1YXH3UL6jbamBISMSZqxLgh79Is9znXGfy8mkLnyGqXY/edit').getSheets()[0];
  
  var homepageReadyRange = homepageSheet.getRange("B4:C10");
  //if (_CheckSpelersInvoerInteractive(homepageReadyRange, [beurtSheetData]))
  {
    //_ResetSpelersReady(homepageReadyRange);
    var beurtNrUitgevoerd = BeurtUitvoeren(beurtSheetData[0]);
    //_BeurtOptellen(homepageSheet, "C2")
  }
}

function TestStatistiekenUpdaten()
{
  const statistiekenSpreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1PeO6XTn-d13cDyrfw5_x1fYowsOyv-uiGepEHXE-zjI/edit");
  // test invoerpagina
  var beurtSheetData = [["Bart", "https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit"]];
  
  var statUpdater = new StatistiekenUpdater(statistiekenSpreadSheet);
  statUpdater.UpdateSpelersStatistieken(beurtSheetData);
}


function TestBattleSpelerBUpdaten()
{
  const statistiekenSpreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1PeO6XTn-d13cDyrfw5_x1fYowsOyv-uiGepEHXE-zjI/edit");
  // test invoerpagina
  var beurtSheetData = [["Bart", "https://docs.google.com/spreadsheets/d/1UCF37vsiZeKIgkKikO2TmuTmDoifP9NphF37RcTuAtk/edit"]];
  
  var statUpdater = new StatistiekenUpdater(statistiekenSpreadSheet);
  var stats = statUpdater.GetStatistieken("Bart", 6);

  var battleInvuller = new BattleInvuller(SpreadsheetApp.openByUrl(beurtSheetData[0][1]));
  battleInvuller.UpdateBattleSpelerB(stats, "Bart");
}


function TestHomepageUpdaten()
{
  const statistiekenSpreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1PeO6XTn-d13cDyrfw5_x1fYowsOyv-uiGepEHXE-zjI/edit");
  const homepageSpreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/12Ri71NxzYuK5PVu_l743wovqDnLoGX7YULuJuyYhLes/edit");
  // test invoerpagina
  
  var homeUpdater = new HomepageUpdater(homepageSpreadSheet, statistiekenSpreadSheet);
  homeUpdater.UpdateHomepage();
}
