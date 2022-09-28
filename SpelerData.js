class RangeCopier
{
    CopyRangeToRange(target)
    {
        for (var content of target.GetContents())
        {
            target.setValues(content.getValues());
        }
    }
}

class SpelerStatus
{
    constructor(grondstoffen, basis, bonus, populatie, goudStelen, belasting)
    {
        this.grondstoffen = grondstoffen, 
        this.basis = basis;
        this.bonus = bonus;
        this.populatie = populatie;
        this.goudStelen = goudStelen;
        this.belasting = belasting;
    }

    GetContents()
    {
        return [this.grondstoffen, this.basis, this.bonus, this.populatie, this.goudStelen, this.belasting];
    }

    CopyRangeToRange(target)
    {
        target.grondstoffen.CopyRangeToRange(target.grondstoffen);
        target.basis.CopyRangeToRange(target.basis);
        target.bonus.CopyRangeToRange(target.bonus);
        target.populatie.CopyRangeToRange(target.populatie);
        target.goudStelen.CopyRangeToRange(target.goudStelen);
        target.belasting.CopyRangeToRange(target.belasting);
    }
}

class Grondstoffen
{
    constructor(goud, hout, ijzer)
    {
        this.goud = goud;
        this.hout = hout;
        this.ijzer = ijzer;
    }

    GetContents()
    {
        return [this.goud, this.hout, this.ijzer];
    }
    
    SubRangesFromOffsets(range, offsets)
    {
        return new Grondstoffen
        (
            new ValueLevel(range.offset(offsets.goud.value[0], offsets.goud.value[1], 1,1), range.offset(offsets.goud.level[0], offsets.goud.level[1], 1,1)), 
            new ValueLevel(range.offset(offsets.hout.value[0], offsets.hout.value[1], 1,1), range.offset(offsets.hout.level[0], offsets.hout.level[1], 1,1)), 
            new ValueLevel(range.offset(offsets.ijzer.value[0], offsets.ijzer.value[1], 1,1), range.offset(offsets.ijzer.level[0], offsets.ijzer.level[1], 1,1)), 
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [this.goud, this.hout, this.ijzer])
        {
            thing.setValues(target.getValues());
        };
    }
}

class Basis
{
    constructor(soldaten, schade, verdediging, discipline)
    {
        this.soldaten = soldaten;
        this.schade = schade;
        this.verdediging = verdediging;
        this.discipline = discipline;
    }

    GetContents()
    {
        return [this.soldaten, this.schade, this.verdediging, this.discipline];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Basis
        (
            range.offset(offsets.soldaten[0], offsets.soldaten[1], 1,1), 
            range.offset(offsets.schade[0], offsets.schade[1], 1,1), 
            range.offset(offsets.verdediging[0], offsets.verdediging[1], 1,1),
            range.offset(offsets.discipline[0], offsets.discipline[1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [this.soldaten, this.schade, this.verdediging, this.discipline])
        {
            thing.setValues(target.getValues());
        };
    }
}

class Bonus
{
    constructor(cavalerie, boogschutters, katapulten, prestige)
    {
        this.cavalerie = cavalerie;
        this.boogschutters = boogschutters;
        this.katapulten = katapulten;
        this.prestige = prestige;
    }
    
    GetContents()
    {
        return [this.cavalerie, this.boogschutters, this.katapulten, this.prestige];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Bonus
        (
            new ValueLevel(range.offset(offsets.cavalerie.value[0], offsets.cavalerie.value[1], 1,1), range.offset(offsets.cavalerie.level[0], offsets.cavalerie.level[1], 1,1)), 
            new ValueLevel(range.offset(offsets.boogschutters.value[0], offsets.boogschutters.value[1], 1,1), range.offset(offsets.boogschutters.level[0], offsets.boogschutters.level[1], 1,1)), 
            new ValueLevel(range.offset(offsets.katapulten.value[0], offsets.katapulten.value[1], 1,1), range.offset(offsets.katapulten.level[0], offsets.katapulten.level[1], 1,1)), 
            new ValueLevel(range.offset(offsets.prestige[0], offsets.prestige[1], 1,1))
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [this.cavalerie, this.boogschutters, this.katapulten, this.prestige])
        {
            thing.setValues(target.getValues());
        };
    }
}

class Populatie
{
    constructor()
    {
    }

    GetContents()
    {
        return [];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Populatie
        (
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [])
        {
            thing.setValues(target.getValues());
        };
    }
}

class GoudStelen
{
    constructor(kluis, inbrekers, onderhoud, goudInkomsten)
    {
        this.kluis = kluis;
        this.inbrekers = inbrekers;
        this.onderhoud = onderhoud;
        this.goudInkomsten = goudInkomsten;
    }

    GetContents()
    {
        return [this.kluis, this.inbrekers, this.onderhoud, this.goudInkomsten];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new GoudStelen
        (
            range.offset(offsets.kluis[0], offsets.kluis[1], 1,1), 
            range.offset(offsets.inbrekers[0], offsets.inbrekers[1], 1,1), 
            range.offset(offsets.onderhoud[0], offsets.onderhoud[1]), 1,1,
            range.offset(offsets.goudInkomsten[0], [1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [this.kluis, this.inbrekers, this.onderhoud, this.goudInkomsten])
        {
            thing.setValues(target.getValues());
        };
    }
}

class Belasting
{
    constructor(percentage, goudInkomsten)
    {
        this.percentage = percentage;
        this.goudInkomsten = goudInkomsten;
    }

    GetContents()
    {
        return [this.percentage, this.goudInkomsten];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Belasting
        (
            range.offset(offsets.percentage[0], offsets.percentage[1], 1,1), 
            range.offset(offsets.goudInkomsten[0], offsets.goudInkomsten[1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        for (var thing of [this.percentage, this.goudInkomsten])
        {
            thing.setValues(target.getValues());
        };
    }
}

