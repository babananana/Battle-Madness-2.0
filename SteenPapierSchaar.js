const SPS_UITSLAGEN =  [[["steen", "papier"], "papier"], 
                        [["papier", "schaar"], "schaar"], 
                        [["schaar", "steen"], "steen"]];

class SteenPapierSchaar
{
    constructor(spelerSheet)
    {
        this.spsHuidigeBeurtRange = spelerSheet.getRange("B29");
        this.spsVooruitzichtRange = spelerSheet.getRange("AA26:AC28");
        this.keuzeTegenstanderRange = spelerSheet.getRange("E29");
        this.spsScoreRange = spelerSheet.getRange("D31");
        this.values = {steen: 0, papier: 0, schaar: 0};
        this.keuze = "";
    }

    SPSNaarHuidigeBeurt()
    {
        var spsInvoer = this._GetSPSKeuze();
        Logger.log("SPS keuze: [" + spsInvoer + "]");
        this.keuze = spsInvoer;
        this.spsHuidigeBeurtRange.setValue(spsInvoer);
    }

    UpdateSpelerBattle(keuzeTegenstander)
    {
      var uitslag = this._GetUitslag(keuzeTegenstander);
      var score = parseInt(this.spsScoreRange.getValue());
      score += this._GetVerdiendePunten(uitslag);

      this.keuzeTegenstanderRange.setValue(CapitalizeFirstLetter(keuzeTegenstander));
      this.spsScoreRange.setValue(score);
    }

    _GetVerdiendePunten(uitslag)
    {
      var punten = 0;
      if (uitslag == null) //gelijkspel
      {
        punten = 1;
      }
      else if (uitslag[1].toLowerCase() == this.keuze.toLowerCase()) //winst
      {
        punten = 3;
      }
      return punten;
    }

    _GetUitslag(tegenstanderKeuze)
    {
      if (this.keuze.toLowerCase() == tegenstanderKeuze.toLowerCase())
      {
        return null; //gelijkspel
      }
      var uitslagenMetKeuze1 = SPS_UITSLAGEN.filter(x => x[0].find(y => y == this.keuze.toLowerCase()));
      return uitslagenMetKeuze1.find(x => x[0].find(y => y == tegenstanderKeuze.toLowerCase()));
    }

    _GetSPSKeuze()
    {
      var values = this.spsVooruitzichtRange.getValues();
      var keuze = "";
      for (var value of values)
      {
        if (value[2].toLowerCase() == "x")
        {
          keuze = value[0];
        }
      }
      
      return keuze;
    }
}


