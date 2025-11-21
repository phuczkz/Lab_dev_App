import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import Loading from "./LoadingComponent";

const mapStateToProps = (state) => ({
  leaders: state.leaders,
});

class RenderLeadership extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <Card>
          <Card.Title style={{ fontSize: 18 }}>Corporate Leadership</Card.Title>
          <Card.Divider />
          <Loading />
        </Card>
      );
    } else if (this.props.errMess) {
      return (
        <Card>
          <Card.Title style={{ fontSize: 18 }}>Corporate Leadership</Card.Title>
          <Card.Divider />
          <Text>{this.props.errMess}</Text>
        </Card>
      );
    } else {
      return (
        <Card>
          <Card.Title style={{ fontSize: 18 }}>Corporate Leadership</Card.Title>
          <Card.Divider />
          {this.props.leaders.map((leader) => (
            <View key={leader.id} style={styles.leaderCard}>
              <Image
                source={{ uri: baseUrl + leader.image }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{leader.name}</Text>
                <Text style={styles.designation}>{leader.designation}</Text>
                <Text style={styles.description}>{leader.description}</Text>
              </View>
            </View>
          ))}
        </Card>
      );
    }
  }
}

class About extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Card.Title style={{ fontWeight: "bold", fontSize: 18 }}>
            Our History
          </Card.Title>
          <Card.Divider />
          <Text style={styles.description}>
            Started in 2010, Ristorante con Fusion quickly established itself as
            a culinary icon par excellence in Hong Kong. With its unique brand
            of world fusion cuisine that can be found nowhere else, it enjoys
            patronage from the A-list clientele in Hong Kong. Featuring four of
            the best three-star Michelin chefs in the world, you never know what
            will arrive on your plate the next time you visit us.
          </Text>
          <Text style={styles.description}>
            The restaurant traces its humble beginnings to The Frying Pan, a
            successful chain started by our CEO, Mr. Peter Pan, that featured
            for the first time the world's best cuisines in a pan.
          </Text>
        </View>

        <RenderLeadership
          leaders={this.props.leaders.leaders}
          isLoading={this.props.leaders.isLoading}
          errMess={this.props.leaders.errMess}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E6EF",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 4,
    padding: 20,
    margin: 15,
    borderWidth: 0.5,
    borderColor: "#DDD",
    elevation: 2,
  },
  leaderCard: {
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  designation: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    lineHeight: 20,
    color: "#444",
  },
});

export default connect(mapStateToProps)(About);
