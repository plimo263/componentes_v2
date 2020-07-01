import React from 'react'
import logoMenu from '../images/logo_menu.png'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import '../css/Logo.css'


const Logo = props =>{
    let className = classNames('Logo', props.className);
    
    return (<a style={props.style} className={className} href={props.href}>
        <img src={props.src} alt={props.alt} />
    </a>);
}

Logo.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    href: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
}

Logo.defaultProps = {
    className: '',
    style: {},
    href: window.location.href,
    src: logoMenu,
    alt: "LOGO",
}

export default Logo;