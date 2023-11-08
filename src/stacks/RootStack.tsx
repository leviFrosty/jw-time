import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import ContactForm from "../screens/ContactForm";
import Header from "../components/layout/Header";
import Home from "../screens/Home";
import ConversationForm from "../screens/ConversationForm";
import ContactSelector from "../screens/ContactSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TouchableOpacity } from "react-native";
import theme from "../constants/theme";
import ContactDetails from "../screens/ContactDetails";
import AddTime from "../screens/AddTime";
import TimeReports from "../screens/TimeReports";
import RecoverContacts from "../screens/RecoverContacts";
import OnBoarding from "../components/onboarding/Onboarding";
import { usePreferences } from "../stores/preferences";
import { FontAwesome } from "@expo/vector-icons";
import Update from "../screens/Update";

export type RootStackParamList = {
  Home: undefined;
  "Conversation Form": { id: string; referrer?: string }; // Contact ID
  "Contact Details": { id: string }; // Contact ID
  "Contact Form": { id: string; edit?: boolean }; // Contact ID
  "Contact Selector": undefined;
  "Add Time": undefined;
  "Time Reports": undefined;
  "Recover Contacts": undefined;
  Onboarding: undefined;
  Update: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;
const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootStackComponent = () => {
  const insets = useSafeAreaInsets();
  const { onboardingComplete } = usePreferences();

  return (
    <RootStack.Navigator>
      <RootStack.Screen
        options={{ header: () => undefined }}
        name="Update"
        component={Update}
      />
      {/* 
      Cannot render onboarding via Navigator initialRouteName. 
      This alternative allows for dynamically rendering screen. 
      Navigating directly between conditional screens causes an error
      because from each screen's perspective the other screen does not exist. 
      You must update the variable instead. 
      See: https://github.com/react-navigation/react-navigation/discussions/10346
      */}
      {onboardingComplete ? (
        <RootStack.Screen
          options={{ header: () => undefined }}
          name="Home"
          component={Home}
        />
      ) : (
        <RootStack.Screen
          options={{ header: () => undefined }}
          name="Onboarding"
          component={OnBoarding}
        />
      )}
      <RootStack.Screen
        options={{ presentation: "containedModal" }}
        name="Contact Details"
        component={ContactDetails}
      />
      <RootStack.Screen name="Contact Form" component={ContactForm} />
      <RootStack.Screen name="Conversation Form" component={ConversationForm} />
      <RootStack.Screen
        name="Contact Selector"
        component={ContactSelector}
        options={{
          presentation: "formSheet",
          header: () => (
            <View
              style={{
                paddingTop: insets.top,
                backgroundColor: theme.colors.accentBackground,
              }}
            />
          ),
        }}
      />
      <RootStack.Screen
        name="Add Time"
        options={{
          presentation: "modal",
          header: () => <Header buttonType="exit" />,
        }}
        component={AddTime}
      />
      <RootStack.Screen
        options={{
          presentation: "modal",
          header: ({ navigation }) => (
            <Header
              buttonType="exit"
              rightElement={
                <TouchableOpacity
                  hitSlop={20}
                  style={{ position: "absolute", right: 0 }}
                  onPress={() => navigation.navigate("Add Time")}
                >
                  <FontAwesome
                    name="plus"
                    style={{ fontSize: 20, color: theme.colors.textInverse }}
                  />
                </TouchableOpacity>
              }
            />
          ),
        }}
        name="Time Reports"
        component={TimeReports}
      />
      <RootStack.Screen
        options={{
          presentation: "modal",
          header: () => <Header buttonType="exit" />,
        }}
        name="Recover Contacts"
        component={RecoverContacts}
      />
      {/* <RootStack.Screen
        options={{ header: () => undefined }}
        name="Update"
        component={Update}
      /> */}
    </RootStack.Navigator>
  );
};

export default RootStackComponent;
