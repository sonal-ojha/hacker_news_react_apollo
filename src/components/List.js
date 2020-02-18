import React from 'react';

const List = ({ url, description, id}) => (
    <div key={id}>
        <a href={url} >{description}</a>
    </div>
);

export default List;