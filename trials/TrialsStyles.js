import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CustomSelect from '../../../../utils/CustomSelect';
import { BlurView } from 'expo-blur';


export const COLORS = {
  primary: '#0066cc',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    inverse: '#ffffff'
  },
  border: '#eeeeee',
  shadow: '#000000'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const RADII = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16
};

export const TYPOGRAPHY = {
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400'
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600'
  }
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
};
// Add these new styles to your existing StyleSheet
export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 20,
  },
  filterScroll: {
    maxHeight: '70%',
  },
  filterSection: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterSectionTitle: {
    ...TYPOGRAPHY.button,
    marginBottom: SPACING.md,
  },
  rangeInputContainer: {
    marginVertical: SPACING.md,
  },
  rangeLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
  },
  rangeSeparator: {
    marginHorizontal: SPACING.md,
  },
  checkboxContainer: {
    marginTop: SPACING.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
  },
  resetButton: {
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.primary,
  },
  applyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.inverse,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADII.md,
    marginHorizontal: SPACING.sm,
  },


    // Existing styles from the original component
    container: {
      flex: 1,
      padding: SPACING.lg,
      backgroundColor: COLORS.background
    },
    title: {
      ...TYPOGRAPHY.title,
      color: COLORS.text.primary,
      marginBottom: SPACING.lg
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: SPACING.lg,
      gap: SPACING.sm
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.md,
      ...SHADOWS.small
    },
    searchIcon: {
      marginRight: SPACING.sm
    },
    searchInput: {
      flex: 1,
      height: 40,
      ...TYPOGRAPHY.body,
      color: COLORS.text.primary
    },
    searchButton: {
      backgroundColor: COLORS.primary,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.lg,
      justifyContent: 'center',
      minWidth: 80
    },
    searchButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.inverse
    },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: RADII.md,
      marginBottom: SPACING.md,
      ...SHADOWS.medium
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.lg
    },
    expandedContent: {
      padding: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border
    },
    loader: {
      marginTop: SPACING.xxl
    },
    emptyText: {
      ...TYPOGRAPHY.body,
      textAlign: 'center',
      marginTop: SPACING.xxl,
      color: COLORS.text.secondary
    },
    listContainer: {
      paddingBottom: SPACING.lg
    },
    // New styles for the enhanced filter modal
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: COLORS.surface,
      borderTopLeftRadius: RADII.xl,
      borderTopRightRadius: RADII.xl,
      maxHeight: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    modalTitle: {
      ...TYPOGRAPHY.title,
      fontSize: 20,
    },
    filterScroll: {
      maxHeight: '70%',
    },
    filterSection: {
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    filterSectionTitle: {
      ...TYPOGRAPHY.button,
      marginBottom: SPACING.md,
    },
    rangeInputContainer: {
      marginVertical: SPACING.md,
    },
    rangeLabel: {
      ...TYPOGRAPHY.body,
      marginBottom: SPACING.sm,
    },
    rangeInputs: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rangeInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: RADII.md,
      paddingHorizontal: SPACING.md,
    },
    rangeSeparator: {
      marginHorizontal: SPACING.md,
    },
    checkboxContainer: {
      marginTop: SPACING.md,
    },
    checkbox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.sm,
    },
    checkboxLabel: {
      ...TYPOGRAPHY.body,
      marginLeft: SPACING.sm,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg, // Account for iOS bottom safe area
    },
    footerButton: {
      flex: 1,
      padding: SPACING.md,
      borderRadius: RADII.md,
      alignItems: 'center',
    },
    resetButton: {
      marginRight: SPACING.sm,
      backgroundColor: COLORS.background,
    },
    applyButton: {
      backgroundColor: COLORS.primary,
    },
    resetButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.primary,
    },
    applyButtonText: {
      ...TYPOGRAPHY.button,
      color: COLORS.text.inverse,
    },
    filterButton: {
      backgroundColor: COLORS.primary,
      padding: SPACING.md,
      borderRadius: RADII.md,
      marginHorizontal: SPACING.sm,
    },
    activeFilterBadge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: '#FF4444',
      borderRadius: 10,
      width: 10,
      height: 10,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.sm,
      padding: SPACING.md,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      borderRadius: RADII.xl,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
    },
    chipText: {
      ...TYPOGRAPHY.body,
      fontSize: 14,
      marginRight: SPACING.sm,
    },
    chipRemove: {
      padding: 2,
    }

});