import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  }
});

const FilteredUsersPDF = ({ users, timestamp }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Relatório de Usuários</Text>
      <Text style={styles.title}>Data: {timestamp}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Nome</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Coordenadoria</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Unidade</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Cargo</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Ramal</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Status</Text>
          </View>
        </View>
        {users.map((user, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.Nome}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.NomeCoordenadoria}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.NomeUnidade}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.NomeCargo}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.Numero}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.Status === 1 ? "Ativo" : "Desativado"}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default FilteredUsersPDF;
