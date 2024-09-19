import { Clipping } from './Clipping';

export const parseLinesIntoClipping = (entry: string): Clipping | null => {
    const lines = entry.trim().split('\n');

    if (lines.length < 4) {
        return null;
    }

    const title = lines[0].trim();
    const content = lines.slice(3).join('\n').trim();
    let kind: string | null = null;
    let location_begin: number | null = null;
    let location_end: number | null = null;
    let potentialDateIndex = 0;
    let page: string | null = null;
    let date: Date | null = null;

    const metadata = lines[1].trim();
    const metadataParts = metadata.split('|').map(part => part.trim());

    // Find kind and location
    const kindMatch = metadataParts[0].match(/Your\s+(?<kind>\w+)\s+at\s+location\s+(?<location_begin>\d+)(?:-(?<location_end>\d+))?/i);
    if (kindMatch && kindMatch.groups) {
        kind = kindMatch?.groups?.kind.toLowerCase();
        location_begin = kindMatch?.groups?.location_begin ? parseInt(kindMatch.groups.location_begin, 10) : null;
        location_end = kindMatch?.groups?.location_end ? parseInt(kindMatch.groups.location_end, 10) : null;
        potentialDateIndex = 1;
    } else {
        const partialMatch = metadataParts[0].match(/Your\s+(?<kind>\w+)\s+on\s+page\s+(?<page>[\w-]+)/i);
        if (partialMatch && partialMatch.groups) {
            kind = partialMatch.groups.kind.toLowerCase();
            page = partialMatch.groups.page;


            const locationMatch = metadataParts[1].match(/location\s(?<location_begin>\d+)(?:-(?<location_end>\d+))?/i);
            if (locationMatch && locationMatch.groups) {
                location_begin = parseInt(locationMatch.groups.location_begin, 10);
                location_end = locationMatch.groups.location_end ? parseInt(locationMatch.groups.location_end, 10) : null;
                potentialDateIndex = 2;
            }
            else {
                potentialDateIndex = 1;
            }
        }
    }

    try {
        const dateString = metadataParts[potentialDateIndex].trim();
        const dateMatch = dateString.match(/Added on (?<weekday>\w+), (?<day>\d+) (?<month>\w+) (?<year>\d{4}) (?<time>\d{2}:\d{2}:\d{2})/);
        if (dateMatch && dateMatch.groups) {
            const { day, month, year, time } = dateMatch.groups;
            date = new Date(`${month} ${day}, ${year} ${time}`);
        }
        else {
            console.log(`Trying to find date at index ${potentialDateIndex} in ${metadataParts} (${dateString})`);
        }
    } catch (error) {
        console.error(error);
    }

    return {
        title,
        content,
        kind,
        location_begin,
        location_end,
        page,
        date,
        note: null
    };
};
