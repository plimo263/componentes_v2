import React from 'react';

const Manual = ({link, titulo})=>(
    <a rel="noopener noreferrer" target="_blank" style={styles} href={link}  title={titulo}>
        <i className="material-icons">menu_book</i>
    </a>
);

const styles = {
    color: 'white',
    fontFamily: 'cursive',
}
export default Manual