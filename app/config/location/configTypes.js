import PropTypes from 'prop-types'

const commonTypes = {
  desiredAccuracy: PropTypes.number,
  stationaryRadius: PropTypes.number,
  distanceFilter: PropTypes.number,
  debug: PropTypes.bool,
  startForeground: PropTypes.bool,
  stopOnStillActivity: PropTypes.bool,
  stopOnTerminate: PropTypes.bool,
  maxLocations: PropTypes.number,
  url: PropTypes.string,
  syncUrl: PropTypes.string,
  syncThreshold: PropTypes.number
}

const androidConfig = {
  interval: PropTypes.number,
  fastestInterval: PropTypes.number,
  activitiesInterval: PropTypes.number,
  locationProvider: PropTypes.number,
  startOnBoot: PropTypes.bool,
  notificationTitle: PropTypes.string,
  notificationText: PropTypes.string,
  notificationIconColor: PropTypes.string
}

export default (commonTypes, androidConfig)
