import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

// const mockGeolocation = {
//   getCurrentPosition: jest.fn(),
//   watchPosition: jest.fn()
// }

global.navigator = { /* geolocation: mockGeolocation  */}
