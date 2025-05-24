import {useEffect, useMemo, useState} from "react";
import {Button, Card, Form, Layout, Result, Skeleton, theme, Typography, Row, Col, Drawer} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "../context/SnackbarContext";
import {FilterOutlined} from "@ant-design/icons";
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
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const searchText = useSelector(selectSearchText);
    const sortOrder = useSelector(selectSortOrder);
    const isAddPanelOpen = useSelector(selectIsAddPanelOpen);
    const editingProductCategoryId = useSelector(selectEditingProductCategoryId);

    const [form] = Form.useForm<CreateProductCategoryRequest>();
    const [updateForm] = Form.useForm<ProductCategory>();

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

    const FiltersContent = () => (
        <Card title="Filters" variant="borderless" style={{marginBottom: '1rem'}}>
            <ProductCategoryFilter onSortChange={handleSortChange}/>
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
                    Manage Product Categories
                </Title>

                <Row gutter={[16, 16]} style={{ marginBottom: '2rem' }}>
                    <Col xs={24} md={18}>
                        <ProductCategorySearch onSearch={handleSearchChange}/>
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
                    </Col>
                </Row>

                {/* Mobile Filters Drawer */}
                <Drawer
                    title="Filters"
                    placement="right"
                    closable={true}
                    onClose={() => setFiltersVisible(false)}
                    open={filtersVisible}
                    width={300}
                    bodyStyle={{ padding: '16px' }}
                >
                    <ProductCategoryFilter onSortChange={handleSortChange}/>
                </Drawer>
            </Content>
        </Layout>
    );
}