import {useEffect} from 'react';
import {Button, Col, Layout, Result, Row, Spin, theme} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetProductByIdQuery, useGetProductCategoriesQuery, useGetProductsBySellerIdQuery} from '../store/api';
import {ProductGallery} from '../components/product/ProductGallery';
import {ProductInfo} from '../components/product/ProductInfo';
import {RelatedProducts} from '../components/product/RelatedProducts';
import {ROUTES} from '../routes/AppRouter';

const {Content} = Layout;
const { useToken } = theme;

export default function ProductDetailPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {token} = useToken();

    const {
        data: productResponse,
        isLoading: isLoadingProduct,
        error: productError,
        refetch: refetchProduct
    } = useGetProductByIdQuery(id || '', {
        skip: !id
    });

    const {
        data: categoriesResponse,
        isLoading: isLoadingCategories
    } = useGetProductCategoriesQuery();

    const sellerId = productResponse?.payload?.sellerId || '';
    const {
        data: relatedProductsResponse,
        isLoading: isLoadingRelatedProducts
    } = useGetProductsBySellerIdQuery(sellerId, {
        skip: !sellerId
    });

    useEffect(() => {
        if (id) {
            refetchProduct();
        }
    }, [id, refetchProduct]);

    const product = productResponse?.payload;
    const categories = categoriesResponse?.payload || [];
    const relatedProducts = relatedProductsResponse?.payload || [];

    const contentStyles = {
        padding: token.paddingLG,
        marginTop: `calc(${token.layout.headerHeight}px + ${token.marginLG}px)`,
        minHeight: `calc(100vh - ${token.layout.headerHeight}px)`,
        backgroundColor: token.colorBgLayout
    };

    if (isLoadingProduct || isLoadingCategories) {
        return (
            <Layout>
                <Content style={{
                    ...contentStyles,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Spin size="large"/>
                </Content>
            </Layout>
        );
    }

    if (productError || !product) {
        return (
            <Layout>
                <Content style={contentStyles}>
                    <Result
                        status="404"
                        title="Product Not Found"
                        subTitle="Sorry, the product you visited does not exist."
                        extra={
                            <Button type="primary" onClick={() => navigate(ROUTES.HOME)}>
                                Back Home
                            </Button>
                        }
                    />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout>
            <Content style={contentStyles}>
                <div style={{maxWidth: '1400px', margin: '0 auto'}}>
                    <Row gutter={[token.marginLG, token.marginLG]}>
                        <Col xs={24} lg={12}>
                            <ProductGallery
                                imageUrl={product.imageUrl}
                                title={product.title}
                                productId={product.id}
                                stock={product.stock}
                                price={product.price}
                            />
                        </Col>

                        <Col xs={24} lg={12}>
                            <ProductInfo
                                product={product}
                                categories={categories}
                            />
                        </Col>
                    </Row>

                    <RelatedProducts
                        sellerId={product.sellerId}
                        currentProductId={product.id}
                        products={relatedProducts}
                        loading={isLoadingRelatedProducts}
                    />
                </div>
            </Content>
        </Layout>
    );
}
