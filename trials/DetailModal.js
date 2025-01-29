import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  
  
  export const TrialDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={detailModalVisible}
      onRequestClose={() => setDetailModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Trial Details</Text>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {selectedTrial && (
              <>
                <View style={styles.trialHeader}>
                  <View style={[
                    styles.statusBadge,
                    styles[`status${selectedTrial.Status.replace(/\s+/g, '')}`]
                  ]}>
                    <Text style={[
                      styles.statusText,
                      styles[`statusText${selectedTrial.Status.replace(/\s+/g, '')}`]
                    ]}>
                      {selectedTrial.Status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.trialTitle}>{selectedTrial.Title}</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>CTA Number</Text>
                  <Text style={styles.detailText}>{selectedTrial.CTA}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Principal Investigator</Text>
                  <View style={styles.infoRow}>
                    <Icon name="account" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{selectedTrial.Principal_Investigator}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Institution</Text>
                  <View style={styles.infoRow}>
                    <Icon name="hospital-building" size={20} color="#6b7280" />
                    <Text style={styles.infoText}>{selectedTrial.Institution}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Sponsor</Text>
                  <Text style={styles.detailText}>{selectedTrial.Sponsor || 'Not specified'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Date of Initial Authorization</Text>
                  <Text style={styles.detailText}>{selectedTrial.Date_of_Initial_Authorization}</Text>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );