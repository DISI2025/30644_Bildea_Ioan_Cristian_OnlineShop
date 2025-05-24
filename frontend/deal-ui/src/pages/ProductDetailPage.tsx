import {useEffect} from 'react';
import {Button, Col, Result, Row, Spin, theme} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import {useGetProductByIdQuery, useGetProductCategoriesQuery, useGetProductsBySellerIdQuery} from '../store/api';
import {ProductGallery} from '../components/product/ProductGallery';
import {ProductInfo} from '../components/product/ProductInfo';
import {RelatedProducts} from '../components/product/RelatedProducts';
import {ROUTES} from '../routes/AppRouter';

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

    if (isLoadingProduct || isLoadingCategories) {
        return (
            <div style={{
                paddingTop: `calc(${token.layout.headerHeight} + ${token.paddingMD}px)`,
                paddingLeft: token.paddingLG,
                paddingRight: token.paddingLG,
                paddingBottom: token.paddingMD,
                height: '100%',
                backgroundColor: token.colorBgLayout,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Spin size="large"/>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div style={{
                paddingTop: `calc(${token.layout.headerHeight} + ${token.paddingMD}px)`,
                paddingLeft: token.paddingLG,
                paddingRight: token.paddingLG,
                paddingBottom: token.paddingMD,
                height: '100%',
                backgroundColor: token.colorBgLayout,
                overflow: 'auto'
            }}>
                <Result
                    status="404"
                    title="Product Not Found"
                    subTitle="The product you're looking for doesn't exist or has been removed."
                    extra={
                        <Button
                            type="primary"
                            onClick={() => navigate(ROUTES.HOME)}
                        >
                            Back to Home
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{
            paddingTop: `calc(${token.layout.headerHeight} + ${token.paddingMD}px)`,
            paddingLeft: token.paddingLG,
            paddingRight: token.paddingLG,
            paddingBottom: token.paddingMD,
            height: '100%',
            backgroundColor: token.colorBgLayout,
            overflow: 'auto'
        }}>
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
        </div>
    );
}
