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

export function getArrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
    // Convert arrays to sets to remove duplicates
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    return [...set1].filter((value) => set2.has(value));
}

//^ converts date object to correct format with zero padding
export const convertDateFormat = (date: Date): string => {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd; // adding zero padding
    if (mm < 10) mm = "0" + mm; // adding zero padding

    const formattedToday = dd + "/" + mm + "/" + yyyy;

    return formattedToday;
  };