import { page } from "../App";

export function orderDatesDescending (date1: page, date2: page) {
    const [d1, m1, y1] = date1.date.split('/').map(Number);
    const [d2, m2, y2] = date2.date.split('/').map(Number);
    
    return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1); // date2 - date1
}

export function extractEmojis(text: string): string[] {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu; // finds emojis in string
    return text.match(emojiRegex) || []; // returns array of emojis
}