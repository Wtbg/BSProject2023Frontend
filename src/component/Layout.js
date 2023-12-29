import React, {useEffect, useState} from 'react';
import {ApiOutlined, MessageOutlined, PieChartOutlined,} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import {DeviceTable} from "./mqtt/device/DeviceTable";
import {MessageTable} from "./mqtt/message/MessageTable";
import {Overview} from "./mqtt/Overview";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setCredentials} from "../utils/auth-slice";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('统计信息', '1', <PieChartOutlined/>),
    getItem('设备列表', '2', <ApiOutlined/>),
    getItem('消息列表', '3', <MessageOutlined/>),
];

export function MyLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const [selectedKeys, setSelectedKeys] = useState(['1']);
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getAuthFromLocal = () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (auth.token === null && token && user) {
            dispatch(setCredentials({token, user: JSON.parse(user)}))
        }
    }
    //page is work on ip:3000, but the backend is on ip:1323
    //get the ip for the backend
    const handleMenuClick = (e) => {
        getAuthFromLocal();
        if (auth.token === null) {
            navigate('/login')
            return
        }
        setSelectedKeys([e.key]);
    };
    // getAuthFromLocal() when first render
    useEffect(() => {
        getAuthFromLocal()
    }, [])
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical"/>
                <Menu theme="dark" defaultSelectedKeys={selectedKeys} mode="inline" items={items}
                      onClick={handleMenuClick}/>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    {selectedKeys[0] === '1' ? <Overview/> :
                        selectedKeys[0] === '2' ? <DeviceTable/> :
                            selectedKeys[0] === '3' ? <MessageTable/> : null
                    }
                </Content>
            </Layout>
        </Layout>
    );
}


