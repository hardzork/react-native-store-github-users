import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-spinkit';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  containerSpinner: {
    flex: 1,
    alignItems: 'center',
  },
});

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    htmlUrl: '',
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({ htmlUrl: navigation.getParam('repository').html_url });
  }

  render() {
    const { htmlUrl } = this.state;
    return (
      <WebView
        source={{ uri: htmlUrl }}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.containerSpinner}>
            <Spinner type="Pulse" color="#7159c1" size={100} />
          </View>
        )}
      />
    );
  }
}
