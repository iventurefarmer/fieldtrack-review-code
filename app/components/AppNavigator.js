import { createAppContainer } from 'react-navigation';
import { AppStackNavigator } from '../config/Routes';


const AppContainer = createAppContainer(AppStackNavigator);
export { AppContainer };
