import React from 'react'
import $ from 'jquery'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'

class Sugestao extends React.Component {
    constructor(){
        super();
        this._id = Math.random().toString(16).substring(2);
    }
    static defaultProps = {
        onChange: ()=>{},
        defaultValue: '',
        disabled: false,
        required: false,
        className: ''
    }
    getValue(){
        return $(`#${this._id}INPUT`).val();
    }
    render(){
        let _id = this._id;
        let {disabled, required, onChange, defaultValue, itens, className, style} = this.props;
        className = ClassNames('form-control', className);
        return (
            [
                <input style={style} key='entrada-sugestao' id={_id+'INPUT'} className={className} 
                list={_id} defaultValue={defaultValue}
                onChange={onChange} disabled={disabled} required={required} />,
                <datalist key='entrada-datalist' id={_id}>
                {
                    itens.map((ele,idx)=>{
                        return <option value={ele} key={idx} />
                    })
                }
                </datalist>
            ]
        )
    }
}

Sugestao.propTypes = {
    itens: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
}


export default Sugestao