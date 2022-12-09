import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const InvoiceV1 = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>SkillCounty</Text>
      </View>
      <View style={styles.section}>
        <Text>s759Labs</Text>
      </View>
    </Page>
  </Document>
);

export default InvoiceV1;
