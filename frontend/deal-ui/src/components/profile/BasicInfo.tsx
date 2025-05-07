import React from 'react';
import { Form, Input, Button, Space, Tag, Typography, Row, Col, Card } from 'antd';
import { UserProfile } from '../../pages/profile/Profile.tsx';
import { basicInfoRules } from '../../utils/validators.ts';

const { Text } = Typography;

interface BasicInfoProps {
  profileData: UserProfile;
  isEditing: boolean;
  isOwner: boolean;
  saving: boolean;
  form: any;
  handleEdit: () => void;
  handleCancel: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  profileData,
  isEditing,
  isOwner,
  saving,
  form,
  handleEdit,
  handleCancel,
}) => {
  return (
    <Card
      className="basic-info-card"
      style={{ 
        width: '100%',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}
    >
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col xs={24} md={isEditing ? 24 : 24} lg={isEditing ? 18 : 24}>
          {isEditing ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                username: profileData.username,
                email: profileData.email,
              }}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={basicInfoRules.username}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={basicInfoRules.email}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={saving}
                    style={{ 
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff'
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          ) : (
            <div style={{ width: '100%' }}>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12}>
                  <div className="info-item" style={{ marginBottom: '12px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Username</Text>
                    <Text style={{ fontSize: '16px' }}>{profileData.username}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="info-item" style={{ marginBottom: '12px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Email</Text>
                    <Text style={{ fontSize: '16px' }}>{profileData.email}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="info-item" style={{ marginBottom: '12px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Role</Text>
                    <Tag color={profileData.role === 'ADMIN' ? 'red' : 'green'} style={{ fontSize: '14px', padding: '2px 8px' }}>
                      {profileData.role}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="info-item" style={{ marginBottom: '12px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px', color: '#595959' }}>Member Since</Text>
                    <Text style={{ fontSize: '16px' }}>{new Date(profileData.createdAt || '').toLocaleDateString()}</Text>
                  </div>
                </Col>
              </Row>
              
              {isOwner && (
                <Button 
                  type="primary" 
                  onClick={handleEdit} 
                  style={{ 
                    marginTop: 20,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff'
                  }}
                >
                  Edit Basic Information
                </Button>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInfo; 