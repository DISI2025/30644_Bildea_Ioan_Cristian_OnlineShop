import React, {useState} from 'react';
import {
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Skeleton,
    Spin,
    Tag,
    theme,
    Tooltip,
    Typography
} from 'antd';
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons';
import {Product, ProductCategory} from '../../types/entities';
import {FormInstance} from 'antd/lib/form';
import {ProductFormData, UpdateProductRequest} from '../../types/transfer';
import {
    imageUrlRules,
    productCategoryRules,
    productDescriptionRules,
    productPriceRules,
    productStockRules,
    productTitleRules
} from '../../utils/validators';
import ImageUpload from '../common/ImageUpload';

const {Text, Title, Paragraph} = Typography;
const {useToken} = theme;

interface ProductListProps {
    products: Product[];
    productCategories: ProductCategory[];
    loading: boolean;
    editingProductId: string | null;
    onUpdate: (values: UpdateProductRequest) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onStartEdit: (product: Product) => void;
    onCancelEdit: () => void;
    updateForm: FormInstance;
    onAdd?: (values: ProductFormData) => Promise<void>;
    form?: FormInstance;
}

const ProductList: React.FC<ProductListProps> = ({
                                                     products,
                                                     productCategories,
                                                     loading,
                                                     onUpdate,
                                                     onDelete,
                                                     onStartEdit,
                                                     onCancelEdit,
                                                     updateForm,
                                                     onAdd,
                                                 }) => {
    const {token} = useToken();
    const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [addForm] = Form.useForm();

    const handleImageLoad = (productId: string) => {
        setLoadingImages(prev => ({
            ...prev,
            [productId]: false
        }));
    };

    const handleImageError = (productId: string) => {
        setLoadingImages(prev => ({
            ...prev,
            [productId]: false
        }));
    };

    const showProductDetails = (product: Product) => {
        setSelectedProduct(product);
        setDetailsModalVisible(true);
    };

    const closeDetailsModal = () => {
        setDetailsModalVisible(false);
    };

    const showEditModal = (product: Product) => {
        setSelectedProduct(product);
        onStartEdit(product);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        onCancelEdit();
    };

    const showAddModal = () => {
        addForm.resetFields();
        setAddModalVisible(true);
    };

    const closeAddModal = () => {
        setAddModalVisible(false);
        addForm.resetFields();
    };

    const handleAddSubmit = async (values: ProductFormData) => {
        if (onAdd) {
            try {
                await onAdd(values);
                setAddModalVisible(false);
                addForm.resetFields();
            } catch (error) {
                console.error("Error adding product:", error);
            }
        } else {
            console.warn('onAdd function is not provided to ProductList component');
        }
    };

    const handleEditSubmit = async (values: UpdateProductRequest) => {
        // Ensure sellerId is included in the request
        const updatedValues = {
            ...values,
            sellerId: selectedProduct?.sellerId || ''
        };
        await onUpdate(updatedValues);
        setEditModalVisible(false);
    };

    const getCategoryName = (categoryId: string): string => {
        const category = productCategories.find(c => c.id === categoryId);
        return category ? category.categoryName : 'Unknown';
    };

    const getCategoryColor = (categoryId: string): string => {
        const colors = [
            'magenta', 'red', 'volcano', 'orange', 'gold',
            'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'
        ];
        
        // Get index based on category position in the array, or hash the ID if not found
        const index = productCategories.findIndex(c => c.id === categoryId);
        if (index >= 0) {
            return colors[index % colors.length];
        }
        
        // Fallback to hash-based color
        const hash = categoryId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const renderEditForm = (product: Product) => (
        <Form
            form={updateForm}
            onFinish={handleEditSubmit}
            layout="vertical"
            initialValues={{
                ...product,
                categories: product.categories.map(cat => cat.categoryName)
            }}
        >
            <Form.Item
                name="id"
                hidden
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="title"
                label="Product Name"
                rules={productTitleRules}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={productDescriptionRules}
            >
                <Input.TextArea rows={4}/>
            </Form.Item>

            <Form.Item
                name="price"
                label="Price"
                rules={productPriceRules}
            >
                <InputNumber min={0} step={0.01} style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item
                name="stock"
                label="Stock"
                rules={productStockRules}
            >
                <InputNumber min={0} style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item
                name="categories"
                label="Categories"
                rules={productCategoryRules}
            >
                <Select mode="multiple">
                    {productCategories.map(category => (
                        <Select.Option key={category.id} value={category.categoryName}>
                            {category.categoryName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="imageUrl"
                label="Product Image"
                rules={imageUrlRules}
            >
                <ImageUpload placeholder="Upload Product Image"/>
            </Form.Item>
        </Form>
    );

    const renderAddForm = () => (
        <Form
            form={addForm}
            onFinish={handleAddSubmit}
            layout="vertical"
            initialValues={{
                price: 0,
                stock: 0
            }}
        >
            <Form.Item
                name="title"
                label="Product Name"
                rules={productTitleRules}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={productDescriptionRules}
            >
                <Input.TextArea rows={4}/>
            </Form.Item>

            <Form.Item
                name="price"
                label="Price"
                rules={productPriceRules}
            >
                <InputNumber min={0} step={0.01} style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item
                name="stock"
                label="Stock"
                rules={productStockRules}
            >
                <InputNumber min={0} style={{width: '100%'}}/>
            </Form.Item>

            <Form.Item
                name="categories"
                label="Categories"
                rules={productCategoryRules}
            >
                <Select mode="multiple">
                    {productCategories.map(category => (
                        <Select.Option key={category.id} value={category.categoryName}>
                            {category.categoryName}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="imageUrl"
                label="Product Image"
                rules={imageUrlRules}
            >
                <ImageUpload placeholder="Upload Product Image"/>
            </Form.Item>
        </Form>
    );

    const renderProductCard = (product: Product) => {
        if (loadingImages[product.id] === undefined) {
            setLoadingImages(prev => ({
                ...prev,
                [product.id]: true
            }));
        }

        const isLoading = loadingImages[product.id];
        const stockStatus = product.stock > 0
            ? (product.stock < 10 ? 'low' : 'in')
            : 'out';

        return (
            <Badge.Ribbon
                text={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                color={stockStatus === 'out' ? 'red' : stockStatus === 'low' ? 'orange' : 'green'}
            >
                <Card
                    key={product.id}
                    hoverable
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: 8,
                        boxShadow: token.boxShadow,
                        background: token.colorBgContainer,
                        color: token.colorText
                    }}
                    cover={
                        <div
                            style={{
                                paddingTop: '75%', // 4:3 aspect ratio
                                position: 'relative',
                                backgroundColor: token.colorBgContainer,
                                overflow: 'hidden'
                            }}
                        >
                            {isLoading && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Skeleton.Image active style={{width: '100%', height: '100%'}}/>
                                </div>
                            )}
                            <img
                                alt={product.title}
                                src={product.imageUrl}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease',
                                    opacity: isLoading ? 0 : 1
                                }}
                                onLoad={() => handleImageLoad(product.id)}
                                onError={() => handleImageError(product.id)}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 16,
                                gap: 8
                            }}>
                                <Tooltip title="View details">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EyeOutlined/>}
                                        size="middle"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            color: token.colorPrimary,
                                            border: 'none'
                                        }}
                                        onClick={() => showProductDetails(product)}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    }
                    bodyStyle={{
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflow: 'hidden',
                        background: token.colorBgContainer,
                        color: token.colorText
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        color: token.colorText
                    }}>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 4,
                            marginBottom: 8
                        }}>
                            {product.categories.map(cat => (
                                <Tag
                                    key={cat.id}
                                    color={getCategoryColor(cat.id)}
                                >
                                    {cat.categoryName}
                                </Tag>
                            ))}
                        </div>

                        <Title
                            level={5}
                            ellipsis={{rows: 1}}
                            style={{
                                margin: 0,
                                lineHeight: 1.4,
                                color: token.colorText,
                                marginBottom: 8
                            }}
                        >
                            {product.title}
                        </Title>

                        <Paragraph
                            ellipsis={{rows: 2, expandable: false}}
                            style={{
                                fontSize: 14,
                                color: token.colorTextSecondary,
                                marginTop: 0,
                                marginBottom: 16,
                                height: '3em',  // Fixed height for 2 lines
                                overflow: 'hidden'
                            }}
                        >
                            {product.description}
                        </Paragraph>

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: token.colorPrimary,
                                marginBottom: 16
                            }}
                        >
                            ${product.price.toFixed(2)}
                        </Text>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 8,
                            marginTop: 'auto'
                        }}>
                            <Button
                                icon={<EditOutlined/>}
                                onClick={() => showEditModal(product)}
                                style={{
                                    flex: 1,
                                    borderRadius: 4,
                                    height: 32
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                icon={<DeleteOutlined/>}
                                onClick={() => onDelete(product.id)}
                                danger
                                style={{
                                    flex: 1,
                                    borderRadius: 4,
                                    height: 32
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            </Badge.Ribbon>
        );
    };

    const renderDetailsModal = () => {
        if (!selectedProduct) return null;

        return (
            <Modal
                title={<Title level={3}>{selectedProduct.title}</Title>}
                open={detailsModalVisible}
                onCancel={closeDetailsModal}
                footer={null}
                width={800}
            >
                <Row gutter={[24, 24]}>
                    <Col span={12}>
                        <div style={{
                            width: '100%',
                            height: '300px',
                            overflow: 'hidden',
                            borderRadius: token.borderRadiusLG,
                            backgroundColor: token.colorBgContainer,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 4,
                            marginBottom: 8
                        }}>
                            {selectedProduct.categories.map(cat => (
                                <Tag
                                    key={cat.id}
                                    color={getCategoryColor(cat.id)}
                                >
                                    {getCategoryName(cat.id)}
                                </Tag>
                            ))}
                        </div>

                        <Title level={2} style={{margin: `${token.marginSM}px 0`}}>
                            {selectedProduct.title}
                        </Title>

                        <Title level={3} type="secondary" style={{color: token.colorPrimary}}>
                            ${selectedProduct.price.toFixed(2)}
                        </Title>

                        <div style={{margin: `${token.marginLG}px 0`}}>
                            <Tag
                                color={selectedProduct.stock > 0 ?
                                    (selectedProduct.stock < 10 ? 'orange' : 'green') :
                                    'red'
                                }
                                style={{padding: '4px 8px', fontSize: token.fontSizeLG}}
                            >
                                {selectedProduct.stock > 0 ?
                                    `${selectedProduct.stock} in stock` :
                                    'Out of stock'
                                }
                            </Tag>
                        </div>

                        <Divider orientation="left">Description</Divider>

                        <Paragraph style={{fontSize: token.fontSize}}>
                            {selectedProduct.description}
                        </Paragraph>

                        <Divider/>

                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button
                                type="primary"
                                icon={<EditOutlined/>}
                                onClick={() => {
                                    showEditModal(selectedProduct);
                                    closeDetailsModal();
                                }}
                            >
                                Edit Product
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined/>}
                                onClick={() => onDelete(selectedProduct.id)}
                            >
                                Delete Product
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    };

    const renderEditModal = () => {
        if (!selectedProduct) return null;

        return (
            <Modal
                title={<Title level={4}>Edit Product</Title>}
                open={editModalVisible}
                onCancel={closeEditModal}
                width={700}
                footer={[
                    <Button key="cancel" onClick={closeEditModal}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        icon={<SaveOutlined/>}
                        onClick={() => updateForm.submit()}
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                ]}
            >
                {renderEditForm(selectedProduct)}
            </Modal>
        );
    };

    const renderAddModal = () => (
        <Modal
            title={<Title level={4}>Add New Product</Title>}
            open={addModalVisible}
            onCancel={closeAddModal}
            width={700}
            footer={[
                <Button key="cancel" onClick={closeAddModal}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => addForm.submit()}
                    loading={loading}
                >
                    Add Product
                </Button>
            ]}
        >
            {renderAddForm()}
        </Modal>
    );

    return (
        <div style={{width: '100%'}}>
            <div style={{marginBottom: 24}}>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={showAddModal}
                    size="large"
                >
                    Add New Product
                </Button>
            </div>

            {loading ? (
                <Spin tip="Loading...">
                    <div style={{padding: '50px', textAlign: 'center'}}/>
                </Spin>
            ) : products.length === 0 ? (
                <Card>
                    <Empty
                        description="No products found"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={showAddModal}
                        >
                            Add Product
                        </Button>
                    </Empty>
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    {products.map(product => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                            {renderProductCard(product)}
                        </Col>
                    ))}
                </Row>
            )}

            {renderDetailsModal()}
            {renderEditModal()}
            {renderAddModal()}
        </div>
    );
};

export default ProductList; 