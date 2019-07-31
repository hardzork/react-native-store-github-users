import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-native-spinkit';
import { StyleSheet, View } from 'react-native';
import api from '../../services/api';
import Starred from '../../components/Starred';
import { Container, Header, Avatar, Name, Bio, Stars } from './styles';

const styles = StyleSheet.create({
  containerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    lastPage: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ loading: true });
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: 1,
      },
    });
    const newData = response.data.map((item, index) => ({
      ...item,
      animatedIndex: index,
    }));
    this.setState({ stars: newData, loading: false });
    if (response.headers.link) {
      const { last } = this.parseLinkHeader(response.headers.link);
      const [, lp] = last.split('page=');
      this.setState({ lastPage: lp });
    }
  }

  parseLinkHeader = link => {
    return link.split(/(?!\B"[^"]*),(?![^"]*"\B)/).reduce((links, part) => {
      const section = part.split(/(?!\B"[^"]*);(?![^"]*"\B)/);
      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      // eslint-disable-next-line no-param-reassign
      links[name] = url;
      return links;
    }, {});
  };

  viewMore = async () => {
    const { stars, page, lastPage } = this.state;
    if (page === lastPage) {
      return;
    }
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: page + 1,
      },
    });
    const newData = response.data.map((item, index) => ({
      ...item,
      animatedIndex: index,
    }));
    this.setState({ stars: [...stars, ...newData], page: page + 1 });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ refreshing: true });
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page: 1,
      },
    });
    const newData = response.data.map((item, index) => ({
      ...item,
      animatedIndex: index,
    }));
    this.setState({ stars: newData, refreshing: false, page: 1 });
    if (response.headers.link) {
      const { last } = this.parseLinkHeader(response.headers.link);
      const [, lp] = last.split('page=');
      this.setState({ lastPage: lp });
    }
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <View style={styles.containerSpinner}>
            <Spinner type="Pulse" color="#7159c1" size={100} />
          </View>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred
                item={item}
                index={item.index}
                onTouch={() => this.handleNavigate(item)}
              />
            )}
            onEndReachedThreshold={0.9}
            onEndReached={this.viewMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
          />
        )}
      </Container>
    );
  }
}
