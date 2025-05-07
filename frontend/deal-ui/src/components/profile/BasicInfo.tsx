import React from 'react';
import { Tag, Typography, Row, Col, Card, theme } from 'antd';
import { UserRole } from '../../types/entities';

const { Text } = Typography;
const { useToken } = theme;

interface BaseUserDTO {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

interface UserDetailsDTO extends BaseUserDTO {
  role: UserRole.USER;
  userInfo: {
    shippingAddress?: string;
    paymentMethod?: string;
    preferredLocations?: string[];
    preferredCourier?: string;
    productCategories?: number[];
  };
}

interface AdminDTO extends BaseUserDTO {
  role: UserRole.ADMIN;
  adminInfo: {
    permissions: string[];
    lastLogin: string;
  };
}

type UserDTO = UserDetailsDTO | AdminDTO;

interface BasicInfoProps {
  profileData: UserDTO;
  isOwner: boolean;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  profileData,
  isOwner,
}) => {
  const { token } = useToken();

  return (
    <Card
      className="basic-info-card"
      style={{
        width: '100%',
        boxShadow: token.shadows.light.md,
        borderRadius: token.borderRadius.md,
        overflow: 'hidden',
        marginBottom: token.spacing.lg
      }}
    >
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        <Col xs={24} md={24} lg={24}>
          <div style={{ width: '100%' }}>
            <Row gutter={[20, 16]}>
              <Col xs={24} sm={12}>
                <div className="info-item" style={{ marginBottom: token.spacing.sm }}>
                  <Text strong style={{
                    display: 'block',
                    marginBottom: token.spacing.xxs,
                    color: token.colorTextSecondary
                  }}>Username</Text>
                  <Text style={{ fontSize: token.customFontSize.base }}>{profileData.username}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="info-item" style={{ marginBottom: token.spacing.sm }}>
                  <Text strong style={{
                    display: 'block',
                    marginBottom: token.spacing.xxs,
                    color: token.colorTextSecondary
                  }}>Role</Text>
                  <Tag color={profileData.role === UserRole.ADMIN ? 'red' : 'green'}
                    style={{
                      fontSize: token.customFontSize.sm,
                      padding: `${token.spacing.xxs} ${token.spacing.sm}`
                    }}>
                    {profileData.role}
                  </Tag>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="info-item" style={{ marginBottom: token.spacing.sm }}>
                  <Text strong style={{
                    display: 'block',
                    marginBottom: token.spacing.xxs,
                    color: token.colorTextSecondary
                  }}>Member Since</Text>
                  <Text style={{ fontSize: token.customFontSize.base }}>
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInfo; 