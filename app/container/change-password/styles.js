import { StyleSheet } from 'react-native';
import { theme } from '../../utilities/color-palette';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#eee'
    },
    label: {
        marginLeft: 15,
        marginTop: 15,
        marginBottom: 10,
        color: '#000',
        fontWeight: 'bold'
    },
    inputtext: {
        marginLeft: 15,
        borderWidth: 1,
        marginRight: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingLeft: 20,
        borderColor: '#888',
        height: 40
    },
    button: {
        marginLeft: 15,
        marginTop: 20,
        marginRight: 15,
        backgroundColor: theme.primary.bgNormal,
        borderRadius: 10
    },
    buttontext: {
        fontWeight: 'bold'
    }
});