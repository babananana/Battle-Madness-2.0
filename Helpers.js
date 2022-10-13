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
