const HOMEPAGE_PROGRAMM_RANGES = ["B13:B16", "D13:D16"];
const HOMEPAGE_UITSLAG_SPELER_RANGES = ["I20:I23", "K20:K23"];
const HOMEPAGE_UITSLAG_WINNAAR_RANGE = "M20:M23";
const HOMEPAGE_BEURTNR_RANGE = "C2";

class HomepageUpdater
{
    constructor(homepageSpreadSheet, statistiekenSpreadSheet)
    {
        this.homepageSpreadSheet = homepageSpreadSheet;
        this.statistiekenSpreadSheet = statistiekenSpreadSheet;
    }

    UpdateHomepage()
    {
        this._ProgrammaKopierenNaarUitslag();
        this._winnaarsInvullen();
        // Scorebord updaten
        // Shuffelen
        // Programma genereren
    }

    _ProgrammaKopierenNaarUitslag()
    {
        

        for (var i=0; i<HOMEPAGE_PROGRAMM_RANGES.length; i++)
        {
            var hoofdpagina = this.homepageSpreadSheet.getSheetByName("Hoofdpagina");
            var programmaRange = hoofdpagina.getRange(HOMEPAGE_PROGRAMM_RANGES[i]);
            var uitslagRange = hoofdpagina.getRange(HOMEPAGE_UITSLAG_SPELER_RANGES[i]);
            uitslagRange.setValues(programmaRange.getValues());
        }
    }

    _winnaarsInvullen()
    {
        var hoofdpagina = this.homepageSpreadSheet.getSheetByName("Hoofdpagina");
        var statUpdater = new StatistiekenUpdater(this.statistiekenSpreadSheet);
        var uitslagSpelerRangeA = hoofdpagina.getRange(HOMEPAGE_UITSLAG_SPELER_RANGES[0]);
        var uitslagSpelerRangeB = hoofdpagina.getRange(HOMEPAGE_UITSLAG_SPELER_RANGES[1]);
        var beurtNr = hoofdpagina.getRange(HOMEPAGE_BEURTNR_RANGE).getValue();
        var winnaarRange = hoofdpagina.getRange(HOMEPAGE_UITSLAG_WINNAAR_RANGE);

        var uitslagSpelersA = uitslagSpelerRangeA.getValues();
        var uitslagSpelersB = uitslagSpelerRangeB.getValues();
        for (var i=0; i<uitslagSpelerRangeA.getNumRows(); i++)
        {
            var spelerANaam = uitslagSpelersA[i][0];
            var spelerBNaam = uitslagSpelersB[i][0];
            var winnaar = statUpdater.GetWinnaar(spelerANaam, spelerBNaam, beurtNr);
            // offset(rowOffset, columnOffset, numRows, numColumns) 
            var winnaarUitslagRange = winnaarRange.offset(i, 0, 1, 1);
            winnaarUitslagRange.setValue(winnaar);
        }
    }
}