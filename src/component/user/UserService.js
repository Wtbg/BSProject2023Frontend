import React, {useState} from 'react';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, Select} from 'antd';
import {useNavigate} from "react-router-dom";
import {logout, setCredentials} from "../../utils/auth-slice";
import {useDispatch} from "react-redux";


export function UserService() {
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    function Login() {
        const [loginType, setLoginType] = useState("username");
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const onFinish = async (values: any) => {
            const submitData = {
                login_type: loginType,
                credential: values
            }
            let fetch_url = "http://" + window.location.hostname + ":1323/api/user/login"
            const data = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            }).then((res) => res.json());
            if (data.code !== 0) {
                dispatch(logout());
            } else {
                dispatch(
                    setCredentials({
                        token: data.result.token,
                        user: data.result.user,
                    })
                );
                navigate('/');
            }
        };

        return (<div className="box">
                <div className="login-box">
                    <div>
                        <div className="login-form-container">
                            <Select defaultValue="username" style={{width: 120}}
                                    onChange={(value) => setLoginType(value)}>
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
                                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                               placeholder="Username"/>
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
                                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                               placeholder="Email"/>
                                    </Form.Item>
                                }
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {required: true, message: 'Please input your Password!'},
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
                                    Or
                                    <Button type='link' onClick={() => setLoginOrRegister("register")}>
                                        register now!
                                    </Button>
                                </Form.Item>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function Register() {
        const onFinish = async (values: any) => {
            const submitData = {
                username: values.username,
                email: values.email,
                password: values.password
            }
            let fetch_url = "http://" + window.location.hostname + ":1323/api/user/register"
            const data = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            }).then((res) => res.json());
            if(data === null){
                alert("出错了，请重试")
                return
            }
            if (data.code !== 0) {
                alert("注册失败，请重试")
            } else {
                alert("注册成功，请登录")
                setLoginOrRegister("login")
            }
        };
        return (<div className="box">
                <div className="login-box">
                    <div>
                        <div className="login-form-container">
                            <Form
                                name="normal_login"
                                className="login-form"
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[{required: true, message: 'Please input your Username!'}]}
                                >
                                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                           placeholder="Username"/>
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {required: true, message: 'Please input your Email!'},
                                        {type: 'email', message: 'Please input a valid Email!'}
                                    ]}
                                >
                                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                           placeholder="Email"/>
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {required: true, message: 'Please input your Password!'},
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon"/>}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="confirm"
                                    dependencies={['password']}
                                    rules={[
                                        {required: true, message: 'Please confirm your Password!'},
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon"/>}
                                        type="password"
                                        placeholder="Confirm Password"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Register
                                    </Button>
                                    Or
                                    <Button type='link' onClick={() => setLoginOrRegister("login")}>
                                        login now!
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        loginOrRegister === "login" ? <Login/> : <Register/>
    )
}