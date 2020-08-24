import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    paddingBottom: Platform.OS === 'android' ? 150 : 100,
  },
})`
  flex: 1;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 60px;
`;

export const Logo = styled.Image`
  align-self: center;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #f4ede8;
  margin: 64px 0 24px;
  align-self: center;
`;

export const BackToSignInButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: #312e38;
  border-top-width: 1px;
  border-color: #232129;

  padding: 16px 0 ${16 + getBottomSpace()}px;
`;

export const BackToSignInButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;
