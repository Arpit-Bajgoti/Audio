const Quixote = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>SkillCounty</Text>
            <Text style={styles.subtitle}>s759labs</Text>
            <Text>Pune, India</Text>
          </View>
          <View>
            <Text>Invoice</Text>
            <Text style={styles.date}>24 Jan 2022</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text>Company Name</Text>
        <Text>Daily Mail</Text>
        <Text>New York</Text>
        <Text>United States</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Particulars
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.contents}>
          <Text style={styles.contentsText}>
            Base Subscription (1 Month)
          </Text>
          <Text style={styles.contentsText}>
            Rs. 5000
          </Text>
        </View>
        <View style={styles.contents}>
          <Text style={styles.contentsText}>
            Tax GST @ 17%
          </Text>
          <Text style={styles.contentsText}>
            Rs. 100
          </Text>
        </View>
        <View style={styles.contents}>
          <Text style={styles.contentsText}>
            Total
          </Text>
          <Text style={styles.contentsText}>
            Rs. 5100
          </Text>
        </View>
        <View>
          <Text>
            Payment Notes
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    border: "2px dashed black",
    color: "#4a4a4a",
  },
  heading:{
    fontSize: "32px",
    fontWeight: 1000,
    fontFamily: "Oswald",
    color: "#236da5"
  },
  subtitle: {
    fontSize: "24px"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: "16px"
  },
  date:{
    fontSize: "16px"
  },
  contents:{
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom : "7px",
    marginLeft: "20px"
  },
  contentsText: {
    fontFamily: "RobotoMono",
    lineHeight: 1.1
  }
});
ReactPDF.render(<Quixote />);
