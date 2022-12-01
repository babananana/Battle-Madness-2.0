class SteenPapierSchaar
{
    constructor(spelerSheet)
    {
        this.spsHuidigeBeurtRange = spelerSheet.getRange("B29");
        this.spsVooruitzichtRange = spelerSheet.getRange("AA26:AC28");
        this.values = {steen: 0, papier: 0, schaar: 0};
    }

    SPSNaarHuidigeBeurt()
    {
        var spsInvoer = this._GetSPSKeuze();
        Logger.log("SPS keuze: [" + spsInvoer + "]");
        this.spsHuidigeBeurtRange.setValue(spsInvoer);
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


