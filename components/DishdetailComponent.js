import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  PanResponder,
} from "react-native";
import {
  Card,
  Image,
  Icon,
  Rating,
  Input,
  Button,
} from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

/* -------------------------------------------------------------------------- */
/*                              Render Dish Component                          */
/* -------------------------------------------------------------------------- */

class RenderDish extends Component {
  render() {
    const dish = this.props.dish;

    // Gesture swipe right → left
    const recognizeDrag = ({ dx }) => {
      if (dx < -200) return 1;
      return 0;
    };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState) === 1) {
          Alert.alert(
            "Add Favorite",
            "Are you sure you wish to add " + dish.name + " to favorite?",
            [
              { text: "Cancel", onPress: () => {} },
              {
                text: "OK",
                onPress: () => {
                  this.props.favorite
                    ? Alert.alert("Thông báo", "Món này đã được yêu thích!")
                    : this.props.onPressFavorite();
                },
              },
            ]
          );
        }
        return true;
      },
    });

    if (dish == null) return <View />;

    return (
      <Card {...panResponder.panHandlers}>
        <Image
          source={{ uri: baseUrl + dish.image }}
          style={{ width: "100%", height: 200 }}
        >
          <View style={styles.imageTitleContainer}>
            <Card.FeaturedTitle style={styles.featuredTitle}>
              {dish.name}
            </Card.FeaturedTitle>
          </View>
        </Image>

        <Text style={{ margin: 10 }}>{dish.description}</Text>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Icon
            raised
            reverse
            type="font-awesome"
            color="#f50"
            name={this.props.favorite ? "heart" : "heart-o"}
            onPress={() =>
              this.props.favorite
                ? Alert.alert("Thông báo", "Món này đã được yêu thích!")
                : this.props.onPressFavorite()
            }
          />

          <Icon
            raised
            reverse
            type="font-awesome"
            color="#7cc"
            name="pencil"
            onPress={this.props.onPressComment}
          />
        </View>
      </Card>
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                             Render Comments Component                       */
/* -------------------------------------------------------------------------- */

class RenderComments extends Component {
  renderCommentItem(item) {
    return (
      <View key={item.id} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>

        <Rating
          startingValue={item.rating}
          imageSize={15}
          readonly
          style={{ alignItems: "flex-start", paddingVertical: 5 }}
        />

        <Text style={{ fontSize: 12, color: "#666" }}>
          {"-- " + item.author + ", " + item.date}
        </Text>
      </View>
    );
  }

  render() {
    const comments = this.props.comments;

    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />

        {comments.map((item) => this.renderCommentItem(item))}
      </Card>
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                              Dish Detail Component                          */
/* -------------------------------------------------------------------------- */

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      comment: "",
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  handleComment = (dishId) => {
    const { rating, author, comment } = this.state;

    if (author.trim() === "" || comment.trim() === "") {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    this.props.postComment(dishId, rating, author, comment);

    this.toggleModal();
    this.setState({ rating: 5, author: "", comment: "" });
  };

  render() {
    const dishId = this.props.route.params.dishId;
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter(
      (cmt) => cmt.dishId === dishId
    );
    const favorite = this.props.favorites.some((el) => el === dishId);

    return (
      <ScrollView>
        {/* Dish with animation */}
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.props.postFavorite(dishId)}
            onPressComment={this.toggleModal}
          />
        </Animatable.View>

        {/* Comments with animation */}
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
          <RenderComments comments={comments} />
        </Animatable.View>

        {/* Modal Comment */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}
          statusBarTranslucent
        >
          <View style={styles.modalContainer}>
            <Text style={styles.ratingTitle}>
              Rating: {this.state.rating}/5
            </Text>

            <Rating
              showRating={false}
              startingValue={this.state.rating}
              imageSize={40}
              onFinishRating={(value) => this.setState({ rating: value })}
              style={styles.rating}
            />

            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o", color: "#666" }}
              inputStyle={{ color: "#333" }}
              placeholderTextColor="#999"
              value={this.state.author}
              onChangeText={(text) => this.setState({ author: text })}
              containerStyle={styles.inputContainer}
            />

            <Input
              placeholder="Comment"
              leftIcon={{
                type: "font-awesome",
                name: "comment-o",
                color: "#666",
              }}
              inputStyle={{ color: "#333" }}
              placeholderTextColor="#999"
              value={this.state.comment}
              onChangeText={(text) => this.setState({ comment: text })}
              containerStyle={styles.inputContainer}
            />

            <Button
              title="SUBMIT"
              buttonStyle={styles.submitBtn}
              containerStyle={styles.submitContainer}
              titleStyle={styles.submitTitle}
              onPress={() => this.handleComment(dishId)}
            />

            <Button
              title="CANCEL"
              buttonStyle={styles.cancelBtn}
              containerStyle={styles.submitContainer}
              titleStyle={styles.submitTitle}
              onPress={this.toggleModal}
            />
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  imageTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  featuredTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  ratingTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
    marginBottom: 10,
  },
  rating: {
    paddingVertical: 10,
  },
  inputContainer: {
    marginVertical: 10,
  },

  submitBtn: {
    backgroundColor: "#512DA8",
    height: 50,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#808080",
    height: 50,
    borderRadius: 8,
  },
  submitContainer: {
    marginTop: 20,
    marginHorizontal: 40,
  },
  submitTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

/* -------------------------------------------------------------------------- */
/*                                  Redux Connect                               */
/* -------------------------------------------------------------------------- */

const mapStateToProps = (state) => ({
  dishes: state.dishes,
  comments: state.comments,
  favorites: state.favorites,
});

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
