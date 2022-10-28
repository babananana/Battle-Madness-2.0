const SPELER_SHEET_STATS_RANGE = "C3:C32"
const STATISTIEKEN_SHEET_SPELER_DATA_RANGE = "C3:O32"
const STATISTIEKEN_SHEET_SPELER_WINNAAR_RANGE = "C29:O29"
const STATISTIEKEN_SPELER_WINST_ROW = 26
const STATISTIEKEN_BEURT_BEWERKEN_RANGE = "A2:B3"; // A2:B9

class StatistiekenUpdater
{
    constructor(statistiekenSpreadSheet)
    {
        this.statistiekenSpreadSheet = statistiekenSpreadSheet;
        this.spelers = [];
    }

    UpdateSpelersStatistieken(beurtSheetData, beurtNr)
    {
        Logger.log("UpdateStatistieken: " + JSON.stringify(beurtSheetData));
        for (var spelerBeurtSheet of beurtSheetData)
        {
            this.spelers.push(spelerBeurtSheet[0]);
            var spelerSpreadsheet = SpreadsheetApp.openByUrl(spelerBeurtSheet[1]);
            var spelerStatSheet = spelerSpreadsheet.getSheets()[2];
            this._KopieerStatsVanSpelerNaarStatistiekenSheet(spelerStatSheet, spelerBeurtSheet[0], beurtNr);
        }
    }

    _KopieerStatsVanSpelerNaarStatistiekenSheet(spelerStatSheet, spelerName, beurtNr)
    {
        //var beurtNr = spelerStatSheet.getRange(SPELER_SHEET_BEURT_NR_RANGE).getValue();
        var statistiekenSheetDataRange = this.statistiekenSpreadSheet.getSheetByName(spelerName).getRange(STATISTIEKEN_SHEET_SPELER_DATA_RANGE);
        var statistiekenSheetDataRangeBeurt = statistiekenSheetDataRange.offset(0, beurtNr, statistiekenSheetDataRange.getNumRows(), 1);
        var spelerBeurtStats = spelerStatSheet.getRange(SPELER_SHEET_STATS_RANGE);

        statistiekenSheetDataRangeBeurt.setValues(spelerBeurtStats.getValues());
    }

    SetWinnaars(winnaars, beurtNr)
    {
        for (var speler of this.spelers)
        {
            var statistiekenSheetSpelerWinnaarRange = this.statistiekenSpreadSheet.getSheetByName(speler).getRange(STATISTIEKEN_SHEET_SPELER_WINNAAR_RANGE);
            var statistiekenSheetSpelerWinnaarBeurtCell = statistiekenSheetSpelerWinnaarRange.offset(0, beurtNr, 1, 1);
            if (winnaars.includes(speler))
            {
                statistiekenSheetSpelerWinnaarBeurtCell.setValue("W");
            }
            else
            {
                statistiekenSheetSpelerWinnaarBeurtCell.clearContent();
            }
        }
    }

    GetWinnaar(spelerNameA, spelerNameB, beurNr)
    {
        var spelerAStats = this.GetStatistieken(spelerNameA, beurNr);
        var spelerAWinst = spelerAStats[STATISTIEKEN_SPELER_WINST_ROW][0];
        if (spelerAWinst == "W")
        {
            return spelerNameA;
        }
        else
        {
            var spelerBStats = this.GetStatistieken(spelerNameB, beurNr);
            var spelerBWinst = spelerBStats[STATISTIEKEN_SPELER_WINST_ROW][0];
            if (spelerBWinst == "W")
            {
                return spelerNameB;
            }
            else
            {
                return "-";
            }
        }
    }

    GetStatistieken(spelerName, beurtNr)
    {
        var statistiekenSheetDataRange = this.statistiekenSpreadSheet.getSheetByName(spelerName).getRange(STATISTIEKEN_SHEET_SPELER_DATA_RANGE);
        var statistiekenSheetDataRangeBeurt = statistiekenSheetDataRange.offset(0, beurtNr, statistiekenSheetDataRange.getNumRows(), 1);
        return statistiekenSheetDataRangeBeurt.getValues();
    }
}
