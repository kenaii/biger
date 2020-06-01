import React from 'react';
import {View, Modal, ActivityIndicator, StyleSheet} from 'react-native';

const ActivityIndicatorComp = ({loading = false}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.opacityCenterBlackContainerStyle}>
        <View style={styles.activityIndicatorWrapperStyle2}>
          <ActivityIndicator size="large" color="#f66725" animating={loading} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  opacityCenterBlackContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapperStyle: {
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrapperStyle2: {
    padding: 5,
    paddingBottom: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightWidth100: {
    width: 100,
    height: 100,
  },
});

export default ActivityIndicatorComp;
