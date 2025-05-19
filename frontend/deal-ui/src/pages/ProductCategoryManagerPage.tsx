import {useEffect, useMemo} from "react";
import {Button, Card, Form, Layout, Result, Skeleton, theme, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "../context/SnackbarContext";
import {
    useCreateProductCategoryMutation,
    useDeleteProductCategoryMutation,
    useGetProductCategoriesQuery,
    useUpdateProductCategoryMutation
} from "../store/api";
import {
    closeAddPanel,
    resetEditingState,
    selectEditingProductCategoryId,
    selectIsAddPanelOpen,
    selectSearchText,
    selectSortOrder,
    setEditingProductCategoryId,
    setSearchText,
    setSortOrder,
    toggleAddPanel
} from "../store/slices/product-category-slice";
import {ProductCategory} from "../types/entities";
import {BaseResponse, CreateProductCategoryRequest} from "../types/transfer";
import {Navbar} from "../components/common/Navbar";
import ProductCategorySearch from "../components/product-category/ProductCategorySearch.tsx";
import ProductCategoryFilter from "../components/product-category/ProductCategoryFilter.tsx";
import ProductCategoryAdd from "../components/product-category/ProductCategoryAdd.tsx";
import ProductCategoryList from "../components/product-category/ProductCategoryList.tsx";

const {Title} = Typography;
const {Content} = Layout;

export default function ProductCategoryManagerPage() {
    const {token} = theme.useToken();
    const {showSuccess, showDealErrors} = useSnackbar();
    const dispatch = useDispatch();

    const searchText = useSelector(selectSearchText);
    const sortOrder = useSelector(selectSortOrder);
    const isAddPanelOpen = useSelector(selectIsAddPanelOpen);
    const editingProductCategoryId = useSelector(selectEditingProductCategoryId);

    const [form] = Form.useForm<CreateProductCategoryRequest>();
    const [updateForm] = Form.useForm<ProductCategory>();

    const {
        data: categoriesResponse,
        isLoading,
        error: fetchError,
        refetch
    } = useGetProductCategoriesQuery();

    const [createProductCategory, {isLoading: isCreating}] = useCreateProductCategoryMutation();
    const [updateProductCategory, {isLoading: isUpdating}] = useUpdateProductCategoryMutation();
    const [deleteProductCategory, {isLoading: isDeleting}] = useDeleteProductCategoryMutation();

    useEffect(() => {
        if (!isCreating && !isUpdating && !isDeleting) {
            refetch();
        }
    }, [isCreating, isUpdating, isDeleting, refetch]);

    const handleToggleAddPanel = (): void => {
        dispatch(toggleAddPanel());
    };

    const handleSearchChange = (value: string): void => {
        dispatch(setSearchText(value));
    };

    const handleSortChange = (value: "asc" | "desc" | null): void => {
        dispatch(setSortOrder(value));
    };

    const handleAddCategory = async (values: CreateProductCategoryRequest): Promise<void> => {
        createProductCategory(values).unwrap()
            .then(() => {
                form.resetFields();
                dispatch(closeAddPanel());
                showSuccess('Success', 'Product category created successfully');
            }).catch((response: BaseResponse) => {
                showDealErrors(response?.errors);
            });
    };

    const startEditProductCategory = (product: ProductCategory): void => {
        dispatch(setEditingProductCategoryId(product.id));
        updateForm.setFieldsValue(product);
    };

    const cancelEditProductCategory = (): void => {
        dispatch(resetEditingState());
        updateForm.resetFields();
    };

    const handleUpdateProductCategory = async (values: ProductCategory): Promise<void> => {
        updateProductCategory(values).unwrap()
            .then(() => {
                dispatch(resetEditingState());
                showSuccess('Success', 'Product category updated successfully');
            }).catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
        });
    };

    const handleDeleteProductCategory = async (id: string): Promise<void> => {
        deleteProductCategory(id).unwrap()
            .then(() => {
                showSuccess('Success', 'Product category deleted successfully');
            }).catch((response: BaseResponse) => {
            showDealErrors(response?.errors);
        });
    };

    const filteredProductCategories = useMemo(() => {
        const productCategories = categoriesResponse?.payload || [];

        let results = productCategories.filter((category) =>
            category.categoryName.toLowerCase().includes(searchText.toLowerCase())
        );

        if (sortOrder) {
            results = [...results].sort((a, b) =>
                sortOrder === "asc"
                    ? a.categoryName.localeCompare(b.categoryName)
                    : b.categoryName.localeCompare(a.categoryName)
            );
        }

        return results;
    }, [categoriesResponse?.payload, searchText, sortOrder]);

    if (fetchError) {
        return (
            <Result
                status="error"
                title="Failed to load product categories"
                subTitle="There was an error loading the data. Please try again later."
                extra={[
                    <Button key="retry" type="primary" onClick={() => refetch()}>
                        Try Again
                    </Button>,
                ]}
            />
        );
    }

    return (
        <Layout>
            <Navbar/>
            <Content style={{
                padding: "2rem", 
                marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
            }}>
                <Title level={2} style={{textAlign: "center", marginBottom: "2rem"}}>
                    Manage Product Categories
                </Title>

                <ProductCategorySearch onSearch={handleSearchChange}/>

                <div style={{display: "flex"}}>
                    <div style={{width: "250px"}}>
                        <Card title="Filters" bordered={false} style={{marginBottom: '1rem'}}>
                            <ProductCategoryFilter onSortChange={handleSortChange}/>
                        </Card>
                    </div>

                    <div style={{
                        width: "2px",
                        backgroundColor: token.colorBorder,
                        margin: "0 16px",
                        minHeight: "100%"
                    }}/>

                    <div style={{flex: 1}}>
                        <ProductCategoryAdd
                            isAddPanelOpen={isAddPanelOpen}
                            toggleAddPanel={handleToggleAddPanel}
                            onFinish={handleAddCategory}
                            form={form}
                        />

                        {isLoading ? (
                            <Card>
                                <Skeleton active/>
                            </Card>
                        ) : (
                            <ProductCategoryList
                                productCategories={filteredProductCategories}
                                loading={isLoading || isCreating || isUpdating || isDeleting}
                                editingProductCategoryId={editingProductCategoryId}
                                onUpdate={handleUpdateProductCategory}
                                onDelete={handleDeleteProductCategory}
                                onStartEdit={startEditProductCategory}
                                onCancelEdit={cancelEditProductCategory}
                                updateForm={updateForm}
                            />
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
}