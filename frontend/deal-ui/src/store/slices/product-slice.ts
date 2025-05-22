import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "..";

interface ProductState {
    searchText: string;
    sortOrder: "asc" | "desc" | null;
    selectedCategoryId: string | null;
    isAddPanelOpen: boolean;
    editingProductId: string | null;
}

const initialState: ProductState = {
    searchText: "",
    sortOrder: null,
    selectedCategoryId: null,
    isAddPanelOpen: false,
    editingProductId: null,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSearchText: (state, action: PayloadAction<string>) => {
            state.searchText = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<"asc" | "desc" | null>) => {
            state.sortOrder = action.payload;
        },
        setSelectedCategoryId: (state, action: PayloadAction<string | null>) => {
            state.selectedCategoryId = action.payload;
        },
        toggleAddPanel: (state) => {
            state.isAddPanelOpen = !state.isAddPanelOpen;
        },
        closeAddPanel: (state) => {
            state.isAddPanelOpen = false;
        },
        setEditingProductId: (state, action: PayloadAction<string>) => {
            state.editingProductId = action.payload;
        },
        resetEditingState: (state) => {
            state.editingProductId = null;
        },
    },
});

export const {
    setSearchText,
    setSortOrder,
    setSelectedCategoryId,
    toggleAddPanel,
    closeAddPanel,
    setEditingProductId,
    resetEditingState,
} = productSlice.actions;

export const selectSearchText = (state: RootState) => state.product.searchText;
export const selectSortOrder = (state: RootState) => state.product.sortOrder;
export const selectSelectedCategoryId = (state: RootState) => state.product.selectedCategoryId;
export const selectIsAddPanelOpen = (state: RootState) => state.product.isAddPanelOpen;
export const selectEditingProductId = (state: RootState) => state.product.editingProductId;

export default productSlice.reducer; 