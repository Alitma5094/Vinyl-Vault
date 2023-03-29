import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RecordListScreen from "./screens/RecordListScreen";
import RecordCreateScreen from "./screens/RecordCreateScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SettingsScreen from "./screens/SettingsScreen";
import RecordDetailScreen from "./screens/RecordDetailScreen";
import RecordUpdateScreen from "./screens/RecordUpdateScreen";
import { RecordContextProvider } from "./store/record-context";
import TrackManageScreen from "./screens/TrackManageScreen";
import RecordFindPage from "./screens/RecordFindPage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="RecordList"
        component={RecordListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="music-box-multiple"
              size={size}
              color={color}
            />
          ),
          title: "Records",
        }}
      />
      <Tab.Screen
        name="RecordCreate"
        component={RecordCreateScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="music-note-plus"
              size={size}
              color={color}
            />
          ),
          title: "Create Record",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation({ theme }) {
  return (
    <NavigationContainer theme={theme}>
      <RecordContextProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
          <Stack.Screen name="RecordUpdate" component={RecordUpdateScreen} />
          <Stack.Screen
            name="TrackManage"
            component={TrackManageScreen}
            options={{
              presentation: "modal",
              title: "Manage Track",
            }}
          />
          <Stack.Screen
            name="RecordFind"
            component={RecordFindPage}
            options={{
              presentation: "modal",
              title: "Find Record",
            }}
          />
        </Stack.Navigator>
      </RecordContextProvider>
    </NavigationContainer>
  );
}

export default Navigation;
