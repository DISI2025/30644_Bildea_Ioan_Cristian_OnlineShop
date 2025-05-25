import {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useDispatch, useSelector} from 'react-redux';
import {useSnackbar} from "../context/SnackbarContext.tsx";
import {Order, UserRole} from '../types/entities.ts';
import {orderReceived, setConnected, setError} from "../store/slices/websocket-slice.ts";
import {RootState} from "../store";
import {OrderStatus} from "../utils/constants.ts";
import {ROUTES} from "../routes/AppRouter.tsx";

interface OrderNotification {
    orderDTO: {
        id: string;
        buyerId: string;
        date: string;
        status: string;
        items: any[];
    }
}

export const useOrderNotifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {showOrderNotification} = useSnackbar();
    const {loggedIn, user} = useSelector((state: RootState) => state.auth);
    const clientRef = useRef<Client | null>(null);

    const WS_ENDPOINT = '/ws-notifications';

    useEffect(() => {
        if (!loggedIn || user?.role !== UserRole.USER || !user?.id) {
            return;
        }

        const userId = user.id;
        const socket = new SockJS(WS_ENDPOINT);

        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                dispatch(setConnected(true));
                const topicPath = `/topic/notify/${userId}`;
                stompClient.subscribe(topicPath, (message:any) => {
                    try {
                        const notification = JSON.parse(message.body) as OrderNotification;
                        const {orderDTO} = notification;

                        const order: Order = {
                            id: orderDTO.id,
                            buyerId: orderDTO.buyerId,
                            date: orderDTO.date,
                            status: orderDTO.status as OrderStatus,
                            items: orderDTO.items || []
                        };

                        dispatch(orderReceived(order));
                        showOrderNotification(
                            order.id,
                            order.status,
                            () => navigate(ROUTES.ORDER_DETAILS.replace(':orderId', order.id))
                        );
                    } catch (error) {
                        dispatch(setError('Error processing notification'));
                    }
                });
            },

            onStompError: (frame) => {
                const errorMessage = frame.headers['message'] || 'Unknown STOMP error';
                dispatch(setError(`STOMP error: ${errorMessage}`));
            },

            onWebSocketError: () => {
                dispatch(setError('WebSocket connection error'));
            },

            onDisconnect: () => {
                dispatch(setConnected(false));
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [loggedIn, user?.id, user?.role, dispatch, showOrderNotification, navigate]);
}