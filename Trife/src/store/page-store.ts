import {create} from 'zustand';
import { page } from '../App';

type PageStore = {
    pagePtr: number;
    pages: page[];
    setPagePtr: (ptr: number) => void;
    setPages: (pages: page[]) => void;
};

export const usePageStore = create<PageStore>((set) => ({
    pagePtr: -1,
    pages: [],
    setPagePtr: (ptr) => set({ pagePtr: ptr }),
    setPages: (pages) => set({ pages: pages }),
}));