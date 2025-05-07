import { Rule } from 'antd/es/form';
import ErrorMessageList from "../components/ErrorMessageList.tsx";

export const usernameRules: Rule[] = [
    {
        required: true,
        message: <ErrorMessageList
            messages={[
                'Please write your username'
            ]}
        />
    }
];

export const passwordRules: Rule[] = [
    {
        required: true,
        message: <ErrorMessageList
            messages={[
                'Please write your password.'
            ]}
        />
    },
    // {
    //     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    //     message: (
    //         <ErrorMessageList
    //             messages={[
    //                 'Password must meet the following requirements:',
    //                 'At least 8 characters long',
    //                 'At least one uppercase letter',
    //                 'At least one lowercase letter',
    //                 'At least one number',
    //                 'At least one special character (e.g., @$!%*?&)'
    //             ]}
    //         />
    //     )
    // },
];