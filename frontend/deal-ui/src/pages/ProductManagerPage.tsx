import {useMemo, useState, useEffect} from "react";
import {Card, Form, Layout, Skeleton, theme, Typography, Alert, Button, Space, Row, Col, Drawer} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "../context/SnackbarContext";
import {Product} from "../types/entities";
import {BaseResponse, CreateProductRequest, ProductFormData, UpdateProductRequest} from "../types/transfer";
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductCategoriesQuery,
    useGetProductsBySellerIdQuery,
    useGetUserProfileQuery,
    useUpdateProductMutation
} from "../store/api";
import {
    resetEditingState,
    selectEditingProductId,
    selectIsAddPanelOpen,
    selectSearchText,
    selectSelectedCategoryId,
    selectSortOrder,
    setEditingProductId,
    setSearchText,
    setSelectedCategoryId,
    setSortOrder
} from "../store/slices/product-slice";
import ProductSearch from "../components/product-management/ProductSearch";
import ProductFilter from "../components/product-management/ProductFilter";
import ProductList from "../components/product-management/ProductList";
import {selectAuthState} from "../store/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { ShopOutlined, SettingOutlined, FilterOutlined } from '@ant-design/icons';

const {Title} = Typography;
const {Content} = Layout;

export default function ProductManagerPage() {
    const {token} = theme.useToken();
    const {showSuccess, showDealErrors} = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector(selectAuthState);
    const userId = authState.user?.id || '';
    const isSeller = authState.isSeller;
    
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const searchText = useSelector(selectSearchText);
    const sortOrder = useSelector(selectSortOrder);
    const selectedCategoryId = useSelector(selectSelectedCategoryId);
    useSelector(selectIsAddPanelOpen);
    const editingProductId = useSelector(selectEditingProductId);

    const [form] = Form.useForm<CreateProductRequest>();
    const [updateForm] = Form.useForm<UpdateProductRequest>();

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            setIsMobile(screenWidth < 768);
            // Close filters drawer if screen becomes large
            if (screenWidth >= 768) {
                setFiltersVisible(false);
            }
        };

        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        data: productsResponse,
        isLoading: isLoadingProducts,
        refetch: refetchProducts
    } = useGetProductsBySellerIdQuery(userId, {
        skip: !userId
    });

    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories
    } = useGetProductCategoriesQuery();

    const {
        data: userProfileResponse,
        isLoading: isLoadingUserProfile
    } = useGetUserProfileQuery(userId);

    const [createProduct, {isLoading: isCreating}] = useCreateProductMutation();
    const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation();
    const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation();

    const handleSearchChange = (value: string): void => {
        dispatch(setSearchText(value));
    };

    const handleSortChange = (value: "asc" | "desc" | null): void => {
        dispatch(setSortOrder(value));
    };

    const handleCategoryChange = (value: string | null): void => {
        dispatch(setSelectedCategoryId(value));
    };

    const startEditProduct = (product: Product): void => {
        dispatch(setEditingProductId(product.id));
        updateForm.setFieldsValue({
            ...product,
            categories: product.categories.map(cat => cat.categoryName)
        });
    };

    const cancelEditProduct = (): void => {
        dispatch(resetEditingState());
        updateForm.resetFields();
    };

    const handleUpdateProduct = async (values: UpdateProductRequest): Promise<void> => {
        updateProduct(values).unwrap()
            .then(() => {
                dispatch(resetEditingState());
                showSuccess('Success', 'Product updated successfully');
                refetchProducts();
            }).catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
        });
    };

    const handleDeleteProduct = async (id: string): Promise<void> => {
        deleteProduct(id).unwrap()
            .then(() => {
                showSuccess('Success', 'Product deleted successfully');
                refetchProducts();
            }).catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
        });
    };

    const handleAddProduct = async (values: ProductFormData): Promise<void> => {
        const productData: CreateProductRequest = {
            title: values.title,
            description: values.description,
            price: values.price,
            stock: values.stock,
            imageUrl: values.imageUrl,
            categories: values.categories,
            sellerId: userId
        };

        createProduct(productData).unwrap()
            .then(() => {
                showSuccess('Success', 'Product created successfully');
                form.resetFields();
                refetchProducts();
            }).catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
        });
    };

    const filteredProducts = useMemo(() => {
        const products = productsResponse?.payload || [];

        let results = [...products];

        if (searchText) {
            results = results.filter((product) =>
                product.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedCategoryId) {
            results = results.filter((product) =>
                product.categories.some(cat => cat.id === selectedCategoryId)
            );
        }

        if (sortOrder) {
            results = results.sort((a, b) =>
                sortOrder === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            );
        }

        return results;
    }, [productsResponse?.payload, searchText, selectedCategoryId, sortOrder]);

    const availableCategories = useMemo(() => {
        const allCategories = categoriesResponse?.payload || [];
        const userProfile = userProfileResponse?.payload;
        const userCategories = userProfile?.productCategories || [];
        
        // Filter to only show categories assigned to the current user
        if (userCategories.length === 0) {
            // If user has no assigned categories, show empty array
            return [];
        }
        
        // Return only categories that are assigned to the current user
        const userCategoryIds = userCategories.map(cat => cat.id);
        return allCategories.filter(category => userCategoryIds.includes(category.id));
    }, [categoriesResponse?.payload, userProfileResponse?.payload]);

    const handleGoToProfile = () => {
        const username = authState.user?.username;
        if (username) {
            navigate(`/profile/${username}`);
        }
    };

    // If user is not a seller, show message to set up store
    if (!isSeller) {
        return (
            <Layout>
                <Content style={{
                    padding: isMobile ? "1rem" : "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + ${isMobile ? '1rem' : '2rem'})`,
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Card style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <ShopOutlined style={{ fontSize: 64, color: token.colorPrimary }} />
                            <Title level={3}>Set Up Your Store</Title>
                            <Alert
                                message="Seller Account Required"
                                description="To manage products, you need to set up your seller account first. Please go to your profile and complete the seller registration process."
                                type="info"
                                showIcon
                            />
                            <Space size="middle" direction={isMobile ? "vertical" : "horizontal"}>
                                <Button 
                                    type="primary" 
                                    icon={<SettingOutlined />} 
                                    onClick={handleGoToProfile}
                                    size={isMobile ? "large" : "middle"}
                                >
                                    Go to Profile
                                </Button>
                                <Button 
                                    onClick={() => navigate('/')}
                                    size={isMobile ? "large" : "middle"}
                                >
                                    Back to Home
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                </Content>
            </Layout>
        );
    }

    // Loading state
    if (isLoadingProducts || isLoadingCategories || isLoadingUserProfile) {
        return (
            <Layout>
                <Content style={{
                    padding: isMobile ? "1rem" : "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + ${isMobile ? '1rem' : '2rem'})`
                }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Content>
            </Layout>
        );
    }

    const FiltersContent = () => (
        <Card title="Filters" variant="borderless" style={{marginBottom: '1rem'}}>
            <ProductFilter 
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                productCategories={availableCategories}
            />
        </Card>
    );

    return (
        <Layout>
            <Content style={{
                padding: isMobile ? "1rem" : "2rem",
                marginTop: `calc(${token.layout.headerHeight}px + ${isMobile ? '1rem' : '2rem'})`
            }}>
                <Title level={2} style={{
                    textAlign: isMobile ? "center" : "left", 
                    marginBottom: "2rem"
                }}>
                    Manage Products
                </Title>

                <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
                    <Col xs={24} md={18}>
                        <ProductSearch onSearch={handleSearchChange}/>
                    </Col>
                    <Col xs={24} md={6}>
                        {isMobile && (
                            <Button
                                type="default"
                                icon={<FilterOutlined />}
                                onClick={() => setFiltersVisible(true)}
                                block
                            >
                                Filters
                            </Button>
                        )}
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    {!isMobile && (
                        <Col xs={24} md={6}>
                            <FiltersContent />
                        </Col>
                    )}
                    
                    <Col xs={24} md={!isMobile ? 18 : 24}>
                        {isLoadingProducts ? (
                            <Card>
                                <Skeleton active paragraph={{ rows: 4 }} />
                            </Card>
                        ) : (
                            <ProductList
                                products={filteredProducts}
                                loading={isLoadingProducts || isCreating || isUpdating || isDeleting}
                                editingProductId={editingProductId}
                                productCategories={availableCategories}
                                onUpdate={handleUpdateProduct}
                                onDelete={handleDeleteProduct}
                                onStartEdit={startEditProduct}
                                onCancelEdit={cancelEditProduct}
                                onAdd={handleAddProduct}
                                updateForm={updateForm}
                                form={form}
                            />
                        )}
                    </Col>
                </Row>

                {/* Mobile Filters Drawer */}
                <Drawer
                    title="Filters"
                    placement="right"
                    closable={true}
                    onClose={() => setFiltersVisible(false)}
                    open={filtersVisible}
                    width={Math.min(320, window.innerWidth * 0.85)}
                    bodyStyle={{ padding: '16px' }}
                >
                    <ProductFilter 
                        onSortChange={handleSortChange}
                        onCategoryChange={handleCategoryChange}
                        productCategories={availableCategories}
                    />
                </Drawer>
            </Content>
        </Layout>
    );
}
