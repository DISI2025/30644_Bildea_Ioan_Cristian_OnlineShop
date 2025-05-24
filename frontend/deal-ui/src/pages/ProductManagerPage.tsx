import {useMemo} from "react";
import {Card, Form, Layout, Skeleton, theme, Typography, Alert, Button, Space} from "antd";
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
import { ShopOutlined, SettingOutlined } from '@ant-design/icons';

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

    const searchText = useSelector(selectSearchText);
    const sortOrder = useSelector(selectSortOrder);
    const selectedCategoryId = useSelector(selectSelectedCategoryId);
    useSelector(selectIsAddPanelOpen);
    const editingProductId = useSelector(selectEditingProductId);

    const [form] = Form.useForm<CreateProductRequest>();
    const [updateForm] = Form.useForm<UpdateProductRequest>();

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
                    padding: "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
                }}>
                    <Title level={2} style={{textAlign: "center", marginBottom: "2rem"}}>
                        Manage Products
                    </Title>

                    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                        <Alert
                            message="Store Address Required"
                            description={
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div>
                                        To manage and sell products, you need to set up your store address in your profile.
                                        This helps customers know where your products are coming from.
                                    </div>
                                    <Button 
                                        type="primary" 
                                        icon={<SettingOutlined />}
                                        onClick={handleGoToProfile}
                                        size="large"
                                    >
                                        Set Up Store Address
                                    </Button>
                                </Space>
                            }
                            type="info"
                            showIcon
                            icon={<ShopOutlined />}
                            style={{ textAlign: 'left' }}
                        />
                    </Card>
                </Content>
            </Layout>
        );
    }

    // If user is a seller but has no assigned categories, show message to contact admin
    if (isSeller && !isLoadingUserProfile && !isLoadingCategories && availableCategories.length === 0) {
        return (
            <Layout>
                <Content style={{
                    padding: "2rem",
                    marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
                }}>
                    <Title level={2} style={{textAlign: "center", marginBottom: "2rem"}}>
                        Manage Products
                    </Title>

                    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                        <Alert
                            message="No Product Categories Assigned"
                            description={
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div>
                                        You don't have any product categories assigned to your account yet. 
                                        Please contact an administrator to assign categories before you can create or manage products.
                                    </div>
                                    <div>
                                        <strong>What you can sell:</strong> Only products in categories specifically assigned to you by an administrator.
                                    </div>
                                </Space>
                            }
                            type="warning"
                            showIcon
                            style={{ textAlign: 'left' }}
                        />
                    </Card>
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
                <Title level={2} style={{textAlign: "center", marginBottom: "2rem"}}>
                    Manage Products
                </Title>

                <ProductSearch onSearch={handleSearchChange}/>

                <div style={{display: "flex"}}>
                    <div style={{width: "250px"}}>
                        <Card title="Filters" variant="borderless" style={{marginBottom: '1rem'}}>
                            {isLoadingCategories || isLoadingUserProfile ? (
                                <Skeleton active/>
                            ) : (
                                <ProductFilter
                                    onSortChange={handleSortChange}
                                    onCategoryChange={handleCategoryChange}
                                    productCategories={availableCategories}
                                />
                            )}
                        </Card>
                    </div>

                    <div style={{
                        width: "2px",
                        backgroundColor: token.colorBorder,
                        margin: "0 16px",
                        minHeight: "100%"
                    }}/>

                    <div style={{flex: 1}}>
                        {isLoadingProducts || isLoadingUserProfile ? (
                            <Card>
                                <Skeleton active/>
                            </Card>
                        ) : (
                            <ProductList
                                products={filteredProducts}
                                productCategories={availableCategories}
                                loading={isLoadingProducts || isCreating || isUpdating || isDeleting}
                                editingProductId={editingProductId}
                                onUpdate={handleUpdateProduct}
                                onDelete={handleDeleteProduct}
                                onStartEdit={startEditProduct}
                                onCancelEdit={cancelEditProduct}
                                updateForm={updateForm}
                                onAdd={handleAddProduct}
                                form={form}
                            />
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
}
