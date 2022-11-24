const BATTLE_REPORT_SPELER_B_RANGE = "F3:F22"
const BATTLE_REPORT_SPELER_B_WINNAAR_CELL = "F15"
const BATTLE_REPORT_SCORE_A1s = ["D14", "L27", "L4", "F3"]
const BATTLE_REPORT_SCORE_SPELER_B_A1s = ["F14", "F24"]
const STATISTIEKEN_SHEET_SPELER_DATA_TO_BATTLE_LAYOUT = {
    "Soldaten" : {statIndex: 3, BattleIndex: 1}, 
    "Schade" : {statIndex: 4, BattleIndex: 2}, 
    "Verdediging" : {statIndex: 5, BattleIndex: 3}, 
    "Discipline" : {statIndex: 6, BattleIndex: 4}, 
    "Cavalerie" : {statIndex: 7, BattleIndex: 6}, 
    "Cal. Bonus" : {statIndex: 8, BattleIndex: 7}, 
    "Boogschutters" : {statIndex: 9, BattleIndex: 8}, 
    "Katapulten" : {statIndex: 10, BattleIndex: 9}, 
    "Prestige" : {statIndex: 12, BattleIndex: 10},
    "Kluis" : {statIndex: 16, BattleIndex: 17}, 
    "Inbrekers" : {statIndex: 17, BattleIndex: 18}, 
    "Onderhoud" : {statIndex: 18, BattleIndex: 19}
}; 

class BattleInvuller
{
    constructor(spelerSheet)
    {
        this.spelerSheet = spelerSheet;
    }

    UpdateBattleSpelerB(statistiekenSheetData, spelerBName)
    {
        var battleSpelerBRange = this.spelerSheet.getRange(BATTLE_REPORT_SPELER_B_RANGE);
        var spelerBNameRange = battleSpelerBRange.offset(0, 0, 1, 1);
        spelerBNameRange.setValues([[spelerBName]]);

        for (var key of Object.keys(STATISTIEKEN_SHEET_SPELER_DATA_TO_BATTLE_LAYOUT))
        {
            var sourceData = statistiekenSheetData[STATISTIEKEN_SHEET_SPELER_DATA_TO_BATTLE_LAYOUT[key].statIndex];

            //offset(rowOffset, columnOffset, numRows, numColumns) 
            var spelerRange = battleSpelerBRange.offset(STATISTIEKEN_SHEET_SPELER_DATA_TO_BATTLE_LAYOUT[key].BattleIndex, 0, 1, 1);

            spelerRange.setValues([[sourceData]]);
        }

        var spelerBWinnaar = this.spelerSheet.getRange(BATTLE_REPORT_SPELER_B_WINNAAR_CELL).getValue();
        return (spelerBWinnaar == "Winnaar");
    }

    GetStats()
    {
        var results = [];
        for (var rangeA1 of BATTLE_REPORT_SCORE_A1s)
        {
            results.push(this.spelerSheet.getRange(rangeA1).getValue());
        }
        return results;
    }

    GetStatsSpelerB()
    {
        var results = [];
        for (var rangeA1 of BATTLE_REPORT_SCORE_SPELER_B_A1s)
        {
            results.push(this.spelerSheet.getRange(rangeA1).getValue());
        }
        
        return results;
    }
}