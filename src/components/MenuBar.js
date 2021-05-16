import React from 'react';
import Icon, { ICON_TYPES } from './Icon';

const MenuBar = () => {
    return (
        <div>
            <ul className="menu-bar-list">
                <li>
                    <a>
                        <span>Western</span>
                        <div style={{marginTop: '5px'}}>
                            <Icon type={ICON_TYPES.toggle} size={24} />
                        </div>
                    </a>
                </li>
                <li>
                    <a>
                        <span>A major</span>
                        <Icon type={ICON_TYPES.scale} size={36} />
                    </a>
                </li>
                <li>
                    <a>
                        <span>90bpm - 5</span>
                        <Icon type={ICON_TYPES.rhythm} size={49} height={32} />
                    </a>
                </li>
                <li>
                    <a>
                        <span>C3 - B4</span>
                        <div style={{marginTop: '-4px'}}>
                            <Icon type={ICON_TYPES.range} size={50} />
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    )
}
export default MenuBar