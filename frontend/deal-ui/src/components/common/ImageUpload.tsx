import React, {useState} from 'react';
import {Upload, Button, message, Image, Tooltip, theme} from 'antd';
import {UploadOutlined, LoadingOutlined, DeleteOutlined, EyeOutlined, EditOutlined} from '@ant-design/icons';
import type {RcFile} from 'antd/es/upload/interface';
import {HTTP_METHOD} from "../../utils/constants.ts";

interface ImageUploadProps {
    value?: string;
    onChange?: (url: string) => void;
    placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({value, onChange, placeholder = 'Upload Image'}) => {
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const {token} = theme.useToken();

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }

        const isLt2M = file.size / 1024 / 1024 < 32;
        if (!isLt2M) {
            message.error('Image must be smaller than 32MB!');
            return false;
        }

        uploadToImgBB(file);
        return false; // Prevent default upload
    };

    const uploadToImgBB = async (file: RcFile) => {
        setLoading(true);
        try {
            const base64Image = await getBase64(file);
            const base64String = base64Image.split(',')[1];

            const formData = new FormData();
            //TODO
            formData.append('key', import.meta.env.VITE_IMGBB_API_KEY || '03e856809891fc84f9d4535effc1315c');
            formData.append('image', base64String);

            //TODO
            const response = await fetch(import.meta.env.VITE_IMGBB_API_URL || 'https://api.imgbb.com/1/upload', {
                method: HTTP_METHOD.POST,
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.data.url;

                if (onChange) {
                    onChange(imageUrl);
                }

                message.success('Image uploaded successfully!');
            } else {
                message.error('Failed to upload image: ' + (result.error?.message || 'Unknown error'));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            message.error('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleRemove = () => {
        if (onChange) {
            onChange('');
        }
    };

    return (
        <div className="image-upload-wrapper">
            {!value && !loading && (
                <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    accept="image/*"
                    disabled={loading}
                >
                    <div>
                        <UploadOutlined style={{fontSize: 20, marginBottom: 8}}/>
                        <div style={{marginTop: 8}}>{placeholder}</div>
                    </div>
                </Upload>
            )}

            {loading && (
                <div
                    style={{
                        width: 104,
                        height: 104,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        border: `1px dashed ${token.colorBorder}`,
                        borderRadius: token.borderRadiusLG,
                        backgroundColor: token.colorBgContainerDisabled
                    }}
                >
                    <LoadingOutlined style={{fontSize: 24, marginBottom: 8}}/>
                    <div>Uploading...</div>
                </div>
            )}

            {value && !loading && (
                <div style={{position: 'relative', width: 'fit-content'}}>
                    <div
                        style={{
                            width: 104,
                            height: 104,
                            overflow: 'hidden',
                            border: `1px solid ${token.colorBorder}`,
                            borderRadius: token.borderRadiusLG,
                            position: 'relative',
                        }}
                    >
                        <img
                            src={value}
                            alt="Uploaded"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />

                        {/* Overlay on hover */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                            }}
                            className="image-actions-overlay"
                        >
                            <Tooltip title="View Image">
                                <Button
                                    type="text"
                                    icon={<EyeOutlined/>}
                                    onClick={() => setPreviewVisible(true)}
                                    style={{
                                        color: 'white',
                                        fontSize: 16,
                                        marginRight: 8
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="Change Image">
                                <Upload
                                    name="image"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    accept="image/*"
                                    disabled={loading}
                                >
                                    <Button
                                        type="text"
                                        icon={<EditOutlined/>}
                                        style={{
                                            color: 'white',
                                            fontSize: 16,
                                            marginRight: 8
                                        }}
                                    />
                                </Upload>
                            </Tooltip>
                            <Tooltip title="Remove Image">
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined/>}
                                    onClick={handleRemove}
                                    style={{
                                        color: 'white',
                                        fontSize: 16
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                </div>
            )}

            <Image
                width={200}
                style={{display: 'none'}}
                src={value}
                preview={{
                    visible: previewVisible,
                    onVisibleChange: (vis) => setPreviewVisible(vis),
                    mask: null
                }}
            />

            <style>{`
        .image-actions-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
        </div>
    );
};

export default ImageUpload; 