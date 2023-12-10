import React, {useState} from 'react';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, Select} from 'antd';
import {useForm} from "antd/es/form/Form";
import {useAuth} from "../utils/use-auth";

export function Login() {
    const form = useForm();
    const {user, login} = useAuth();
    const [loginType, setLoginType] = useState("username");
    const onFinish = (values: any) => {
        const submitData = {
            login_type: loginType,
            credential: values
        }
        login(submitData);
        console.log('Received values of form: ', values);
    };

    return (
        <div className="login-form-container">
            <Select defaultValue="username" style={{width: 120}} onChange={(value) => setLoginType(value)}>
                <Select.Option value="username">Username</Select.Option>
                <Select.Option value="email">Email</Select.Option>
            </Select>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
            >
                {loginType === "username" &&
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                }
                {loginType === "email" &&
                    <Form.Item
                        name="email"
                        rules={[
                            {required: true, message: 'Please input your Email!'},
                            {type: 'email', message: 'Please input a valid Email!'}
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                    </Form.Item>
                }
                <Form.Item
                    name="password"
                    rules={[
                        {required: true, message: 'Please input your Password!'},
                        // {min: 6, message: 'Password must be at least 6 characters!'},
                        // {max: 20, message: 'Password must be at most 20 characters!'},
                        // {pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/, message: 'Password must contain at least one uppercase letter, one lowercase letter and one number!'}
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        </div>
    )
}

