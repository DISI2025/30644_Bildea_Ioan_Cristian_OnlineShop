import React from 'react';
import { Typography, Alert, Row, Col, Card } from 'antd';

const { Title, Text } = Typography;

const BuyerInfo: React.FC = () => {
  return (
    <Card
      className="buyer-info-card"
      style={{ 
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}
    >
      <Alert
        message={<Title level={4} style={{ margin: 0 }}>Buyer Information</Title>}
        description={
          <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
            <Col xs={24}>
              <Text>This section will be implemented in a future task.</Text>
            </Col>
            <Col xs={24}>
              <Text strong>The buyer section will include:</Text>
              <ul style={{ 
                paddingLeft: '20px',
                marginTop: '8px',
                color: 'rgba(0, 0, 0, 0.65)'
              }}>
                <li style={{ marginBottom: '4px' }}>Shipping address management</li>
                <li style={{ marginBottom: '4px' }}>Payment methods</li>
                <li style={{ marginBottom: '4px' }}>Purchase history</li>
                <li style={{ marginBottom: '4px' }}>Saved seller favorites</li>
                <li style={{ marginBottom: '4px' }}>Account preferences</li>
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