import React from 'react';

const Manual = ({link, titulo})=>(
    <a style={styles} href={link}  title={titulo}>
        <i className="material-icons">menu_book</i>
        <b style={{marginLeft: '3px'}}>{titulo}</b>
    </a>
);

const styles = {
    color: '',
    fontFamily: 'cursive',
    padding: '10px',
}
export default Manual