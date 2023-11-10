import React, { useMemo, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import useTheme from "../contexts/theme";
import { FontAwesome } from "@expo/vector-icons";
import Card from "./Card";
import Text from "./MyText";
import ContactRow from "./ContactRow";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigation } from "../stacks/RootStack";
import * as Crypto from "expo-crypto";
import useContacts from "../stores/contactsStore";
import SearchBar from "./SearchBar";
import { FlashList } from "@shopify/flash-list";
import moment from "moment";
import useConversations from "../stores/conversationStore";
import i18n from "../lib/locales";
import { contactSortOptions, usePreferences } from "../stores/preferences";
import { Contact } from "../types/contact";
import { contactMostRecentStudy } from "../lib/conversations";
import Select from "./Select";

const ContactsList = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { contactSort, setContactSort } = usePreferences();
  const { conversations } = useConversations();
  const { contacts } = useContacts();
  const navigation = useNavigation<RootStackNavigation>();
  const [focusingSearchBar, setFocusingSearchBar] = useState(false);

  const searchResultsSorted = useMemo(() => {
    const filteredContacts = contacts.filter((c) => c.name.includes(search));

    return filteredContacts.sort((a, b) => {
      const getMostRecentConversation = (contact: Contact) => {
        const filteredConversations = conversations.filter(
          (c) => c.contact.id === contact.id
        );
        const sortedConversations = filteredConversations.sort((a, b) =>
          moment(a.date).unix() < moment(b.date).unix() ? 1 : -1
        );

        return sortedConversations.length > 0 ? sortedConversations[0] : null;
      };

      const mostRecentConversationA = getMostRecentConversation(a);
      const mostRecentConversationB = getMostRecentConversation(b);

      const sortByMostRecentConversation = () => {
        if (mostRecentConversationA === null) {
          return 1;
        }
        if (mostRecentConversationB === null) {
          return -1;
        }
        return moment(mostRecentConversationA.date).unix() <
          moment(mostRecentConversationB.date).unix()
          ? 1
          : -1;
      };
      if (!contactSort) {
        return sortByMostRecentConversation();
      }
      if (contactSort === "recentConversation") {
        return sortByMostRecentConversation();
      }
      if (contactSort === "az") {
        return a.name.localeCompare(b.name);
      }
      if (contactSort === "za") {
        return b.name.localeCompare(a.name);
      }
      if (contactSort === "bibleStudy") {
        const mostRecentStudyA = contactMostRecentStudy({
          conversations,
          contact: a,
        });
        const mostRecentStudyB = contactMostRecentStudy({
          conversations,
          contact: b,
        });
        if (mostRecentStudyA === null) {
          return 1;
        }
        if (mostRecentStudyB === null) {
          return -1;
        }
        return moment(mostRecentStudyA.date).unix() <
          moment(mostRecentStudyB.date).unix()
          ? 1
          : -1;
      }
      // Add more cases for additional sorting methods if needed

      // Default to date sorting if no matching method is found
      return sortByMostRecentConversation();
    });
  }, [contacts, search, contactSort, conversations]);

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Inter_600SemiBold",
            marginLeft: 5,
          }}
        >
          {i18n.t("returnVisitContacts")}
        </Text>

        <View style={{ flex: 1 }}>
          <Select
            data={contactSortOptions}
            placeholder="Sort"
            style={{ borderWidth: 0, marginRight: 15 }}
            placeholderStyle={{ fontSize: 12 }}
            selectedTextStyle={{ opacity: 0 }}
            renderRightIcon={() => (
              <FontAwesome name="sort" style={{ color: theme.colors.text }} />
            )}
            onChange={({ value }) => setContactSort(value)}
            value={contactSort}
          />
        </View>
      </View>
      <Card>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <SearchBar
            placeholder={
              focusingSearchBar ? i18n.t("searchForContact") : i18n.t("search")
            }
            value={search}
            setValue={setSearch}
            onFocus={() => setFocusingSearchBar(true)}
            onBlur={() => setFocusingSearchBar(false)}
          />
          <TouchableOpacity
            style={{
              flexGrow: focusingSearchBar ? undefined : 1,
              paddingVertical: 15,
              paddingHorizontal: 25,
              backgroundColor: theme.colors.accent,
              borderRadius: theme.numbers.borderRadiusLg,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
            }}
            onPress={() =>
              navigation.navigate("Contact Form", { id: Crypto.randomUUID() })
            }
          >
            {!focusingSearchBar && (
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Inter_700Bold",
                  fontSize: 18,
                  color: theme.colors.textInverse,
                }}
              >
                {i18n.t("addContact")}
              </Text>
            )}
            <FontAwesome
              style={{ fontSize: 14, color: theme.colors.textInverse }}
              name="plus"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, minHeight: 10 }}>
          <FlashList
            data={searchResultsSorted}
            renderItem={({ item }) => (
              <ContactRow
                key={item.id}
                contact={item}
                onPress={() =>
                  navigation.navigate("Contact Details", { id: item.id })
                }
              />
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: theme.colors.textAlt, fontSize: 12 }}>
                {i18n.t("noContactsSaved")}
              </Text>
            )}
            estimatedItemSize={84}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: 6 }} />
            )}
          />
        </View>
      </Card>
    </View>
  );
};

export default ContactsList;
