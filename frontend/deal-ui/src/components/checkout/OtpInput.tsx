import React, {useEffect, useRef, useState} from 'react';
import {Input, Space} from 'antd';

interface OtpInputProps {
    value?: string;
    onChange?: (value: string) => void;
    length?: number;
    autoFocus?: boolean;
    disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
                                               value = '',
                                               onChange,
                                               length = 5,
                                               autoFocus = true,
                                               disabled = false,
                                           }) => {
    const [otp, setOtp] = useState<string[]>(value.split('').concat(Array(length).fill('').slice(value.length)));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);

        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, [length, autoFocus]);

    useEffect(() => {
        if (value) {
            const newOtp = value.split('').concat(Array(length).fill('').slice(value.length));
            setOtp(newOtp);
        }
    }, [value, length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const target = e.target;
        let digit = target.value;

        if (digit.length > 1) {
            digit = digit[digit.length - 1];
        }

        if (!/^\d*$/.test(digit)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (onChange) {
            onChange(newOtp.join(''));
        }

        if (digit && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        if (!/^\d*$/.test(pastedData)) {
            return;
        }

        const digits = pastedData.slice(0, length).split('');
        const newOtp = [...digits, ...Array(length).fill('').slice(digits.length)];

        setOtp(newOtp);

        if (onChange) {
            onChange(newOtp.join(''));
        }

        const focusIndex = Math.min(digits.length, length - 1);
        if (inputRefs.current[focusIndex]) {
            inputRefs.current[focusIndex]?.focus();
        }
    };

    return (
        <div className="otp-input-container">
            <Space size="small">
                {Array(length).fill(null).map((_, index) => (
                    <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        ref={(ref) => {
                            if (ref) {
                                inputRefs.current[index] = ref.input as HTMLInputElement;
                            } else {
                                inputRefs.current[index] = null;
                            }
                        }}
                        style={{
                            width: '50px',
                            height: '50px',
                            fontSize: '24px',
                            textAlign: 'center',
                            borderRadius: '8px'
                        }}
                        disabled={disabled}
                    />
                ))}
            </Space>
        </div>
    );
};
export default OtpInput;