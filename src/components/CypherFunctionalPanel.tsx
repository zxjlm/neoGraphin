// @ts-nocheck
import React, {useCallback, useMemo, useState} from 'react';
import {AutoComplete, Col, Divider, Row, Tabs} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {debounce} from 'lodash';
import '../css/panel.css';
import {neoQuery} from "../utils/neoOperations";
import {AppleOutlined, AndroidOutlined} from '@ant-design/icons';

const {TabPane} = Tabs;

const CypherFunctionalPanel = ({isVisible, setVisible, nodeOptions, setGraphData}) => {
    const [options, setOptions] = useState(nodeOptions);

    useMemo(() => {
        setOptions(nodeOptions)
    }, [nodeOptions]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = useCallback(
        debounce(
            (searchText) => searchHandler(searchText),
            1000,
        ),
        [],
    );

    const searchHandler = (searchText) => {
        setOptions(nodeOptions.map(option => ({
            ...option,
            options: option.options.filter(elem => !elem.value.search(searchText))
        })))
    }

    const onSearch = (searchText) => {
        debounceSearch(searchText)
    }

    const onSelect = (selectText) => {
        console.log(selectText)
        neoQuery(`MATCH (n:Herb) WHERE n.s_name='${selectText}' RETURN n`).then(
            result => {
                setGraphData(result)
                sessionStorage.setItem('graph', JSON.stringify(result))
            }
        )
    }

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
                    <Tabs defaultActiveKey="2" style={{marginLeft:10}}>
                        <TabPane
                            tab={
                                <span>
                                  <AppleOutlined/>
                                  单个节点
                                </span>
                            }
                            key="1"
                        >
                            <AutoComplete
                                dropdownMatchSelectWidth={500}
                                style={{
                                    width: 250,
                                    marginTop: 8,
                                    marginLeft: 20
                                }}
                                options={options}
                                onSearch={onSearch}
                                placeholder={'节点名称'}
                                onSelect={onSelect}
                            />
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
                            Tab 2
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
