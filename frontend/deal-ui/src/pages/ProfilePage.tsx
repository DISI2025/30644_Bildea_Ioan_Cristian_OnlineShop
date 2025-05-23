import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Card, 
    Form, 
    Layout, 
    Space, 
    Tabs, 
    theme, 
    Typography, 
    Spin, 
    Empty
} from 'antd';
import { 
    LockOutlined, 
    UserOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState, updateUserProfile as updateUserProfileAction } from '../store/slices/auth-slice';
import { UserRole } from "../types/entities";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../store/api';
import { UserProfileUpdateRequest, UpdateUserRequest } from '../types/transfer';
import { useSnackbar } from '../context/SnackbarContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileInfo from '../components/profile/ProfileInfo';

const { Content } = Layout;
const { Title, Text } = Typography;
const { useToken } = theme;

interface AuthState {
    user: {
        id: string;
        username: string;
        role: UserRole;
    } | null;
}

interface ProfileFormData {
    username?: string;
    email?: string;
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    phoneNumber?: string;
    profileUrl?: string;
    storeAddress?: string;
}

const ProfilePage: React.FC = () => {
    const { token } = useToken();
    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();
    const { user } = useSelector(selectAuthState) as AuthState;
    const { showSuccess, showDealErrors } = useSnackbar();
    const dispatch = useDispatch();
    
    const [activeTab, setActiveTab] = useState('basic');
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm] = Form.useForm<ProfileFormData>();
    const [localProfileUpdates, setLocalProfileUpdates] = useState<Partial<ProfileFormData> | null>(null);

    // API hooks
    const {
        data: profileResponse,
        isLoading: isLoadingProfile,
        refetch: refetchProfile
    } = useGetUserProfileQuery(user?.id || '', {
        skip: !user?.id
    });

    const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    // Create a merged profile that combines API data with local updates
    const userProfile = profileResponse?.payload ? {
        ...profileResponse.payload,
        ...(localProfileUpdates || {})
    } : null;

    // Validate user access
    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        if (username !== user.username) {
            navigate('/');
        }
    }, [user, username, navigate]);

    const handleEdit = () => {
        if (!userProfile) return;
        
        // Don't allow editing for admin users
        if (userProfile.role === UserRole.ADMIN) {
            return;
        }
        
        setIsEditing(true);
        profileForm.setFieldsValue({
            username: userProfile.username,
            email: userProfile.email,
            fullName: userProfile.fullName || '',
            address: userProfile.address || '',
            city: userProfile.city || '',
            country: userProfile.country || '',
            postalCode: userProfile.postalCode || '',
            phoneNumber: userProfile.phoneNumber || '',
            profileUrl: userProfile.profileUrl || '',
            storeAddress: userProfile.storeAddress || '',
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        profileForm.resetFields();
    };

    const handleSave = async (values: ProfileFormData) => {
        if (!userProfile) return;

        try {
            // Immediately update local state for instant UI feedback
            const cleanedValues: Partial<ProfileFormData> = {
                ...values,
                storeAddress: values.storeAddress?.trim() || undefined
            };
            setLocalProfileUpdates(cleanedValues);

            const updateRequest: UserProfileUpdateRequest & UpdateUserRequest = {
                id: userProfile.id,
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                address: values.address,
                city: values.city,
                country: values.country,
                postalCode: values.postalCode,
                phoneNumber: values.phoneNumber,
                profileUrl: values.profileUrl,
                storeAddress: values.storeAddress
            };

            await updateUserProfile(updateRequest).unwrap();
            
            // Create updated user object for Redux
            const updatedUser = {
                ...userProfile,
                username: values.username || userProfile.username,
                email: values.email || userProfile.email,
                fullName: values.fullName || userProfile.fullName,
                address: values.address || userProfile.address,
                city: values.city || userProfile.city,
                country: values.country || userProfile.country,
                postalCode: values.postalCode || userProfile.postalCode,
                phoneNumber: values.phoneNumber || userProfile.phoneNumber,
                profileUrl: values.profileUrl || userProfile.profileUrl,
                storeAddress: values.storeAddress?.trim() || undefined
            };
            
            // Update Redux state to trigger seller status change
            dispatch(updateUserProfileAction(updatedUser));
            
            showSuccess('Success', 'Profile updated successfully');
            setIsEditing(false);
            
            // Clear local updates since they're now persisted
            setLocalProfileUpdates(null);
            
            // Then refetch to ensure consistency with backend
            await refetchProfile();
        } catch (error: any) {
            // Revert local changes on error
            setLocalProfileUpdates(null);
            showDealErrors(error?.errors || [{ message: 'Failed to update profile' }]);
        }
    };

    if (isLoadingProfile) {
        return (
            <Layout>
                <Content style={{
                    padding: token.paddingLG,
                    marginTop: `calc(${token.layout?.headerHeight || 64}px + ${token.paddingLG}px)`
                }}>
                    <div style={{ 
                        textAlign: 'center', 
                        padding: token.paddingXL 
                    }}>
                        <Spin size="large" />
                        <p style={{ 
                            marginTop: token.margin, 
                            color: token.colorText 
                        }}>
                            Loading profile...
                        </p>
                    </div>
                </Content>
            </Layout>
        );
    }

    if (!userProfile) {
        return (
            <Layout>
                <Content style={{
                    padding: token.paddingLG,
                    marginTop: `calc(${token.layout?.headerHeight || 64}px + ${token.paddingLG}px)`
                }}>
                    <Empty description="Profile not found" />
                </Content>
            </Layout>
        );
    }

    const isAdmin = userProfile.role === UserRole.ADMIN;

    const renderBasicInfo = () => (
        <Card style={{ 
            borderRadius: token.borderRadiusLG, 
            overflow: 'hidden', 
            boxShadow: token.boxShadow 
        }}>
            <ProfileHeader 
                userProfile={userProfile} 
                isEditing={isEditing}
            />
            {isAdmin ? (
                <ProfileInfo
                    userProfile={userProfile}
                    onEdit={handleEdit}
                />
            ) : isEditing ? (
                <ProfileForm
                    userProfile={userProfile}
                    form={profileForm}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isLoading={isUpdating}
                />
            ) : (
                <ProfileInfo
                    userProfile={userProfile}
                    onEdit={handleEdit}
                />
            )}
        </Card>
    );

    const renderSecurityTab = () => (
        <Card style={{ 
            borderRadius: token.borderRadiusLG, 
            boxShadow: token.boxShadow 
        }}>
            <div style={{ padding: token.paddingLG }}>
                <Title level={4}>Security Settings</Title>
                <Text type="secondary">
                    Password reset functionality will be implemented in a future update. Here you will be able to:
                </Text>
                <ul style={{ 
                    paddingLeft: token.paddingLG, 
                    marginTop: token.margin 
                }}>
                    <li>Change your current password</li>
                    <li>Set up two-factor authentication</li>
                    <li>View login history</li>
                    <li>Manage active sessions</li>
                </ul>
            </div>
        </Card>
    );

    const tabItems = [
        {
            key: 'basic',
            label: (
                <Space>
                    <UserOutlined />
                    <span>Profile Information</span>
                </Space>
            ),
            children: renderBasicInfo()
        },
        {
            key: 'security',
            label: (
                <Space>
                    <LockOutlined />
                    <span>Security</span>
                </Space>
            ),
            children: renderSecurityTab()
        }
    ];

    return (
        <Layout>
            <Content style={{
                padding: token.paddingLG,
                marginTop: `calc(${token.layout?.headerHeight || 64}px + ${token.paddingLG}px)`,
                background: token.colorBgLayout
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ 
                        marginBottom: token.marginXL, 
                        textAlign: 'center' 
                    }}>
                        <Title level={2} style={{ margin: 0 }}>Profile Settings</Title>
                        <Text type="secondary" style={{ fontSize: token.fontSizeLG }}>
                            Manage your account information and preferences
                        </Text>
                    </div>
                    
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="large"
                        tabBarStyle={{
                            background: token.colorBgContainer,
                            margin: 0,
                            padding: `0 ${token.paddingLG}px`,
                            borderRadius: `${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0`,
                            borderBottom: `1px solid ${token.colorBorder}`
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default ProfilePage;