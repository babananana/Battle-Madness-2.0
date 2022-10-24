const SPELER_SHEET_STATS_RANGE = "C3:C32"
const SPELER_SHEET_BEURT_NR_RANGE = "C2"
const STATISTIEKEN_SHEET_SPELER_DATA_RANGE = "C3:O32"
const STATISTIEKEN_SPELER_WINST_ROW = 26


class StatistiekenUpdater
{
    constructor(statistiekenSpreadSheet)
    {
        this.statistiekenSpreadSheet = statistiekenSpreadSheet;
    }

    UpdateStatistieken(beurtSheetData)
    {
        Logger.log("UpdateStatistieken: " + JSON.stringify(beurtSheetData));
        for (var spelerBeurtSheet of beurtSheetData)
        {
            var spelerSpreadsheet = SpreadsheetApp.openByUrl(spelerBeurtSheet[1]);
            var spelerStatSheet = spelerSpreadsheet.getSheets()[2];
            this._KopieerStatsVanSpelerNaarStatistiekenSheet(spelerStatSheet, spelerBeurtSheet[0]);
        }
    }

    _KopieerStatsVanSpelerNaarStatistiekenSheet(spelerStatSheet, spelerName)
    {
        var beurtNr = spelerStatSheet.getRange(SPELER_SHEET_BEURT_NR_RANGE).getValue();
        var statistiekenSheetDataRange = this.statistiekenSpreadSheet.getSheetByName(spelerName).getRange(STATISTIEKEN_SHEET_SPELER_DATA_RANGE);
        var statistiekenSheetDataRangeBeurt = statistiekenSheetDataRange.offset(0, beurtNr, statistiekenSheetDataRange.getNumRows(), 1);
        var spelerBeurtStats = spelerStatSheet.getRange(SPELER_SHEET_STATS_RANGE);

        statistiekenSheetDataRangeBeurt.setValues(spelerBeurtStats.getValues());
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
