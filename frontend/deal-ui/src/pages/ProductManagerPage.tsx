import {useEffect, useMemo} from "react";
import {Card, Form, Layout, Skeleton, theme, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "../context/SnackbarContext";
import {Navbar} from "../components/common/Navbar";
import {Product, ProductCategory} from "../types/entities";
import {BaseResponse, CreateProductRequest, UpdateProductRequest} from "../types/transfer";
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductCategoriesQuery,
    useGetProductsQuery,
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

const {Title} = Typography;
const {Content} = Layout;

// TODO Delete after integration with be, Mock data for products when API doesn't return any
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Smartphone X Pro",
        description: "Latest flagship smartphone with advanced camera system and powerful processor",
        price: 999.99,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500",
        categoryId: "smartphones"
    },
    {
        id: "2",
        name: "Ultra HD Smart TV",
        description: "65-inch 4K Ultra HD smart television with HDR and voice control",
        price: 799.50,
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=500",
        categoryId: "tv"
    },
    {
        id: "3",
        name: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
        price: 349.99,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=500",
        categoryId: "audio"
    },
    {
        id: "4",
        name: "Professional Blender",
        description: "High-performance blender for smoothies, soups, and more with multiple speed settings",
        price: 129.95,
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1544233726-9f1d2c27c022?q=80&w=500",
        categoryId: "kitchen"
    },
    {
        id: "5",
        name: "Gaming Laptop",
        description: "Powerful gaming laptop with RGB keyboard, 16GB RAM and dedicated graphics card",
        price: 1299.00,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500",
        categoryId: "computers"
    },
    {
        id: "6",
        name: "Fitness Smartwatch",
        description: "Water-resistant smartwatch with heart rate monitor, GPS, and week-long battery life",
        price: 199.99,
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=500",
        categoryId: "wearables"
    },
    {
        id: "7",
        name: "Electric Coffee Grinder",
        description: "Stainless steel coffee grinder with adjustable settings for perfect coffee grounds",
        price: 49.95,
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500",
        categoryId: "kitchen"
    },
    {
        id: "8",
        name: "Wireless Charging Pad",
        description: "Fast charging wireless pad compatible with all Qi-enabled devices",
        price: 29.99,
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1622086674543-36464c8aaabc?q=80&w=500",
        categoryId: "accessories"
    }
];

// TODO Delete after integration with be, Mock data for product categories when API doesn't return any
const MOCK_CATEGORIES: ProductCategory[] = [
    {id: "smartphones", categoryName: "Smartphones"},
    {id: "tv", categoryName: "Televisions"},
    {id: "audio", categoryName: "Audio Devices"},
    {id: "kitchen", categoryName: "Kitchen Appliances"},
    {id: "computers", categoryName: "Computers & Laptops"},
    {id: "wearables", categoryName: "Wearable Technology"},
    {id: "accessories", categoryName: "Accessories"}
];

export default function ProductManagerPage() {
    const {token} = theme.useToken();
    const {showSuccess, showDealErrors} = useSnackbar();
    const dispatch = useDispatch();

    const searchText = useSelector(selectSearchText);
    const sortOrder = useSelector(selectSortOrder);
    const selectedCategoryId = useSelector(selectSelectedCategoryId);
    const isAddPanelOpen = useSelector(selectIsAddPanelOpen);
    const editingProductId = useSelector(selectEditingProductId);

    const [form] = Form.useForm<CreateProductRequest>();
    const [updateForm] = Form.useForm<UpdateProductRequest>();

    const {
        data: productsResponse,
        isLoading: isLoadingProducts,
        refetch: refetchProducts
    } = useGetProductsQuery();

    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories
    } = useGetProductCategoriesQuery();

    const [createProduct, {isLoading: isCreating}] = useCreateProductMutation();
    const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation();
    const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation();

    useEffect(() => {
        if (!isCreating && !isUpdating && !isDeleting) {
            refetchProducts();
        }
    }, [isCreating, isUpdating, isDeleting, refetchProducts]);
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
        updateForm.setFieldsValue(product);
    };

    const cancelEditProduct = (): void => {
        dispatch(resetEditingState());
        updateForm.resetFields();
    };

    const handleUpdateProduct = async (values: UpdateProductRequest): Promise<void> => {
        // TODO: Implement API call to update product
        await updateProduct(values).unwrap()
            .then(() => {
                dispatch(resetEditingState());
                showSuccess('Success', 'Product updated successfully');
            }).catch((response: BaseResponse) => {
                showDealErrors(response?.errors);
            });
    };

    const handleDeleteProduct = async (id: string): Promise<void> => {
        // TODO: Implement API call to delete product
        await deleteProduct(id).unwrap()
            .then(() => {
                showSuccess('Success', 'Product deleted successfully');
            }).catch((response: BaseResponse) => {
                showDealErrors(response?.errors);
            });
    };

    const handleAddProduct = async (values: Omit<Product, 'id'>): Promise<void> => {
        // TODO: Implement API call to create product
        /* 
        When BE is ready:
        await createProduct(values).unwrap()
            .then(() => {
                showSuccess('Success', 'Product created successfully');
                dispatch(closeAddPanel());
            }).catch((response: BaseResponse) => {
                showDealErrors(response?.errors);
            });
        */
        console.log('Would create product with values:', values);
        console.log('Create product functionality not yet fully implemented');
        showSuccess('Demo', 'Product creation is in development');
    };

    // TODO Check with BE to integrate on server for now filter and sort products here
    const filteredProducts = useMemo(() => {
        // Use API data if available, otherwise use mock data
        const products = productsResponse?.payload?.length ? productsResponse.payload : MOCK_PRODUCTS;

        let results = [...products];

        // Filter by search text
        if (searchText) {
            results = results.filter((product) =>
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategoryId) {
            results = results.filter((product) =>
                product.categoryId === selectedCategoryId
            );
        }

        // Sort by name
        if (sortOrder) {
            results = results.sort((a, b) =>
                sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }

        return results;
    }, [productsResponse?.payload, searchText, selectedCategoryId, sortOrder]);

    // Use API categories if available, otherwise use mock categories
    const availableCategories = useMemo(() => {
        return categoriesResponse?.payload?.length ? categoriesResponse.payload : MOCK_CATEGORIES;
    }, [categoriesResponse?.payload]);

    return (
        <Layout>
            <Navbar/>
            <Content style={{padding: "2rem"}}>
                <Title level={2} style={{textAlign: "center", marginBottom: "2rem"}}>
                    Manage Products
                </Title>

                <ProductSearch onSearch={handleSearchChange}/>

                <div style={{display: "flex"}}>
                    <div style={{width: "250px"}}>
                        <Card title="Filters" bordered={false} style={{marginBottom: '1rem'}}>
                            {isLoadingCategories ? (
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
                        {isLoadingProducts ? (
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
                            />
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
}
