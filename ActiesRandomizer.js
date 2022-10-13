class ActiesRandomizer
{
    constructor(statSheet)
    {
        this.statSheet = statSheet;
    }
    
    NieuweActiesBepalen()
    {
        var opties = this.statSheet.getRange("V4:V11").getValues();
        var nieuweActies = [];
        for (var i=0; i<3; i++)
        {
            var randIndex = opties.randomIndex();
            nieuweActies.push(opties[randIndex]);
            opties.splice(randIndex, 1); // remove used value from opties
        }
        Logger.log("Nieuwe acties: [" + nieuweActies + "]");
        return nieuweActies;
    }

    Update(spelerSheet)
    {
        var nieuweActies = this.NieuweActiesBepalen();
        const actieCells = ["T33", "X33", "AB33"];
        for (var i=0; i<actieCells.length; i++)
        {
            var cell = spelerSheet.getRange(actieCells[i]);
            Logger.log("nieuwe actie [" + nieuweActies[i] + "] voor Cel [" + actieCells[i] + "]");
            cell.setValues([[nieuweActies[i]]]);
        }
    }
}