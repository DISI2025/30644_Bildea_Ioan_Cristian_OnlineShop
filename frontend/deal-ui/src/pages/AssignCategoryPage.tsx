import {useMemo, useState} from 'react';
import {Button, Card, Empty, Layout, Select, Space, Spin, Tag, theme, Typography} from 'antd';
import {CloseOutlined, EditOutlined, SaveOutlined, ShopOutlined} from '@ant-design/icons';
import UserSearch from '../components/common/UserSearch';
import {useAssignUserCategoriesMutation, useGetProductCategoriesQuery, useGetUsersQuery} from '../store/api';
import {useSnackbar} from '../context/SnackbarContext';
import {MainUser, UserRole} from '../types/entities';
import {AssignProductCategoryRequest, BaseResponse} from '../types/transfer';

const {Title, Text} = Typography;
const {Content} = Layout;

export default function AssignCategoryPage() {
    const {token} = theme.useToken();
    const {showSuccess, showDealErrors} = useSnackbar();

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

    const [assignUserCategories, {isLoading: isAssigning}] = useAssignUserCategoriesMutation();

    const sellersOnly = useMemo(() => {
        const allUsers = usersResponse?.payload || [];
        return allUsers.filter(user =>
            user.role !== UserRole.ADMIN &&
            user.storeAddress &&
            user.storeAddress.trim() !== ''
        );
    }, [usersResponse?.payload]);

    const categories = useMemo(() => categoriesResponse?.payload || [], [categoriesResponse?.payload]);

    const filteredUsers = useMemo(() => {
        if (!searchText) return sellersOnly;
        return sellersOnly.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [sellersOnly, searchText]);

    const handleSearchChange = (value: string): void => {
        setSearchText(value);
    };

    const startEditUser = (user: MainUser) => {
        setEditingUserId(user.id);
        const currentCategoryIds = user.productCategories?.map(cat => cat.id) ||
            (user as any).productCategoryIds || [];
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

    const getCategoryName = (categoryId: string): string => {
        const category = categories.find(c => c.id === categoryId);
        return category?.categoryName || 'Unknown Category';
    };

    const getUserCategoryIds = (user: MainUser): string[] => {
        if (user.productCategories && Array.isArray(user.productCategories)) {
            return user.productCategories.map(cat => cat.id);
        }
        return (user as any).productCategoryIds || [];
    };

    const renderUserCategories = (user: MainUser) => {
        const categoryIds = getUserCategoryIds(user);

        if (categoryIds.length === 0) {
            return (
                <Text type="secondary" italic>
                    No categories assigned
                </Text>
            );
        }

        return (
            <div style={{display: 'inline-flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px'}}>
                {categoryIds.map(categoryId => (
                    <Tag
                        key={categoryId}
                        color={getCategoryColor(categoryId)}
                    >
                        {getCategoryName(categoryId)}
                    </Tag>
                ))}
            </div>
        );
    };

    if (isLoadingUsers || isLoadingCategories) {
        return (
            <Layout>
                <Content style={{
                    padding: "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
                }}>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <Spin size="large"/>
                        <p style={{marginTop: '16px'}}>Loading sellers and categories...</p>
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
                <Title level={2} style={{textAlign: "center", marginBottom: "1rem"}}>
                    Product Category Assignment Manager
                </Title>

                <div style={{textAlign: "center", marginBottom: "2rem"}}>
                    <Text type="secondary" style={{fontSize: token.fontSizeLG}}>
                        Assign product categories to sellers only. Only users with store addresses can manage products.
                    </Text>
                </div>

                <UserSearch onSearch={handleSearchChange}/>

                {filteredUsers.length === 0 ? (
                    <Card style={{textAlign: 'center', padding: '40px'}}>
                        <Empty
                            description={searchText ? "No sellers found matching your search" : "No sellers found. Users need to set up their store address to appear here."}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Card>
                ) : (
                    <div style={{display: 'grid', gap: '16px'}}>
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
                                bodyStyle={{padding: '16px'}}
                            >
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{flex: 1}}>
                                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                            <Title level={4} style={{margin: 0, marginRight: '8px'}}>
                                                {user.fullName || user.username}
                                            </Title>
                                            <Tag color="green" icon={<ShopOutlined/>}>
                                                Seller
                                            </Tag>
                                        </div>

                                        <div style={{marginBottom: '8px'}}>
                                            <Text type="secondary" style={{fontSize: token.fontSizeSM}}>
                                                <strong>Store:</strong> {user.storeAddress}
                                            </Text>
                                        </div>

                                        <div style={{marginBottom: '8px'}}>
                                            {editingUserId === user.id ? (
                                                <div>
                                                    <Text strong style={{marginRight: '8px'}}>Assign Categories:</Text>
                                                    <Select
                                                        mode="multiple"
                                                        style={{width: '100%', minWidth: '300px', marginTop: '4px'}}
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
                                                </div>
                                            ) : (
                                                <div>
                                                    <Text strong style={{marginRight: '8px'}}>Categories:</Text>
                                                    {renderUserCategories(user)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{marginLeft: '16px'}}>
                                        {editingUserId === user.id ? (
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    icon={<SaveOutlined/>}
                                                    loading={isAssigning}
                                                    onClick={() => handleSaveCategories(user.id)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    icon={<CloseOutlined/>}
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </Button>
                                            </Space>
                                        ) : (
                                            <Button
                                                type="default"
                                                icon={<EditOutlined/>}
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
