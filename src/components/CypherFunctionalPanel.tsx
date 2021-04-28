// @ts-nocheck
import * as Graphin from '@antv/graphin';
import React from 'react';
import {Col, Divider, Dropdown, Form, Menu, Row, Tooltip} from 'antd';
import {CloseOutlined} from '@ant-design/icons';

import '../css/panel.css';


const LayoutConfigPanel = ({isVisible, setVisible}) => {

    return (
        <div
            className={'draggablePanel'}
            style={{
                top: 50,
                right: 30,
                height: '600px',
                bottom: 50
            }}
            hidden={isVisible}
        >
            <Row className={'header'}>
                <Col span={22} className={'title'}>
                    功能集
                </Col>
                <Col span={2}>
          <span className={'collapseIcon'}>
            <CloseOutlined onClick={() => setVisible(!isVisible)}/>
          </span>
                </Col>
            </Row>
            <Row
                style={{
                    marginTop: 8,
                }}
            >
                <Col span={24}>
                    <Divider/>
                    <div style={{fontWeight: 'bold'}}>查找</div>
                </Col>
                {/*<Dropdown overlay={layoutMenu}>*/}
                {/*    <Col span={24} style={{textAlign: 'center', marginBottom: 8, cursor: 'pointer'}}>*/}
                {/*        <span style={{fontSize: 14, marginRight: 8, marginLeft: 8}}>{layoutTipInfo.text}</span>*/}
                {/*        <DownOutlined/>*/}
                {/*    </Col>*/}
                {/*</Dropdown>*/}
                <Col span={24}>
                    <Divider/>
                    <div style={{fontWeight: 'bold'}}>配置参数</div>
                </Col>
            </Row>
            <div
                className={'contentContainer'}
                style={{
                    display: 'block',
                }}
            >
                111122
            </div>
        </div>
    );
};

export default LayoutConfigPanel;
