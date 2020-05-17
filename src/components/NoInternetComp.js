import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const NoInternetComp = props => {
  const {
    donePress = () => {},
    cancelPress = () => {},
    infoText = '',
    titleText = '',
    buttonText = '',
    buttonCancelText = '',
  } = props;

  const cicleStyle = [
    {backgroundColor: '#6EB115'},
    {backgroundColor: '#D32F2F'},
  ];

  // const iconType = 'emoticon-sad-outline';

  const buttonContainerStyle = buttonCancelText
    ? styles.left5Containerstyle
    : styles.fl1;

  return (
    <View style={styles.padding20CenterStyle}>
      <View style={styles.modalCenterContainerStyle}>
        <View style={styles.fl1}>
          <View style={styles.height40} />
          <View style={styles.infopostionContainerStyle}>
            <View style={[styles.circleContainerStyle, cicleStyle]}>
              {/* <Icon name={iconType} size={40} color="white" /> */}
            </View>
          </View>
          <Text style={styles.modalTitleText}>{titleText}</Text>
          {infoText ? (
            <ScrollView style={styles.fl1}>
              <View style={styles.paddingHorizontal20Flex}>
                <Text style={styles.titleAnimatedText}>{infoText}</Text>
              </View>
            </ScrollView>
          ) : null}
        </View>
        <View style={styles.divider5Style} />
        <View style={styles.rowCenterContainerStyle}>
          {buttonCancelText ? (
            <View style={styles.right5Containerstyle}>
              <ButtonComp
                isGray
                buttonText={buttonCancelText}
                iconName="close-circle-outline"
                onClick={cancelPress}
              />
            </View>
          ) : null}
          <View style={buttonContainerStyle}>
            <ButtonComp
              isMain
              buttonText={buttonText}
              iconName="check-circle-outline"
              onClick={donePress}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const ButtonComp = props => {
  const {
    buttonText = '',
    loading = false,
    isDisable = false,
    onClick = () => {},
  } = props;

  const buttonStyles = [styles.buttonMainStyle, styles.moreContentContainer];

  const textStyles = [
    styles.primaryColorText15Style,
    styles.whiteColorText15Style,
  ];

  const isColor = '#fff';

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onClick}
      disabled={isDisable}
      activeOpacity={0.5}>
      <Text />
      {loading && (
        <ActivityIndicator
          size="small"
          color={isColor}
          style={styles.marRight10}
        />
      )}
      <Text style={textStyles}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  left5Containerstyle: {
    flex: 1,
    marginLeft: -5,
  },
  fl1: {
    flex: 1,
  },
  padding20CenterStyle: {
    padding: 20,
    flex: 1,
  },
  modalCenterContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
  },
  marRight10: {
    marginRight: 10,
  },
  height40: {
    height: 40,
  },
  infopostionContainerStyle: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  circleContainerStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.chatConnect,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.62,
    elevation: 5,
  },
  divider5Style: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#D0D0D0',
  },
  modalTitleText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginHorizontal: 10,
  },
  paddingHorizontal20Flex: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
  },
  titleAnimatedText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  rowCenterContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right5Containerstyle: {
    flex: 1,
    marginRight: -5,
  },
  buttonMainStyle: {
    borderColor: 'transparent',
    borderRadius: 20,
    height: 40,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  moreContentContainer: {
    backgroundColor: '#154D9E',
  },
  primaryColorText15Style: {
    color: '#154D9E',
    fontSize: 15,
  },
  whiteColorText15Style: {
    color: '#fff',
    fontSize: 15,
  },
});

export default NoInternetComp;
