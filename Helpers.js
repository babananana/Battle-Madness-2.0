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
