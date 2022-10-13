class SpelerInvoer{
    constructor()
    {
        this.invoerCellA1 = ["T4:T6", "T8:T10", "U11", "W13:W14", "U15", "V17", "U19", "V21", "U22", "T24", "AC26:AC28", "S34:AA34"];
    }

    ClearInvoer(spelerSheet)
    {
        for (var A1 of this.invoerCellA1)
        {
            var range = spelerSheet.getRange(A1);
            Logger.log("Clearing content of " + A1 + "removing values: " + range.getValues());
            range.clearContent();
        }
    }
}