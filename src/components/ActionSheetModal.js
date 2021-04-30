import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";

const windowHeight = Dimensions.get("window").height;
const HEADER_MAX_HEIGHT = windowHeight;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ActionSheetModal = () => {
  const actionSheetRef = useRef();
  const scrollViewRef = useRef();
  const actionSheetScrollRef = actionSheetRef.current?.scrollViewRef;
  const [scrollY, setScrollY] = useState(
    new Animated.Value(
      // iOS has negative initial scroll value because content inset...
      Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0
    )
  );

  useEffect(() => {
    actionSheetRef.current?.show();
  }, []);

  function changeScrollEnabled(parent, child) {
    // We only need this on Android, iOS works great with Child Scroll Views.
    if (Platform.OS !== "android") {
      return;
    }
    actionSheetScrollRef?.current?.setNativeProps({
      scrollEnabled: parent,
    });
    scrollViewRef.current?.setNativeProps({
      scrollEnabled: child,
      nestedScrollEnabled: false,
    });
  }

  const onScroll = () => {
    changeScrollEnabled(false, true);

    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: true,
    });
  };

  const onHasReachedTop = (hasReachedTop) => {
    changeScrollEnabled(!hasReachedTop, hasReachedTop);
  };

  const onClose = () => {
    scrollViewRef.current?.setNativeProps({
      scrollEnabled: false,
    });
    console.log("onClose");
  };

  const onOpen = () => {
    scrollViewRef.current?.setNativeProps({
      scrollEnabled: true,
    });
  };

  const currentScrollY = Animated.add(
    scrollY,
    Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0
  );
  // const headerTranslate = currentScrollY.interpolate({
  //   inputRange: [0, HEADER_SCROLL_DISTANCE],
  //   outputRange: [0, -HEADER_SCROLL_DISTANCE],
  //   extrapolate: 'clamp',
  // });

  const imageOpacity = currentScrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const imageTranslate = currentScrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <>
      <SafeAreaView style={styles.safeareview}>
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
              height: windowHeight * 0.4,
            },
          ]}
          source={require("../../assets/cat.jpg")}
        />
        <ActionSheet
          containerStyle={{ borderRadius: 32 }}
          animated={false}
          initialOffsetFromBottom={0.7}
          ref={actionSheetRef}
          onOpen={onOpen}
          statusBarTranslucent
          onPositionChanged={onHasReachedTop}
          bounceOnOpen={true}
          bounciness={0}
          gestureEnabled={true}
          onClose={onClose}
          //closeOnTouchBackdrop={false}
          closable={false}
          bottomOffset={200}
          closeOnPressBack={false}
          CustomHeaderComponent={
            <TouchableOpacity
              onPress={() => {
                const { currentOffsetFromBottom } = actionSheetRef.current;
                if (currentOffsetFromBottom > 0.9) {
                  actionSheetRef.current?.snapToOffset(windowHeight * 0.7);
                } else if (currentOffsetFromBottom >= 0.7) {
                  actionSheetRef.current?.snapToOffset(200);
                } else {
                  actionSheetRef.current?.snapToOffset(windowHeight);
                }
              }}
              style={{ padding: 15 }}
            >
              <View style={styles.indicator} />
            </TouchableOpacity>
          }
          defaultOverlayOpacity={0}
        >
          <View
            style={{
              paddingHorizontal: 12,
            }}
          >
            <Animated.ScrollView
              ref={scrollViewRef}
              //nestedScrollEnabled={false}
              scrollsToTop={false}
              onScroll={onScroll}
              onStartShouldSetResponder={() => {
                changeScrollEnabled(false, true);
                return false;
              }}
              onScrollEndDrag={({ nativeEvent }) => {
                changeScrollEnabled(true, false);
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              onTouchEnd={() => {
                changeScrollEnabled(true, false);
              }}
              onScrollAnimationEnd={() => {
                changeScrollEnabled(true, false);
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              onMomentumScrollEnd={() => {
                changeScrollEnabled(true, false);
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              scrollEventThrottle={2}
              style={styles.scrollview}
            >
              <TextInput
                style={styles.input}
                multiline={true}
                placeholder="Write your text here"
              />

              <View>
                {items.map((item) => (
                  <TouchableOpacity key={item} style={styles.listItem}>
                    <View
                      style={{
                        width: item,
                        height: 15,
                        backgroundColor: "#f0f0f0",
                        marginVertical: 15,
                        borderRadius: 5,
                      }}
                    />

                    <View style={styles.btnLeft} />
                  </TouchableOpacity>
                ))}
              </View>

              {/*  Add a Small Footer at Bottom */}
              <View style={styles.footer} />
            </Animated.ScrollView>
          </View>
        </ActionSheet>
      </SafeAreaView>
    </>
  );
};

export default ActionSheetModal;

const items = [
  100,
  60,
  150,
  200,
  170,
  80,
  41,
  101,
  61,
  151,
  202,
  172,
  173,
  81,
  42,
  1,
  2,
  4,
  5,
  44,
  43,
  3,
  51,
  53,
  15,
  90,
];

const styles = StyleSheet.create({
  footer: {
    height: 100,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnLeft: {
    width: 30,
    height: 30,
    backgroundColor: "#f0f0f0",
    borderRadius: 100,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  scrollview: {
    width: "100%",
    padding: 12,
  },
  btn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fe8a71",
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0.7 * 4,
  },
  safeareview: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "pink",
  },
  btnTitle: {
    color: "white",
    fontWeight: "bold",
  },
  indicator: {
    height: 6,
    width: 60,
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    alignSelf: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    resizeMode: "cover",
  },
});
