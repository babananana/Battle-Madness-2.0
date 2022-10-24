const SCOREBORD_KOLOMMEN = ["J4:J16", "K4:K16", "L4:L16", "M4:M16", "N4:N16", "O4:O16", "P4:P16", "Q4:Q16"];
const SCOREBORD_SPELERS = ["Bart", "Davey", "Geus", "Jessy", "Koen", "Martin", "Robbie", "CPU"];

class ScorebordSpeler
{
  constructor(naam, scorebordRange, locatieCell)
  {
    this.naam = naam;
    this.scorebordRange = scorebordRange;
    this.locatieCell = locatieCell;
    this.values = scorebordRange.getValues();
  }

  toString()
  {
    return ("\nnaam: " + this.naam + 
    ", scorebordRange: " + this.scorebordRange.getA1Notation() + 
    ", locatieCell: " + this.locatieCell.getA1Notation());
  }
}

function _ScorebordFactory(homepageSheet)
{
  var scorebord = [];
  for (var range of homepageSheet.getRangeList(SCOREBORD_KOLOMMEN).getRanges())
  {
    for (var naam of SCOREBORD_SPELERS)
    {
      var textFinder = range.createTextFinder(naam);
      var textFinderResult = textFinder.findNext();
      if (textFinderResult)
      {
        //Logger.log("Found " + naam + " at: " + textFinderResult.getA1Notation());
        scorebord.push(new ScorebordSpeler(naam, range, textFinderResult));
        break;
      }
    }
  }
  Logger.log("Scorebord: " + scorebord);
  return scorebord;
}