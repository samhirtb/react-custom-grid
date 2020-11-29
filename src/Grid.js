import React, {useState, useEffect, useRef} from 'react'
import {GridTable, GridRow, GridItem, GridOptions, GridOption, GridIsActive} from './GridComponents.js'
import Data from './TestData'
import './CSS/Styles.css';

const Grid = ({fetchURL, settingPostURL}) => {
    const [isLoading, setIsLoading] = useState(true) //can be replaced with a reducer
    const [gridData, setGridData] = useState({}) //can be passed data?
    const optionRef = useRef(null)
    
    useEffect(() => {
        //fetchURL call here
        if (isLoading) {
            setGridData(Data)
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const {DisplayInfo} = gridData
        //fetch("url", {type:"POST"})
        console.log(DisplayInfo)

    }, [gridData])

    const pd = (e) => e.preventDefault();
    const onDragStart = (dragevent) => dragevent.dataTransfer.setData("text", dragevent.target.id);

    const onDrop = (dropevent) => { //save settings call
        dropevent.preventDefault();
        const data = dropevent.dataTransfer.getData("text");
        const updatedDisplayInfo = [...gridData.DisplayInfo]
        updatedDisplayInfo.splice(gridData.DisplayInfo.indexOf(data), 1)
        updatedDisplayInfo.splice(gridData.DisplayInfo.indexOf(dropevent.target.id), 0, data)
        setGridData({
            ...gridData,
            DisplayInfo: updatedDisplayInfo
        })
    }

    const toggleDisplay = (e) => { //save settings call
        const {name} = e.target
        const updatedDisplayInfo = [...gridData.DisplayInfo]
        
        if (updatedDisplayInfo.includes(name)) 
            updatedDisplayInfo.splice(gridData.DisplayInfo.indexOf(name), 1)
        else 
            updatedDisplayInfo.push(name)

        setGridData({
            ...gridData,
            DisplayInfo: updatedDisplayInfo
        })
    }

    const toggleOptionsMenu = () => {optionRef.current.focus()}

    const onClickSort = (e) => {
        const {id} = e.target;
        console.log(id)
        let records = null;
        let newSortDirection = ""
        const sorted = gridData.MetaData[id].sorted;
        if (sorted === "" || sorted === "D") {
            records = Data.records.sort((a, b) => b[id].toString().localeCompare(a[id].toString()));
            newSortDirection = "A"
        }
        else  {
            records = Data.records.sort((a, b) => a[id].toString().localeCompare(b[id].toString()));
            newSortDirection = "D"
        }

        setGridData({
            ...gridData,
            records : records,
            MetaData: {
                ...gridData.MetaData,
                [id] : {
                    ...gridData.MetaData[id],
                    sorted: newSortDirection
                }
            }
        })
    }

    return (
        !isLoading ?
        <GridTable className="grid-table">
            <button className="option-toggle-button" onClick={toggleOptionsMenu}>&#8285;</button>
            {/* grid dropdown options */}
            <GridOptions OptionsClassName="grid-options" OptionClassName="grid-option"
                toggleOptionsMenu={toggleOptionsMenu} ref={optionRef}> 
                {
                    Object.keys(gridData.MetaData).map(key => (
                        <GridOption checked={gridData.DisplayInfo.includes(key)} 
                            name={key} onChange={toggleDisplay}>
                            {gridData.MetaData[key].displayName}
                        </GridOption>
                    ))
                }
            </GridOptions>
            {/* grid header */}
            <GridRow className="grid-row grid-row-header">  
                {gridData.DisplayInfo.map(x => 
                    <GridItem draggable onDragStart={onDragStart} onDragOver={pd} onDrop={onDrop} 
                        className="grid-header-item" key={x} id={x} onClickSort={onClickSort}>
                        {gridData.MetaData[x].displayName}  
                        {gridData.MetaData[x].sorted === "A" ? <>   &#8593;</> : gridData.MetaData[x].sorted === "D" ? <>   &#8595;</> : ""}
                    </GridItem>
                )}
            </GridRow>
            {
                gridData.records.map(record => (
                    <GridRow className="grid-row">
                        {gridData.DisplayInfo.map(x => <GridItem className="grid-item" key={x}>
                            {typeof(record[x]) !== "boolean" ? record[x]
                                : <GridIsActive isActive={record[x]}/>}
                        </GridItem>)}
                    </GridRow>
                ))
            }
        </GridTable>
        : <h1>Loading Data!</h1>
    )
}

export default Grid



/*
   Create a gridContainer that Creates the grid and returns it and maintains a state and retunrs it
        Watch Container/Components and Compound components

        A grid class that takes ->
            1. The data (or fetch URL)
                1.1 Actual data to be displayed on the grid
                1.2 MetaData of columns and their types
                1.3 SortOrder
            2. A callback function for save (or fetch POST url)
                2.1 A boolean value for if order should persist
)
*/