import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchCategory =
  | "all"
  | "bookings"
  | "customers"
  | "parking-lots"
  | "tickets"
  | "reports"
  | "settings"
  | "recent";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  category: SearchCategory;
  path: string;
  icon?: any;
  keywords?: string[];
}

interface SearchResult {
  item: SearchItem;
  score: number;
}

interface SearchState {
  query: string;
  isOpen: boolean;
  results: SearchResult[];
  recentSearches: SearchItem[];
  selectedIndex: number;
  activeCategories: SearchCategory[];
  isLoading: boolean;
}

const initialState: SearchState = {
  query: "",
  isOpen: false,
  results: [],
  recentSearches: [],
  selectedIndex: 0,
  activeCategories: ["all"],
  isLoading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
      state.query = "";
      state.results = [];
      state.selectedIndex = 0;
    },
    setResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<SearchItem>) => {
      // Remove if already exists
      state.recentSearches = state.recentSearches.filter(
        (item) => item.id !== action.payload.id
      );
      // Add to beginning
      state.recentSearches.unshift(action.payload);
      // Keep only last 10
      if (state.recentSearches.length > 10) {
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    setSelectedIndex: (state, action: PayloadAction<number>) => {
      state.selectedIndex = action.payload;
    },
    incrementSelectedIndex: (state) => {
      if (state.selectedIndex < state.results.length - 1) {
        state.selectedIndex++;
      }
    },
    decrementSelectedIndex: (state) => {
      if (state.selectedIndex > 0) {
        state.selectedIndex--;
      }
    },
    toggleCategory: (state, action: PayloadAction<SearchCategory>) => {
      const category = action.payload;
      if (category === "all") {
        state.activeCategories = ["all"];
      } else {
        // Remove 'all' if adding specific category
        state.activeCategories = state.activeCategories.filter(
          (c) => c !== "all"
        );

        const index = state.activeCategories.indexOf(category);
        if (index === -1) {
          state.activeCategories.push(category);
        } else {
          state.activeCategories.splice(index, 1);
        }

        // If no categories selected, default to 'all'
        if (state.activeCategories.length === 0) {
          state.activeCategories = ["all"];
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setQuery,
  openSearch,
  closeSearch,
  setResults,
  addRecentSearch,
  clearRecentSearches,
  setSelectedIndex,
  incrementSelectedIndex,
  decrementSelectedIndex,
  toggleCategory,
  setLoading,
} = searchSlice.actions;

export default searchSlice.reducer;
