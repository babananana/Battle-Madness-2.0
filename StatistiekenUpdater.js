const SPELER_SHEET_STATS_RANGE = "C3:C"
const STATISTIEKEN_SHEET_SPELER_DATA_RANGE = "C3:O"
const STATS_ROW_END_BATTLE_BEURT = "32"
const STATS_ROW_END_NONBATTLE_BEURT = "26"
const STATISTIEKEN_SHEET_SPELER_WINNAAR_RANGE = "C29:O29"
const STATISTIEKEN_SHEET_SPELER_STATS_NA_BATTLE_RANGES = ["C27:O27", "C22:O22", "C3:O3", "C28:O28"]
const STATISTIEKEN_SHEET_SPELER_TEGENSTANDER_RANGE = "C28:O28"
const STATISTIEKEN_SPELER_WINST_ROW = 26
const STATISTIEKEN_BEURT_BEWERKEN_RANGE = "A2:B8";

class StatistiekenUpdater
{
    constructor(statistiekenSpreadSheet)
    {
        this.statistiekenSpreadSheet = statistiekenSpreadSheet;
        this.spelers = [];
    }

    UpdateSpelersStatistiekenVoorIngevuldBattleReport(beurtSheetData, beurtNr)
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
        var statistiekenStatsRangeA1 = _IsBattleBeurt(beurtNr) ? (STATISTIEKEN_SHEET_SPELER_DATA_RANGE + STATS_ROW_END_BATTLE_BEURT) : (STATISTIEKEN_SHEET_SPELER_DATA_RANGE + STATS_ROW_END_NONBATTLE_BEURT);
        var statistiekenSheetDataRange = this.statistiekenSpreadSheet.getSheetByName(spelerName).getRange(statistiekenStatsRangeA1);
        var statistiekenSheetDataRangeBeurt = statistiekenSheetDataRange.offset(0, beurtNr, statistiekenSheetDataRange.getNumRows(), 1);
        var spelerStatsRangeA1 = _IsBattleBeurt(beurtNr) ? (SPELER_SHEET_STATS_RANGE + STATS_ROW_END_BATTLE_BEURT) : (SPELER_SHEET_STATS_RANGE + STATS_ROW_END_NONBATTLE_BEURT);
        var spelerBeurtStats = spelerStatSheet.getRange(spelerStatsRangeA1);

        statistiekenSheetDataRangeBeurt.setValues(spelerBeurtStats.getValues());
    }

    UpdateSpelersStatistiekenNaIngevuldBattleReport(speler, beurtNr, stats)
    {
        for (var value of stats)
        {
            var statistiekenSheetSpelerScoreRange = this.statistiekenSpreadSheet.getSheetByName(speler).getRange(STATISTIEKEN_SHEET_SPELER_STATS_NA_BATTLE_RANGES[stats.indexOf(value)]);
            var statistiekenSheetSpelerScoreBeurtCell = statistiekenSheetSpelerScoreRange.offset(0, beurtNr, 1, 1);
            statistiekenSheetSpelerScoreBeurtCell.setValue(value);
        }
    }


    SetCPUTegenstander(spelerNaam, beurtNr)
    {
        var statistiekenSheetSpelerTegenstanderRange = this.statistiekenSpreadSheet.getSheetByName("CPU").getRange(STATISTIEKEN_SHEET_SPELER_TEGENSTANDER_RANGE);
        var statistiekenSheetSpelerTegenstanderBeurtCell = statistiekenSheetSpelerTegenstanderRange.offset(0, beurtNr, 1, 1);
        statistiekenSheetSpelerTegenstanderBeurtCell.setValue(spelerNaam);
    }

    SetWinnaars(winnaars, beurtNr)
    {
        var alleSpelers = this.spelers;
        alleSpelers.push("CPU");
        for (var speler of alleSpelers)
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
        var statistiekenStatsRangeA1 = _IsBattleBeurt(beurtNr) ? (STATISTIEKEN_SHEET_SPELER_DATA_RANGE + STATS_ROW_END_BATTLE_BEURT) : (STATISTIEKEN_SHEET_SPELER_DATA_RANGE + STATS_ROW_END_NONBATTLE_BEURT);
        var statistiekenSheetDataRange = this.statistiekenSpreadSheet.getSheetByName(spelerName).getRange(statistiekenStatsRangeA1);
        var statistiekenSheetDataRangeBeurt = statistiekenSheetDataRange.offset(0, beurtNr, statistiekenSheetDataRange.getNumRows(), 1);
        return statistiekenSheetDataRangeBeurt.getValues();
    }
}
