import {
    Card,
    List,
    Select,
    Button,
    Typography,
    Space,
    Divider,
    Modal,
    Tag,
    Collapse,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {useState} from "react";
import {Navbar} from "../components/common/Navbar.tsx";
import {Link} from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const statusColors: Record<string, string> = {
    Pending: "default",
    Processed: "blue",
    Shipped: "orange",
    Delivered: "green",
    Cancelled: "red",
};

const statusOptions = ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"];

const initialOrders = [
    {
        id: "ORD-001",
        buyerName: "Alice Johnson",
        status: "Processed",
        items: [
            { name: "Wireless Mouse", quantity: 2 },
            { name: "Laptop Stand", quantity: 1 },
        ],
        total: 89.99,
        shippingAddress: "123 Main St, Springfield",
    },
    {
        id: "ORD-002",
        buyerName: "Bob Smith",
        status: "Shipped",
        items: [{ name: "Bluetooth Keyboard", quantity: 1 }],
        total: 45.0,
        shippingAddress: "456 Oak Rd, Rivertown",
    },
];

export default function OrderManagementPage(){
    const [orders, setOrders] = useState(initialOrders);
    const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        newStatus: string;
        orderId: string | null;
    }>({
        visible: false,
        newStatus: "",
        orderId: null,
    });

    const toggleExpand = (id: string) => {
        setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const confirmStatusChange = () => {
        if (!statusModal.orderId) return;

        setOrders((prev) =>
            prev.map((order) =>
                order.id === statusModal.orderId
                    ? { ...order, status: statusModal.newStatus }
                    : order
            )
        );

        setStatusModal({ visible: false, newStatus: "", orderId: null });
    };

    return (
        <>
            <Navbar/>
            <div style={{padding: 24}}>
                <Title level={2}>Order Management</Title>

                <List
                    dataSource={orders}
                    renderItem={(order) => (
                        <Card
                            key={order.id}
                            style={{ marginBottom: 16 }}
                            title={
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Space direction="vertical" size={4}>
                                        <Text strong>Order #{order.id}</Text>
                                        <Text type="secondary">Buyer: {order.buyerName}</Text>
                                        <Button
                                            type="link"
                                            icon={expandedOrders[order.id] ? <UpOutlined /> : <DownOutlined />}
                                            onClick={() => toggleExpand(order.id)}
                                            style={{ padding: 0 }}
                                        >
                                            {expandedOrders[order.id] ? "View Less" : "View More"}
                                        </Button>
                                    </Space>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Tag color={statusColors[order.status]}>{order.status}</Tag>
                                        <Select
                                            defaultValue={order.status}
                                            style={{ width: 150 }}
                                            onChange={(value) =>
                                                setStatusModal({
                                                    visible: true,
                                                    newStatus: value,
                                                    orderId: order.id,
                                                })
                                            }
                                        >
                                            {statusOptions.map((status) => (
                                                <Option key={status} value={status}>
                                                    {status}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            }
                        >
                            {expandedOrders[order.id] && (
                                <>
                                    <Collapse defaultActiveKey={["1"]}>
                                        <Panel header="Items Purchased" key="1">
                                            <ul style={{ marginLeft: 16 }}>
                                                {order.items.map((item, index) => (
                                                    <li key={index}>
                                                        <Link to={`/product-management`}>
                                                            {item.name}
                                                        </Link>{" "}
                                                        × {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Panel>
                                    </Collapse>

                                    <Divider />

                                    <Space direction="vertical" style={{ width: "100%" }}>
                                        <Text>Total: ${order.total.toFixed(2)}</Text>
                                        <Text type="secondary">Shipping Address:</Text>
                                        <Text>{order.shippingAddress}</Text>
                                    </Space>
                                </>
                            )}
                        </Card>
                    )}
                />

                <Modal
                    title="Confirm Status Change"
                    open={statusModal.visible}
                    onOk={confirmStatusChange}
                    onCancel={() =>
                        setStatusModal({visible: false, newStatus: "", orderId: null})
                    }
                    okText="Confirm"
                >
                    <p>
                        Are you sure you want to change the status to{" "}
                        <Tag color={statusColors[statusModal.newStatus]}>
                            {statusModal.newStatus}
                        </Tag>
                        ?
                    </p>
                </Modal>
            </div>
        </>
    );
};
