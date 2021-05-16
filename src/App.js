import React from 'react';
import {useSelector} from 'react-redux';
import Icon, { ICON_TYPES } from './components/Icon';
import MenuBar from './components/MenuBar';
import Piano, { VIEW_TYPES } from './components/Piano';

const App = () => {
    const notation = useSelector(state => state.settings.notation)
    const range = useSelector(state => state.settings.range)
    return (
        <div className="container">
            <MenuBar />
            <Piano range={range} viewType={VIEW_TYPES.viewOnly} />
            <Piano range={range} viewType={VIEW_TYPES.range} />
            <Piano range={range} viewType={VIEW_TYPES.notesOnly} />
        </div>
    )
}

export default App
