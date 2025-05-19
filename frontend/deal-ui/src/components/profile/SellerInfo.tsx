import React from 'react';
import {Button, Card, Col, Form, Input, Row, Space, theme, Typography} from 'antd';
import type {FormInstance} from 'antd/es/form';
import {UserRole} from '../../types/entities';

//TODO Adjust the file and integrate with future components and api

const {Text, Title} = Typography;
const {useToken} = theme;

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
        preferredLocations?: string[];
        preferredCourier?: string;
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

interface UserInfoProps {
    profileData: UserDTO;
    isEditing: boolean;
    canEditUserInfo: boolean;
    saving: boolean;
    form: FormInstance;
    handleEdit: () => void;
    handleCancel: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
                                               profileData,
                                               isEditing,
                                               canEditUserInfo,
                                               saving,
                                               form,
                                               handleEdit,
                                               handleCancel,
                                           }) => {
    const {token} = useToken();

    if (profileData.role !== UserRole.USER) {
        return null;
    }

    return (
        <Card
            className="user-info-card"
            style={{
                width: '100%',
                boxShadow: token.shadows.light.md,
                borderRadius: token.borderRadius.md,
                overflow: 'hidden',
                marginBottom: token.spacing.lg
            }}
        >
            <Row gutter={[16, 16]} style={{width: '100%'}}>
                <Col xs={24}>
                    {isEditing && canEditUserInfo ? (
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                preferredLocations: profileData.userInfo.preferredLocations?.join(', '),
                                preferredCourier: profileData.userInfo.preferredCourier,
                                shippingAddress: profileData.userInfo.shippingAddress,
                            }}
                            style={{width: '100%'}}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="preferredLocations"
                                        label={<span style={{
                                            fontSize: token.customFontSize.sm,
                                            color: token.colorText
                                        }}>Preferred Locations</span>}
                                        help="Enter locations separated by commas"
                                    >
                                        <Input placeholder="Cluj-Napoca, Bucharest, ..."/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="preferredCourier"
                                        label={<span style={{
                                            fontSize: token.customFontSize.sm,
                                            color: token.colorText
                                        }}>Preferred Courier</span>}
                                    >
                                        <Input placeholder="Fan Courier, DHL, ..."/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        name="shippingAddress"
                                        label={<span style={{
                                            fontSize: token.customFontSize.sm,
                                            color: token.colorText
                                        }}>Shipping Address</span>}
                                    >
                                        <Input placeholder="Enter your shipping address"/>
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
                                            backgroundColor: token.colorPrimary,
                                            borderColor: token.colorPrimary
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    ) : (
                        <div style={{width: '100%'}}>
                            <Title level={5} style={{marginBottom: token.spacing.md, color: token.colorText}}>User
                                Details</Title>
                            <Row gutter={[20, 16]}>
                                <Col xs={24} md={12}>
                                    <div className="info-item" style={{marginBottom: token.spacing.md}}>
                                        <Text strong style={{
                                            display: 'block',
                                            marginBottom: token.spacing.xxs,
                                            color: token.colorTextSecondary
                                        }}>Preferred Locations</Text>
                                        <Text style={{fontSize: token.customFontSize.base}}>
                                            {profileData.userInfo.preferredLocations?.length
                                                ? profileData.userInfo.preferredLocations.join(', ')
                                                : 'None specified'}
                                        </Text>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="info-item" style={{marginBottom: token.spacing.md}}>
                                        <Text strong style={{
                                            display: 'block',
                                            marginBottom: token.spacing.xxs,
                                            color: token.colorTextSecondary
                                        }}>Preferred Courier</Text>
                                        <Text style={{fontSize: token.customFontSize.base}}>
                                            {profileData.userInfo.preferredCourier || 'None specified'}
                                        </Text>
                                    </div>
                                </Col>

                                <Col xs={24}>
                                    <div className="info-item" style={{marginBottom: token.spacing.md}}>
                                        <Text strong style={{
                                            display: 'block',
                                            marginBottom: token.spacing.xxs,
                                            color: token.colorTextSecondary
                                        }}>Shipping Address</Text>
                                        <Text style={{fontSize: token.customFontSize.base}}>
                                            {profileData.userInfo.shippingAddress || 'None specified'}
                                        </Text>
                                    </div>
                                </Col>
                            </Row>

                            {canEditUserInfo && (
                                <Button
                                    type="primary"
                                    onClick={handleEdit}
                                    style={{
                                        marginTop: token.spacing.md,
                                        backgroundColor: token.colorPrimary,
                                        borderColor: token.colorPrimary
                                    }}
                                >
                                    Edit User Information
                                </Button>
                            )}
                        </div>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default UserInfo; 