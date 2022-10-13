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
        this.grondstoffen.CopyRangeToRange(target.grondstoffen);
        this.basis.CopyRangeToRange(target.basis);
        this.bonus.CopyRangeToRange(target.bonus);
        this.populatie.CopyRangeToRange(target.populatie);
        this.goudStelen.CopyRangeToRange(target.goudStelen);
        this.belasting.CopyRangeToRange(target.belasting);
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
            // Een kolom naar rechts voor het level. De waarde wordt berekend in de sheet
            new range.offset(offsets.goud.value[0], offsets.goud.value[1] + 1, 1,1),
            new range.offset(offsets.hout.value[0], offsets.hout.value[1] + 1, 1,1),
            new range.offset(offsets.ijzer.value[0], offsets.ijzer.value[1] + 1, 1,1) 
        )
    }

    CopyRangeToRange(target)
    {
        var values = this.goud.getValues();
        target.goud.setValues(values);
        target.hout.setValues(this.hout.getValues());
        target.ijzer.setValues(this.ijzer.getValues());
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
        target.soldaten.setValues(this.soldaten.getValues());
        target.schade.setValues(this.schade.getValues());
        target.verdediging.setValues(this.verdediging.getValues());
        target.discipline.setValues(this.discipline.getValues());
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
            new range.offset(offsets.cavalerie.value[0], offsets.cavalerie.value[1], 1,2), 
            new range.offset(offsets.boogschutters.value[0], offsets.boogschutters.value[1], 1,2), 
            new range.offset(offsets.katapulten.value[0], offsets.katapulten.value[1], 1,1), 
            new range.offset(offsets.prestige[0], offsets.prestige[1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        target.cavalerie.setValues(this.cavalerie.getValues());
        target.boogschutters.setValues(this.boogschutters.getValues());
        target.katapulten.setValues(this.katapulten.getValues());
        target.prestige.setValues(this.prestige.getValues());
    }
}

class Populatie
{
    constructor(totaal, max, beschikbaar)
    {
        this.totaal = totaal;
        this.max = max;
        this.beschikbaar = beschikbaar;
    }

    GetContents()
    {
        return [this.totaal, this.max, this.beschikbaar];
    }

    SubRangesFromOffsets(range, offsets)
    {
        return new Populatie
        (
            new range.offset(offsets.totaal[0], offsets.totaal[1], 1,1), 
            new range.offset(offsets.max[0], offsets.max[1], 1,1), 
            new range.offset(offsets.beschikbaar[0], offsets.beschikbaar[1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        target.totaal.setValues(this.totaal.getValues());
        target.max.setValues(this.max.getValues());
        target.beschikbaar.setValues(this.beschikbaar.getValues());
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
            range.offset(offsets.onderhoud[0], offsets.onderhoud[1], 1,1), 
            range.offset(offsets.goudInkomsten[0], [1], 1,1)
        )
    }

    CopyRangeToRange(target)
    {
        target.kluis.setValues(this.kluis.getValues());
        target.inbrekers.setValues(this.inbrekers.getValues());
        target.onderhoud.setValues(this.onderhoud.getValues());
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
        target.percentage.setValues(this.percentage.getValues());
        target.goudInkomsten.setValues(this.goudInkomsten.getValues());
    }
}

