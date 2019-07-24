
import PropTypes from 'prop-types';

export const Tagpill = (props) => {
    return (<span>{props.item}</span>)
}


Tagpill.propTypes = {
    item:PropTypes.string.isRequired
}

Tagpill.defaultProps = {
    item:'tech'
}