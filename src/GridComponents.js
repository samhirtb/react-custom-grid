
import React, {forwardRef} from 'react'

const GridTable = ({className, children}) => <div className={className}>{children}</div>

const GridRow = ({className, children}) => <div className={className}>{children}</div>

const GridItem = ({draggable, className, children, onDragStart, onDragOver, onDrop, id, onClickSort}) => {
    return (
        <span draggable={draggable} className={className} id={id} onDoubleClick={onClickSort}
            onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>
            {children}
        </span>
    )
}

const GridOptions = forwardRef(({OptionsClassName, OptionClassName, children}, ref) => (
    <ul className={OptionsClassName} onMouseOut={(e) => e.target.blur()} ref={ref} tabIndex="-1">
        {children.map(child => <li className={OptionClassName}>{child}</li>)}
    </ul>
))

const GridOption = ({children, className, checked, name, onChange}) => {
    return (
        <label className={className}>
            <input type="checkbox" checked={checked} name={name} onChange={onChange}/>
            {children}
        </label>
    )
}

const GridIsActive = ({isActive}) => {
    return (
        <div className={`grid-active ${!isActive ? "grid-inactive" : ""}`}></div>
    )
}

export {GridTable, GridRow, GridItem, GridOptions, GridOption, GridIsActive}

