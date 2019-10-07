import { Button } from '../common';
import React from 'react';


export const CameraView = ({ profilepic, openGallery, disabled }) => {
    return (
        <Button 
            title={'Camera'}
            onPress={openGallery.bind(this)}
            disabled={disabled}
        >
            Camera
        </Button>
    );
};