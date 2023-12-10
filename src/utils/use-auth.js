// useAuth.js
import { useState } from 'react';

//{
//     "code": 0,
//     "msg": "login success",
//     "result": {
//         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IjEyMyIsImV4cCI6MTcwMjIxNzkxN30.DsJURObKXjEwxjWR5FYQJnjehzNzJimytQeHpd6IvVE"
//     }
// }

export function useAuth() {
    const [user, setUser] = useState(null);

    const login = async (submitData) => {
        try {
            // Make login request
            const data = await fetch('http://localhost:1323/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            }).then((res) => res.json());
            console.log('登录成功:', data);
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(data));
            // Set user state
            setUser(data);
        } catch (error) {
            console.error('登录错误:', error);
            // 处理登录错误
            // throw error; // Make sure to rethrow the error to propagate it to the calling code
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, login, logout };
}

//
