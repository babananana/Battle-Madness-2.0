const STATISTIEKEN_SHEET_ACTIES_OPTIELIJST_RANGE = "I6:I13"
const STATISTIEKEN_SHEET_ACTIES_OPTIES_PER_BEURT_RANGE = "F16:R18"

class ActiesRandomizer
{
    constructor(statistiekenBeurtBewerkenSheet)
    {
        this.statSheet = statistiekenBeurtBewerkenSheet;
    }
    
    NieuweActiesBepalen()
    {
        var opties = this.statSheet.getRange(STATISTIEKEN_SHEET_ACTIES_OPTIELIJST_RANGE).getValues();
        var nieuweActies = [];
        for (var i=0; i<3; i++)
        {
            var randIndex = opties.randomIndex();
            nieuweActies.push(opties[randIndex]);
            opties.splice(randIndex, 1); // remove used value from opties
        }
        Logger.log("Nieuwe acties: [" + nieuweActies + "]");
        this.nieuweActies = nieuweActies;
    }

    UpdateStatSheet(beurtNr)
    {
        // offset(rowOffset, columnOffset, numRows, numColumns) 
        var optiesRange = this.statSheet.getRange(STATISTIEKEN_SHEET_ACTIES_OPTIES_PER_BEURT_RANGE).offset(0, beurtNr-1, 3, 1);
        for (var row=0; row<3; row++)
        {
            var cell = optiesRange.getCell(row+1, 1);
            cell.setValue(this.nieuweActies[row]);
        }
    }

    UpdateSpelerSheet(spelerSheet)
    {
        const actieCells = ["T33", "X33", "AB33"];
        for (var i=0; i<actieCells.length; i++)
        {
            var cell = spelerSheet.getRange(actieCells[i]);
            Logger.log("nieuwe actie [" + this.nieuweActies[i] + "] voor Cel [" + actieCells[i] + "]");
            cell.setValues([[this.nieuweActies[i]]]);
        }
    }
}