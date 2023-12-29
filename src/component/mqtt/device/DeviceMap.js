import React, {useEffect, useRef, useState} from 'react';
import {Amap, Marker, Polyline, PolylineEditor, RoadNetLayer} from '@amap/amap-react';
import {Form, Input, InputNumber} from 'antd';
import {setCredentials, logout} from "../../../utils/auth-slice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const FormItem = Form.Item;
const DeviceMap = (device_id) => {
        const mapRef = useRef();
        const [center, setCenter] = useState([116.473571, 39.993083]);
        const [zoom, setZoom] = useState(14);
        const [path, setPath] = useState([]);
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
        const fetchData = async (fetch_id) => {
            getAuthFromLocal()
            if (auth.token === null) {
                alert("登录过期，请重新登录")
                navigate('/login')
            }
            try {
                let fetch_url = "http://" + window.location.hostname + ":1323/api/device/searchMessage"
                let result = await fetch(fetch_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.token,
                    },
                    body: JSON.stringify({
                        deviceID: fetch_id,
                    }),
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
                        throw new Error(result.msg);
                    }
                } else {
                    let path_result = result.result;
                    //get only the last 10 points
                    if (path_result.length > 10) {
                        path_result = path_result.slice(path_result.length - 10, path_result.length);
                    }
                    path_result = path_result.map((item) => {
                        return [item.lng, item.lat];
                    });
                    setPath(path_result);
                    if (path_result.length > 0) {
                        setCenter(path_result[path_result.length - 1]);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        };
        //fetch data every 1s also consider the device_id change
        useEffect(() => {
            getAuthFromLocal()
        }, [])
        useEffect(() => {
            const interval = setInterval(() => {
                fetchData(device_id.deviceID);
            }, 1000);
            return () => clearInterval(interval);
        }, [device_id.deviceID]);
        return (
            <div>
                <Form layout="inline">
                    <FormItem label="zoom">
                        <InputNumber
                            value={zoom}
                            onChange={(v) => setZoom(v)}
                            style={{width: '60px'}}
                        />
                    </FormItem>
                    <FormItem label="center">
                        <Input readOnly value={center.join(',')} style={{width: '180px'}}/>
                    </FormItem>
                    <FormItem label="device_id">
                        <Input readOnly value={device_id.deviceID} style={{width: '180px'}}/>
                    </FormItem>
                </Form>

                <div style={{width: '100%', height: '400px', paddingTop: '10px'}}>
                    <Amap
                        ref={mapRef}
                        // viewMode="3D"
                        mapStyle="amap://styles/whitesmoke"
                        zoom={zoom}
                        center={center}
                        showIndoorMap={false}
                        isHotspot
                        onHotspotClick={(map, e) => {
                            if (e && e.lnglat) {
                                setCenter([e.lnglat.lng, e.lnglat.lat]);
                            }
                        }}
                        onZoomChange={(map) => {
                            setZoom(map.getZoom())
                        }}
                        onMapMove={(map) => {
                            setCenter(map.getCenter().toArray())
                        }}
                    >
                        <RoadNetLayer/>
                        <PolylineEditor enabled={false}>
                            <Polyline path={path}
                                      showDir={true}
                                      strokeColor="#28F"
                                      strokeWeight={6}
                            />
                        </PolylineEditor>
                        {/*the last point of the path*/}
                        <Marker position={path[path.length - 1]}
                                label={{
                                    content: '当前位置',
                                }}
                        />
                    </Amap>
                </div>
            </div>
        );
    }
;

export default DeviceMap;