import React from 'react';
import { Typography, Alert, Row, Col, Card, theme } from 'antd';

const { Title, Text } = Typography;
const { useToken } = theme;

const BuyerInfo: React.FC = () => {
  const { token } = useToken();

  return (
    <Card
      className="buyer-info-card"
      style={{ 
        width: '100%',
        boxShadow: token.shadows.light.md,
        borderRadius: token.borderRadius.md,
        overflow: 'hidden',
        marginBottom: token.spacing.lg
      }}
    >
      <Alert
        message={<Title level={4} style={{ margin: 0 }}>Buyer Information</Title>}
        description={
          <Row gutter={[16, 16]} style={{ marginTop: token.spacing.sm }}>
            <Col xs={24}>
              <Text>This section will be implemented in a future task.</Text>
            </Col>
            <Col xs={24}>
              <Text strong>The buyer section will include:</Text>
              <ul style={{ 
                paddingLeft: token.spacing.lg,
                marginTop: token.spacing.sm,
                color: token.colorTextSecondary
              }}>
                <li style={{ marginBottom: token.spacing.xs }}>Shipping address management</li>
                <li style={{ marginBottom: token.spacing.xs }}>Payment methods</li>
                <li style={{ marginBottom: token.spacing.xs }}>Purchase history</li>
                <li style={{ marginBottom: token.spacing.xs }}>Saved seller favorites</li>
                <li style={{ marginBottom: token.spacing.xs }}>Account preferences</li>
              </ul>
            </Col>
          </Row>
        }
        type="info"
        showIcon
        style={{ 
          width: '100%',
          border: 'none',
          background: 'rgba(24, 144, 255, 0.1)'
        }}
      />
    </Card>
  );
};

export default BuyerInfo; 