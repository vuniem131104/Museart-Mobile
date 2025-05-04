import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { FontFamily, FontSize, Padding, Border } from '../../GlobalStyles';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { submitFeedback } from '../../services/feedbackService';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const StarRating = ({ rating, setRating }) => {
  const { colors } = useTheme();
  
  const handleRating = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(value);
  };
  
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleRating(star)}
          style={styles.starButton}
        >
          {star <= rating ? (
            <MaterialIcons name="star" size={36} color="#FFC107" />
          ) : (
            <MaterialIcons name="star-border" size={36} color={colors.onSurfaceVarient} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FeedbackModal = ({ visible, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { colors } = useTheme();
  
  useEffect(() => {
    console.log('FeedbackModal visible state:', visible);
    if (visible) {
      // Reset form when modal opens
      setFeedback('');
      setRating(0);
      setIsSuccess(false);
    }
  }, [visible]);
  
  const resetForm = () => {
    setFeedback('');
    setRating(0);
    setIsSuccess(false);
  };
  
  const handleClose = () => {
    console.log('FeedbackModal close button pressed');
    resetForm();
    onClose();
  };
  
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitFeedback(feedback, rating > 0 ? rating : null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSuccess(true);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut" 
      backdropOpacity={0.7}
      backdropTransitionOutTiming={0}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      useNativeDriver={true}
      style={styles.modalContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.surfaceContainerHigh }]}>
            {isSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <MaterialIcons name="check-circle" size={120} color="#4CAF50" />
                </View>
                <Text style={[styles.successTitle, { color: colors.onSurface }]}>
                  Thank You!
                </Text>
                <Text style={[styles.successText, { color: colors.onSurfaceVarient }]}>
                  Your feedback has been successfully submitted.
                </Text>
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: colors.primary }]}
                  onPress={handleClose}
                >
                  <Text style={[styles.closeButtonText, { color: colors.onPrimary }]}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.feedbackIconContainer, { backgroundColor: colors.primaryFixed }]}>
                    <MaterialCommunityIcons name="message-text-outline" size={40} color={colors.onPrimary} />
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                    We Value Your Feedback
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: colors.onSurfaceVarient }]}>
                    Please share your thoughts to help us improve
                  </Text>
                </View>
                
                <StarRating rating={rating} setRating={setRating} />
                
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.feedbackInput,
                      { 
                        color: colors.onSurface,
                        backgroundColor: colors.surfaceContainerLowest,
                        borderColor: colors.outline
                      }
                    ]}
                    placeholder="What's on your mind?"
                    placeholderTextColor={colors.onSurfaceVarient}
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                  />
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: colors.outline }]}
                    onPress={handleClose}
                    disabled={isSubmitting}
                  >
                    <Text style={[styles.cancelText, { color: colors.onSurfaceVarient }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: colors.primary },
                      isSubmitting && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting || !feedback.trim()}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                      <Text style={[styles.submitText, { color: colors.onPrimary }]}>
                        Submit
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: '100%',
    borderRadius: Border.br_xl,
    padding: Padding.p_xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: FontSize.headline5Bold_size,
    fontFamily: FontFamily.labelMediumBold,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  starButton: {
    padding: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  feedbackInput: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderRadius: Border.br_3xs,
    padding: 15,
    textAlignVertical: 'top',
    fontFamily: FontFamily.typographyLabelLarge,
    fontSize: FontSize.size_sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: Border.br_3xs,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: FontFamily.typographyLabelLarge,
    fontSize: FontSize.size_sm,
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: Border.br_3xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    fontFamily: FontFamily.labelMediumBold,
    fontSize: FontSize.size_sm,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 10,
  },
  successTitle: {
    fontSize: FontSize.headline5Bold_size,
    fontFamily: FontFamily.labelMediumBold,
    marginVertical: 15,
  },
  successText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.typographyLabelLarge,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: Border.br_3xs,
  },
  closeButtonText: {
    fontFamily: FontFamily.labelMediumBold,
    fontSize: FontSize.size_sm,
  },
});

export default FeedbackModal; 