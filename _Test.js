
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
