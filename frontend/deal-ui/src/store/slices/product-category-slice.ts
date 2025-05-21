import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface ProductCategoryState {
  searchText: string;
  sortOrder: "asc" | "desc" | null;
  isAddPanelOpen: boolean;
  editingProductCategoryId: string | null;
}

const initialState: ProductCategoryState = {
  searchText: "",
  sortOrder: null,
  isAddPanelOpen: false,
  editingProductCategoryId: null
};

export const productCategorySlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc" | null>) => {
      state.sortOrder = action.payload;
    },
    toggleAddPanel: (state) => {
      state.isAddPanelOpen = !state.isAddPanelOpen;
    },
    closeAddPanel: (state) => {
      state.isAddPanelOpen = false;
    },
    setEditingProductCategoryId: (state, action: PayloadAction<string | null>) => {
      state.editingProductCategoryId = action.payload;
    },
    resetEditingState: (state) => {
      state.editingProductCategoryId = null;
    }
  }
});

export const {
  setSearchText,
  setSortOrder,
  toggleAddPanel,
  closeAddPanel,
  setEditingProductCategoryId,
  resetEditingState
} = productCategorySlice.actions;

export const selectProductCategoryState = (state: RootState) => state.productCategory;
export const selectSearchText = (state: RootState) => state.productCategory.searchText;
export const selectSortOrder = (state: RootState) => state.productCategory.sortOrder;
export const selectIsAddPanelOpen = (state: RootState) => state.productCategory.isAddPanelOpen;
export const selectEditingProductCategoryId = (state: RootState) => state.productCategory.editingProductCategoryId;

export default productCategorySlice.reducer; 