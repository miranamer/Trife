import {create} from 'zustand';

type PageStore = {
    pagePtr: number;
    setPagePtr: (ptr: number) => void;
};

export const usePageStore = create<PageStore>((set) => ({
    pagePtr: -1,
    setPagePtr: (ptr) => set({ pagePtr: ptr })
}));