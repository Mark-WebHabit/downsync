import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import Collapsible from "react-native-collapsible";
import { PieChart } from "react-native-chart-kit";

const CollapsiblematchingHard = ({ matchingHard, showMathingHard, user }) => {
  const completed = matchingHard?.length
    ? matchingHard.filter((el) => el.complete === true).length
    : 0;
  const pending = matchingHard?.length ? matchingHard.length - completed : 49;

  const data = [
    {
      name: "Completed",
      population: completed,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Pending",
      population: pending,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
  };

  return (
    <Collapsible collapsed={!showMathingHard}>
      {matchingHard && (
        <>
          <PieChart
            data={data}
            width={Dimensions.get("window").width}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Text style={styles.info}>
            {user.user} has completed {completed} out of {matchingHard.length}{" "}
            questions
          </Text>
        </>
      )}
    </Collapsible>
  );
};

export default CollapsiblematchingHard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set background to white
  },
  info: {
    textAlign: "center",
    fontWeight: "700",
  },
});