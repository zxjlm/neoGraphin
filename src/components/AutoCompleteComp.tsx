import React, {useCallback, useState} from "react";
import {neoQuery} from "../utils/neoOperations";
import {AutoComplete} from "antd";
// @ts-ignore
import {debounce} from 'lodash';

// @ts-ignore
export const AutoCompleteComp = ({nodeOptions, setGraphData}) => {
    console.log('auto', nodeOptions)
    const [options, setOptions] = useState(nodeOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceSearch = useCallback(
        debounce(
            (searchText: any) => searchHandler(searchText),
            1000,
        ),
        [],
    );

    const searchHandler = (searchText: string) => {
        setOptions(nodeOptions.map((option: { options: any[]; }) => ({
            ...option,
            options: option.options.filter(elem => !elem.value.search(searchText))
        })))
    }

    const onSearch = (searchText: string) => {
        debounceSearch(searchText)
    }

    const onSelect = (selectText: string) => {
        console.log(selectText)
        neoQuery(`MATCH (n:Herb) WHERE n.s_name='${selectText}' RETURN n`).then(
            result => {
                setGraphData(result)
                sessionStorage.setItem('graph', JSON.stringify(result))
            }
        )
    }


    return (
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
    )
}