import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import '../css/Toggle.css';
/**
- Um checkbox enfeitado por botoes deslizantes
- Seu estado deve ser controlado passando props
*/


class Toggle extends React.Component {
    constructor(){
        super();
        this._ref = React.createRef();
    }

    render(){
        let {title, className, defaultChecked, label, children, ref} = this.props;
        ref = ref || this._ref; // Referencia ao objeto
        let cls = classNames('Toggle', className); // className do toggle
        let clsIcone = classNames('material-icons', {
            'text-red': defaultChecked === true,
            '': defaultChecked === false
        })
        return <label title={title} className={cls} htmlFor="">
            <span className={defaultChecked ? 'text-red' : ''}>{label || children}</span>
            <input onChange={this.props.onChange} defaultChecked={defaultChecked} ref={ref} type="checkbox" name="" id=""/>
            <i className={clsIcone}>{defaultChecked ? 'toggle_on' : 'toggle_off'}</i>
        </label>
    }

    componentDidMount(){
        ReactDOM.findDOMNode(this).addEventListener('click', ()=>{
            this._ref.current.click();
        })
    }
}

Toggle.defaultProps = {    
    title: "ALTERAR ENTRE AS OPCOES",
    className: '', 
    defaultChecked: false, 
    label: 'DESATIVADO', 
    children: null, 
    ref: null
}

Toggle.propTypes = {
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool.isRequired,
    label: PropTypes.any,
    children: PropTypes.any,
}

export default Toggle