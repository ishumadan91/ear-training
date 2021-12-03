
import React from 'react';
import { isTouchDevice } from '../utils/common';

export default class Draggable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isDragging: false,

            originalX: 0,
            originalY: 0,

            translateX: 0,
            translateY: 0,

            lastTranslateX: 0,
            lastTranslateY: 0,

            isTouchDecide: isTouchDevice()
        };
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
    }

    componentWillUnmount() {
        if(!this.state.isTouchDecide) {
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseup', this.handleMouseUp);
        }
    }

    handleMouseDown(e) {
        const obj = e.touches && e.touches.length?e.touches[0]:e
        const { clientX, clientY } = obj
        console.log('*********** handle mouse down *********', clientX, clientY)
        if(!this.state.isTouchDecide) {
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('mouseup', this.handleMouseUp);
        }

        if (this.props.onDragStart) {
        this.props.onDragStart();
        }

        this.setState({
            originalX: clientX,
            originalY: clientY,
            isDragging: true
        });
    }

    handleMouseMove (e) {
        const obj = e.touches && e.touches.length?e.touches[0]:e
        const { clientX, clientY } = obj
        console.log('*********** handle mouse move *********', clientX, clientY)
        const { isDragging } = this.state;
        const { onDrag } = this.props;

        if (!isDragging) {
            return;
        }

        this.setState(prevState => ({
            translateX: clientX - prevState.originalX + prevState.lastTranslateX,
            //   translateY: clientY - prevState.originalY + prevState.lastTranslateY
            }), () => {
            if (onDrag) {
                onDrag({
                translateX: this.state.translateX,
                //   translateY: this.state.translateY
                });
            }
        });
    }

    handleMouseUp() {
        if(!this.state.isTouchDecide) {
            window.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseup', this.handleMouseUp);
        }

        this.setState(
            {
                originalX: 0,
                originalY: 0,
                lastTranslateX: this.state.translateX,
                lastTranslateY: this.state.translateY,

                isDragging: false
            },
            () => {
                if (this.props.onDragEnd) {
                this.props.onDragEnd();
                }
            }
        );
    }

    render() {
    const { Component } = this.props;
    const { translateX, translateY, isDragging } = this.state;

        return (
            <Component
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                x={translateX}
                y={translateY}
                isDragging={isDragging}
                {...this.props}
            />
        );
    }
}
