import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableOpacity } from 'react-native';

import { OwnerAvatar, Info, Title, Author } from './styles';

export default class Starred extends Component {
  static defaultProps = {
    index: 0,
  };

  static propTypes = {
    item: PropTypes.shape({
      animatedIndex: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        avatar_url: PropTypes.string,
        login: PropTypes.string,
      }).isRequired,
    }).isRequired,
    index: PropTypes.number,
    onTouch: PropTypes.func.isRequired,
  };

  state = {
    animateStar: new Animated.Value(0),
  };

  componentDidMount() {
    const { index } = this.props;
    const { animateStar } = this.state;
    Animated.timing(animateStar, {
      toValue: 1,
      duration: 700,
      delay: index * 30,
    }).start();
  }

  render() {
    const { item, onTouch } = this.props;
    const { animateStar } = this.state;
    return (
      <TouchableOpacity onPress={onTouch}>
        <Animated.View
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 15,
            paddingBottom: 15,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            transform: [
              {
                translateY: animateStar.interpolate({
                  inputRange: [0, 1],
                  outputRange: [700, 1],
                }),
              },
            ],
          }}
        >
          <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
          <Info>
            <Title>{item.name}</Title>
            <Author>{item.owner.login}</Author>
          </Info>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
