class ValueLevel
{
    constructor(value, level)
    {
        this.value = value;
        this.level = level;
    }
    
    CopyRangeToRange(target)
    {
        for (var thing of [this.value, this.level])
        {
            thing.setValues(target.getValues());
        };
    }
}

Array.prototype.random = function () 
{
    return this[Math.floor((Math.random()*this.length))];
}

Array.prototype.randomIndex = function () 
{
    return Math.floor((Math.random()*this.length));
}
//[2,3,5].random()

function CheckUi()
{
  // See if getUi will load; If not, we are likely not running this script interactively, so disable prompts
  try
  {
    var ui = SpreadsheetApp.getUi();
    globalThis.uiActief = true;
  }
  catch(err)
  {
    globalThis.uiActief = false;
  }
}

function _IsCellInRange(cell, range)
{
  var startRow = range.getRow();
  var endRow = startRow + range.getNumRows() - 1;
  var startColumn = range.getColumn();
  var endColumn = startColumn + range.getNumColumns() - 1;
  return (
    cell.getRow() >= startRow && 
    cell.getRow() <= endRow && 
    cell.getColumn() >= startColumn && 
    cell.getColumn() <= endColumn);
}

function _Shuffle(unshuffled)
{
  return (unshuffled
  // We put each element in the array in an object, and give it a random sort key
  .map(value => ({ value, sort: Math.random() }))
  // We sort using the random key
  .sort((a, b) => a.sort - b.sort)
  // We unmap to get the original objects
  .map(({ value }) => value));
}

function _BeurtOptellen(sheet, rangeA1)
{
  Logger.log("BeurtOptellen");
  beurtCell = sheet.getRange(rangeA1).getCell(1,1);
  var oldValue = parseInt(beurtCell.getValue());
  beurtCell.setValue(oldValue+1);
  return oldValue;
}

function _IsBattleBeurt(beurtNr)
{
  return (beurtNr > 3) ? true : false;
}

function _IsVolgendeBeurtBattleBeurt(beurtNr)
{
  return _IsBattleBeurt(beurtNr + 1);
}