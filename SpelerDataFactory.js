
const BEURT_INDEXES = new SpelerStatus
(
    new Grondstoffen(new ValueLevel([3,2], [3,3]), new ValueLevel([4,2], [4,3]), new ValueLevel([5,2], [5,3]), ),
    new Basis([8,2], [9,2], [10,2], [11,2],),
    new Bonus(new ValueLevel([14,2], [14,3]), new ValueLevel([15,2], [15,3]), new ValueLevel([16,2], [16,3]), [17,2]),
    new Populatie(),
    new GoudStelen([23,2], [24,2], [25,2], [26,2]),
    new Belasting([29,2], [30,2])
);

class SpelerDataFactory
{
    CreateSpelerData(sheet)
    {
        const huidigeBeurtRange = "J1:M31"
        const vooruitzichtRange = "AG1:AJ31"
        var result =  
        {
            huidigeBeurt: this.CreateSpelerStatusRangesFromRange(sheet.getRange(huidigeBeurtRange), BEURT_INDEXES), 
            vooruitzicht: this.CreateSpelerStatusRangesFromRange(sheet.getRange(vooruitzichtRange), BEURT_INDEXES)
        };
        return result;
    }

    CreateSpelerStatusRangesFromRange(range, offsets)
    {
        return new SpelerStatus
        (
            BEURT_INDEXES.grondstoffen.SubRangesFromOffsets(range, offsets.grondstoffen), 
            BEURT_INDEXES.basis.SubRangesFromOffsets(range, offsets.basis),
            BEURT_INDEXES.bonus.SubRangesFromOffsets(range, offsets.bonus), 
            BEURT_INDEXES.populatie.SubRangesFromOffsets(range, offsets.populatie), 
            BEURT_INDEXES.goudStelen.SubRangesFromOffsets(range, offsets.goudStelen), 
            BEURT_INDEXES.belasting.SubRangesFromOffsets(range, offsets.belasting)
        )
    }
}

const SPELER_DATA_FACTORY = new SpelerDataFactory();