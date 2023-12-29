import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Input, InputNumber, Popconfirm, Space, Table, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {useNavigate} from "react-router-dom";
import {logout, setCredentials} from "../../../utils/auth-slice";
import {useDispatch, useSelector} from "react-redux";
import DeviceMap from "./DeviceMap";

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export const DeviceTable = () => {
    const [selectDeviceID, setSelectDeviceID] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [newDeviceForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const auth = useSelector(state => state.auth)
    const getAuthFromLocal = () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (auth.token === null && token && user) {
            dispatch(setCredentials({token, user: JSON.parse(user)}))
        }
    }
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        getAuthFromLocal()
        if (auth.token === null) {
            alert("登录过期，请重新登录")
            navigate('/login')
        }
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            let fetch_url = "http://" + window.location.hostname + ":1323/api/device/modify";
            let result = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token,
                },
                body: JSON.stringify({
                    deviceID: newData[index].DeviceID,
                    deviceName: row.DeviceName,
                    deviceType: row.DeviceType,
                }),
            })
                .then((res) => res.json());
            if (result.code !== 0) {
                if (result.code === 401) {
                    alert("登录过期，请重新登录")
                    dispatch(logout());
                    navigate('/login')
                } else {
                    alert(result.msg)
                    throw new Error(result.msg)
                }
            }
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const deleteConfirm = async (key) => {
        getAuthFromLocal()
        if (auth.token === null) {
            alert("登录过期，请重新登录")
            navigate('/login')
        }
        try {
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            let fetch_url = "http://" + window.location.hostname + ":1323/api/device/delete";
            let result = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token,
                },
                body: JSON.stringify({
                    deviceID: newData[index].DeviceID,
                }),
            })
                .then((res) => res.json());
            if (result.code !== 0) {
                if (result.code === 401) {
                    alert("登录过期，请重新登录")
                    dispatch(logout());
                    navigate('/login')
                } else {
                    alert(result.msg)
                    throw new Error(result.msg)
                }
            }
            if (index > -1) {
                newData.splice(index, 1);
                setData(newData);
            }
        } catch (errInfo) {
            console.log(errInfo);
        }
    };
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
            render: (text) => {
                if (dataIndex === "DeviceID") {
                    return <Button type="link" onClick={() => {
                        if (selectDeviceID === text) {
                            setSelectDeviceID(null);
                        } else {
                            setSelectDeviceID(text.toString());
                        }
                    }}> {text}</Button>

                } else {
                    if (searchedColumn === dataIndex) {
                        return <Highlighter
                            highlightStyle={{
                                backgroundColor: '#ffc069',
                                padding: 0,
                            }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        />
                    } else {
                        return text;
                    }
                }
            }

        })
    ;
    const columns = [
        {
            title: 'Device ID',
            dataIndex: 'DeviceID',
            //string compare
            sorter: (a, b) => a.DeviceID.localeCompare(b.DeviceID),
            width: '20%',
            ...getColumnSearchProps('DeviceID'),
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
        {
            title: 'IsConnected',
            dataIndex: 'IsConnected',
            filters: [
                {
                    text: 'yes',
                    value: 'yes',
                },
                {
                    text: 'no',
                    value: 'no',
                },
            ],
            onFilter: (value, record) => record.IsConnected.indexOf(value) === 0,
        },
        {
            title: 'Device Name',
            dataIndex: 'DeviceName',
            editable: true,
            ...getColumnSearchProps('DeviceName'),
        },
        {
            title: 'Device Type',
            dataIndex: 'DeviceType',
            editable: true,
            ...getColumnSearchProps('DeviceType'),
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <Space size="middle">
                        <Typography.Link disabled={editingKey !== ''}
                                         onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title={"Sure to delete?"} onConfirm={() => deleteConfirm(record.key)}>
                            <Typography.Link disabled={editingKey !== ''}>
                                Delete
                            </Typography.Link>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    useEffect(() => {
        getAuthFromLocal()
    }, [])
    const fetchData = async () => {
        setLoading(true);
        getAuthFromLocal()
        try {
            let fetch_url = "http://" + window.location.hostname + ":1323/api/device/searchDevice";
            const respond = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token,
                },
            })
                .then((res) => res.json());
            if (respond.code !== 0) {
                if (result.code === 401) {
                    alert("登录过期，请重新登录")
                    navigate('/login')
                } else {
                    alert(result.msg)
                    throw new Error(result.msg)
                }
            }
            let result = respond.result;
            //map result to table
            result = result.map((item) => {
                return {
                    key: item.DeviceID,
                    DeviceID: item.DeviceID,
                    Alert: item.Alert ? "alert" : "no",
                    IsConnected: item.IsConnected ? "yes" : "no",
                    DeviceName: item.DeviceName,
                    DeviceType: item.DeviceType,
                };
            });
            setData(result);
            setLoading(false);
        } catch (e) {
            setLoading(false)
            console.log(e);
        }
    };
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
    //refetch data when each second
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    columns={mergedColumns}
                    dataSource={data}
                    pagination={
                        {
                            ...tableParams.pagination,
                            total: data.length,
                        }
                    }
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Form>
            {
                selectDeviceID ? <DeviceMap deviceID={selectDeviceID}/> : null
            }
        </div>
    );
};