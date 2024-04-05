import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    selectedItem: {},
  },
  reducers: {
    addToCarts: (state, { payload }) => {
      const {
        _id,
        id,
        size,
        price,
        size_group_id,
        name,
        parent_product,
        parent_product_id,
        unit,
        quantity,
      } = payload;
      const index = state.carts?.findIndex(item => item?.id === id);
      if (index !== -1) {
        if (quantity === 0) {
          state.carts = state.carts?.filter(item => item?.id !== id );
        } else {
          state.carts[index].quantity = quantity;
        }
      } else {
        state.carts?.push({
          _id,
          id,
          size,
          size_group_id,
          price,
          name,
          parent_product,
          parent_product_id,
          unit,
          quantity,
        });
      }
    },
    clearCart: state => {
      state.carts = [];
    },
    setSelectedItem: (state, { payload }) => {
      state.selectedItem = payload;
    }
  },
});

export const {
  clearCart,
  addToCarts,
  setSelectedItem,
} = orderSlice.actions;

export default orderSlice.reducer;
