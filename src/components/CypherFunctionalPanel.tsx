// @ts-nocheck
import React, {useCallback, useState} from 'react';
import {AutoComplete, Col, Divider, Form, Row} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import {debounce} from 'lodash';
import '../css/panel.css';
import {neoQuery} from "../utils/neoOperations";


const CypherFunctionalPanel = ({isVisible, setVisible, nodeOptions, setGraphData}) => {

    const [options, setOptions] = useState(nodeOptions);

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
            <Row
                style={{
                    marginTop: 8,
                }}
            >
                <Col span={24}>
                    <Divider/>
                    <div style={{fontWeight: 'bold'}}>查找</div>
                </Col>
                <Form>
                    <AutoComplete
                        dropdownMatchSelectWidth={500}
                        style={{
                            width: 250,
                        }}
                        options={options}
                        onSearch={onSearch}
                        placeholder={'节点名称'}
                        onSelect={onSelect}
                    />
                </Form>

                <Col span={24}>
                    <Divider/>
                    <div style={{fontWeight: 'bold'}}>配置参数</div>
                </Col>
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
