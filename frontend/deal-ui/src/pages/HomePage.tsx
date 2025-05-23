import React from 'react';
import {Layout, theme, Typography, Divider} from 'antd';
import ProductGrid from '../components/product/ProductGrid';
import {useGetProductsQuery} from '../store/api';

const {Content, Footer} = Layout;
const {useToken} = theme;
const {Title} = Typography;

export const HomePage: React.FC = () => {
    const {token} = useToken();
    const {data: productsResponse, error, isLoading} = useGetProductsQuery();

    const products = productsResponse?.payload || [];

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Content style={{
                padding: token.spacing.lg,
                backgroundColor: token.colorBgLayout,
                minHeight: `calc(100vh - ${token.layout.headerHeight}px - ${token.layout.footerHeight}px)`,
                marginTop: `calc(${token.layout.headerHeight}px + 2rem)`
            }}>
                <div style={{maxWidth: 1200, margin: '0 auto'}}>
                    <Title level={2}>Featured Products</Title>
                    <Divider />

                    <ProductGrid
                        products={products}
                        loading={isLoading}
                        columns={4}
                    />

                    {error && (
                        <div style={{textAlign: 'center', marginTop: 24}}>
                            <Typography.Text type="danger">
                                Failed to load products. Please try again later.
                            </Typography.Text>
                        </div>
                    )}
                </div>
            </Content>

            <Footer style={{
                textAlign: 'center',
                backgroundColor: token.colorBgContainer,
                color: token.colorTextSecondary,
                padding: token.spacing.md,
                borderTop: `${token.colorBorder}`,
            }}>
                DEAL E-Commerce ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};