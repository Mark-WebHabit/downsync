import { StyleSheet, View, FlatList } from "react-native";
import React, { useContext } from "react";

import MainContainer from "../components/MainContainer";
import { AnimalsContext } from "../GroupContext/AnimalsContext";
import LevelContainer from "../components/LevelContainer";
import { Context } from "../DataContext";

const images = [
  require("../assets/images/buttonbluebox.png"),
  require("../assets/images/buttonwhitebox.png"),
  require("../assets/images/buttonmintbox.png"),
  require("../assets/images/buttongreenbox.png"),
];

const MatchingDescription = ({ navigation }) => {
  const { matchingHard } = useContext(AnimalsContext);
  const { sound } = useContext(Context);

  const renderItem = ({ item, index }) => {
    const isComplete = item.complete;

    const imageSource = images[index % images.length];

    const navigateToGame = () => {
      sound();
      navigation.navigate("MatchingHardGame", {
        item: item,
      });
    };

    return (
      <LevelContainer
        text={index + 1}
        imageSource={imageSource}
        navigateToGame={navigateToGame}
        isComplete={isComplete}
      />
    );
  };

  return (
    <MainContainer
      navigation={navigation}
      showSetting={false}
      addStyle={styles.container}
    >
      <View style={styles.levelContainer}>
        <FlatList
          data={matchingHard}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid}
          numColumns={3}
          contentContainerStyle={styles.flatlist}
        />
      </View>
    </MainContainer>
  );
};

export default MatchingDescription;

const styles = StyleSheet.create({
  levelContainer: {
    marginHorizontal: "auto",
    height: "100%",
  },
  flatlist: {
    justifyContent: "center",
  },
});
