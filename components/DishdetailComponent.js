import React, { Component } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import {
  Card,
  Image,
  Icon,
  Rating,
  Input,
  Button,
} from "react-native-elements";
// import { DISHES } from "../shared/dishes";
// import { COMMENTS } from "../shared/comments";
import { ScrollView } from "react-native-virtualized-view";
import { baseUrl } from "../shared/baseUrl";
import { connect } from "react-redux";
import { postFavorite, postComment } from "../redux/ActionCreators";

class RenderDish extends Component {
  render() {
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card>
          <Image
            source={{ uri: baseUrl + dish.image }}
            style={{
              width: "100%",
              height: 100,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingVertical: 5,
            }}
          >
            <Icon
              raised
              reverse
              type="font-awesome"
              color="#f50"
              name={this.props.favorite ? "heart" : "heart-o"}
              onPress={() =>
                this.props.favorite
                  ? alert("Already favorite")
                  : this.props.onPressFavorite()
              }
            />
            {/* Phần Assignment 2 */}
            <Icon
              raised
              reverse
              type="font-awesome"
              name="pencil"
              color="#512DA8" // "rgba(28, 61, 140, 1)"
              onPress={this.props.onPressOpenModal}
            />
          </View>
        </Card>
      );
    }
    return <View />;
  }
}
class RenderComments extends Component {
  add7Hours(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toISOString();
  }
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title style={{ fontSize: 18 }}>Comments</Card.Title>
        <Card.Divider />
        <FlatList
          data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item, index) => item.id.toString()}
          // keyExtractor={(item, index) => `comment-${item.id}-${index}`}
        />
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View style={{ margin: 12 }}>
        {/* bỏ key={index} */}
        <Text style={{ fontSize: 14, marginBottom: 10 }}>{item.comment}</Text>
        {/* Phần Assignment 2 */}
        <Rating
          readonly
          imageSize={12}
          startingValue={item.rating}
          style={{ alignItems: "flex-start", marginBottom: 10 }}
        />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + this.add7Hours(item.date)}{" "}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    // Phan assignment 2s
    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      comment: "",
    };
  }

  handleComment(dishId) {
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );

    // Reset form + tắt modal
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      comment: "",
    });
  }
  render() {
    const dishId = this.props.route.params.dishId;
    // const dish = this.state.dishes[dishId];
    // const comments = this.state.comments.filter((cmt) => cmt.dishId === dishId);
    const favorites = this.props.favorites.some((el) => el === dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter(
      (cmt) => cmt.dishId === dishId
    );
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <RenderDish
            dish={dish}
            favorite={favorites}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressOpenModal={() => this.setState({ showModal: true })}
          />
          <RenderComments comments={comments} />
        </ScrollView>
        {/* Phần Assignment 2 - Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
        >
          <View style={{ margin: 30, marginTop: 50 }}>
            <Rating
              showRating
              startingValue={this.state.rating}
              imageSize={40}
              onFinishRating={(value) => this.setState({ rating: value })}
            />

            <Input
              style={{ marginTop: 20 }}
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={(text) => this.setState({ author: text })}
            />

            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              onChangeText={(text) => this.setState({ comment: text })}
            />

            <Button
              title="Submit"
              onPress={() => this.handleComment(dishId)}
              buttonStyle={{ backgroundColor: "#512DA8" }} // "rgba(28, 61, 140, 1)"
            />

            <View style={{ height: 10 }} />

            <Button
              title="Cancel"
              onPress={() => this.setState({ showModal: false })}
              buttonStyle={{ backgroundColor: "grey" }}
            />
          </View>
        </Modal>
      </View>
    );
  }
  markFavorite(dishId) {
    // this.setState({ favorites: this.state.favorites.concat(dishId) });
    this.props.postFavorite(dishId);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
