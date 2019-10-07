import { AsyncStorage } from 'react-native';


async function storeItem(key, item) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        return await AsyncStorage.setItem(key, item);
    } catch (error) {
        //console.log(error.message);
    }
}

//the functionality of the retrieveItem is shown below
async function retrieveItem(key) {
    try {
        const retrievedItem = await AsyncStorage.getItem(key);
        return JSON.parse(retrievedItem);
    } catch (error) {
        //console.log(error.message);
    }
}

//the functionality of the removeItem is shown below
async function removeItem(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}

//the functionality of the removeItem is shown below
async function removeAll() {
    try {
        await AsyncStorage.clear(() => {
            return true;
        }, (error) => {
            return false;
        });
    }
    catch (exception) {
        return false;
    }
}


export { storeItem, retrieveItem, removeItem, removeAll };