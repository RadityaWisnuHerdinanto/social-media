import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import { ApolloProvider } from "@apollo/client/react";
import Toast from "react-native-toast-message";
import { apolloClient } from "./config/apolloClient";

import Home from "./screens/Home";
import Search from "./screens/Search";
import AddPost from "./screens/AddPost";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Register from "./screens/Register";
import PostDetail from "./screens/PostDetail";

import { AuthContext, AuthProvider } from "./contexts/auth";
import ProfileById from "./screens/ProfileById";
import FollowList from "./screens/FollowList";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#ddd",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-square" size={size} color={color} />
          ),
          title: "Add",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MyStack() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#007AFF" },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
      }}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{
              title: "Instadar",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PostDetail"
            component={PostDetail}
            options={{
              title: "Post Detail",
            }}
          />
          <Stack.Screen
            name="ProfileById"
            component={ProfileById}
            options={{
              title: "Profile",
            }}
          />
          <Stack.Screen
            name="FollowList"
            component={FollowList}
            options={{
              title: "Follow List",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
        <Toast />
      </ApolloProvider>
    </AuthProvider>
  );
}
