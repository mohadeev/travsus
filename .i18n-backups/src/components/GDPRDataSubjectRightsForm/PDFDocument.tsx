import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { formatDate } from '@/utils/formatDate'
import { companyProfile } from '@/constants/companyProfile'

// Register fonts for PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
})

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsSection: {
    borderTop: 1,
    borderBottom: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bullet: {
    width: 10,
  },
  footer: {
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
    marginTop: 30,
  },
  instructions: {
    marginTop: 20,
    fontSize: 9,
    color: '#4b5563',
  },
})

const PDFDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          src="https://www.travsus.com/_next/static/media/logo.d4fff429.png"
        />
        <View>
          <Text style={styles.title}>GDPR - Data Subject Rights Form</Text>
          <Text style={styles.subtitle}>{data.gdprRight}</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>1. Data Controller Details</Text>
        <Text style={styles.text}>Name: {companyProfile.fullLegalName}</Text>
        <Text style={styles.text}>Address: {companyProfile.legalAddress}</Text>
        <Text style={styles.text}>VAT: {companyProfile.vatNumber}</Text>
        <Text style={styles.text}>Registration Number: {companyProfile.registrationNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Data Subject Details</Text>
        <Text style={styles.text}>Full Name: {data.firstName || ''} {data.surname || ''}</Text>
        <Text style={styles.text}>Date of Birth: {data.dateOfBirth ? formatDate(data.dateOfBirth) : 'N/A'}</Text>
        <Text style={styles.text}>Address: {data.address || 'N/A'}</Text>
        <Text style={styles.text}>Phone Number: {data.mobileNo || 'N/A'}</Text>
        <Text style={styles.text}>Email: {data.email || 'N/A'}</Text>
        <Text style={styles.text}>Customer Type: {data.customerType || 'N/A'}</Text>
        {data.customerType === 'Other' && data.otherCustomerType && (
          <Text style={styles.text}>Other Type: {data.otherCustomerType}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Request Details</Text>
        <Text style={styles.text}>
          In accordance with the General Data Protection Regulation (GDPR), I hereby request to exercise my right to {data.gdprRight.toLowerCase()}. Please process this request within one month of receipt.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Specific Information Requested</Text>
        <Text style={styles.text}>{data.requestDetails}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Declaration</Text>
        <Text style={styles.text}>
          I, {data.firstName} {data.surname}, confirm that the information provided on this form is correct and that I am the data subject whose name appears on this form. I understand that {companyProfile.fullLegalName} may need to obtain more information to confirm my identity and to process my request.
        </Text>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.text}>1. Please complete this form and submit it to {companyProfile.fullLegalName}.</Text>
        <Text style={styles.text}>2. We will respond to your request within one month of receipt of a fully completed form and proof of identity.</Text>
        <Text style={styles.text}>3. If you are making the request on behalf of another person, please provide proof of your authority to do so.</Text>
        <Text style={styles.text}>4. For more information on your rights under GDPR, please visit the website of the Data Protection Commission at www.dataprotection.ie.</Text>
        <Text style={styles.text}>5. If you are not satisfied with the response you receive, you have the right to lodge a complaint with the Data Protection Commission.</Text>
      </View>

      <View style={styles.footer}>
        <Text>{companyProfile.fullLegalName} | {companyProfile.legalAddress}</Text>
        <Text>VAT: {companyProfile.vatNumber} | Reg. No: {companyProfile.registrationNumber}</Text>
        <Text>This form is a formal request to exercise your rights under the General Data Protection Regulation (GDPR).</Text>
      </View>
    </Page>
  </Document>
)

export default PDFDocument

