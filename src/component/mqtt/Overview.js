import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import cloneDeep from 'lodash.clonedeep';
import {Col, Row, Statistic} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logout, setCredentials} from "../../utils/auth-slice";

export function Overview() {
    const [device_count, setDeviceCount] = useState(0);
    const [online_count, setOnlineCount] = useState(0);
    const [alert_count, setAlertCount] = useState(0);
    const [message_count, setMessageCount] = useState(null);
    const [recent_message_count1, setRecentMessageCount1] = useState(0);
    const [recent_message_count2, setRecentMessageCount2] = useState(0);
    const [recent_message_count3, setRecentMessageCount3] = useState(0);
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
    const fetchData = async () => {
        getAuthFromLocal()
        if (auth.token === null) {
            alert("登录过期，请重新登录")
            navigate('/login')
        }
        try {
            let fetch_url = "http://" + window.location.hostname + ":1323/api/device/summary";
            let result = await fetch(fetch_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                },
            })
                .then((res) => res.json());
            //if res.code !== 0, it means error
            if (result.code !== 0) {
                if(result.code === 401) {
                    alert("登录过期，请重新登录")
                    dispatch(logout())
                    navigate('/login')
                }else{
                    alert(result.msg)
                    dispatch(logout())
                    navigate('/login')
                    throw new Error(result.msg);
                }
            } else {
                setDeviceCount(result.result.deviceCount);
                setOnlineCount(result.result.connectedCount);
                setAlertCount(result.result.alertingCount);
                setMessageCount(result.result.messageCount);
                setRecentMessageCount1(result.result.recentMessageCount1);
                setRecentMessageCount2(result.result.recentMessageCount2);
                setRecentMessageCount3(result.result.recentMessageCount3);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const MESSAGE_OPTION = {
        title: {
            text: '消息总量',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['消息总量']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        // only occupy a small slice
        grid: {
            right: '5%',
            bottom: '15%'
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1000,
            color: ['#BE002F', '#F20C00', '#F00056', '#FF2D51', '#FF2121', '#FF4C00', '#FF7500',
                '#FF8936', '#FFA400', '#F0C239', '#FFF143', '#FAFF72', '#C9DD22', '#AFDD22',
                '#9ED900', '#00E500', '#0EB83A', '#0AA344', '#0C8918', '#057748', '#177CB0']
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function () {
                    let now = new Date();
                    let res = [];
                    let len = 50;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '消息总量',
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '消息总量',
                type: 'line',
                data: (function () {
                    let res = [];
                    let len = 0;
                    while (len < 50) {
                        res.push(null);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    };
    const DEVICE_OPTION = {
        xAxis: {
            data: ['设备总量', '设备连接量', '设备告警量']
        },
        yAxis: {},
        series: [
            {
                type: 'bar',
                legendHoverLink: true,
                data: [
                    {
                        value: null,
                        // 设置单个柱子的样式
                        itemStyle: {
                            color: '#5470c6',
                            shadowColor: '#5470c6',
                            opacity: 0.5
                        }
                    },
                    {
                        value: null,
                        // 设置单个柱子的样式
                        itemStyle: {
                            color: '#91cc75',
                            shadowColor: '#91cc75',
                            opacity: 0.5
                        }
                    },
                    {
                        value: null,
                        // 设置单个柱子的样式
                        itemStyle: {
                            color: '#fa586b',
                            shadowColor: '#fac858',
                            opacity: 0.5
                        }
                    }
                ],
                itemStyle: {
                    barBorderRadius: 5,
                    borderWidth: 1,
                    borderType: 'solid',
                    borderColor: '#73c0de',
                    shadowColor: '#5470c6',
                    shadowBlur: 3
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#5470c6'
                }
            }
        ]
    };

    const [messageOption, setMessageOption] = useState(MESSAGE_OPTION);
    const [deviceOption, setDeviceOption] = useState(DEVICE_OPTION);

    function fetchNewData() {
        fetchData();
        const axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
        const newMessageOption = cloneDeep(messageOption); // immutable
        const newDeviceOption = cloneDeep(deviceOption); // immutable
        newMessageOption.title.text = '当前消息总量:' + message_count + '         近一分钟消息接收量:' + recent_message_count2 +'       当前时间:' + new Date().toLocaleTimeString();
        const data0 = newMessageOption.series[0].data;
        const data1 = newDeviceOption.series[0].data;
        data1[0].value = device_count;
        data1[1].value = online_count;
        data1[2].value = alert_count;
        data0.shift();
        data0.push(message_count);

        newMessageOption.xAxis[0].data.shift();
        newMessageOption.xAxis[0].data.push(axisData);


        setMessageOption(newMessageOption);
        setDeviceOption(newDeviceOption);
    }

    useEffect(() => {
        const timer = setInterval(() => {
            fetchNewData();
        }, 1000);

        return () => clearInterval(timer);
    });

    return (
        //show statistic align to react-echarts
        <div>
            <ReactECharts option={messageOption}/>
            <ReactECharts option={deviceOption}/>
        </div>
    );
}
