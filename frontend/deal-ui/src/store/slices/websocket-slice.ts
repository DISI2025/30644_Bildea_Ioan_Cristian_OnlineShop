import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../types/entities';

interface WebSocketState {
    connected: boolean;
    lastOrder: Order | null;
    error: string | null;
}

const initialState: WebSocketState = {
    connected: false,
    lastOrder: null,
    error: null,
};

export const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
            if (action.payload) {
                state.error = null;
            }
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.connected = false;
        },
        orderReceived: (state, action: PayloadAction<Order>) => {
            state.lastOrder = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { setConnected, setError, orderReceived, clearError } = webSocketSlice.actions;

export default webSocketSlice.reducer; 