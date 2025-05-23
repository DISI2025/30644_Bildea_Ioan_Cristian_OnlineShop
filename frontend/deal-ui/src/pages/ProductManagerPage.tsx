import {useMemo} from "react";
import {Card, Form, Layout, Skeleton, theme, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "../context/SnackbarContext";
import {Navbar} from "../components/common/Navbar";
import {Product} from "../types/entities";
import {BaseResponse, CreateProductRequest, ProductFormData, UpdateProductRequest} from "../types/transfer";
import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductCategoriesQuery,
    useGetProductsBySellerIdQuery,
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

const {Title} = Typography;
const {Content} = Layout;

export default function ProductManagerPage() {
    const {token} = theme.useToken();
    const {showSuccess, showDealErrors} = useSnackbar();
    const dispatch = useDispatch();
    const authState = useSelector(selectAuthState);
    const userId = authState.user?.id || '';

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
        return categoriesResponse?.payload || [];
    }, [categoriesResponse?.payload]);

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
                                form={form}
                            />
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
}
