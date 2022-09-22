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
}

class Grondstoffen
{
    constructor(goud, hout, ijzer)
    {
        this.goud = goud;
        this.hout = hout;
        this.ijzer = ijzer;
    }
    
    SubRangesFromOffsets(range, offsets)
    {
        return new Grondstoffen
        (
            new ValueLevel(range.offset(offsets.goud.value[0], offsets.goud.value[1]), range.offset(offsets.goud.level[0], offsets.goud.level[1])), 
            new ValueLevel(range.offset(offsets.hout.value[0], offsets.hout.value[1]), range.offset(offsets.hout.level[0], offsets.hout.level[1])), 
            new ValueLevel(range.offset(offsets.ijzer.value[0], offsets.ijzer.value[1]), range.offset(offsets.ijzer.level[0], offsets.ijzer.level[1])), 
        )
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

    SubRangesFromOffsets(range, offsets)
    {
        return new Basis
        (
            range.offset(offsets.soldaten[0], offsets.soldaten[1]), 
            range.offset(offsets.schade[0], offsets.schade[1]), 
            range.offset(offsets.verdediging[0], offsets.verdediging[1]),
            range.offset(offsets.discipline[0], offsets.discipline[1])
        )
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
    
    SubRangesFromOffsets(range, offsets)
    {
        return new Bonus
        (
            new ValueLevel(range.offset(offsets.cavalerie.value[0], offsets.cavalerie.value[1]), range.offset(offsets.cavalerie.level[0], offsets.cavalerie.level[1])), 
            new ValueLevel(range.offset(offsets.boogschutters.value[0], offsets.boogschutters.value[1]), range.offset(offsets.boogschutters.level[0], offsets.boogschutters.level[1])), 
            new ValueLevel(range.offset(offsets.katapulten.value[0], offsets.katapulten.value[1]), range.offset(offsets.katapulten.level[0], offsets.katapulten.level[1])), 
            new ValueLevel(range.offset(offsets.prestige[0], offsets.prestige[1]))
        )
    }
}

class Populatie
{
    constructor()
    {
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Populatie
        (
        )
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

    SubRangesFromOffsets(range, offsets)
    {
        return new GoudStelen
        (
            range.offset(offsets.kluis[0], offsets.kluis[1]), 
            range.offset(offsets.inbrekers[0], offsets.inbrekers[1]), 
            range.offset(offsets.onderhoud[0], offsets.onderhoud[1]),
            range.offset(offsets.goudInkomsten[0], [1])
        )
    }
}

class Belasting
{
    constructor(percentage, goudInkomsten)
    {
        this.percentage = percentage;
        this.goudInkomsten = goudInkomsten;
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Basis
        (
            range.offset(offsets.percentage[0], offsets.percentage[1]), 
            range.offset(offsets.goudInkomsten[0], offsets.goudInkomsten[1])
        )
    }
}

class ValueLevel
{
    constructor(value, level)
    {
        this.value = value;
        this.level = level;
    }
}

const beurtIndexes = new SpelerStatus
(
    new Grondstoffen(new ValueLevel([3,1], [3,2]), new ValueLevel([4,1], [4,2]), new ValueLevel([5,1], [5,2]), ),
    new Basis([8,1], [9,1], [10,1], [11,1],),
    new Bonus(new ValueLevel([14,1], [14,2]), new ValueLevel([15,1], [15,2]), new ValueLevel([16,1], [16,2]), [17,1]),
    new Populatie(),
    new GoudStelen([23,1], [24,1], [25,1], [26,1]),
    new Belasting([29,1], [30,1])
);

function _CreateSpelerData(sheet)
{
    const huidigeBeurtRange = "J1:M31"
    const vooruitzichtRange = "AG1:AJ31"
    var result =  
    {
        huidigeBeurt: _CreateSpelerStatusRangesFromRange(sheet.getRange(huidigeBeurtRange), beurtIndexes), 
        vooruitzicht: _CreateSpelerStatusRangesFromRange(sheet.getRange(vooruitzichtRange), beurtIndexes)
    };
    return result;
}

function _CreateSpelerStatusRangesFromRange(range, offsets)
{
    return new SpelerStatus
    (
        beurtIndexes.grondstoffen.SubRangesFromOffsets(range, offsets.grondstoffen), 
        beurtIndexes.basis.SubRangesFromOffsets(range, offsets.basis),
        beurtIndexes.bonus.SubRangesFromOffsets(range, offsets.bonus), 
        beurtIndexes.populatie.SubRangesFromOffsets(range, offsets.populatie), 
        beurtIndexes.goudStelen.SubRangesFromOffsets(range, offsets.goudStelen), 
        beurtIndexes.belasting.SubRangesFromOffsets(range, offsets.belasting)
    )
}