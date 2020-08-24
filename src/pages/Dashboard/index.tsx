import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  UserAvatarDefault,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText,
  ProvidersListTitle,
} from './styles';

export interface Providers {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Providers[]>([]);

  const { signOut, user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation.navigate]);

  const navigateToCreateAppointment = useCallback(
    (providerId: string) => {
      navigation.navigate('CreateAppointment', { providerId });
    },
    [navigation.navigate],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vinda, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={() => navigateToProfile()}>
          {user.avatar_url ? (
            <UserAvatar source={{ uri: user.avatar_url }} />
          ) : (
            <UserAvatarDefault>
              <Icon name="user" size={30} color="#999591" />
            </UserAvatarDefault>
          )}
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.avatar_url }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>
              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda a sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8hrs às 18hrs</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
