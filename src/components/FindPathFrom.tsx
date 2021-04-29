import {Form, Input, Button, AutoComplete} from 'antd';
import {useState} from "react";
import {executeCypher} from "../utils/neoOperations";

const layout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 5,
        span: 16,
    },
};

export const FindPathFrom = () => {
    const [options, setOptions] = useState([{value: 'Loading'}]);
    // const [nameTypeMapper, setNameTypeMapper] = useState({});
    // const [disabled, setDisabled] = useState(true);

    const onFinish = (values: any) => {
        // let query = `MATCH (A:${nameTypeMapper[values.source]} {s_name: ${values.source} ),(B:${nameTypeMapper[values.target]} {s_name: ${values.target}),p = shortestPath((A)-[:]-(B)) RETURN p`
        let query = `MATCH (A {s_name: '${values.source}'}),(B {s_name: '${values.target}'}),p = shortestPath((A)-[*]-(B)) RETURN p`
        executeCypher(query).then(result => {
            debugger
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFocus = () => {
        if (options[0].value === 'Loading') {
            executeCypher('MATCH (n) RETURN n.s_name').then(result => {
                // @ts-ignore
                setOptions(result.records.map(elem => ({value: elem._fields[0]})))
                // result.records.forEach(elem => tmp[elem._fields[0]] = elem.labels[0])
                // console.log('tmp',tmp)
                // setNameTypeMapper(tmp)
            })
        }
    }

    return (
        <Form
            {...layout}
            name="find-path"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="起点"
                name="source"
                rules={[
                    {
                        required: true,
                        message: 'Please input source!',
                    },
                ]}
            >
                <AutoComplete
                    options={options}
                    onFocus={onFocus}
                    filterOption={true}
                />
            </Form.Item>

            <Form.Item
                label="终点"
                name="target"
                rules={[
                    {
                        required: true,
                        message: 'Please input target!',
                    },
                ]}
            >
                <AutoComplete
                    options={options}
                    onFocus={onFocus}
                    filterOption={true}
                />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    确认查找
                </Button>
            </Form.Item>
        </Form>
    );
};
