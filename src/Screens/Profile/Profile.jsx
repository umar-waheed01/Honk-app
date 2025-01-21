import { ScrollView } from "react-native";
import React from "react";

import ProfileBanner from "../../components/Profile/ProfileBanner";

export default function Profile({ route }) {
  const slug = route?.params?.slug;

  return (
    <ScrollView>
      <ProfileBanner slug={slug} />
    </ScrollView>
  );
}
