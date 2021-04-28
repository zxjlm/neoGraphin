import React from 'react';
import {GraphinContext} from '@antv/graphin';
import {Tooltip, Button} from 'antd';
import {
    ZoomOutOutlined,
    ZoomInOutlined,
    PieChartOutlined,
    AimOutlined,
    FunctionOutlined
} from '@ant-design/icons';

// @ts-ignore
export const CustomContent = ({layoutPanelVisible, setLayoutPanelVisible, visible, setVisible, funcPanelVisible,setFuncPanelVisible}) => {
    const {apis} = React.useContext(GraphinContext);
    const {handleZoomIn, handleZoomOut} = apis;
    const options = [
        {
            key: 'fishEye',
            name: <AimOutlined/>,
            description: '鱼眼放大镜(ESC取消)',
            action: () => {
                setVisible(!visible);
            },
        },
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
            action: () => {
                setLayoutPanelVisible(!layoutPanelVisible)
                setFuncPanelVisible(true)
            }
        },
        {
            key: 'funcPanel',
            name: <FunctionOutlined/>,
            description: '功能面板',
            action: () => {
                setFuncPanelVisible(!funcPanelVisible)
                setLayoutPanelVisible(true)
            }
        }
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