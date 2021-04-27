import React from 'react';
import {GraphinContext} from '@antv/graphin';
import {Tooltip, Button} from 'antd';
import {
    ZoomOutOutlined,
    ZoomInOutlined,
    PieChartOutlined,
    DeleteOutlined,
    VideoCameraAddOutlined,
} from '@ant-design/icons';

export const CustomContent = () => {
    const {apis} = React.useContext(GraphinContext);
    const {handleZoomIn, handleZoomOut} = apis;
    const options = [
        {
            key: 'zoomOut',
            name: <ZoomInOutlined/>,
            description: '放大',
            action: () => {
                handleZoomOut();
            },
        },
        {
            key: 'zoomIn',
            name: <ZoomOutOutlined/>,
            description: '缩小',
            action: () => {
                handleZoomIn();
            },
        },
        {
            key: 'visSetting',
            name: <PieChartOutlined/>,
            description: '可视化设置',
        },
    ];
    return (
        <div>
            {options.map((item) => {
                return (
                    <Tooltip title={item.description} key={item.key}>
                        <Button onClick={item.action}>{item.name}</Button>
                    </Tooltip>
                );
            })}
        </div>
    );
};