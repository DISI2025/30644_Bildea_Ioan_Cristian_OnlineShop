import React, { useMemo, useState } from 'react';
import { 
    Card, 
    Typography, 
    Select, 
    Button, 
    Layout, 
    theme, 
    Skeleton, 
    Empty, 
    Space,
    Tag,
    Spin
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Navbar } from '../components/common/Navbar';
import UserSearch from '../components/common/UserSearch';
import { 
    useGetUsersQuery, 
    useGetProductCategoriesQuery, 
    useAssignUserCategoriesMutation 
} from '../store/api';
import { useSnackbar } from '../context/SnackbarContext';
import { MainUser, ProductCategory } from '../types/entities';
import { BaseResponse, AssignProductCategoryRequest } from '../types/transfer';

const { Title, Text } = Typography;
const { Content } = Layout;

export default function AssignCategoryPage() {
    const { token } = theme.useToken();
    const { showSuccess, showDealErrors } = useSnackbar();
    
    const [searchText, setSearchText] = useState('');
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
    const {
        data: usersResponse,
        isLoading: isLoadingUsers,
        refetch: refetchUsers
    } = useGetUsersQuery();

    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories
    } = useGetProductCategoriesQuery();

    const [assignUserCategories, { isLoading: isAssigning }] = useAssignUserCategoriesMutation();

    const users = useMemo(() => usersResponse?.payload || [], [usersResponse?.payload]);
    const categories = useMemo(() => categoriesResponse?.payload || [], [categoriesResponse?.payload]);

    const filteredUsers = useMemo(() => {
        if (!searchText) return users;
        return users.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [users, searchText]);

    const handleSearchChange = (value: string): void => {
        setSearchText(value);
    };

    const startEditUser = (user: MainUser) => {
        setEditingUserId(user.id);
        const currentCategoryIds = user.productCategories?.map(cat => cat.id) || [];
        setSelectedCategories(currentCategoryIds);
    };

    const cancelEdit = () => {
        setEditingUserId(null);
        setSelectedCategories([]);
    };

    const handleSaveCategories = async (userId: string) => {
        try {
            const request: AssignProductCategoryRequest = {
                userId,
                productCategoryIds: selectedCategories
            };

            await assignUserCategories(request).unwrap();
            showSuccess('Success', 'Categories assigned successfully');
            setEditingUserId(null);
            setSelectedCategories([]);
            refetchUsers();
        } catch (error) {
            showDealErrors((error as BaseResponse)?.errors);
        }
    };

    const getCategoryColor = (categoryId: string): string => {
        const colors = [
            'magenta', 'red', 'volcano', 'orange', 'gold',
            'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
        ];
        const index = categories.findIndex(c => c.id === categoryId);
        return colors[index % colors.length] || 'default';
    };

    if (isLoadingUsers || isLoadingCategories) {
        return (
            <Layout>
                <Content style={{
                    padding: "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
                }}>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px' }}>Loading users and categories...</p>
                    </div>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout>
            <Content style={{
                padding: "2rem",
                marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
            }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: "2rem" }}>
                    Product Category Assignment Manager
                </Title>

                <UserSearch onSearch={handleSearchChange} />

                {filteredUsers.length === 0 ? (
                    <Card style={{ textAlign: 'center', padding: '40px' }}>
                        <Empty 
                            description="No users found" 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {filteredUsers.map(user => (
                            <Card
                                key={user.id}
                                style={{
                                    background: token.colorBgContainer,
                                    borderRadius: token.borderRadiusLG,
                                    boxShadow: token.boxShadowSecondary,
                                    border: editingUserId === user.id ? `2px solid ${token.colorPrimary}` : `1px solid ${token.colorBorder}`,
                                    transition: 'all 0.3s ease'
                                }}
                                bodyStyle={{ padding: '16px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                                            {user.fullName || user.username}
                                        </Title>
                                        
                                        <div>
                                            <Text strong style={{ marginRight: '8px' }}>Categories:</Text>
                                            {editingUserId === user.id ? (
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '100%', minWidth: '300px' }}
                                                    placeholder="Select categories"
                                                    value={selectedCategories}
                                                    onChange={setSelectedCategories}
                                                    loading={isAssigning}
                                                >
                                                    {categories.map(category => (
                                                        <Select.Option key={category.id} value={category.id}>
                                                            {category.categoryName}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                                                    {user.productCategories && user.productCategories.length > 0 ? (
                                                        user.productCategories.map(category => (
                                                            <Tag
                                                                key={category.id}
                                                                color={getCategoryColor(category.id)}
                                                            >
                                                                {category.categoryName}
                                                            </Tag>
                                                        ))
                                                    ) : (
                                                        <Text type="secondary" italic>
                                                            No categories assigned
                                                        </Text>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginLeft: '16px' }}>
                                        {editingUserId === user.id ? (
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    icon={<SaveOutlined />}
                                                    loading={isAssigning}
                                                    onClick={() => handleSaveCategories(user.id)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    icon={<CloseOutlined />}
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </Button>
                                            </Space>
                                        ) : (
                                            <Button
                                                type="default"
                                                icon={<EditOutlined />}
                                                onClick={() => startEditUser(user)}
                                            >
                                                Edit Categories
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Content>
        </Layout>
    );
}
