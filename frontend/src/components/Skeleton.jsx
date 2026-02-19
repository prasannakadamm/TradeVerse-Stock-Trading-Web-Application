import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius = '8px', style }) => {
    return (
        <div
            className="skeleton"
            style={{
                width,
                height,
                borderRadius,
                ...style
            }}
        />
    );
};

export default Skeleton;
