import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, or use default
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#00f2fe', // --accent-aqua
    paddingBottom: 15,
    marginBottom: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#090a0f', // --bg-deep
  },
  docDetails: {
    textAlign: 'right',
  },
  docName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#090a0f',
  },
  textMuted: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  patientSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#090a0f',
  },
  meta: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
  },
  diagnosisSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00f2fe',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  diagnosisText: {
    fontSize: 12,
    color: '#090a0f',
    lineHeight: 1.5,
  },
  table: {
    width: 'auto',
    marginBottom: 25,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#090a0f',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: '#333333',
    padding: 8,
  },
  col1: { width: '35%' },
  col2: { width: '20%' },
  col3: { width: '25%' },
  col4: { width: '20%' },
  notesSection: {
    marginTop: 10,
  },
  notesText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
  }
});

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration_days: string;
  notes: string;
}

interface PrescriptionPDFProps {
  doctorName: string;
  doctorSpecialty?: string;
  patientName: string;
  patientAge?: string;
  patientGender?: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  generalNotes?: string;
}

export const PrescriptionPDF = ({
  doctorName,
  doctorSpecialty = "General Practitioner",
  patientName,
  patientAge = "-",
  patientGender = "-",
  date,
  diagnosis,
  medicines,
  generalNotes
}: PrescriptionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>CareVerse</Text>
          <Text style={styles.textMuted}>Digital Health Platform</Text>
        </View>
        <View style={styles.docDetails}>
          <Text style={styles.docName}>Dr. {doctorName}</Text>
          <Text style={styles.textMuted}>{doctorSpecialty}</Text>
          <Text style={styles.textMuted}>Date: {date}</Text>
        </View>
      </View>

      {/* Patient Info */}
      <View style={styles.patientSection}>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patientName}</Text>
          <Text style={styles.meta}>Age: {patientAge} • Gender: {patientGender}</Text>
        </View>
      </View>

      {/* Diagnosis */}
      <View style={styles.diagnosisSection}>
        <Text style={styles.sectionTitle}>Diagnosis</Text>
        <Text style={styles.diagnosisText}>{diagnosis || 'No specific diagnosis provided.'}</Text>
      </View>

      {/* Medicines Table */}
      <View style={styles.diagnosisSection}>
        <Text style={styles.sectionTitle}>Medications</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Medicine</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Dosage</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Frequency</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Duration</Text>
          </View>
          {medicines.map((med, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.col1}>
                <Text style={styles.tableCell}>{med.name}</Text>
                {med.notes && <Text style={{ fontSize: 8, color: '#666', paddingLeft: 8 }}>{med.notes}</Text>}
              </View>
              <Text style={[styles.tableCell, styles.col2]}>{med.dosage}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{med.frequency}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{med.duration_days} days</Text>
            </View>
          ))}
        </View>
      </View>

      {/* General Notes */}
      {generalNotes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Doctor&apos;s Notes</Text>
          <Text style={styles.notesText}>{generalNotes}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a digitally generated prescription and does not require a physical signature.
        </Text>
        <Text style={styles.footerText}>Generated via CareVerse</Text>
      </View>
    </Page>
  </Document>
);
