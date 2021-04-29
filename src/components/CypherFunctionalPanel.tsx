// @ts-nocheck
import React from 'react';
import {Col, Divider, Row, Tabs} from 'antd';
import {CloseOutlined} from '@ant-design/icons';

import '../css/panel.css';

import {AppleOutlined, AndroidOutlined} from '@ant-design/icons';
import {AutoCompleteComp} from "./AutoCompleteComp";
import {TreeSelector} from "./TreeSelector";

const {TabPane} = Tabs;

const CypherFunctionalPanel = ({isVisible, setVisible, nodeOptions, treeOptions, setGraphData}) => {
    console.log('cypher', nodeOptions)

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
            <Divider/>
            <Row
                style={{
                    marginTop: 8,
                }}
            >
                <div style={{fontWeight: 'bold'}}>查找节点</div>
                <Col span={24}>
                    <Tabs defaultActiveKey="2" style={{marginLeft: 10}}>
                        <TabPane
                            tab={
                                <span>
                                  <AppleOutlined/>
                                  单个节点
                                </span>
                            }
                            key="1"
                        >
                            <AutoCompleteComp nodeOptions={nodeOptions} setGraphData={setGraphData}/>
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                  <AndroidOutlined/>
                                  多个节点
                                </span>
                            }
                            key="2"
                        >
                            <TreeSelector options={treeOptions}/>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>

            <Row>
                <Divider/>
                <div style={{fontWeight: 'bold'}}>配置参数</div>
            </Row>
            {/*<div*/}
            {/*    className={'contentContainer'}*/}
            {/*    style={{*/}
            {/*        display: 'block',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    111122*/}
            {/*</div>*/}
        </div>
    );
};

export default CypherFunctionalPanel;
