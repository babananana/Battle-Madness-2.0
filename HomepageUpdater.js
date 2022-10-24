const HOMEPAGE_PROGRAMM_RANGES = ["B13:B16", "D13:D16"];
const HOMEPAGE_UITSLAG_SPELER_RANGES = ["I20:I23", "K20:K23"];
const HOMEPAGE_UITSLAG_RANGE = "I20:M23";
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
        this._ScorebordUpdaten();
        this._ScorebordShufflen();
        this._VolgendeBattlesBepalenProgrammaUpdaten();
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
        var winnaarRange = hoofdpagina.getRange(HOMEPAGE_UITSLAG_RANGE);

        var uitslagSpelersA = uitslagSpelerRangeA.getValues();
        var uitslagSpelersB = uitslagSpelerRangeB.getValues();
        for (var i=0; i<uitslagSpelerRangeA.getNumRows(); i++)
        {
            var spelerANaam = uitslagSpelersA[i][0];
            var spelerBNaam = uitslagSpelersB[i][0];
            var winnaar = statUpdater.GetWinnaar(spelerANaam, spelerBNaam, beurtNr);
            // offset(rowOffset, columnOffset, numRows, numColumns) 
            var winnaarUitslagRange = winnaarRange.offset(i, 4, 1, 1);
            winnaarUitslagRange.setValue(winnaar);
        }
    }

    _ScorebordUpdaten()
    {
        CheckUi();
        var hoofdpagina = this.homepageSpreadSheet.getSheetByName("Hoofdpagina");
        var winnaars = hoofdpagina.getRange(HOMEPAGE_UITSLAG_RANGE).getValues();
        this._BattleUpdatenOpScorebord(winnaars, _ScorebordFactory(hoofdpagina));
    }

    _BattleUpdatenOpScorebord(wedstrijdUitslagLijst, scorebord)
    {
        var winnaars = [];
        var verliezers = [];
        var error = "";
        
        for (var wedstrijdUitslag of wedstrijdUitslagLijst)
        {
            var winnaar = wedstrijdUitslag[4];
            if (winnaar != "-")
            {
            if (scorebord.findIndex((x) => x.naam == winnaar) == -1)
            {
                error = "Winnaar [" + winnaar + "] niet gevonden op scorebord";
                break;
            }
            winnaars.push(winnaar);
            var winnaarIndex = wedstrijdUitslag.findIndex((x) => x == winnaar);
            //Logger.log("winnaarIndex: " + winnaarIndex);
            var verliezer = "";
            if (winnaarIndex == 0)
            {
                verliezer = wedstrijdUitslag[2];
            }
            else if (winnaarIndex == 2)
            {
                verliezer = wedstrijdUitslag[0];
            }
            else
            {
                error = "Winnaar [" + winnaar + "] niet gevonden op in battle uitslag: \n" + wedstrijdUitslag;
                break;
            }

            if (verliezer == "")
            {
                error = "Verliezer is niet goed bepaald: \n" + wedstrijdUitslag;
                break;
            }

            verliezers.push(verliezer);
            Logger.log("Winnaar: " + winnaar + ", Verliezer: " + verliezer);
            }
        }

        if (error != "")
        {
            Logger.log(error);
            if (uiActief)
            {
            var ui = SpreadsheetApp.getUi(); // Same variations.
            var result = ui.alert(
                'Oei',
                error + '\nScorebord blijft ongewijzigd',
                ui.ButtonSet.OK);
            }
            return;
        }

        for (var naam of winnaars)
        {
            this._SpelerScoreToepassen(naam, -2, scorebord);
        }
        for (var naam of verliezers)
        {
            this._SpelerScoreToepassen(naam, 2, scorebord);
        }
    }

    _SpelerScoreToepassen(naam, offset, scorebord)
    {
        var speler = scorebord.find((x) => x.naam == naam);
        var nieuweLocatieCell = speler.locatieCell.offset(offset, 0);
        if (_IsCellInRange(nieuweLocatieCell, speler.scorebordRange))
        {
            Logger.log(naam + " verplaatst naar " + nieuweLocatieCell.getA1Notation());
            nieuweLocatieCell.setValue(speler.naam);
            speler.locatieCell.clearContent();
        }
        else 
        {
            Logger.log(naam + " staat al bovenaan/onderaan!");
        }
    }

    _ScorebordShufflen()
    {
        CheckUi();
        var hoofdpagina = this.homepageSpreadSheet.getSheetByName("Hoofdpagina");
        var scorebordRangeList = hoofdpagina.getRangeList(SCOREBORD_KOLOMMEN).getRanges();
        var scorebord = _ScorebordFactory(hoofdpagina);
        var shuffledScorebord = _Shuffle(scorebord);
        for (var col = 0; col < scorebord.length; col++)
        {
            var colRange = scorebordRangeList[col];
            colRange.setValues(shuffledScorebord[col].values);
        }
        scorebord = _ScorebordFactory(hoofdpagina);
    }

    _VolgendeBattlesBepalenProgrammaUpdaten()
    {
        CheckUi();
        var hoofdpagina = this.homepageSpreadSheet.getSheetByName("Hoofdpagina");
        var scorebordRange = hoofdpagina.getRange("J4:Q16");
        var programmaRange = hoofdpagina.getRange("B13:D16");

        var spelersSorted = [];  

        for (var rowCount = 0; rowCount < scorebordRange.getNumRows(); rowCount++)
        {
            var scorebordRegelRange = scorebordRange.offset(rowCount, 0, 1);
            if ((rowCount % 2) == 0) // Alleen even rijen
            {
                var regelValues = scorebordRegelRange.getValues()[0];
                for (var cellValue of regelValues)
                {
                    var result = SCOREBORD_SPELERS.findIndex((x) => x == cellValue);
                    if (result != -1)
                    {
                        spelersSorted.push(cellValue);
                    }
                }
            }
        }

        Logger.log("Spelerlijst op volgorde: " + spelersSorted);

        for (var rowCount = 0; rowCount < programmaRange.getNumRows(); rowCount++)
        {
            var programmaRegelRange = programmaRange.offset(rowCount, 0, 1);
            var cellIndexes = [[1,1], [1,3]];
            for (var cellIndex of cellIndexes)
            {
                var cell = programmaRegelRange.getCell(cellIndex[0], cellIndex[1]);
                var naam = spelersSorted.shift();
                Logger.log(naam + " naar " + cell.getA1Notation());
                cell.setValue(naam);
            }
        }
    }
}