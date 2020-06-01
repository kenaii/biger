import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

export const checkUpdate = _result => {
  const version = DeviceInfo.getVersion();
  const _version = parseInt(version.replace(/\./g, ''));
  if (
    Platform.OS === 'ios' &&
    parseInt(_result.ios.replace(/\./g, '')) > _version
  ) {
    return true;
  }
  if (
    Platform.OS === 'android' &&
    parseInt(_result.android.replace(/\./g, '')) > _version
  ) {
    return true;
  }

  return false;
};
