import React from 'react';
import { useOrderNotifications } from '../../hooks/useOrderNotifications';

/**
 * WebSocketConnection component that initializes and manages WebSocket connection
 * for order notifications. This component should be placed at the app root level
 * to ensure WebSocket connection is active throughout the application lifecycle.
 */
const WebSocketConnection: React.FC = () => {
    useOrderNotifications();

    return null;
};

export default WebSocketConnection; 