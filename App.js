import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Snackbar from 'react-native-snackbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Clipboard from '@react-native-clipboard/clipboard';
import Tts from 'react-native-tts';

Tts.setDefaultLanguage('en-GB');
Tts.setDefaultVoice('com.apple.ttsbundle.Moira-compact');
Tts.setDefaultRate(0.5);
Tts.setDefaultPitch(1.2);

const App = () => {
  const [quote, setQuote] = useState('Loading...');
  const [author, setAuthor] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const randomQuote = () => {
    setIsLoading(true);
    fetch('https://api.quotable.io/random')
      .then(res => res.json())
      .then(result => {
        setAuthor(result.author);
        setQuote(result.content);
      });
    setIsLoading(false);
  };

  const speakNow = () => {
    Tts.stop();
    Tts.speak(quote + ' by ' + author);
    Tts.addEventListener('tts-start', event => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', event => setIsSpeaking(false));
  };

  const copyToClipboard = () => {
    Clipboard.setString(quote);
    Snackbar.show({
      text: 'Quote copied!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const tweetNow = () => {
    const url = 'https://twitter.com/intent/tweet?text=' + quote;
    Linking.openURL(url);
  };

  useEffect(() => {
    randomQuote();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.quotecontainer}>
        <FontAwesome5 name="quote-left" style={styles.quoteleft} color="#000" />
        <Text style={styles.quote}>{quote}</Text>
        <FontAwesome5
          name="quote-right"
          style={styles.quoteright}
          color="#000"
        />
        <Text style={styles.author}>{author}</Text>
        <TouchableOpacity
          onPress={randomQuote}
          style={[
            styles.quotebutton,
            {
              backgroundColor: isLoading
                ? 'rgba(83, 114, 240, 0.8)'
                : 'rgba(83, 114, 240, 1)',
            },
          ]}>
          <Text style={{fontSize: 18, textAlign: 'center', color: '#fff'}}>
            {isLoading ? 'Loading...' : 'New Quote'}
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity
            onPress={speakNow}
            style={{
              borderWidth: 2,
              borderColor: '#5372F0',
              borderRadius: 50,
              padding: 15,
              backgroundColor: isSpeaking ? '#5372F0' : '#fff',
            }}>
            <FontAwesome
              name="volume-up"
              size={22}
              color={isSpeaking ? '#fff' : '#5372F0'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={{
              borderWidth: 2,
              borderColor: '#5372F0',
              borderRadius: 50,
              padding: 15,
            }}>
            <FontAwesome5 name="copy" size={22} color="#5372F0" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={tweetNow}
            style={{
              borderWidth: 2,
              borderColor: '#5372F0',
              borderRadius: 50,
              padding: 15,
            }}>
            <FontAwesome name="twitter" size={22} color="#5372F0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5372F0',
  },
  quotecontainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  quoteleft: {
    fontSize: 20,
    marginBottom: -12,
  },
  quote: {
    color: '#000',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 1.1,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  quoteright: {
    fontSize: 20,
    textAlign: 'right',
    marginTop: -20,
    marginBottom: 20,
  },
  author: {
    textAlign: 'right',
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000',
  },
  quotebutton: {
    padding: 20,
    borderRadius: 30,
    marginVertical: 20,
  },
});
