import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../css/Transicoes.css'
/**
- Um simples componente que envolve outro componente e gera um efeito fade In/Out.
*/
class Fade extends Component {
    render(){
        return <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
        >
        {this.props.children}
        </ReactCSSTransitionGroup>
    }
}


export default Fade;

