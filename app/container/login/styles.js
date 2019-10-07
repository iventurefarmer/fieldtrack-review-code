import { StyleSheet } from 'react-native';
import { theme } from '../../utilities/color-palette';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingTop: 23
  },
  logo: {
    height: 100,
    width: '50%',
    resizeMode: 'contain',
    alignItems: 'flex-start',
    alignSelf: 'center'
  },
  inputText: {
    margin: 15,
    height: 40,
    borderColor: theme.primary.bgNormal,
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: theme.primary.bgNormal,
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    color: 'white',
    alignSelf: 'center'
  },
  submitButtonLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default styles;