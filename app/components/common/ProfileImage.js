import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Thumbnail } from 'native-base';

const ProfileImage = (props) => (
    <View style={styles.container}>
        {props.url === null || props.url === '' || props.url === undefined ?
            <Thumbnail large
                source={props.placeholder}
                style={[styles.img, props.style]}
            />
            :
            <Thumbnail large
                source={{ uri: `data:image/png;base64,${props.url}` }}
                style={[styles.img, props.style]}
            />
        }

        {props.editOption ?
            <TouchableOpacity onPress={props.openGallery.bind(this)} style={{ position: 'absolute', right: 0, bottom: 10 }}>
                <Image source={require('../../assets/edit.png')} style={styles.editImage} />
            </TouchableOpacity>
            : null
        }
    </View>
);

const styles = {
    container: {
        alignSelf: 'center'
    },
    img: {
        marginTop: 10,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    editImage: {
        height: 30,
        width: 30
    }
};

export { ProfileImage };