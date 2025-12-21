import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Dummy quotes data
const QUOTES = [
  {
    id: 1,
    text: 'जीवन एक सुंदर यात्रा है। हर दिन नया अवसर लेकर आता है।',
    language: 'Marathi',
  },
  {
    id: 2,
    text: 'सपने वो नहीं जो नींद में आए, सपने वो हैं जो नींद उड़ा दें।',
    language: 'Hindi',
  },
  {
    id: 3,
    text: 'Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.',
    language: 'English',
  },
  {
    id: 4,
    text: 'मन के हारे हार है, मन के जीते जीत।',
    language: 'Hindi',
  },
  {
    id: 5,
    text: 'The only way to do great work is to love what you do.',
    language: 'English',
  },
];

const HomeScreen = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('MR');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({x: gesture.dx, y: 0});
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right - previous quote
          swipeCard('right');
        } else if (gesture.dx < -120) {
          // Swipe left - next quote
          swipeCard('left');
        } else {
          // Return to original position
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const swipeCard = (direction: 'left' | 'right') => {
    const x = direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'left') {
        setCurrentQuoteIndex((currentQuoteIndex + 1) % QUOTES.length);
      } else {
        setCurrentQuoteIndex(
          currentQuoteIndex === 0 ? QUOTES.length - 1 : currentQuoteIndex - 1,
        );
      }
      position.setValue({x: 0, y: 0});
      setIsLiked(false);
      setIsSaved(false);
    });
  };

  const cycleLanguage = () => {
    const languages = ['MR', 'HI', 'EN'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
    Alert.alert('Language Changed', `Language set to ${languages[nextIndex]}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(isSaved ? 'Removed from Saved' : 'Saved Successfully');
  };

  const handleCopy = async () => {
    try {
      await Share.share({
        message: QUOTES[currentQuoteIndex].text,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to copy');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: QUOTES[currentQuoteIndex].text,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share');
    }
  };

  const handleMenu = () => {
    Alert.alert('Menu', 'Categories coming soon!');
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    return {
      ...styles.quoteCard,
      transform: [{translateX: position.x}, {rotate}],
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleMenu}
          activeOpacity={0.7}>
          <Icon name="menu-outline" size={28} color="#2E7DFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Quotee</Text>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={cycleLanguage}
          activeOpacity={0.7}>
          <Text style={styles.languageText}>{currentLanguage}</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={getCardStyle()}>
          <View style={styles.cardInner}>
            <Icon
              name="quote"
              size={40}
              color="#2E7DFF"
              style={styles.quoteIcon}
            />
            <Text style={styles.quoteText}>
              {QUOTES[currentQuoteIndex].text}
            </Text>
            <View style={styles.swipeHint}>
              <Icon name="chevron-back" size={20} color="#C0C0C0" />
              <Text style={styles.swipeHintText}>Swipe to change</Text>
              <Icon name="chevron-forward" size={20} color="#C0C0C0" />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF4458' : '#666'}
          />
          <Text style={styles.actionLabel}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Icon
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? '#2E7DFF' : '#666'}
          />
          <Text style={styles.actionLabel}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopy}
          activeOpacity={0.7}>
          <MaterialIcon name="content-copy" size={24} color="#666" />
          <Text style={styles.actionLabel}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}>
          <Icon name="share-social-outline" size={24} color="#666" />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* AdMob Banner Placeholder - Commented out to remove gap above system navigation */}
      {/* <View style={styles.adBanner}>
        <Text style={styles.adText}>Ad Banner Placeholder</Text>
        <Text style={styles.adSubText}>320 x 50</Text>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7DFF',
    letterSpacing: 0.5,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2E7DFF',
    minWidth: 44,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7DFF',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  quoteCard: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardInner: {
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 20,
    opacity: 0.3,
  },
  quoteText: {
    fontSize: 22,
    lineHeight: 34,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  swipeHintText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginHorizontal: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    minWidth: 60,
  },
  actionLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  adBanner: {
    height: 60,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D0D0D0',
  },
  adText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
  },
  adSubText: {
    fontSize: 10,
    color: '#AAAAAA',
    marginTop: 2,
  },
});

export default HomeScreen;
