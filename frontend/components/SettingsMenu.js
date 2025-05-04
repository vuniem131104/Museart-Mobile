import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, Switch, SafeAreaView, Modal, TouchableOpacity, Animated, TextInput, ActivityIndicator, Alert } from "react-native";
import { Padding, Color, FontSize, Border, FontFamily } from "../../GlobalStyles";
import ButtonPrimary from "../button/ButtonPrimary";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../store";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const ModalComponent = ({ visible, onClose, title, content, colors }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(0));
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }
              ],
            },
          ]}
        >
          <LinearGradient
            colors={isDarkMode 
              ? [colors.primary, colors.primaryContainer] 
              : [colors.primary, colors.primaryFixed]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                {title === "Về chúng tôi" ? (
                  <FontAwesome5 name="info-circle" size={24} color={colors.onPrimary} />
                ) : (
                  <FontAwesome5 name="comment-alt" size={24} color={colors.onPrimary} />
                )}
                <Text style={[styles.modalTitle, { color: colors.onPrimary }]}>
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.onPrimary + '20' }]}
                onPress={onClose}
              >
                <Ionicons name="close-circle" size={24} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          
          <View style={[styles.modalBody, { backgroundColor: colors.surfaceContainerHigh }]}>
            <View style={styles.contentContainer}>
              {title === "Về chúng tôi" ? (
                <>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name="palette" size={40} color={colors.primary} />
                  </View>
                  <Text style={[styles.modalText, { color: colors.onSurface }]}>
                    {content}
                  </Text>
                  <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                      <FontAwesome5 name="paint-brush" size={20} color={colors.primary} />
                      <Text style={[styles.featureText, { color: colors.onSurface }]}>
                        Khám phá nghệ thuật
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <FontAwesome5 name="users" size={20} color={colors.primary} />
                      <Text style={[styles.featureText, { color: colors.onSurface }]}>
                        Cộng đồng nghệ thuật
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <FontAwesome5 name="lightbulb" size={20} color={colors.primary} />
                      <Text style={[styles.featureText, { color: colors.onSurface }]}>
                        Nguồn cảm hứng sáng tạo
                      </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name="envelope" size={40} color={colors.primary} />
                  </View>
                  <Text style={[styles.modalText, { color: colors.onSurface }]}>
                    {content}
                  </Text>
                  <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackItem}>
                      <FontAwesome5 name="star" size={20} color={colors.primary} />
                      <Text style={[styles.feedbackText, { color: colors.onSurface }]}>
                        Đánh giá ứng dụng
                      </Text>
                    </View>
                    <View style={styles.feedbackItem}>
                      <FontAwesome5 name="bug" size={20} color={colors.primary} />
                      <Text style={[styles.feedbackText, { color: colors.onSurface }]}>
                        Báo lỗi
                      </Text>
                    </View>
                    <View style={styles.feedbackItem}>
                      <FontAwesome5 name="lightbulb" size={20} color={colors.primary} />
                      <Text style={[styles.feedbackText, { color: colors.onSurface }]}>
                        Góp ý tính năng
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.modalButtons}>
              <LinearGradient
                colors={isDarkMode 
                  ? [colors.primary, colors.primaryContainer] 
                  : [colors.primary, colors.primaryFixed]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalButton}
              >
                <TouchableOpacity
                  style={styles.gradientButton}
                  onPress={onClose}
                >
                  <FontAwesome5 name="check" size={20} color={colors.onPrimary} />
                  <Text style={[styles.modalButtonText, { color: colors.onPrimary }]}>
                    Đóng
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const SettingsModal = ({ visible, onClose, colors }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnim] = useState(new Animated.Value(0));
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('vi');

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }
              ],
            },
          ]}
        >
          <LinearGradient
            colors={isDarkMode 
              ? [colors.primary, colors.primaryContainer] 
              : [colors.primary, colors.primaryFixed]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.modalHeader}>
              <View style={styles.titleContainer}>
                <FontAwesome5 name="cog" size={24} color={colors.onPrimary} />
                <Text style={[styles.modalTitle, { color: colors.onPrimary }]}>
                  Cài đặt
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.onPrimary + '20' }]}
                onPress={onClose}
              >
                <Ionicons name="close-circle" size={24} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          
          <View style={[styles.modalBody, { backgroundColor: colors.surfaceContainerHigh }]}>
            <View style={styles.settingsContainer}>
              {/* Chế độ tối */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <FontAwesome5 name="moon" size={20} color={colors.primary} />
                  <Text style={[styles.settingText, { color: colors.onSurface }]}>
                    Chế độ tối
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: '#616057', true: '#767577' }}
                  thumbColor={isDarkMode ? '#f4f3f4' : '#ebe134'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => dispatch(toggleTheme())}
                  value={isDarkMode}
                />
              </View>

              {/* Thông báo */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <FontAwesome5 name="bell" size={20} color={colors.primary} />
                  <Text style={[styles.settingText, { color: colors.onSurface }]}>
                    Thông báo
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: '#616057', true: '#767577' }}
                  thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setNotificationsEnabled}
                  value={notificationsEnabled}
                />
              </View>

              {/* Âm thanh */}
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <FontAwesome5 name="volume-up" size={20} color={colors.primary} />
                  <Text style={[styles.settingText, { color: colors.onSurface }]}>
                    Âm thanh
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: '#616057', true: '#767577' }}
                  thumbColor={soundEnabled ? colors.primary : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setSoundEnabled}
                  value={soundEnabled}
                />
              </View>

              {/* Phiên bản */}
              <View style={styles.versionContainer}>
                <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>
                  Phiên bản 1.0.0
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const SettingsMenu = ({ closeMenu }) => {
  const { colors } = useTheme();
  const { logout, userToken, userInfo, setUserInfo } = useContext(AuthContext);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSwitch = () => {
    dispatch(toggleTheme());
  };

  const handleNavigation = (route, params = {}) => {
    closeMenu && closeMenu();
    navigation.navigate(route, params);
  };

  const handleAboutUs = () => {
    closeMenu && closeMenu();
    setShowAboutUs(true);
  };

  const handleFeedback = () => {
    closeMenu && closeMenu();
    setShowFeedback(true);
  };

  const handleProfilePress = () => {
    if (userToken) {
      closeMenu && closeMenu();
      setShowEditProfile(true);
    } else {
      closeMenu && closeMenu();
      Alert.alert(
        "Đăng nhập", 
        "Bạn cần đăng nhập để xem trang cá nhân",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng nhập", onPress: () => handleNavigation("SignIn") }
        ]
      );
    }
  };

  return (
    <View style={[styles.settingsMenu, {backgroundColor: colors.surfaceContainerHigh, shadowColor: colors.primaryShadow}]}>
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        colors={colors}
      />
      
      <ModalComponent
        visible={showAboutUs}
        onClose={() => setShowAboutUs(false)}
        title="Về chúng tôi"
        content="MuseArt là nền tảng khám phá và chia sẻ nghệ thuật. Chúng tôi cung cấp không gian để người dùng khám phá các tác phẩm nghệ thuật, chia sẻ cảm hứng sáng tạo và kết nối với cộng đồng nghệ thuật."
        colors={colors}
      />
      
      <ModalComponent
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
        title="Phản hồi"
        content="Chúng tôi rất mong nhận được phản hồi từ bạn! Vui lòng gửi phản hồi của bạn đến email: feedback@museart.com"
        colors={colors}
      />

      <MenuItem 
        colors={colors} 
        imageSource={isDarkMode ? require("../../assets/Explore2.png") : require("../../assets/explore.png")} 
        text="Về chúng tôi" 
        func={handleAboutUs} 
      />
      
      <MenuItem 
        colors={colors} 
        imageSource={isDarkMode ? require("../../assets/item.png") : require("../../assets/navbaritem.png")} 
        text="Cài đặt" 
        func={() => {
          closeMenu && closeMenu();
          setShowSettings(true);
        }} 
      />
      
      <MenuItem 
        colors={colors} 
        isDarkMode={isDarkMode} 
        imageSource={isDarkMode ? require("../../assets/Frame15.png") : require("../../assets/frame-141.png")} 
        text="Phản hồi" 
        func={handleFeedback} 
      />
      
      {userToken != null && userInfo && (
        <MenuItem 
          colors={colors} 
          isDarkMode={isDarkMode} 
          imageSource={isDarkMode ? require("../../assets/Explore2.png") : require("../../assets/explore.png")} 
          text={userInfo?.name || 'Người dùng'} 
          func={handleProfilePress}
        />
      )}
      
      {userToken == null ? (
        <View style={[styles.flexRow, styles.flexRowButton]}>
          <ButtonPrimary text="Đăng nhập"
            textSize={FontSize.labelLargeBold_size}
            textMargin={8}
            buttonPrimaryFlex={1}
            onPressButton={() => { handleNavigation("SignIn") }}
          />
          <ButtonPrimary text="Đăng ký"
            textSize={FontSize.labelLargeBold_size}
            buttonPrimaryBackgroundColor={colors.primaryFixed}
            buttonPrimaryMarginLeft={15}
            buttonPrimaryFlex={1}
            onPressButton={() => { handleNavigation("SignUp") }}
          />
        </View>
      ) : (
        <View style={[styles.flexRow, styles.flexRowButton]}>
          <ButtonPrimary text="Đăng xuất"
            textSize={FontSize.labelLargeBold_size}
            textMargin={8}
            buttonPrimaryFlex={1}
            onPressButton={() => { 
              try {
                logout();
                closeMenu && closeMenu();
              } catch (error) {
                console.error("Logout error:", error);
              }
            }}
          />
        </View>
      )}
      
      <View style={styles.themeToggleContainer}>
        <Text style={[styles.menuItemText, {color: colors.onSurface, marginBottom: 5}]}>
          {isDarkMode ? 'Chế độ tối' : 'Chế độ sáng'}
        </Text>
        <Switch
          trackColor={{ false: '#616057', true: '#767577' }}
          thumbColor={isDarkMode ? '#f4f3f4' : '#ebe134'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>
    </View>
  );
};

const MenuItem = ({ colors, imageSource, text, func }) => {
  return (
    <Pressable onPress={func} style={[styles.menuItem, styles.flexRow]}>
      <Image style={styles.menuItemImage} source={imageSource} />
      <Text style={[styles.menuItemText, {color: colors.onSurface}]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    marginTop: 5,
  },
  menuItemImage: {
    width: 25,
    height: 25,
  },
  menuItemText: {
    marginLeft: 10,
    marginTop: 2,
    fontFamily: FontFamily.labelLargeMedium,
    fontSize: FontSize.labelLargeBold_size,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexRowButton: {
    paddingTop: 10,
    justifyContent: "space-between",
  },
  settingsMenu: {
    width: 237,
    padding: Padding.p_3xs,
    justifyContent: "center",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    borderRadius: Border.br_3xs,
    marginTop: 13,
  },
  themeToggleContainer: {
    marginTop: 10,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientHeader: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: FontSize.titleLarge_size,
    fontFamily: FontFamily.titleLargeBold,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalText: {
    fontSize: FontSize.bodyLarge_size,
    fontFamily: FontFamily.bodyLargeRegular,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Border.br_3xs,
  },
  featureText: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.labelLargeMedium,
    flex: 1,
  },
  feedbackContainer: {
    width: '100%',
    gap: 16,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Border.br_3xs,
  },
  feedbackText: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.labelLargeMedium,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: Border.br_3xs,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalButtonText: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.labelLargeMedium,
  },
  settingsContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: FontSize.labelLargeBold_size,
    fontFamily: FontFamily.labelLargeMedium,
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: FontSize.labelSmall_size,
    fontFamily: FontFamily.labelSmallRegular,
  },
});

export default SettingsMenu; 