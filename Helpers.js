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
    uiActief = true;
  }
  catch(err)
  {
    uiActief = false;
  }
}

function GetMode()
{
  var scriptProperties = PropertiesService.getScriptProperties();
  var mode = scriptProperties.getProperty('mode');
  //Logger.log(mode);
  return mode;
}

function SetMode(value)
{
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('mode', value);
}

function SetModeInteractive()
{
  CheckUi();
  if (uiActief)
  {
    // Display a dialog box with a message, input field, and "Yes" and "No" buttons. The user can
    // also close the dialog by clicking the close button in its title bar.
    var ui = SpreadsheetApp.getUi();
    var response = ui.prompt('Mode kan "test" of "official" zijn.\nVul hieronder de nieuwe waarde in: ', ui.ButtonSet.OK_CANCEL);

    // Process the user's response.
    if (response.getSelectedButton() == ui.Button.OK) 
    {
      SetMode(response.getResponseText());
      Logger.log('Mode is nu: [', response.getResponseText() + "].");
    }
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