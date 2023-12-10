// import React from 'react';
// import {LockOutlined, UserOutlined} from '@ant-design/icons';
// import {Button, Checkbox, Form, Input} from 'antd';
//
// export function Login() {
//     const onFinish = (values: any) => {
//         console.log('Received values of form: ', values);
//     };
//
//     return (
//         <Form
//             name="normal_login"
//             className="login-form"
//             initialValues={{remember: true}}
//             onFinish={onFinish}
//         >
//             <Form.Item
//                 name="username"
//                 rules={[{required: true, message: 'Please input your Username!'}]}
//             >
//                 <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
//             </Form.Item>
//             <Form.Item
//                 name="password"
//                 rules={[{required: true, message: 'Please input your Password!'}]}
//             >
//                 <Input
//                     prefix={<LockOutlined className="site-form-item-icon"/>}
//                     type="password"
//                     placeholder="Password"
//                 />
//             </Form.Item>
//             <Form.Item>
//                 <Form.Item name="remember" valuePropName="checked" noStyle>
//                     <Checkbox>Remember me</Checkbox>
//                 </Form.Item>
//
//                 <a className="login-form-forgot" href="">
//                     Forgot password
//                 </a>
//             </Form.Item>
//
//             <Form.Item>
//                 <Button type="primary" htmlType="submit" className="login-form-button">
//                     Log in
//                 </Button>
//                 Or <a href="">register now!</a>
//             </Form.Item>
//         </Form>
//     );
// }

import {useAuth} from "../utils/use-auth";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAsync} from "../utils/use-async";
import {FullPageLoading} from "../lib/full-page-loading";
import {FullPageErrorFallback} from "../lib/full-page-error-fallback";

export function Login() {
    const {user, login} = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const {run, isLoading, isIdle, isError, error} = useAsync();
    const handleSubmit = (event) => {
        event.preventDefault();
        run(() => login(form)).then();
    };
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    if (user) {
        navigate('/', {replace: true});
    }
    return (<div className="login">
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={form.username} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={form.password} onChange={handleChange}/>
            </div>
            <button type="submit" disabled={isLoading}>Login</button>
        </form>
        <div>
            <Link to="/register">Register</Link>
        </div>
        {isIdle ? null : isLoading ? <FullPageLoading/> : isError ? <FullPageErrorFallback error={error}/> : null}
    </div>);
}