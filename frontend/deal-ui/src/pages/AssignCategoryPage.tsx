import { Card, Typography, Modal, Select, Button, message } from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface Seller {
    id: string;
    name: string;
    assignedCategory?: string;
}

interface Category {
    id: string;
    name: string;
}

export default function AssignCategoryPage() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchSellers();
        fetchCategories();
    }, []);

    const fetchSellers = () => {
        const mockSellers = [
            { id: 's1', name: 'Techify Ltd' },
            { id: 's2', name: 'GreenGoods' },
            { id: 's3', name: 'UrbanOutlets' },
        ];
        setSellers(mockSellers);
    };

    const fetchCategories = () => {
        const mockCategories = [
            { id: 'c1', name: 'Electronics' },
            { id: 'c2', name: 'Clothing' },
            { id: 'c3', name: 'Home & Garden' },
        ];
        setCategories(mockCategories);
    };

    const openModal = (seller: Seller) => {
        setSelectedSeller(seller);
        setSelectedCategory(seller.assignedCategory || null);
        setModalVisible(true);
    };

    const handleAssignCategory = () => {
        if (!selectedCategory || !selectedSeller) {
            message.warning('Please select a category.');
            return;
        }

        const updatedSellers = sellers.map(s =>
            s.id === selectedSeller.id ? { ...s, assignedCategory: selectedCategory } : s
        );
        setSellers(updatedSellers);
        setModalVisible(false);
        setSelectedSeller(null);
        setSelectedCategory(null);
    };

    return (
        <div style={{ margin: '40px auto'}}>
            <Title level={3} style={{ textAlign: 'center', paddingBottom:'10px' }}>
                Assign Categories to Sellers
            </Title>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sellers.map(seller => (
                    <Card
                        key={seller.id}
                        style={{
                            border: '1px solid black',
                            borderRadius: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>{seller.name}</Title>
                                <Text type={seller.assignedCategory ? 'success' : 'secondary'}>
                                    {seller.assignedCategory
                                        ? `Assigned to: ${categories.find(c => c.id === seller.assignedCategory)?.name}`
                                        : 'No category assigned'}
                                </Text>
                            </div>

                            <Button type="link" onClick={() => openModal(seller)}>
                                {seller.assignedCategory ? 'Update Category' : 'Add Category'}
                            </Button>
                        </div>
                    </Card>

                ))}
            </div>

            <Modal
                title={`Assign Category to ${selectedSeller?.name}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleAssignCategory}
                okText="Assign"
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a category"
                    value={selectedCategory || undefined}
                    onChange={value => setSelectedCategory(value)}
                >
                    {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
}
