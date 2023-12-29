import React, {useEffect, useRef, useState} from "react";
import {Button, Input, Space, Table} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout, setCredentials} from "../../../utils/auth-slice";


const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});
export const MessageTable = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '';
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'Message ID',
            dataIndex: 'MessageID',
            sorter: (a, b) => a.MessageID - b.MessageID,
            ...getColumnSearchProps('MessageID'),
        },
        {
            title: 'Device ID',
            dataIndex: 'DeviceID',
            width: '20%',
            //compare string
            sorter: (a, b) => a.DeviceID.localeCompare(b.DeviceID),
            ...getColumnSearchProps('DeviceID'),
        },
        {
            title:'Info',
            dataIndex:'Info',
        },
        {
            title: 'Time',
            dataIndex: 'Time',
            width: '20%',
        },
        {
            title: 'Alert',
            dataIndex: 'Alert',
            filters: [
                {
                    text: 'alert',
                    value: 'alert',
                },
                {
                    text: 'no',
                    value: 'no',
                },
            ],
            onFilter: (value, record) => record.Alert.indexOf(value) === 0,
        },

    ];
    const fetchData = async () => {
        setLoading(true);
        getAuthFromLocal()
        if (auth.token === null) {
            alert("登录过期，请重新登录")
            navigate('/login')
        }
        try {
            let fetch_url = "http://" + window.location.hostname + ":1323/api/device/searchMessage"
            const result = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token,
                },
            })
                .then((res) => res.json());
            if(result.code !== 0){
                if(result.code === 401){
                    alert("登录过期，请重新登录")
                    dispatch(logout())
                    navigate('/login')
                }
                else{
                    alert(result.msg)
                    throw new Error(result.msg)
                }
            }
            const messages = result.result.map((item) => {
                            item.timestamp = new Date(item.timestamp).toLocaleString();
                            return {
                                key: item.messageId,
                                MessageID: item.messageId,
                                DeviceID: item.clientId,
                                Info: item.info,
                                Time: item.timestamp,
                                Alert: item.alert ? 'alert' : 'no',
                            };
                        });
            setData(messages);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    };
    useEffect(() => {
        getAuthFromLocal()
    }, [])
    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);
    //if filter change set pagination.current to first page
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
        // console.log("handle table change");
        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
        />
    );
};