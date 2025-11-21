import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, Image } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";

class Contact extends Component {
  render() {
    return (
      <View>
        <Card>
          <Card.Title style={{ fontWeight: "bold", fontSize: 16 }}>
            Contact Information
          </Card.Title>
          <Card.Divider />
          <View>
            <Text style={styles.contactText}>121, Clear Water Bay Road</Text>
            <Text style={styles.contactText}>Clear Water Bay, Kowloon</Text>
            <Text style={styles.contactText}>HONG KONG</Text>
            <Text style={styles.contactText}>Tel: +852 1234 5678</Text>
            <Text style={styles.contactText}>Fax: +852 8765 4321</Text>
            <Text style={styles.contactText}>Email: confusion@food.net</Text>
          </View>
        </Card>
      </View>
    );
  }
}
const styles = {
  contactText: {
    marginBottom: 10,
    color: "black",
  },
};
export default Contact;
