import {StyleSheet, Dimensions, Platform} from 'react-native';
import GoDeliveryColors from './colors';

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GoDeliveryColors.background,
  },
  contentAreaPadding: {
    paddingHorizontal: 20,
  },
  authenticationScreenLogoBack: {
    marginTop: 50,
    alignItems: 'center',
    height: 220,
    justifyContent: 'center',
    backgroundColor: GoDeliveryColors.white,
  },
  authenticationScreenLogo: {
    height: 220,
    resizeMode: 'contain',
  },
  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: GoDeliveryColors.secondary,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 8,
        shadowColor: GoDeliveryColors.secondary,
      },
    }),
  },
  primaryButton: {
    alignSelf: 'center',
    width: '100%',
    height: 50,
    backgroundColor: GoDeliveryColors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    color: GoDeliveryColors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  primaryEmphasizeLabel: {
    color: GoDeliveryColors.primary,
    fontSize: 12,
    fontWeight: '400',
  },
  primaryEmphasizeLabelHigher: {
    color: GoDeliveryColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  indicator: {
    borderWidth: 1,
    borderColor: 'red',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.secondary,
  },
  textBold: {
    fontSize: 12,
    fontWeight: '600',
    color: GoDeliveryColors.secondary,
  },
  textDisable: {
    fontSize: 12,
    fontWeight: '400',
    color: GoDeliveryColors.disabled,
  },
  diabledColor: {
    color: GoDeliveryColors.disabled,
  },
  assignedColor: {
    color: '#F47B0A',
  },
  processingColor: {
    color: '#FA4A0C',
  },
  textMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: GoDeliveryColors.secondary,
  },
  subTitleText: {
    fontSize: 18,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    color: GoDeliveryColors.primary,
    marginVertical: 15,
  },
  headerTitle: {
    color: GoDeliveryColors.secondary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GoDeliveryColors.secondary,
  },
  textFieldErrorMsgArea: {
    height: 30,
    paddingLeft: 20,
    color: GoDeliveryColors.primary,
  },
  authenticationHeaderTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: GoDeliveryColors.primary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15
  },
});

export default GlobalStyles;
