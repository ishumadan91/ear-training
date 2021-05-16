import React from 'react';
import Range from 'SvgIcons/Range';
import Rhythm from 'SvgIcons/Rhythm';
import Scale from 'SvgIcons/Scale';
import Toggle from 'SvgIcons/Toggle';
import ArrowLeft from 'SvgIcons/ArrowLeft';
import ArrowRight from 'SvgIcons/ArrowRight';
import Play from 'SvgIcons/Play';
import PlayCircle from 'SvgIcons/PlayCircle';
import Info from 'SvgIcons/Info';
import Reset from 'SvgIcons/Reset';
import Check from '../svgIcons/Check';

export const ICON_TYPES = {
    toggle: 'toggle',
    scale: 'scale',
    rhythm: 'rhythm',
    range: 'range',
    arrowLeft: 'arrow-left',
    arrowRight: 'arrow-right',
    play: 'play',
    playCircle: 'play-circle',
    info: 'info',
    reset: 'reset',
    check: 'check'
}
const iconsMapper = {
    [ICON_TYPES.range]: Range,
    [ICON_TYPES.scale]: Scale,
    [ICON_TYPES.rhythm]: Rhythm,
    [ICON_TYPES.toggle]: Toggle,
    [ICON_TYPES.arrowLeft]: ArrowLeft,
    [ICON_TYPES.arrowRight]: ArrowRight,
    [ICON_TYPES.play]: Play,
    [ICON_TYPES.playCircle]: PlayCircle,
    [ICON_TYPES.info]: Info,
    [ICON_TYPES.reset]: Reset,
    [ICON_TYPES.check]: Check
}
const Icon = ({size=24, height, type, color=null}) => {
    const Component = iconsMapper[type]
    if(!Component) {
        return null
    }
    return (
        <div className="icon" style={{width: `${size}px`, height: `${height || size}px`}}>
            <Component color={color || Component.defaultProps.color} />
        </div>
    )
}

export default Icon
